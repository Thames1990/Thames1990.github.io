import { expect, test } from '@playwright/test';

test('hero stays visible and deferred content appears when scrolled into view', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#top h1')).toBeVisible();

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

test('portfolio and CV remain readable without loading custom font files', async ({ page }) => {
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    if (/\.woff2?($|\?)/i.test(request.url())) fontRequests.push(request.url());
  });

  for (const route of ['/', '/cv']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }

  expect(fontRequests).toEqual([]);
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
