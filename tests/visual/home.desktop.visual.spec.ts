import { test, expect } from '@playwright/test';
import { openHomeAndStabilize, switchLocale, warmUpPageForFullScreenshot, type Locale } from './visual.helpers';

const desktopLocales: Locale[] = ['pt', 'en', 'fr'];

test.describe('Visual Regression - Home Desktop', () => {
  test.describe.configure({ timeout: 90_000 });

  for (const locale of desktopLocales) {
    test(`Desktop Homepage - ${locale.toUpperCase()}`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'Only run on desktop/tablet projects');
      await openHomeAndStabilize(page);
      if (locale !== 'pt') {
        await switchLocale(page, locale);
      }

      await warmUpPageForFullScreenshot(page, locale);
      await expect(page).toHaveScreenshot(`homepage-desktop-${locale}.png`, {
        fullPage: true,
        animations: 'disabled',
        timeout: 20_000,
      });
    });
  }
});
