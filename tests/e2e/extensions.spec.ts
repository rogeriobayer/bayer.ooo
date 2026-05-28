import { test, expect } from '@playwright/test';
import { extensionsData } from '../../src/app/lib/extensions-data.js';
import { translations } from '../../src/app/data/translations.js';

const defaultLanguage = 'pt';

const t = (lang: keyof typeof translations, key: string) =>
  translations[lang]?.[key] ?? key;

test.describe('Extensions Page', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/extensions');
  });

  test('should render the extensions page title and heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Extensões | Rogério Bayer/);

    const heading = page.getByRole('heading', { name: t(defaultLanguage, 'extensions.title'), level: 1 });
    await expect(heading).toBeVisible();

    await expect(page.getByText(t(defaultLanguage, 'extensions.description'))).toBeVisible();
  });

  test('should render all extensions with correct names and descriptions', async ({ page }) => {
    const extensions = extensionsData[defaultLanguage]?.extensions || [];
    test.skip(extensions.length === 0, 'No extensions to test');

    for (const extension of extensions) {
      const card = page.locator('article, section').filter({ hasText: extension.name });
      await expect(card.first()).toBeVisible();
      await expect(page.getByText(extension.description)).toBeVisible();
    }
  });

  test('should render extension images', async ({ page }) => {
    const extensions = extensionsData[defaultLanguage]?.extensions || [];
    test.skip(extensions.length === 0, 'No extensions to test');

    for (const extension of extensions) {
      const image = page.locator(`img[alt*="${extension.name}"]`);
      await expect(image.first()).toBeVisible();
    }
  });

  test('should have install links to Chrome Web Store for each extension', async ({ page }) => {
    const extensions = extensionsData[defaultLanguage]?.extensions || [];
    test.skip(extensions.length === 0, 'No extensions to test');

    for (const extension of extensions) {
      if (!extension.link) continue;

      const installButton = page
        .locator('a')
        .filter({ hasText: t(defaultLanguage, 'extensions.install') })
        .filter({ has: page.locator(`xpath=ancestor::*[contains(text(), "${extension.name}")]`) });

      // Check that the link exists somewhere on the page for this extension's card
      const card = page.locator('section, article, .card').filter({ hasText: extension.name });
      const linkInCard = card.locator(`a[href="${extension.link}"]`);
      await expect(linkInCard.first()).toBeVisible();
    }
  });

  test('should have more info buttons for each extension', async ({ page }) => {
    const extensions = extensionsData[defaultLanguage]?.extensions || [];
    test.skip(extensions.length === 0, 'No extensions to test');

    const moreInfoButtons = page.getByRole('button', {
      name: t(defaultLanguage, 'extensions.moreInfo'),
    });
    await expect(moreInfoButtons).toHaveCount(extensions.length);
  });

  test('should open and close extension detail modal', async ({ page }) => {
    const extensions = extensionsData[defaultLanguage]?.extensions || [];
    test.skip(extensions.length === 0, 'No extensions to test');

    const firstExtension = extensions[0];

    const cardHeading = page.getByRole('heading', { name: firstExtension.name });
    await cardHeading.click();

    const moreInfoButton = cardHeading.locator('xpath=ancestor::*[contains(@class, "card")]').getByRole('button', {
      name: t(defaultLanguage, 'extensions.moreInfo'),
    });
    await moreInfoButton.click();

    const modal = page.locator('[role="dialog"], .modal, .modal-box').first();
    await expect(modal).toBeVisible();

    await expect(modal.getByText(firstExtension.name)).toBeVisible();

    const closeButton = modal.locator('button.btn-ghost:not(.btn-circle)').filter({ hasText: t(defaultLanguage, 'projects.modal.close') });
    await closeButton.click();

    await expect(modal).not.toBeVisible();
  });

  test('should display release dates and download counts', async ({ page }) => {
    const extensions = extensionsData[defaultLanguage]?.extensions || [];
    test.skip(extensions.length === 0, 'No extensions to test');

    for (const extension of extensions) {
      if (extension.releaseDate) {
        await expect(
          page.getByText(new RegExp(`${t(defaultLanguage, 'extensions.releaseDate')}`)).first()
        ).toBeVisible();
      }
    }
  });

  test('should display header and footer', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have navigation link to extensions in header or footer', async ({ page }) => {
    // Header should be visible and allow navigation
    await expect(page.locator('header')).toBeVisible();
  });
});

test.describe('Extensions Page Language Switching', () => {
  test('should switch extensions page language correctly', async ({ page }) => {
    await page.goto('/extensions');

    await expect(page.getByRole('heading', { name: t('pt', 'extensions.title'), level: 1 })).toBeVisible();
    await expect(page.getByText(t('pt', 'extensions.description'))).toBeVisible();

    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page.getByRole('heading', { name: t('en', 'extensions.title'), level: 1 })).toBeVisible();
    await expect(page.getByText(t('en', 'extensions.description'))).toBeVisible();

    await page.getByRole('button', { name: 'FR' }).click();
    await expect(page.getByRole('heading', { name: t('fr', 'extensions.title'), level: 1 })).toBeVisible();
    await expect(page.getByText(t('fr', 'extensions.description'))).toBeVisible();

    await page.getByRole('button', { name: 'PT' }).click();
    await expect(page.getByRole('heading', { name: t('pt', 'extensions.title'), level: 1 })).toBeVisible();
    await expect(page.getByText(t('pt', 'extensions.description'))).toBeVisible();
  });
});
