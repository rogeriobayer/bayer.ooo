import { test, expect } from '@playwright/test';
import { blogPosts } from '../../src/app/lib/blog-data.js';
import { translations } from '../../src/app/data/translations.js';

const defaultLanguage = 'pt';

const t = (lang: keyof typeof translations, key: string) =>
  translations[lang]?.[key] ?? key;

test.describe('Blog List Page', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('should render the blog page title and description', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog | Rogério Bayer/);

    const heading = page.getByRole('heading', { name: 'Blog', level: 1 });
    await expect(heading).toBeVisible();

    await expect(
      page.getByText(
        'Artigos, tutoriais e reflexões sobre desenvolvimento de software, tecnologia e design.'
      )
    ).toBeVisible();
  });

  test('should render blog post cards', async ({ page }) => {
    const posts = blogPosts;
    test.skip(posts.length === 0, 'No blog posts to test');

    for (const post of posts) {
      const translation = post.translations[defaultLanguage] || post.translations.pt || Object.values(post.translations)[0];
      if (!translation) continue;

      const card = page.locator('article').filter({ hasText: translation.title });
      await expect(card).toBeVisible();

      await expect(card.getByText(translation.excerpt)).toBeVisible();
      await expect(card.getByText(`${translation.readingTime} min`)).toBeVisible();

      if (translation.tags && translation.tags.length > 0) {
        for (const tag of translation.tags) {
          await expect(card.getByText(tag, { exact: true })).toBeVisible();
        }
      }
    }
  });

  test('should have working links to individual blog posts', async ({ page }) => {
    const posts = blogPosts;
    test.skip(posts.length === 0, 'No blog posts to test');

    for (const post of posts) {
      const translation = post.translations[defaultLanguage] || post.translations.pt || Object.values(post.translations)[0];
      if (!translation) continue;

      const link = page.locator('article').filter({ hasText: translation.title }).locator('a');
      await expect(link).toHaveAttribute('href', `/blog/${post.slug}`);
    }
  });

  test('should display header and footer', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('Blog Post Page', () => {
  test.setTimeout(30000);

  const firstPost = blogPosts[0];
  test.skip(!firstPost, 'No blog posts to test individual page');

  const translation = firstPost?.translations[defaultLanguage] || firstPost?.translations.pt || Object.values(firstPost?.translations || {})[0];

  test.beforeEach(async ({ page }) => {
    if (firstPost) {
      await page.goto(`/blog/${firstPost.slug}`);
    }
  });

  test('should render the blog post title and metadata', async ({ page }) => {
    if (!translation) return;

    await expect(page).toHaveTitle(new RegExp(`${translation.title} | Rogério Bayer`));

    const heading = page.getByRole('heading', { name: translation.title, level: 1 });
    await expect(heading).toBeVisible();

    const article = page.locator('article').first();
    await expect(article.getByText(translation.author, { exact: true })).toBeVisible();
    await expect(article.getByText(`${translation.readingTime} min`, { exact: false })).toBeVisible();
  });

  test('should render the blog post excerpt and tags', async ({ page }) => {
    if (!translation) return;

    if (translation.excerpt) {
      await expect(page.getByText(translation.excerpt)).toBeVisible();
    }

    if (translation.tags && translation.tags.length > 0) {
      for (const tag of translation.tags) {
        await expect(page.getByText(tag, { exact: true }).first()).toBeVisible();
      }
    }
  });

  test('should render markdown content', async ({ page }) => {
    const article = page.locator('article');
    await expect(article).toBeVisible();

    // Content should have rendered paragraphs or headings from markdown
    const contentHasText = await article.locator('p, h1, h2, h3, ul, ol, pre').count();
    expect(contentHasText).toBeGreaterThan(0);
  });

  test('should have a back to blog link', async ({ page }) => {
    const backLink = page.getByRole('link', { name: t(defaultLanguage, 'blog.backToBlog') }).first();
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/blog');
  });

  test('should navigate back to blog list', async ({ page }) => {
    const backLink = page.getByRole('link', { name: t(defaultLanguage, 'blog.backToBlog') }).first();
    await backLink.click();

    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  });

  test('should return 404 for non-existent slug', async ({ page }) => {
    const response = await page.goto('/blog/non-existent-slug-12345');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Blog Language Switching', () => {
  test('should switch blog page language correctly', async ({ page }) => {
    await page.goto('/blog');

    // Switch to English
    await page.getByRole('button', { name: 'EN' }).click();

    // Verify page still loads with English content if available
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();

    // Switch back to Portuguese
    await page.getByRole('button', { name: 'PT' }).click();
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  });
});
