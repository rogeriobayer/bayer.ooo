import { getAllPosts } from "@/app/lib/blog";

export default function sitemap() {
  const baseSites = [
    { url: 'https://bayer.ooo', priority: 1 },
    { url: 'https://palmeiras.bayer.ooo', priority: 0.8 },
    { url: 'https://noronha.bayer.ooo', priority: 0.8 },
    { url: 'https://focuspatrol.bayer.ooo', priority: 0.8 },
    { url: 'https://yoc.bayer.ooo', priority: 0.8 },
  ];

  const baseEntries = baseSites.map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority,
    alternates: {
      languages: {
        pt: url,
        en: url,
        fr: url,
      },
    },
  }));

  const blogIndex = {
    url: 'https://bayer.ooo/blog',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: {
      languages: {
        pt: 'https://bayer.ooo/blog',
        en: 'https://bayer.ooo/blog',
        fr: 'https://bayer.ooo/blog',
      },
    },
  };

  const posts = getAllPosts();
  const postEntries = posts.map((post) => {
    const defaultPost = post.translations.pt || Object.values(post.translations)[0];
    return {
      url: `https://bayer.ooo/blog/${post.slug}`,
      lastModified: new Date(defaultPost.date),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          pt: `https://bayer.ooo/blog/${post.slug}`,
          en: `https://bayer.ooo/blog/${post.slug}`,
          fr: `https://bayer.ooo/blog/${post.slug}`,
        },
      },
    };
  });

  return [...baseEntries, blogIndex, ...postEntries];
}
