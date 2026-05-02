import { describe, it, expect } from 'vitest';
import { getPostsByLanguage, getAllPosts, getPostBySlug, getAllPostSlugs, formatDate } from '@/app/lib/blog';

describe('Blog helpers', () => {
  it('getPostsByLanguage returns posts for a language', () => {
    const posts = getPostsByLanguage('pt');
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('slug');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('content');
  });

  it('getPostsByLanguage returns empty array for non-existent language', () => {
    const posts = getPostsByLanguage('xx');
    expect(posts).toEqual([]);
  });

  it('getAllPosts returns posts across all languages', () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThanOrEqual(3);
  });

  it('getPostBySlug returns a post', () => {
    const post = getPostBySlug('pt', 'ola-mundo');
    expect(post).not.toBeNull();
    expect(post.slug).toBe('ola-mundo');
    expect(post.title).toBe('Olá, Mundo!');
    expect(post.lang).toBe('pt');
  });

  it('getPostBySlug returns null for non-existent post', () => {
    const post = getPostBySlug('pt', 'non-existent');
    expect(post).toBeNull();
  });

  it('getAllPostSlugs returns array of slugs', () => {
    const slugs = getAllPostSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThanOrEqual(3);
    expect(slugs[0]).toHaveProperty('lang');
    expect(slugs[0]).toHaveProperty('slug');
  });

  it('formatDate formats date correctly', () => {
    const formatted = formatDate('2025-05-02T10:00:00.000Z', 'pt');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });
});
