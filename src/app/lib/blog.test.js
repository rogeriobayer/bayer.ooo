import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug, getAllPostSlugs, formatDate } from '@/app/lib/blog';

describe('Blog helpers', () => {
  it('getAllPosts returns unique posts with translations', () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('slug');
    expect(posts[0]).toHaveProperty('translations');
    expect(Object.keys(posts[0].translations).length).toBeGreaterThan(0);
  });

  it('getPostBySlug returns a post with all translations', () => {
    const post = getPostBySlug('ola-mundo');
    expect(post).not.toBeNull();
    expect(post.slug).toBe('ola-mundo');
    expect(post.translations).toHaveProperty('pt');
    expect(post.translations.pt.title).toBe('Olá, Mundo!');
  });

  it('getPostBySlug returns null for non-existent post', () => {
    const post = getPostBySlug('non-existent');
    expect(post).toBeNull();
  });

  it('getAllPostSlugs returns array of slugs without lang', () => {
    const slugs = getAllPostSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs[0]).toHaveProperty('slug');
    expect(slugs[0]).not.toHaveProperty('lang');
  });

  it('formatDate formats date correctly', () => {
    const formatted = formatDate('2025-05-02T10:00:00.000Z', 'pt');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });
});
