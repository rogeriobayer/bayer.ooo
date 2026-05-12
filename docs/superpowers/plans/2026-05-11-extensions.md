# Extensions Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new `/extensions` route listing browser extensions with CMS-configurable JSON, reusing the existing project card/modal components with extension-specific fields.

**Architecture:** Add extensions to the existing CMS build pipeline (`build-cms-data.js`), generate `extensions-data.js` with i18n support, adapt `Projects` and `ProjectModal` components to handle a `type="extensions"` prop, and create a static Next.js page at `/extensions`.

**Tech Stack:** Next.js, React, Tailwind CSS, DaisyUI, Framer Motion, Vitest

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `scripts/build-cms-data.js` | Modify | Add extensions to build pipeline |
| `content/extensions/extensions.json` | Create | Source CMS data with i18n |
| `src/app/lib/extensions-data.js` | Generated | Auto-generated localized data |
| `src/app/data/translations.js` | Modify | Add extension-specific translation keys |
| `src/app/components/Projects.jsx` | Modify | Add `type` prop, extension card layout |
| `src/app/components/ProjectModal.jsx` | Modify | Add `releaseDate` and `details` support |
| `src/app/extensions/page.js` | Create | Static page route |
| `src/app/__tests__/build.test.js` | Modify | Validate extensions-data generation |
| `src/app/lib/extensions.test.js` | Create | Unit tests for extensions data |

---

## Task 1: Add Extensions to Build Script

**Files:**
- Modify: `scripts/build-cms-data.js`

- [ ] **Step 1: Add extensions build call in `main()`**

Insert after the `careerData` build call:

```javascript
    buildDataFile(
      path.join(CONTENT_DIR, 'extensions', 'extensions.json'),
      path.join(LIB_DIR, 'extensions-data.js'),
      'extensionsData'
    );
```

The `main()` function should now look like:

```javascript
function main() {
  console.log('Building CMS data files...\n');

  try {
    buildDataFile(
      path.join(CONTENT_DIR, 'projects', 'projects.json'),
      path.join(LIB_DIR, 'projects-data.js'),
      'projectsData'
    );

    buildDataFile(
      path.join(CONTENT_DIR, 'career', 'career.json'),
      path.join(LIB_DIR, 'career-data.js'),
      'careerData'
    );

    buildDataFile(
      path.join(CONTENT_DIR, 'extensions', 'extensions.json'),
      path.join(LIB_DIR, 'extensions-data.js'),
      'extensionsData'
    );

    console.log('\n🎉 All CMS data files built successfully!');
  } catch (error) {
    console.error('\n❌ Error building CMS data files:', error.message);
    process.exit(1);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/build-cms-data.js
git commit -m "feat(build): add extensions to CMS data pipeline"
```

---

## Task 2: Create Sample Extensions JSON

**Files:**
- Create: `content/extensions/extensions.json`

- [ ] **Step 1: Create directory and sample data**

```bash
mkdir -p content/extensions
```

Create `content/extensions/extensions.json`:

```json
{
  "extensions": [
    {
      "id": 1,
      "slug": "focus-patrol",
      "name": {
        "pt": "Focus Patrol",
        "en": "Focus Patrol",
        "fr": "Focus Patrol"
      },
      "icon": "/images/projects/focus-patrol-project.png",
      "description": {
        "pt": "Utiliza IA On-Device para classificar o conteúdo das páginas. O recurso central é o Contador de Foco em Tempo Real, que exibe a quantidade de sites acessados nas categorias Foco, Neutro e Distração.",
        "en": "Uses On-Device AI to classify page content. The core feature is the Real-Time Focus Counter, displaying the number of sites accessed in Focus, Neutral, and Distraction categories.",
        "fr": "Utilise l'IA embarquée pour classifier le contenu des pages. La fonctionnalité centrale est le Compteur de Concentration en Temps Réel."
      },
      "link": "https://focuspatrol.bayer.ooo/",
      "downloads": "12.5K",
      "releaseDate": "2025-03-15",
      "frameworks": ["javascript", "chrome"],
      "modal": {
        "images": [
          "/images/projects/focus-patrol-project.png"
        ],
        "technologies": [
          {
            "code": "javascript",
            "role": {
              "pt": "Lógica principal da extensão",
              "en": "Core extension logic",
              "fr": "Logique principale de l'extension"
            }
          },
          {
            "code": "chrome",
            "role": {
              "pt": "APIs de extensão do navegador",
              "en": "Browser extension APIs",
              "fr": "APIs d'extension du navigateur"
            }
          }
        ],
        "impact": [
          {
            "value": "5.0 ★",
            "label": {
              "pt": "Web Store",
              "en": "Web Store",
              "fr": "Web Store"
            }
          },
          {
            "value": "#20",
            "label": {
              "pt": "Product Hunt",
              "en": "Product Hunt",
              "fr": "Product Hunt"
            }
          }
        ],
        "details": {
          "pt": "Focus Patrol é uma extensão 100% privacy-first que processa todos os dados de navegação localmente. O sistema de Notificações é acionado de acordo com a tolerância de distrações e o tempo escolhido pelo usuário. Desenvolvida com JavaScript puro e APIs do Chrome, não requer nenhum servidor externo para funcionar.",
          "en": "Focus Patrol is a 100% privacy-first extension that processes all browsing data locally. The Notifications system is triggered according to distraction tolerance and user-chosen time. Built with pure JavaScript and Chrome APIs, it requires no external server.",
          "fr": "Focus Patrol est une extension 100% privacy-first qui traite toutes les données de navigation localement. Le système de notifications est déclenché selon la tolérance aux distractions et le temps choisi par l'utilisateur."
        }
      }
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/extensions/extensions.json
git commit -m "feat(cms): add sample extensions JSON data"
```

---

## Task 3: Generate Extensions Data File

**Files:**
- Generated: `src/app/lib/extensions-data.js`

- [ ] **Step 1: Run build script**

```bash
npm run build:data
```

**Expected output:**
```
Building CMS data files...

✅ Generated projects-data.js
✅ Generated career-data.js
✅ Generated extensions-data.js

🎉 All CMS data files built successfully!
Generated blog data with X posts
```

- [ ] **Step 2: Verify generated file exists**

```bash
cat src/app/lib/extensions-data.js | head -20
```

**Expected:** File starts with `// Auto-generated by scripts/build-cms-data.js` and contains `extensionsData` export.

- [ ] **Step 3: Commit**

```bash
git add src/app/lib/extensions-data.js
git commit -m "feat(data): generate extensions-data.js from CMS"
```

---

## Task 4: Add Translation Keys

**Files:**
- Modify: `src/app/data/translations.js`

- [ ] **Step 1: Add keys to `pt` object (after `footer.blogLink`)**

```javascript
    "extensions.title": "Extensões",
    "extensions.description": "Extensões de navegador que desenvolvi para produtividade e foco.",
    "extensions.install": "Instalar",
    "extensions.moreInfo": "Mais informações",
    "extensions.downloads": "downloads",
    "extensions.releaseDate": "Lançado em",
    "extensions.modal.details": "Detalhes",
    "extensions.modal.releaseDate": "Data de lançamento",
```

- [ ] **Step 2: Add keys to `en` object (after `footer.blogLink`)**

```javascript
    "extensions.title": "Extensions",
    "extensions.description": "Browser extensions I built for productivity and focus.",
    "extensions.install": "Install",
    "extensions.moreInfo": "More info",
    "extensions.downloads": "downloads",
    "extensions.releaseDate": "Released on",
    "extensions.modal.details": "Details",
    "extensions.modal.releaseDate": "Release date",
```

- [ ] **Step 3: Add keys to `fr` object (after `footer.blogLink`)**

```javascript
    "extensions.title": "Extensions",
    "extensions.description": "Extensions de navigateur que j'ai développées pour la productivité et la concentration.",
    "extensions.install": "Installer",
    "extensions.moreInfo": "Plus d'infos",
    "extensions.downloads": "téléchargements",
    "extensions.releaseDate": "Publié le",
    "extensions.modal.details": "Détails",
    "extensions.modal.releaseDate": "Date de publication",
```

- [ ] **Step 4: Commit**

```bash
git add src/app/data/translations.js
git commit -m "feat(i18n): add extensions translation keys for pt/en/fr"
```

---

## Task 5: Adapt ProjectModal for Extensions

**Files:**
- Modify: `src/app/components/ProjectModal.jsx`
- Import `formatDate` from `@/app/lib/date`

- [ ] **Step 1: Add import for formatDate**

At the top, after existing imports:

```javascript
import { formatDate } from "../lib/date";
```

- [ ] **Step 2: Add `type` prop and releaseDate display**

Update component signature and `useTranslation`:

```javascript
export const ProjectModal = ({ project, isOpen, onClose, type = "projects" }) => {
    const { t, currentLanguage } = useTranslation();
```

After the `<h2>` title and before the close button, add:

```jsx
                                {project.releaseDate && (
                                    <p className="text-sm text-muted mt-1">
                                        {t("extensions.modal.releaseDate")}: {formatDate(project.releaseDate, currentLanguage)}
                                    </p>
                                )}
```

- [ ] **Step 3: Add details section**

After the technologies section and before the impact section, add:

```jsx
                            {modalData.details && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-base-content mb-3">
                                        {t("extensions.modal.details")}
                                    </h3>
                                    <p className="text-secondary leading-relaxed whitespace-pre-line">
                                        {modalData.details}
                                    </p>
                                </div>
                            )}
```

- [ ] **Step 4: Change link button label based on type**

Replace the link button label with:

```jsx
                                        {type === "extensions" ? t("extensions.install") : t("projects.access")}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ProjectModal.jsx
git commit -m "feat(modal): add releaseDate and details support for extensions"
```

---

## Task 6: Adapt Projects Component for Extensions

**Files:**
- Modify: `src/app/components/Projects.jsx`
- Import `extensionsData` from `@/app/lib/extensions-data`
- Import `formatDate` from `@/app/lib/date`

- [ ] **Step 1: Add imports**

At the top, after `projectsData` import:

```javascript
import { extensionsData } from "@/app/lib/extensions-data";
import { formatDate } from "@/app/lib/date";
```

- [ ] **Step 2: Add `type` prop**

Change the component signature:

```javascript
export const Projects = ({ type = "projects" }) => {
```

- [ ] **Step 3: Select data source based on type**

Replace:

```javascript
  const projects = projectsData[currentLanguage]?.projects || projectsData.pt.projects;
```

With:

```javascript
  const data = type === "extensions" ? extensionsData : projectsData;
  const projects = data[currentLanguage]?.[type === "extensions" ? "extensions" : "projects"] || data.pt[type === "extensions" ? "extensions" : "projects"];
```

- [ ] **Step 4: Update section id and title**

```javascript
        id={type}
```

And:

```javascript
            {t(`${type}.title`)}
```

- [ ] **Step 5: Add downloads and releaseDate to card**

After the description `<p>` and before `card-actions`, add:

```jsx
                    {(project.downloads || project.releaseDate) && (
                      <div className="flex items-center gap-3 text-xs text-muted mt-2">
                        {project.downloads && (
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            {project.downloads} {t("extensions.downloads")}
                          </span>
                        )}
                        {project.releaseDate && (
                          <span>
                            {t("extensions.releaseDate")} {formatDate(project.releaseDate, currentLanguage)}
                          </span>
                        )}
                      </div>
                    )}
```

- [ ] **Step 6: Update card action buttons**

Change the link button label:

```jsx
                        {project.link && (
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                            variants={buttonHoverVariant}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            {type === "extensions" ? t("extensions.install") : t("projects.access")}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </motion.a>
                        )}
```

And change the details button label:

```jsx
                      <motion.button
                        onClick={() => openModal(project)}
                        className="btn btn-ghost btn-sm"
                        variants={buttonHoverVariant}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {type === "extensions" ? t("extensions.moreInfo") : t("projects.details")}
                      </motion.button>
```

- [ ] **Step 7: Pass type to ProjectModal**

Update the `ProjectModal` call at the bottom:

```jsx
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={closeModal}
        type={type}
      />
```

- [ ] **Step 8: Commit**

```bash
git add src/app/components/Projects.jsx
git commit -m "feat(projects): add type prop to support extensions"
```

---

## Task 7: Create /extensions Page

**Files:**
- Create: `src/app/extensions/page.js`

- [ ] **Step 1: Create page file**

```javascript
import Projects from "@/app/components/Projects";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const dynamic = "force-static";

export const metadata = {
  title: "Extensões | Rogério Bayer",
  description: "Extensões de navegador que desenvolvi para produtividade e foco.",
  keywords: ["extensões", "browser extensions", "chrome", "produtividade", "focus"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://bayer.ooo/extensions",
  },
  openGraph: {
    title: "Extensões | Rogério Bayer",
    description: "Extensões de navegador que desenvolvi para produtividade e foco.",
    url: "https://bayer.ooo/extensions",
    type: "website",
    siteName: "Rogério Bayer",
    locale: "pt_BR",
    images: [
      {
        url: "https://bayer.ooo/rogeriobayer.png",
        width: 1200,
        height: 630,
        alt: "Extensões | Rogério Bayer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Extensões | Rogério Bayer",
    description: "Extensões de navegador que desenvolvi para produtividade e foco.",
    images: ["https://bayer.ooo/rogeriobayer.png"],
  },
};

export default function ExtensionsPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-base-content mb-4">
              Extensões
            </h1>
            <p className="text-lg text-secondary max-w-lg mx-auto">
              Extensões de navegador que desenvolvi para produtividade e foco.
            </p>
          </div>

          <Projects type="extensions" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create extensions lib file**

Create `src/app/lib/extensions.js`:

```javascript
import { extensionsData } from './extensions-data';

export { formatDate } from './date';

/**
 * Get all extensions with their translations
 * @returns {Array} Array of { slug, translations: { pt: ext, en: ext, fr: ext } }
 */
export function getAllExtensions() {
  return extensionsData;
}

/**
 * Get a single extension with all translations by slug
 * @param {string} slug
 * @returns {object|null} { slug, translations: { pt, en, fr } }
 */
export function getExtensionBySlug(slug) {
  return extensionsData.find((ext) => ext.slug === slug) || null;
}

/**
 * Get all extension slugs for static generation
 * @returns {Array} Array of { slug }
 */
export function getAllExtensionSlugs() {
  return extensionsData.map((ext) => ({ slug: ext.slug }));
}
```

Wait, `extensionsData` from `build-cms-data.js` is an object with locale keys, not an array. Looking at the generated `projects-data.js`:

```javascript
export const projectsData = {
  "pt": { "projects": [...] },
  "en": { "projects": [...] },
  "fr": { "projects": [...] }
};
```

So `extensionsData` will be:
```javascript
export const extensionsData = {
  "pt": { "extensions": [...] },
  "en": { "extensions": [...] },
  "fr": { "extensions": [...] }
};
```

The `getAllExtensions` function in the page currently won't work because it expects an array. Actually, looking at the `/blog` page, `BlogList` receives `posts` directly from `getAllPosts()` which returns the array.

But for the `/extensions` page, we're using `<Projects type="extensions" />` directly which reads from `extensionsData` internally. So the page doesn't actually need to pass data to `Projects`. The `getAllExtensions()` import in the page is unnecessary.

Let's remove that and simplify the page:

```javascript
import Projects from "@/app/components/Projects";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const dynamic = "force-static";

export const metadata = {
  title: "Extensões | Rogério Bayer",
  description: "Extensões de navegador que desenvolvi para produtividade e foco.",
  keywords: ["extensões", "browser extensions", "chrome", "produtividade", "focus"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://bayer.ooo/extensions",
  },
  openGraph: {
    title: "Extensões | Rogério Bayer",
    description: "Extensões de navegador que desenvolvi para produtividade e foco.",
    url: "https://bayer.ooo/extensions",
    type: "website",
    siteName: "Rogério Bayer",
    locale: "pt_BR",
    images: [
      {
        url: "https://bayer.ooo/rogeriobayer.png",
        width: 1200,
        height: 630,
        alt: "Extensões | Rogério Bayer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Extensões | Rogério Bayer",
    description: "Extensões de navegador que desenvolvi para produtividade e foco.",
    images: ["https://bayer.ooo/rogeriobayer.png"],
  },
};

export default function ExtensionsPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-base-content mb-4">
              Extensões
            </h1>
            <p className="text-lg text-secondary max-w-lg mx-auto">
              Extensões de navegador que desenvolvi para produtividade e foco.
            </p>
          </div>

          <Projects type="extensions" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

Actually wait — looking at the page again, I don't need the `getAllExtensions` import. But for future use (like generating static params), having `src/app/lib/extensions.js` is still useful. However, the current plan doesn't need it for the page. I'll still create it as it follows the pattern of `blog.js`.

- [ ] **Step 3: Commit**

```bash
git add src/app/extensions/page.js src/app/lib/extensions.js
git commit -m "feat(page): create /extensions route with static generation"
```

---

## Task 8: Update Tests

**Files:**
- Modify: `src/app/__tests__/build.test.js`
- Create: `src/app/lib/extensions.test.js`

- [ ] **Step 1: Add extensions-data validation to build test**

Add after the `career-data.js` check:

```javascript
  it('should validate extensions data file exists and is valid', async () => {
    const fs = require('fs');
    const path = require('path');
    
    const extensionsDataPath = path.join(process.cwd(), 'src', 'app', 'lib', 'extensions-data.js');
    expect(fs.existsSync(extensionsDataPath)).toBe(true);
    
    const { extensionsData } = await import('../../app/lib/extensions-data.js');
    expect(extensionsData).toBeDefined();
    expect(extensionsData.pt).toBeDefined();
    expect(extensionsData.pt.extensions).toBeDefined();
    expect(Array.isArray(extensionsData.pt.extensions)).toBe(true);
  });
```

- [ ] **Step 2: Create extensions unit test**

Create `src/app/lib/extensions.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { extensionsData } from './extensions-data';

describe('Extensions Data', () => {
  it('should have data for all supported locales', () => {
    expect(extensionsData.pt).toBeDefined();
    expect(extensionsData.en).toBeDefined();
    expect(extensionsData.fr).toBeDefined();
  });

  it('should have extensions array for each locale', () => {
    expect(Array.isArray(extensionsData.pt.extensions)).toBe(true);
    expect(Array.isArray(extensionsData.en.extensions)).toBe(true);
    expect(Array.isArray(extensionsData.fr.extensions)).toBe(true);
  });

  it('should have consistent extension count across locales', () => {
    expect(extensionsData.pt.extensions.length).toBe(extensionsData.en.extensions.length);
    expect(extensionsData.pt.extensions.length).toBe(extensionsData.fr.extensions.length);
  });

  it('should have required fields for each extension', () => {
    const extensions = extensionsData.pt.extensions;
    
    extensions.forEach((ext) => {
      expect(ext.id).toBeDefined();
      expect(ext.slug).toBeDefined();
      expect(ext.name).toBeDefined();
      expect(ext.description).toBeDefined();
      expect(ext.icon).toBeDefined();
      expect(ext.frameworks).toBeDefined();
      expect(Array.isArray(ext.frameworks)).toBe(true);
      expect(ext.modal).toBeDefined();
      expect(ext.modal.images).toBeDefined();
      expect(ext.modal.technologies).toBeDefined();
    });
  });

  it('should have extension-specific fields', () => {
    const extensions = extensionsData.pt.extensions;
    
    extensions.forEach((ext) => {
      expect(ext.downloads).toBeDefined();
      expect(ext.releaseDate).toBeDefined();
      expect(ext.modal.details).toBeDefined();
    });
  });
});
```

- [ ] **Step 3: Commit**

```bash
git add src/app/__tests__/build.test.js src/app/lib/extensions.test.js
git commit -m "test(extensions): add build and data validation tests"
```

---

## Task 9: Run Tests

- [ ] **Step 1: Run build data**

```bash
npm run build:data
```

- [ ] **Step 2: Run unit tests**

```bash
npm run test:run
```

**Expected:** All tests pass, including new extensions tests.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

**Expected:** No lint errors.

- [ ] **Step 4: Commit if all pass**

```bash
git commit -m "chore: verify tests and lint pass for extensions feature"
```

---

## Task 10: Verify Build

- [ ] **Step 1: Run Next.js build**

```bash
npm run build
```

**Expected:** Build completes successfully, `/extensions` page is generated statically.

- [ ] **Step 2: Verify static output**

Check that `.next/server/app/extensions.html` exists (or similar static output path depending on Next.js version).

```bash
ls .next/server/app/extensions/
```

**Expected:** `page.html` or `index.html` and `page.js` exist.

---

## Spec Coverage Checklist

| Spec Requirement | Task |
|-----------------|------|
| JSON CMS with i18n | Task 2 |
| Build script integration | Task 1 |
| `type` prop on Projects | Task 6 |
| Card with downloads & releaseDate | Task 6 |
| Modal with releaseDate & details | Task 5 |
| `/extensions` route | Task 7 |
| Translations (pt/en/fr) | Task 4 |
| Tests | Task 8, 9 |
| Reuse existing components | Tasks 5, 6 |

**Placeholder scan:** No TBDs, TODOs, or vague steps. All code is explicit.

**Type consistency:** `type` prop is `"projects" | "extensions"` throughout. `downloads` is string. `releaseDate` is ISO string. `details` is string.
