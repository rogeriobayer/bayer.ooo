import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export { formatDate } from './date';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all posts for a given language
 * @param {string} lang - Language code (pt, en, fr)
 * @returns {Array} Array of post objects sorted by date desc
 */
export function getPostsByLanguage(lang) {
  const langDir = path.join(BLOG_DIR, lang);
  
  if (!fs.existsSync(langDir)) {
    return [];
  }

  const files = fs.readdirSync(langDir).filter((file) => file.endsWith('.md'));

  const posts = files.map((file) => {
    const filePath = path.join(langDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || file.replace('.md', ''),
      title: data.title || '',
      date: data.date || '',
      lang: data.lang || lang,
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      cover: data.cover || null,
      author: data.author || 'Rogério Bayer',
      content,
      readingTime: calculateReadingTime(content),
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get all posts across all languages
 * @returns {Array} Array of all posts sorted by date desc
 */
export function getAllPosts() {
  const languages = ['pt', 'en', 'fr'];
  let allPosts = [];

  for (const lang of languages) {
    const posts = getPostsByLanguage(lang);
    allPosts = allPosts.concat(posts);
  }

  return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by language and slug
 * @param {string} lang
 * @param {string} slug
 * @returns {object|null}
 */
export function getPostBySlug(lang, slug) {
  const filePath = path.join(BLOG_DIR, lang, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: data.slug || slug,
    title: data.title || '',
    date: data.date || '',
    lang: data.lang || lang,
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    cover: data.cover || null,
    author: data.author || 'Rogério Bayer',
    content,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Get all post slugs for static generation
 * @returns {Array} Array of { lang, slug } params
 */
export function getAllPostSlugs() {
  const languages = ['pt', 'en', 'fr'];
  let slugs = [];

  for (const lang of languages) {
    const langDir = path.join(BLOG_DIR, lang);
    if (!fs.existsSync(langDir)) continue;

    const files = fs.readdirSync(langDir).filter((file) => file.endsWith('.md'));
    for (const file of files) {
      const slug = file.replace('.md', '');
      slugs.push({ lang, slug });
    }
  }

  return slugs;
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


