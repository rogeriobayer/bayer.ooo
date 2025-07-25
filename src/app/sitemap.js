export default function sitemap() {
  const baseUrl = 'https://bayer.ooo';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          pt: baseUrl,
          en: `${baseUrl}`,
          fr: `${baseUrl}`,
        },
      },
    },
  ];
} 