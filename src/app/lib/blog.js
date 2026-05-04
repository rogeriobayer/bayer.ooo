import { blogPosts } from './blog-data';

export { formatDate } from './date';

/**
 * Get all unique post slugs with their translations
 * @returns {Array} Array of { slug, translations: { pt: post, en: post, fr: post } }
 */
export function getAllPosts() {
  return blogPosts;
}

/**
 * Get a single post with all translations by slug
 * @param {string} slug
 * @returns {object|null} { slug, translations: { pt, en, fr } }
 */
export function getPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) || null;
}

/**
 * Get all post slugs for static generation
 * @returns {Array} Array of { slug }
 */
export function getAllPostSlugs() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}
