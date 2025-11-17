export default function sitemap() {
  const sites = [
    { url: 'https://bayer.ooo' },
    { url: 'https://palmeiras.bayer.ooo' },
    { url: 'https://noronha.bayer.ooo' },
    { url: 'https://focuspatrol.bayer.ooo' },
  ];

  return sites.map(({ url }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: {
        pt: url,
        en: url,
        fr: url,
      },
    },
  }));
}