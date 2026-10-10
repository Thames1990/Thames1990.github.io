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
  await expect(page.getByRole('link', { name: 'Thomas Mohr home', exact: true })).toBeVisible();
});

test('mobile portfolio navigation spans the content width and supports keyboard access', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Open portfolio navigation' });
  const menu = page.getByRole('menu');
  await expect(menu).toBeHidden();

  for (const width of [320, 375, 430]) {
    await page.setViewportSize({ width, height: 812 });
    await toggle.focus();
    await page.keyboard.press('ArrowDown');
    const items = menu.getByRole('menuitem');
    await expect(menu).toBeVisible();
    await expect(items).toHaveCount(3);
    await expect(items.first()).toBeFocused();
    await expect.poll(() => menu.evaluate((element) => element.getBoundingClientRect().width))
      .toBeCloseTo(width - 40, 0);
    const menuBounds = await menu.evaluate((element) => {
      const { left, right, height } = element.getBoundingClientRect();
      return { left, right, height };
    });
    expect(menuBounds.height).toBeLessThan(200);
    expect(menuBounds.left).toBeCloseTo(20, 0);
    expect(menuBounds.right).toBeCloseTo(width - 20, 0);

    if (width === 320) {
      await page.keyboard.press('ArrowDown');
      await expect(items.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(items.nth(2)).toBeFocused();
    }
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  }
});

test('mobile navigation closes when a section link is selected', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Open portfolio navigation' });
  const menu = page.getByRole('menu');
  await toggle.click();
  await menu.getByRole('menuitem', { name: 'Impact' }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#work$/);
});

test('desktop navigation stays available after resizing', async ({ page }) => {
  await page.getByRole('button', { name: 'Open portfolio navigation' }).click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.getByRole('menu')).toBeHidden();
  const links = page.getByRole('navigation', { name: 'Section links', exact: true });
  await expect(links.getByRole('link', { name: 'Impact' })).toBeVisible();
  await links.getByRole('link', { name: 'Impact' }).focus();
  await expect(links.getByRole('link', { name: 'Impact' })).toBeFocused();
});

test('reduced motion removes dropdown animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Open portfolio navigation' }).click();
  await expect(page.getByRole('menu')).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('menu')).toHaveCSS('transition-duration', '0s');
});

test('CV header omits portfolio section navigation', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/cv');
    await expect(page.getByRole('button', { name: 'Open portfolio navigation' })).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Section links' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Back to portfolio', exact: true })).toBeVisible();
  }
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
  await expect(page.getByRole('menu')).toBeHidden();
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

test('mobile browser theme color follows the active light, dark and system theme', async ({ page }) => {
  const themeColor = page.locator('meta[name="theme-color"]').first();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(themeColor).toHaveAttribute('content', '#f1f1eb');

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(themeColor).toHaveAttribute('content', '#151917');
  await selectTheme(page, 'Light');
  await expect(themeColor).toHaveAttribute('content', '#f1f1eb');
  await selectTheme(page, 'Dark');
  await expect(themeColor).toHaveAttribute('content', '#151917');
  await selectTheme(page, 'System');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(themeColor).toHaveAttribute('content', '#f1f1eb');
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

test('portfolio and CV render the redesigned content without horizontal overflow', async ({ page }) => {
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    for (const route of ['/', '/cv']) {
      await page.goto(route);
      await expect(page.locator(route === '/' ? '.work-case__accordion' : '[data-slot="alert"]').first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('main')).toBeFocused();
    }
  }
});

test('opening readouts connect project outcomes to their case studies', async ({ page }) => {
  const readouts = page.getByRole('complementary', { name: 'Selected project outcomes' });
  await expect(readouts.getByRole('heading', { name: 'Evidence that shipped' })).toBeVisible();
  for (const [index, title, outcome] of [[1, 'Loader', '≈10k'], [2, 'Fuel & Leg Twin', '3m'], [3, '80+ TB music catalog', '80+ TB']] as const) {
    const project = readouts.locator('li').nth(index - 1);
    await expect(project.getByText(outcome, { exact: true })).toBeVisible();
    await project.getByRole('link', { name: title }).click();
    await expect(page).toHaveURL(new RegExp(`#project-0${index}$`));
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeInViewport();
  }
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

test('case-study details preserve all project content and links', async ({ page }) => {
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

test('technology lists remain accessible on mobile and desktop', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/');
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
    const card = page.locator('article').filter({
      has: page.getByRole('heading', { name: '80+ TB music catalog', exact: true }),
    });
    const technology = card.getByRole('button', { name: 'Technology & tools', exact: true });
    await technology.click();
    await expect(technology).toHaveAttribute('aria-expanded', 'true');
    const technologies = card.getByRole('list').last();
    await expect(technologies.getByText('DataOps', { exact: true })).toBeVisible();
    await expect(technologies).toBeInViewport();
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
    await page.getByRole('complementary', { name: 'Selected project outcomes' })
      .getByRole('link', { name: /Loader/ }).click();
    await expect(page).toHaveURL(/#project-01$/);
    await expect(page.getByRole('heading', { name: 'Loader', exact: true })).toBeInViewport();
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

test('project summaries and evidence stay in reading order at each breakpoint', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const projects = page.locator('#work .work-case');
    for (const project of await projects.all()) {
      const layout = await project.evaluate((element) => {
        const summary = element.querySelector('.work-case__summary')?.getBoundingClientRect();
        const details = element.querySelector('.work-case__details')?.getBoundingClientRect();
        if (!summary || !details) throw new Error('Project summary or results are missing.');
        return { summaryRight: summary.right, summaryBottom: summary.bottom, detailsLeft: details.left, detailsTop: details.top };
      });
      if (width >= 768) expect(layout.summaryRight).toBeLessThanOrEqual(layout.detailsLeft);
      else expect(layout.summaryBottom).toBeLessThanOrEqual(layout.detailsTop);
    }
  }
});
