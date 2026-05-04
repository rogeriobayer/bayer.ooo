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
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                                                    ▲
         │ OAuth (GitHub)                                     │
         ▼                                                    │
┌─────────────────────────────────────────┐                   │
│  Cloudflare Worker: bayerooo-decap-auth │───────────────────┘
│  /auth  →  GitHub  →  /callback         │  (commit → rebuild)
└─────────────────────────────────────────┘
         │
         ▼
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

- **GitHub OAuth via Cloudflare Worker proxy** (`workers/decap-auth/`)
- O serviço padrão da Netlify (`api.netlify.com/auth`) **não funciona** para sites hospedados fora da Netlify (ex: Cloudflare Pages)
- Foi implementado um **OAuth Proxy próprio** como Cloudflare Worker que faz o intermédio entre o DecapCMS e o GitHub
- O worker troca o `code` do GitHub por `access_token` e retorna ao DecapCMS via `postMessage`
- O `config.yml` usa `base_url` apontando para a URL do worker deployado

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

### 1. Criar GitHub OAuth App

1. Acesse https://github.com/settings/developers
2. Clique em **"New OAuth App"**
3. Preencha:
   - **Application name**: `Decap CMS - bayer.ooo`
   - **Homepage URL**: URL do seu worker (veja passo 3 abaixo). Pode ser o workers.dev ou domínio customizado.
   - **Authorization callback URL**: URL do worker + `/callback`
     - Exemplo: `https://bayerooo-decap-auth.seu-account.workers.dev/callback`
4. Salve o **Client ID** e gere o **Client Secret**

### 2. Deploy do OAuth Proxy (Cloudflare Worker)

```bash
cd workers/decap-auth

# Configure as secrets do worker
npx wrangler secret put GITHUB_OAUTH_ID
# (cole o Client ID do GitHub)

npx wrangler secret put GITHUB_OAUTH_SECRET
# (cole o Client Secret do GitHub)

# Faça o deploy
npx wrangler deploy
```

> **Opcional - Domínio customizado**: Edite `wrangler.jsonc` e descomente a linha `route` apontando para um subdomínio seu (ex: `auth.bayer.ooo`).

### 3. Atualizar config.yml do DecapCMS

Edite `public/admin/config.yml` e atualize o `base_url` para a URL do worker deployado:

```yaml
backend:
  name: github
  repo: rogeriobayer/bayer.ooo
  branch: main
  base_url: https://bayerooo-decap-auth.seu-account.workers.dev  # <- sua URL aqui
  auth_endpoint: /auth
```

Commit e push para que a mudança vá para produção.

### 4. Cloudflare Pages Build Settings

Já devem estar configurados:
- Build command: `npm run build`
- Output directory: `.open-next/assets`

### 5. Acessar o DecapCMS

1. Navegue para `https://bayer.ooo/admin`
2. Clique em "Login with GitHub"
3. Autorize o aplicativo
4. Pronto para criar posts!

---

## 13. Future Enhancements

- Syntax highlighting with `react-syntax-highlighter`
- RSS feed generation
- Search functionality (could integrate Tavily API here)
- Related posts suggestions
- Pagination for blog listing
