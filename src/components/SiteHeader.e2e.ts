import { expect, test, type Page } from '@playwright/test';
import { caseStudies } from '@/data/portfolio';

async function selectTheme(page: Page, theme: 'Light' | 'Dark' | 'System'): Promise<void> {
  await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
  await page.getByRole('menuitem', { name: theme, exact: true }).click();
  await expect(page.getByRole('menu')).toBeHidden();
}

test.use({ viewport: { width: 375, height: 812 } });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
});

test('logo accessible name includes its visible label and home purpose', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'TM / 90 — Thomas Mohr home', exact: true })).toBeVisible();
});

test('mobile Sheet contains navigation in keyboard order and traps focus', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  const sheet = page.getByRole('dialog', { name: 'Navigation' });
  await expect(sheet).toBeHidden();
  await toggle.click();
  const links = sheet.getByRole('link');
  const close = sheet.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toBeFocused();
  for (const item of [links.first(), links.nth(1), links.nth(2), close]) {
    await page.keyboard.press('Tab');
    await expect(item).toBeFocused();
  }
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('Sheet closes with Escape, overlay and links', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  const sheet = page.getByRole('dialog', { name: 'Navigation' });
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('[data-slot="sheet-overlay"]').click({ position: { x: 5, y: 400 } });
  await expect(sheet).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await sheet.getByRole('link', { name: 'Impact' }).click();
  await expect(sheet).toBeHidden();
  await expect(page).toHaveURL(/#work$/);
});

test('desktop navigation stays available after resizing', async ({ page }) => {
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
  const links = page.getByRole('navigation', { name: 'Section links', exact: true });
  await expect(links.getByRole('link', { name: 'Impact' })).toBeVisible();
  await links.getByRole('link', { name: 'Impact' }).focus();
  await expect(links.getByRole('link', { name: 'Impact' })).toBeFocused();
});

test('reduced motion removes Sheet animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCSS('transition-duration', '0s');
});

test('CV action stays in the sticky header across scrolling and navigation', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const [route, name] of [['/', 'Open CV'], ['/cv', 'Back to portfolio']] as const) {
      await page.goto(route);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const action = page.getByRole('banner').getByRole('link', { name, exact: true });
      await expect(action).toBeInViewport();
      expect(await action.evaluate((element) => getComputedStyle(element).position)).not.toBe('fixed');
      expect(await action.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(64);
    }
  }
});

test('mobile theme control stays in the header and works independently of navigation', async ({ page }) => {
  const toggle = page.getByRole('banner').getByRole('button', { name: 'Toggle theme' });
  await expect(toggle).toBeInViewport();
  await toggle.focus();
  await page.keyboard.press('Enter');
  const light = page.getByRole('menuitem', { name: 'Light', exact: true });
  await expect(light).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('shadcn appearance control persists theme through reloads and page navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await selectTheme(page, 'Dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('link', { name: 'Open CV', exact: true }).click();
  await expect(page).toHaveURL(/\/cv\/?$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await selectTheme(page, 'Light');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('system appearance follows OS changes and explicit light overrides a dark OS', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');

  await selectTheme(page, 'Light');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await selectTheme(page, 'System');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('appearance remains usable when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new DOMException('Storage unavailable', 'SecurityError'); },
    });
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await selectTheme(page, 'Dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('portfolio and CV render shadcn primitives without horizontal overflow', async ({ page }) => {
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    for (const route of ['/', '/cv']) {
      await page.goto(route);
      await expect(page.locator(route === '/' ? '[data-slot="card"]' : '[data-slot="alert"]').first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('main')).toBeFocused();
    }
  }
});

test('hero preserves the original Field notes content', async ({ page }) => {
  const notes = page.getByRole('complementary', { name: 'A few useful numbers' });
  await expect(notes.getByRole('heading', { name: 'Field notes' })).toBeVisible();
  await expect(notes.getByText('8+ years', { exact: true })).toBeVisible();
  await expect(notes.getByText('Engineering experience', { exact: true })).toBeVisible();
  await expect(notes.getByText('5+', { exact: true })).toBeVisible();
  await expect(notes.getByText('Developers per project', { exact: true })).toBeVisible();
  await expect(notes.getByText('Code + people', { exact: true })).toBeVisible();
  await expect(notes.getByText('Where I do my best work', { exact: true })).toBeVisible();
});

test('header CV action remains readable in both themes and on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const action = page.getByRole('link', { name: 'Open CV', exact: true });
  for (const theme of ['Light', 'Dark'] as const) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await selectTheme(page, theme);
    await page.evaluate(() => window.scrollTo(0, 220));
    await expect(action).toBeInViewport();
    for (const hover of [false, true]) {
      if (hover) await action.hover();
      else await page.mouse.move(0, 0);
      await expect.poll(() => action.evaluate((element) => {
        const context = document.createElement('canvas').getContext('2d');
        if (!context) throw new Error('Canvas context is unavailable for contrast measurement.');
        const luminance = (color: string) => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = getComputedStyle(document.body).backgroundColor;
          context.fillRect(0, 0, 1, 1);
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          const rgb = context.getImageData(0, 0, 1, 1).data;
          const linear = [rgb[0], rgb[1], rgb[2]].map((channel) => {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          });
          return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        };
        const foreground = luminance(getComputedStyle(element.querySelector('span') ?? element).color);
        const background = luminance(getComputedStyle(element).backgroundColor);
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      })).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test('CV availability sentence fits its shadcn Alert at responsive widths', async ({ page }) => {
  await page.goto('/cv');
  const availability = page.getByRole('note');
  await expect(availability).toHaveText('Available immediately for permanent roles');
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    expect(await availability.evaluate((element) => {
      const content = element.querySelector('[data-slot="alert-title"]');
      if (!content) throw new Error('Availability content is missing.');
      const outer = element.getBoundingClientRect();
      const inner = content.getBoundingClientRect();
      return inner.top >= outer.top && inner.bottom <= outer.bottom &&
        inner.left >= outer.left && inner.right <= outer.right &&
        element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth;
    })).toBe(true);
  }
});

test('homepage omits the skills strip while the CV retains skill details', async ({ page }) => {
  await expect(page.getByRole('region', { name: 'Technologies I work with' })).toHaveCount(0);
  await expect(page.getByText('Scrum facilitation', { exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Open CV', exact: true }).click();
  await expect(page.getByRole('complementary').getByText(/Scrum facilitation/)).toBeVisible();
});

test('case-study Cards preserve all project content and links', async ({ page }) => {
  for (const study of caseStudies) {
    const card = page.locator('article').filter({ has: page.getByRole('heading', { name: study.title, exact: true }) });
    for (const text of [
      study.eyebrow, study.context,
      ...study.outcomes.flatMap(({ value, label }) => [value, label]),
    ]) {
      await expect(card.getByText(text, { exact: true })).toHaveCount(1);
    }
    const delivery = card.getByRole('button', { name: 'Challenge & contribution', exact: true });
    const technology = card.getByRole('button', { name: 'Technology & tools', exact: true });
    await expect(delivery).toHaveAttribute('aria-expanded', 'false');
    await expect(technology).toHaveAttribute('aria-expanded', 'false');
    await delivery.focus();
    await page.keyboard.press('Enter');
    for (const text of [study.challenge, ...study.contribution]) {
      await expect(card.getByText(text, { exact: true })).toBeVisible();
    }
    await page.keyboard.press('ArrowDown');
    await expect(technology).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(delivery).toHaveAttribute('aria-expanded', 'false');
    for (const text of study.technologies) {
      await expect(card.getByText(text, { exact: true })).toBeVisible();
    }
    await page.keyboard.press('Enter');
    await expect(technology).toHaveAttribute('aria-expanded', 'false');
    for (const { label, url } of study.links) {
      await expect(card.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', url);
    }
  }
});

test('hero flows directly into selected work and provides a working jump link', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const gap = await page.evaluate(() => {
      const hero = document.querySelector('#top');
      const work = document.querySelector('#work');
      if (!hero || !work) throw new Error('Portfolio sections are missing.');
      return work.getBoundingClientRect().top - hero.getBoundingClientRect().bottom;
    });
    expect(gap).toBeLessThanOrEqual(1);
    await page.getByRole('link', { name: 'View selected work', exact: true }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.getByRole('heading', { name: 'Selected work.' })).toBeInViewport();
  }
});

test('project summaries stay compact and reduced motion disables disclosure animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const study of caseStudies) {
      const card = page.locator('article').filter({ has: page.getByRole('heading', { name: study.title, exact: true }) });
      expect(await card.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThan(width === 375 ? 700 : 480);
      const delivery = card.getByRole('button', { name: 'Challenge & contribution', exact: true });
      await delivery.click();
      await expect(card.getByText(study.challenge, { exact: true })).toBeVisible();
      await expect(card.locator('[data-slot="accordion-content"][data-state="open"]')).toHaveCSS('animation-name', 'none');
      await delivery.click();
      await expect(delivery).toHaveAttribute('aria-expanded', 'false');
    }
  }
});

test('project summary headers have equal top and bottom padding', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const headers = page.locator('#work [data-slot="card-header"]');
    for (const header of await headers.all()) {
      const padding = await header.evaluate((element) => {
        const style = getComputedStyle(element);
        return { top: style.paddingTop, bottom: style.paddingBottom, left: style.paddingLeft, right: style.paddingRight };
      });
      expect(padding.top).toBe('16px');
      expect(padding.top).toBe(padding.bottom);
      expect(padding.left).toBe(padding.right);
    }
  }
});
