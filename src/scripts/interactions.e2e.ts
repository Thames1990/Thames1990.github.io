import { expect, test } from '@playwright/test';

test('reveal content stays visible until an offscreen target is observed', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#top [data-reveal]').first();

  await expect.poll(() => hero.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');

  const workHeading = page.locator('#work [data-reveal]').first();
  await workHeading.scrollIntoViewIfNeeded();
  await expect.poll(() => workHeading.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
});

test('reveal content remains visible when IntersectionObserver is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, 'IntersectionObserver');
  });
  await page.goto('/');

  const reveals = page.locator('[data-reveal]');
  await expect.poll(() => reveals.last().evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
});

test('portfolio and CV do not redraw visible text when delayed fonts arrive', async ({ page }) => {
  for (const route of ['/', '/cv']) {
    let releaseFonts: () => void = () => {};
    const fontsReleased = new Promise<void>((resolve) => { releaseFonts = resolve; });
    await page.route('**/*.woff2', async (request) => {
      await fontsReleased;
      await request.continue();
    });
    try {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      // Outlast the optional font's initial block period while it is still unavailable.
      await page.evaluate(() => new Promise<void>((resolve) => {
        const start = performance.now();
        const next = () => {
          if (performance.now() - start >= 300) resolve();
          else requestAnimationFrame(next);
        };
        requestAnimationFrame(next);
      }));
      const measureText = () => page.evaluate(() => {
        const targets = document.querySelectorAll('h1, #top p, #cv-profile p');
        return [...targets].map((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          const bounds = range.getBoundingClientRect();
          const text = document.createTreeWalker(element, NodeFilter.SHOW_TEXT).nextNode();
          if (!text) throw new Error('Visible text is missing');
          range.setStart(text, 0);
          range.setEnd(text, Math.min(10, text.textContent?.length ?? 0));
          return {
            width: bounds.width,
            height: bounds.height,
            textWidth: range.getBoundingClientRect().width,
            opacity: getComputedStyle(element).opacity,
          };
        });
      });
      const before = await measureText();
      expect(before.length).toBeGreaterThan(1);
      expect(before.every(({ opacity }) => opacity === '1')).toBe(true);
      expect(await page.evaluate(() => [...document.fonts].every((font) => font.display === 'optional'))).toBe(true);
      releaseFonts();
      await page.evaluate(() => document.fonts.ready);
      const after = await measureText();
      expect(after).toEqual(before);
    } finally {
      releaseFonts();
      await page.unroute('**/*.woff2');
    }
  }
});

test('reloading inside the work section restores scroll without moving cards', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.locator('#work article').nth(1).evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' });
  });
  await expect.poll(() => page.evaluate(() => (history.state as { scrollY?: number } | null)?.scrollY ?? 0)).toBeGreaterThan(400);

  await page.addInitScript(() => {
    const samples: { scrollY: number; cards: { top: number; opacity: string; transform: string }[] }[] = [];
    Object.assign(window, { __loadSamples: samples });
    document.addEventListener('DOMContentLoaded', () => {
      const start = performance.now();
      const sample = () => {
        const cards = [...document.querySelectorAll<HTMLElement>('#work article')]
          .filter((card) => {
            const { top, bottom } = card.getBoundingClientRect();
            return bottom > 0 && top < window.innerHeight;
          })
          .map((card) => ({
            top: Math.round(card.getBoundingClientRect().top + window.scrollY),
            opacity: getComputedStyle(card).opacity,
            transform: getComputedStyle(card).transform,
          }));
        samples.push({ scrollY: Math.round(window.scrollY), cards });
        if (performance.now() - start < 1200) requestAnimationFrame(sample);
      };
      sample();
    });
  });
  await page.reload();
  await page.waitForFunction(() => (window as unknown as { __loadSamples: unknown[] }).__loadSamples.length > 20);
  await page.waitForTimeout(1300);

  const samples = await page.evaluate(() => (window as unknown as {
    __loadSamples: { scrollY: number; cards: { top: number; opacity: string; transform: string }[] }[];
  }).__loadSamples);
  expect(new Set(samples.map(({ scrollY }) => scrollY)).size).toBe(1);
  expect(samples[0].scrollY).toBeGreaterThan(400);
  expect(samples[0].cards.length).toBeGreaterThan(0);
  for (const { cards } of samples) {
    expect(cards).toEqual(samples[0].cards.map((card) => ({ ...card, opacity: '1', transform: 'none' })));
  }
});

test('reloading near the bottom paints the restored position on the first frame', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight - 150, behavior: 'instant' });
  });
  const target = await page.evaluate(() => Math.round(window.scrollY));
  await expect.poll(() => page.evaluate(() => (history.state as { scrollY?: number } | null)?.scrollY ?? 0)).toBe(target);

  await page.addInitScript(() => {
    const frames: number[] = [];
    Object.assign(window, { __frameScroll: frames });
    const sample = () => {
      // Skip frames painted while the parser is still streaming the document; they only show the header.
      const { scrollHeight } = document.documentElement;
      if (document.readyState !== 'loading' || scrollHeight > window.innerHeight * 2) frames.push(Math.round(window.scrollY));
      if (frames.length < 30) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.reload();
  await page.waitForFunction(() => (window as unknown as { __frameScroll: number[] }).__frameScroll.length >= 30);

  const frames = await page.evaluate(() => (window as unknown as { __frameScroll: number[] }).__frameScroll);
  for (const scrollY of frames) expect(Math.abs(scrollY - target)).toBeLessThanOrEqual(2);
});

test('pointer card effects reuse bounds throughout a movement sequence', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  const card = page.locator('[data-tilt]').first();
  await card.scrollIntoViewIfNeeded();
  await card.evaluate((element) => {
    const target = element as HTMLElement;
    const getBounds = target.getBoundingClientRect.bind(target);
    target.dataset.testGeometryReads = '0';
    target.getBoundingClientRect = () => {
      target.dataset.testGeometryReads = String(Number(target.dataset.testGeometryReads) + 1);
      return getBounds();
    };
  });

  const bounds = await card.boundingBox();
  if (!bounds) throw new Error('The pointer-tilt card must have a visible bounding box.');
  await page.mouse.move(bounds.x + 10, bounds.y + 10);
  await page.mouse.move(bounds.x + bounds.width - 10, bounds.y + bounds.height - 10, { steps: 12 });

  await expect.poll(() => card.evaluate((element) => element.dataset.testGeometryReads)).toBe('1');
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element).getPropertyValue('--rx'))).not.toBe('0');

  await page.evaluate(() => {
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
  });
  await expect.poll(() => card.evaluate((element) => element.dataset.testGeometryReads)).toBe('2');
});

test('pointer effects follow the desktop media query across resizes', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await page.goto('/');

  const card = page.locator('[data-tilt]').first();
  await card.scrollIntoViewIfNeeded();
  let bounds = await card.boundingBox();
  if (!bounds) throw new Error('The pointer-tilt card must have a visible bounding box.');
  await page.mouse.move(bounds.x + 10, bounds.y + 10);
  await expect(card).toHaveCSS('--rx', '0');

  await page.setViewportSize({ width: 1280, height: 800 });
  await card.scrollIntoViewIfNeeded();
  bounds = await card.boundingBox();
  if (!bounds) throw new Error('The pointer-tilt card must have a visible bounding box.');
  await page.mouse.move(bounds.x + 10, bounds.y + 10);
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element).getPropertyValue('--rx'))).not.toBe('0');

  await page.setViewportSize({ width: 640, height: 800 });
  await expect(card).toHaveCSS('--rx', '0');
});
