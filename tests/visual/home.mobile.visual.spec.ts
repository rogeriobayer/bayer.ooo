import { test, expect } from '@playwright/test';
import { openHomeAndStabilize, switchLocale, warmUpPageForFullScreenshot, type Locale } from './visual.helpers';

const mobileLocales: Locale[] = ['pt', 'en', 'fr'];

test.describe('Visual Regression - Home Mobile', () => {
  test.describe.configure({ timeout: 90_000 });

  for (const locale of mobileLocales) {
    test(`Mobile Homepage Full - ${locale.toUpperCase()}`, async ({ page, isMobile }, testInfo) => {
      test.skip(!isMobile, 'Only run on mobile/tablet projects');
      const isIpad = testInfo.project.name === 'iPad Mini';
      test.skip(isIpad && locale !== 'pt', 'iPad runs only PT full-page to keep suite stable and fast');
      await openHomeAndStabilize(page);
      if (locale !== 'pt') {
        await switchLocale(page, locale);
      }

      await warmUpPageForFullScreenshot(page, locale);
      await expect(page).toHaveScreenshot(`homepage-mobile-full-${locale}.png`, {
        fullPage: !isIpad,
        animations: 'disabled',
        timeout: 30_000,
      });
    });
  }

  test('Mobile Homepage Projects Focus - PT', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Only run on mobile/tablet projects');
    await openHomeAndStabilize(page);
    const projectsSection = page.locator('#projects');
    await projectsSection.scrollIntoViewIfNeeded();
    await expect(projectsSection).toBeVisible();
    await expect(page.getByTestId('project-card-powerbi')).toBeVisible();
    await expect(page.getByTestId('project-card-farmaalg')).toBeVisible();
    await expect(page.getByTestId('project-card-focuspatrol')).toBeVisible();

    await expect(projectsSection).toHaveScreenshot('homepage-mobile-projects-pt.png', {
      animations: 'disabled',
    });
  });
});
