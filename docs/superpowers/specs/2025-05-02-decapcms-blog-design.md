# DecapCMS Blog Integration - Design Spec

**Date:** 2025-05-02
**Scope:** Add a blog section to bayer.ooo using DecapCMS for content management
**Deploy Target:** Cloudflare Pages (OpenNext)

---

## 1. Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Decap CMS     │      │   Next.js 15    │      │   Cloudflare    │
│  /admin/index   │─────▶│  Static Gen     │─────▶│   Pages (SSG)   │
│  (GitHub OAuth) │      │  App Router     │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  content/blog/  │      │  public/admin/  │
│  pt/en/fr/*.md  │      │  config.yml     │
└─────────────────┘      └─────────────────┘
```

- **DecapCMS** at `/admin` allows creating/editing posts via web UI.
- Posts saved to Git repo (`content/blog/[lang]/slug.md`) trigger CI/CD on Cloudflare.
- **Next.js** generates static pages at build time with `generateStaticParams`.
- Posts are read via Node.js `fs` + `gray-matter` for frontmatter parsing.

---

## 2. File Structure

```
public/admin/
├── index.html              # DecapCMS entry point
└── config.yml              # Collection config for "blog"

content/
└── blog/
    ├── pt/
    │   └── ola-mundo.md
    ├── en/
    │   └── hello-world.md
    └── fr/
        └── bonjour-le-monde.md

src/app/
├── blog/
│   └── page.js             # /blog - post listing
├── blog/
│   └── [lang]/
│       └── [slug]/
│           └── page.js     # /blog/[lang]/[slug] - individual post
├── lib/
│   └── blog.js             # Post reading helpers
└── components/Blog/
    ├── BlogCard.jsx        # Post card for listing
    ├── BlogPost.jsx        # Markdown content renderer
    └── BlogList.jsx        # List container
```

---

## 3. Data Model (Frontmatter)

```yaml
---
title: "Título do Post"
slug: "titulo-do-post"
date: "2025-05-02T10:00:00.000Z"
lang: "pt"
excerpt: "Resumo curto do post..."
tags: ["nextjs", "cms"]
cover: "/images/blog/cover.png"
author: "Rogério Bayer"
---
```

---

## 4. DecapCMS Config

```yaml
backend:
  name: github
  repo: rogeriobayer/bayer.ooo
  branch: main

media_folder: public/images/blog
public_folder: /images/blog

collections:
  - name: "blog"
    label: "Blog"
    folder: "content/blog"
    create: true
    slug: "{{fields.lang}}/{{fields.slug}}"
    path: "{{fields.lang}}/{{fields.slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Slug", name: "slug", widget: "string" }
      - { label: "Data", name: "date", widget: "datetime" }
      - { label: "Idioma", name: "lang", widget: "select", options: ["pt", "en", "fr"] }
      - { label: "Resumo", name: "excerpt", widget: "text" }
      - { label: "Tags", name: "tags", widget: "list" }
      - { label: "Capa", name: "cover", widget: "image", required: false }
      - { label: "Autor", name: "author", widget: "string", default: "Rogério Bayer" }
      - { label: "Corpo", name: "body", widget: "markdown" }
```

---

## 5. Pages

### `/blog` — Post Listing
- Static generation (single page, filters by current language)
- Cards with: title, excerpt, date, estimated read time, tags
- Ordered by date descending
- Consistent styling with site (Tailwind + DaisyUI)

### `/blog/[lang]/[slug]` — Individual Post
- Static generation via `generateStaticParams` iterating `content/blog/[lang]/*.md`
- `react-markdown` + `remark-gfm` for rendering
- Custom components mapping Tailwind classes
- Dynamic meta tags via `generateMetadata`
- "Back to blog" link

---

## 6. Styling

- Typography: `Stack Sans Text`, `Stack Sans Notch`
- Colors: DaisyUI theme `portfolio` / `portfolio-dark`
- Animations: Framer Motion (`staggerContainerVariant`, `fadeInVariant`, `cardHoverVariant`)
- Container: `max-w-2xl mx-auto` consistent with existing sections
- Markdown elements styled with project design tokens

---

## 7. Internationalization

- Uses existing `useTranslation` + `LanguageContext`
- New keys: `blog.title`, `blog.readMore`, `blog.publishedOn`, `blog.minRead`, `blog.backToBlog`, `blog.noPosts`
- Default listing at `/blog` shows posts in current language, fallback to all if none found
- URLs: `/blog` (listing), `/blog/[lang]/[slug]` (post)

---

## 8. Navigation

- **Footer:** Link "Blog" added alongside social icons
- **Header:** Not adding to header to keep minimal (per user request: "link a ser adicionado no footer")

---

## 9. Backend / Auth

- GitHub OAuth via DecapCMS default Netlify auth service (free, works with any host)
- No additional OAuth proxy needed for initial setup
- User must create a GitHub OAuth App if they want custom auth later

---

## 10. Dependencies

- `gray-matter`: Frontmatter parsing
- `react-markdown`: Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support

---

## 11. Testing

- Vitest: Test `lib/blog.js` helpers
- Playwright: E2E navigation /blog → post

---

## 12. Configurations Needed by User

1. **GitHub OAuth App** (optional but recommended for production):
   - Go to https://github.com/settings/developers
   - Create OAuth App with:
     - Homepage URL: `https://bayer.ooo`
     - Authorization callback: `https://api.netlify.com/auth/done`
   - Update `public/admin/config.yml` with `base_url` if using custom auth

2. **Cloudflare Pages Build Settings** (should already be configured):
   - Build command: `npm run build`
   - Output directory: `.open-next/assets` (handled by OpenNext)

3. **DecapCMS Access**:
   - Navigate to `https://bayer.ooo/admin`
   - Authorize with GitHub
   - Start creating posts

---

## 13. Future Enhancements

- Syntax highlighting with `react-syntax-highlighter`
- RSS feed generation
- Search functionality (could integrate Tavily API here)
- Related posts suggestions
- Pagination for blog listing
