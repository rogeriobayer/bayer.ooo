import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export { formatDate } from './date';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function readPostFile(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    slug: data.slug || path.basename(filePath).replace(/\.\w+\.md$/, ''),
    title: data.title || '',
    date: data.date || '',
    lang: data.lang || 'pt',
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    cover: data.cover || null,
    author: data.author || 'Rogério Bayer',
    content,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Get all unique post slugs with their translations
 * @returns {Array} Array of { slug, translations: { pt: post, en: post, fr: post } }
 */
export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));
  const postsBySlug = {};

  for (const file of files) {
    const match = file.match(/^(.+)\.(pt|en|fr)\.md$/);
    if (!match) continue;

    const [, slug, lang] = match;
    const post = readPostFile(path.join(BLOG_DIR, file));

    if (!postsBySlug[slug]) {
      postsBySlug[slug] = { slug, translations: {} };
    }
    postsBySlug[slug].translations[lang] = post;
  }

  return Object.values(postsBySlug).sort((a, b) => {
    const dateA = new Date(a.translations.pt?.date || 0);
    const dateB = new Date(b.translations.pt?.date || 0);
    return dateB - dateA;
  });
}

/**
 * Get a single post with all translations by slug
 * @param {string} slug
 * @returns {object|null} { slug, translations: { pt, en, fr } }
 */
export function getPostBySlug(slug) {
  const langs = ['pt', 'en', 'fr'];
  const translations = {};

  for (const lang of langs) {
    const filePath = path.join(BLOG_DIR, `${slug}.${lang}.md`);
    if (fs.existsSync(filePath)) {
      translations[lang] = readPostFile(filePath);
    }
  }

  if (Object.keys(translations).length === 0) {
    return null;
  }

  return { slug, translations };
}

/**
 * Get all post slugs for static generation
 * @returns {Array} Array of { slug }
 */
export function getAllPostSlugs() {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));
  const slugs = new Set();

  for (const file of files) {
    const match = file.match(/^(.+)\.(pt|en|fr)\.md$/);
    if (match) {
      slugs.add(match[1]);
    }
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

/**
 * Calculate estimated reading time
 * @param {string} content
 * @returns {number} Minutes
 */
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
