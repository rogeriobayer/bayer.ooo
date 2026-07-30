/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  
  trailingSlash: false,
  
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, 
  },
  
  async headers() {
    const agentLinkHeader = [
      '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
      '</llms.txt>; rel="describedby"; type="text/plain"',
      '</.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/skills-index"; type="application/json"',
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
      '</auth.md>; rel="https://authmd.org/rel/auth"; type="text/markdown"',
      '</agents/home.md>; rel="alternate"; type="text/markdown"',
    ].join(', ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Link',
            value: agentLinkHeader,
          },
        ],
      },
      {
        source: '/agents/:path*.md',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/markdown; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
      {
        source: '/auth.md',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/markdown; charset=utf-8',
          },
        ],
      },
      {
        source: '/.well-known/api-catalog',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/linkset+json',
          },
        ],
      },
      {
        source: '/.well-known/agent-skills/index.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;