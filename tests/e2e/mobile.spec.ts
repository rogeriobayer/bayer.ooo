import { test, expect, devices } from '@playwright/test';
import { translations } from '../../src/app/data/translations.js';

const defaultLanguage = 'pt';

const t = (lang: keyof typeof translations, key: string) =>
  translations[lang]?.[key] ?? key;

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Responsiveness', () => {
  test.setTimeout(30000);

  test('should adapt layout for mobile', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: t(defaultLanguage, 'apresentation.greeting'), level: 1 })
    ).toBeVisible();
  });
});
