import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('CV page renders content without embedding a duplicate JSON payload', async ({ page }) => {
  await page.goto('/cv');

  await expect(page.locator('#cv-pdf-data')).toHaveCount(0);
  await expect(page.getByText('Core strengths', { exact: true })).toBeVisible();
});

test('CV download serves the generated PDF with loading and success states', async ({ page }) => {
  await page.goto('/cv');
  let releaseRequest!: () => void;
  const requestGate = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });

  await page.route('**/cv.pdf', async (route) => {
    await requestGate;
    await route.continue();
  });

  const button = page.locator('#download-cv');
  const downloadPromise = page.waitForEvent('download');
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/cv.pdf');
  await button.click();

  await expect(button).toBeDisabled();
  await expect(page.locator('[data-download-label]')).toHaveText('Preparing your PDF…');
  releaseRequest();

  const [download, response] = await Promise.all([downloadPromise, responsePromise]);
  expect(download.suggestedFilename()).toBe('thomas-mohr-cv.pdf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const downloadedFile = await download.path();
  expect((await readFile(downloadedFile)).subarray(0, 4).toString()).toBe('%PDF');
  await expect(page.locator('[data-download-label]')).toHaveText('PDF downloaded');
  await expect(button).toBeEnabled();
});

test('CV download exposes an error state when the PDF request fails', async ({ page }) => {
  await page.goto('/cv');
  await page.route('**/cv.pdf', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));

  const button = page.locator('#download-cv');
  await button.click();

  await expect(page.locator('[data-download-label]')).toHaveText('Try download again');
  await expect(button).toBeEnabled();
});
