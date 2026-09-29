import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('closed mobile menu is inert, and opening exposes every item in keyboard order', async ({ page }) => {
  const menu = page.locator('#site-menu');
  const toggle = page.locator('#menu-toggle');
  const links = menu.locator('a');
  const choices = menu.locator('[data-theme-choice]');

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toHaveAttribute('inert', '');
  await expect(menu).toHaveAttribute('aria-hidden', 'true');
  await expect(links.first()).toBeHidden();

  await toggle.focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#cv-action')).toBeFocused();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).not.toHaveAttribute('inert');
  await expect(menu).not.toHaveAttribute('aria-hidden');
  await expect(links.first()).toBeFocused();

  for (const item of [links.nth(1), links.nth(2), choices.nth(0), choices.nth(1), choices.nth(2)]) {
    await page.keyboard.press('Tab');
    await expect(item).toBeFocused();
  }

  await toggle.click();
  await expect(menu).toHaveAttribute('inert', '');
  await expect(toggle).toBeFocused();
});

test('Escape, outside clicks and menu links close the menu and restore focus', async ({ page }) => {
  const menu = page.locator('#site-menu');
  const toggle = page.locator('#menu-toggle');

  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(menu).toHaveAttribute('inert', '');

  await toggle.click();
  await page.locator('body').click({ position: { x: 1, y: 400 } });
  await expect(toggle).toBeFocused();
  await expect(menu).toHaveAttribute('inert', '');

  await toggle.click();
  await menu.locator('a').first().evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), { once: true });
  });
  await menu.locator('a').first().click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toHaveAttribute('inert', '');
  await expect(toggle).toBeFocused();
});

test('desktop navigation stays available after resizing', async ({ page }) => {
  const menu = page.locator('#site-menu');
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(menu).not.toHaveAttribute('inert');
  await expect(menu).not.toHaveAttribute('aria-hidden');
  await expect(menu.locator('a').first()).toBeVisible();

  await menu.locator('a').first().focus();
  await expect(menu.locator('a').first()).toBeFocused();
});

test('reduced motion removes mobile menu transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#menu-toggle').click();
  await expect(page.locator('#site-menu')).toHaveCSS('transition-duration', '0s');
});
