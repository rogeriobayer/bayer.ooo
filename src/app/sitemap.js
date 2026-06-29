import { getAllPosts } from "@/app/lib/blog";

const BASE_URL = "https://bayer.ooo";

/**
 * Sitemap for the bayer.ooo domain.
 *
 * Notes:
 * - Sitemaps should only list URLs belonging to the same host. Subdomains
 *   (palmeiras.bayer.ooo, focuspatrol.bayer.ooo, etc.) must have their own
 *   sitemap or be submitted separately in Search Console.
 * - `alternates.languages` is omitted because the site uses a single URL for
 *   every language (content is negotiated via Accept-Language). Hreflang
 *   annotations require distinct URLs to be valid.
 */
export default function sitemap() {
  const now = new Date();

  const staticPages = [
    {
      path: "",
      changeFrequency: "monthly",
      priority: 1,
      images: [`${BASE_URL}/rogeriobayer.png`],
    },
    {
      path: "/extensions",
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${BASE_URL}/rogeriobayer.png`],
    },
    {
      path: "/blog",
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${BASE_URL}/rogeriobayer.png`],
    },
  ];

  const staticEntries = staticPages.map(({ path, changeFrequency, priority, images }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    images,
  }));

  const posts = getAllPosts();
  const postEntries = posts.map((post) => {
    const defaultPost = post.translations.pt || Object.values(post.translations)[0];
    const url = `${BASE_URL}/blog/${post.slug}`;

    return {
      url,
      lastModified: new Date(defaultPost.date),
      changeFrequency: "monthly",
      priority: 0.7,
      images: defaultPost.cover
        ? [`${BASE_URL}${defaultPost.cover}`]
        : [`${BASE_URL}/rogeriobayer.png`],
    };
  });

  return [...staticEntries, ...postEntries];
}
