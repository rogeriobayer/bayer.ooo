import { test, expect } from '@playwright/test';
import { openHomeAndStabilize, openProjectModal, projectModalCases } from './visual.helpers';

test.describe('Visual Regression - Project Modal', () => {
  test.describe.configure({ timeout: 90_000 });

  for (const modalCase of projectModalCases) {
    test(`Project Modal - ${modalCase.slug}`, async ({ page }) => {
      await openHomeAndStabilize(page);
      const modal = await openProjectModal(page, modalCase);
      await expect(modal).toHaveScreenshot(modalCase.screenshotName, {
        animations: 'disabled',
      });
    });
  }
});
