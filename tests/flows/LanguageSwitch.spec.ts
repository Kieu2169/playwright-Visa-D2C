import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';

test('Language switch should update UI text correctly', async ({ page }) => {
  await page.goto('https://visa-d2c.urbox.dev');

    // ✅ LOGIN REUSE
    await loginBeforeTest(page);
  
    console.log('Login done');

  // mở menu language
  await page.getByRole('link', { name: 'logo' }).click();
  await page.locator('.icon-wrap').first().click();
  await page.getByRole('navigation').getByText('Language & Location').click();

  // =========================
  // STEP 1: English + Vietnam
  // =========================
  await page.locator('div.relative.w-full').first().click();
  await page.getByRole('button', { name: 'Vietnam' }).click();
  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('.icon-wrap').first().click();

  // verify English UI
  await expect(page.getByText('Language & Location')).toBeVisible();

  // =========================
  // STEP 2: Vietnamese
  // =========================
  await page.locator('.icon-wrap').first().click();
  await page.getByRole('navigation').getByText('Language & Location').click();

  await page.getByRole('button', { name: 'Việt Nam' }).click();
  await page.getByRole('button', { name: 'Tiếng Việt' }).click();
  await page.getByRole('button', { name: 'Lưu' }).click();

  // verify Vietnamese UI
  await expect(page.getByText('Ngôn ngữ & Vị trí')).toBeVisible();

  // =========================
  // STEP 3: Indonesia
  // =========================
  await page.locator('.icon-wrap').first().click();
  await page.getByRole('navigation').getByText('Bahasa & Lokasi').click();

  await page.getByRole('button', { name: 'Indonesia', exact: true }).click();
  await page.getByRole('button', { name: 'Korea', exact: true }).click();
  await page.getByRole('button', { name: 'Simpan' }).click();

  // verify Indonesian UI
  await expect(page.getByText('Bahasa & Lokasi')).toBeVisible();
});