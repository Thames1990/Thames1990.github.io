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
});
