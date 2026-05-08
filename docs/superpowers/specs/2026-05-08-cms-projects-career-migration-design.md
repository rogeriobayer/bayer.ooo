# CMS Data Migration — Projects & Career to DecapCMS

**Date:** 2026-05-08
**Scope:** Migrate `projectsData` + `careerSummary` from hardcoded JS files to DecapCMS-managed JSON files, with build-time generation to JS modules.
**Approach:** CMS as single source of truth with build-time generation (consistent with existing blog pattern).

---

## 1. Problem Statement

Currently, portfolio data lives in two places:

1. **Hardcoded JS files** (`src/app/data/projects.server.js`, `src/app/data/projectsModal.server.js`, `src/app/data/career.server.js`)
2. **Translation keys** in `src/app/data/translations.js` (`projects.powerbi.name`, `career.rubylabs.description`, etc.)

This means any content update (new project, job change, description edit) requires a code commit, violating the principle of separating content from code.

Additionally, project images are hardcoded references (`/powerbi-project.png`, `/farmaalg-project.png`, `/focus-patrol-project.png`) with no CMS management.

---

## 2. Architecture

```
┌─────────────────┐      ┌─────────────────────┐      ┌─────────────────┐
│   Decap CMS     │      │   scripts/build-    │      │   Next.js 15    │
│  /admin/index   │─────▶│   cms-data.js       │─────▶│  Static Gen     │
│                 │      │   (JSON → JS)       │      │  Cloudflare     │
└─────────────────┘      └─────────────────────┘      └─────────────────┘
         │                                                    ▲
         │ commit → CI/CD                                     │
         ▼                                                    │
┌──────────────────────────────────────────────────────────┐  │
│  content/                                                │  │
│  ├── blog/        (existente)                            │  │
│  ├── projects/    (novo — JSON único com i18n inline)    │  │
│  │   └── projects.json                                   │  │
│  └── career/      (novo — JSON único com i18n inline)    │  │
│      └── career.json                                     │  │
└──────────────────────────────────────────────────────────┘  │
         │                                                    │
         ▼                                                    │
┌──────────────────────────────────────────────────────────┐  │
│  src/app/lib/             (gerado no build)              │  │
│  ├── blog-data.js         (existente)                    │  │
│  ├── projects-data.js     (novo)                         │  │
│  └── career-data.js       (novo)                         │  │
└──────────────────────────────────────────────────────────┘──┘
```

**Why build-time generation?**
- Cloudflare Workers has no filesystem at runtime
- Follows existing blog pattern (`scripts/build-blog-data.js`)
- Enables validation and transformation during build
- Single source of truth: CMS

---

## 3. File Structure

### New content directories
```
content/
├── blog/                  (existente)
├── projects/
│   └── projects.json      (único arquivo com traduções inline)
└── career/
    └── career.json        (único arquivo com traduções inline)
```

### New generated files
```
src/app/lib/
├── blog-data.js           (existente)
├── projects-data.js       (novo — gerado)
└── career-data.js         (novo — gerado)
```

### Modified files
- `public/admin/config.yml` — adicionar collections `projects` e `career`
- `scripts/build-cms-data.js` — novo script (ou extensão do existente)
- `src/app/data/translations.js` — remover keys de projects e career
- `src/app/components/Projects.jsx` — importar de `projects-data.js`
- `src/app/components/ProjectModal.jsx` — importar de `projects-data.js`
- `src/app/components/Summary.jsx` — importar de `career-data.js`
- `src/app/components/History.jsx` — importar de `career-data.js`
- `src/app/components/SkillsSummary.jsx` — importar de `career-data.js`
- `package.json` — adicionar `predev`/`prebuild` hooks se necessário
- Test files — atualizar mocks e assertions

### Deleted files
- `src/app/data/projects.server.js`
- `src/app/data/projectsModal.server.js`
- `src/app/data/career.server.js`

---

## 4. Data Models

### 4.1 Projects JSON Schema

**File:** `content/projects/projects.json` (single file with inline i18n)

```json
{
  "projects": [
    {
      "id": 1,
      "slug": "powerbi",
      "name": "Dashboard Analítico de Obras",
      "image": "/images/projects/powerbi-project.png",
      "frameworks": ["powerbi"],
      "description": "Desenvolvi dashboards analíticos...",
      "link": null,
      "modal": {
        "images": ["/images/projects/powerbi-project.png"],
        "technologies": [
          { "code": "powerbi", "role": "Visualização e dashboards interativos" }
        ],
        "impact": []
      }
    }
  ]
}
```

**Fields:**

| Field | Type | Required | i18n | Description |
|-------|------|----------|------|-------------|
| `id` | number | yes | no | Unique identifier |
| `slug` | string | yes | no | URL-friendly identifier |
| `name` | string | yes | yes | Project display name |
| `image` | string | no | duplicate | Cover image path |
| `frameworks` | string[] | yes | yes | Technology codes (for badges) |
| `description` | string | yes | yes | Short description |
| `link` | string | no | no | External project URL |
| `modal` | object | no | no | Modal details |
| `modal.images` | string[] | no | no | Gallery images |
| `modal.technologies` | object[] | no | yes | Tech stack with roles |
| `modal.technologies.code` | string | yes | no | Technology code |
| `modal.technologies.role` | string | yes | yes | Role description |
| `modal.impact` | object[] | no | yes | Impact metrics |
| `modal.impact.value` | string | yes | no | Metric value (e.g., "5.0 ★") |
| `modal.impact.label` | string | yes | yes | Metric label key |

### 4.2 Career JSON Schema

**File:** `content/career/career.json` (single file with inline i18n)

```json
{
  "position": {
    "name": "Frontend UI/UX Designer",
    "companyCode": "rubylabs",
    "startDate": "2026-03-03",
    "framework": "next"
  },
  "skills": {
    "languages": ["javascript", "typescript", "html", "css", "sass"],
    "frameworks": ["vue", "nuxt", "react", "react-native", "nest", "next", "expo", "nx"],
    "tools": ["powerbi", "cloudflare", "gcp", "git", "docker", "tailwind", "vuetify", "mui"]
  },
  "history": [
    {
      "position": "Frontend UI/UX Designer",
      "companyCode": "rubylabs",
      "startDate": "03/2026",
      "endDate": null,
      "technologies": ["react", "typescript", "next", "vercel", "figma"],
      "description": "Atuo no projeto Sagabox..."
    }
  ]
}
```

**Fields:**

| Field | Type | Required | i18n | Description |
|-------|------|----------|------|-------------|
| `position.name` | string | yes | yes | Current job title |
| `position.companyCode` | string | yes | no | Company code (references companiesList) |
| `position.startDate` | string (ISO date) | yes | no | Start date |
| `position.framework` | string | yes | no | Primary framework |
| `skills.languages` | string[] | yes | no | Language codes |
| `skills.frameworks` | string[] | yes | no | Framework codes |
| `skills.tools` | string[] | yes | no | Tool codes |
| `history` | object[] | yes | yes | Job history |
| `history.position` | string | yes | yes | Job title |
| `history.companyCode` | string | yes | no | Company code |
| `history.startDate` | string | yes | no | Start date (MM/YYYY) |
| `history.endDate` | string | no | no | End date (MM/YYYY or null) |
| `history.technologies` | string[] | yes | no | Tech codes used |
| `history.description` | string | yes | yes | Job description |

---

## 5. DecapCMS Configuration

Adicionar ao `public/admin/config.yml`, dentro da seção `collections`:

```yaml
collections:
  - name: "projects"
    label: "Projetos"
    folder: "content/projects"
    format: "json"
    create: false
    slug: "projects"
    fields:
      - name: "projects"
        label: "Projetos"
        widget: "list"
        fields:
          - { name: "id", label: "ID", widget: "number" }
          - { name: "slug", label: "Slug", widget: "string" }
          - name: "name"
            label: "Nome"
            widget: "object"
            fields:
              - { name: "pt", label: "Português", widget: "string" }
              - { name: "en", label: "English", widget: "string" }
              - { name: "fr", label: "Français", widget: "string" }
          - { name: "image", label: "Imagem", widget: "image", required: false }
          - { name: "frameworks", label: "Frameworks", widget: "list" }
          - name: "description"
            label: "Descrição"
            widget: "object"
            fields:
              - { name: "pt", label: "Português", widget: "text" }
              - { name: "en", label: "English", widget: "text" }
              - { name: "fr", label: "Français", widget: "text" }
          - { name: "link", label: "Link", widget: "string", required: false }
          - name: "modal"
            label: "Modal"
            widget: "object"
            fields:
              - { name: "images", label: "Imagens", widget: "list", required: false }
              - name: "technologies"
                label: "Tecnologias"
                widget: "list"
                required: false
                fields:
                  - { name: "code", label: "Código", widget: "string" }
                  - name: "role"
                    label: "Função"
                    widget: "object"
                    fields:
                      - { name: "pt", label: "Português", widget: "string" }
                      - { name: "en", label: "English", widget: "string" }
                      - { name: "fr", label: "Français", widget: "string" }
              - name: "impact"
                label: "Impacto"
                widget: "list"
                required: false
                fields:
                  - { name: "value", label: "Valor", widget: "string" }
                  - name: "label"
                    label: "Label"
                    widget: "object"
                    fields:
                      - { name: "pt", label: "Português", widget: "string" }
                      - { name: "en", label: "English", widget: "string" }
                      - { name: "fr", label: "Français", widget: "string" }

  - name: "career"
    label: "Carreira"
    folder: "content/career"
    format: "json"
    create: false
    slug: "career"
    fields:
      - name: "position"
        label: "Posição Atual"
        widget: "object"
        fields:
          - name: "name"
            label: "Cargo"
            widget: "object"
            fields:
              - { name: "pt", label: "Português", widget: "string" }
              - { name: "en", label: "English", widget: "string" }
              - { name: "fr", label: "Français", widget: "string" }
          - { name: "companyCode", label: "Código da Empresa", widget: "string" }
          - { name: "startDate", label: "Data de Início", widget: "date" }
          - { name: "framework", label: "Framework", widget: "string" }
      - name: "skills"
        label: "Skills"
        widget: "object"
        fields:
          - { name: "languages", label: "Linguagens", widget: "list" }
          - { name: "frameworks", label: "Frameworks", widget: "list" }
          - { name: "tools", label: "Ferramentas", widget: "list" }
      - name: "history"
        label: "Histórico"
        widget: "list"
        fields:
          - name: "position"
            label: "Cargo"
            widget: "object"
            fields:
              - { name: "pt", label: "Português", widget: "string" }
              - { name: "en", label: "English", widget: "string" }
              - { name: "fr", label: "Français", widget: "string" }
          - { name: "companyCode", label: "Código da Empresa", widget: "string" }
          - { name: "startDate", label: "Data Início", widget: "string" }
          - { name: "endDate", label: "Data Fim", widget: "string", required: false }
          - { name: "technologies", label: "Tecnologias", widget: "list" }
          - name: "description"
            label: "Descrição"
            widget: "object"
            fields:
              - { name: "pt", label: "Português", widget: "text" }
              - { name: "en", label: "English", widget: "text" }
              - { name: "fr", label: "Français", widget: "text" }
```

**Nota:** Usamos widgets `object` com campos `pt`/`en`/`fr` para i18n inline ao invés do i18n nativo do DecapCMS. Isso permite ver e editar todas as traduções lado a lado em um único arquivo.

---

## 6. Build Script (`scripts/build-cms-data.js`)

Novo script que:

1. Lê `content/projects/projects.json` (único arquivo com i18n inline)
2. Lê `content/career/career.json` (único arquivo com i18n inline)
3. Para cada idioma (pt, en, fr), resolve os objetos i18n inline recursivamente
4. Valida estrutura básica:
   - Projetos: `id` e `slug` são obrigatórios, ids únicos
   - Career: `position`, `skills`, `history` presentes
5. Gera:
   - `src/app/lib/projects-data.js` — exporta `projectsData` com estrutura `{ pt: {...}, en: {...}, fr: {...} }`
   - `src/app/lib/career-data.js` — exporta `careerData` com estrutura similar
6. Fallback automático para `pt` quando uma tradução está ausente

**Output format (projects-data.js):**
```javascript
// Auto-generated by scripts/build-cms-data.js
// Do not edit manually

export const projectsData = {
  pt: {
    projects: [
      { id: 1, slug: "powerbi", name: "...", ... }
    ]
  },
  en: { ... },
  fr: { ... }
};
```

**Output format (career-data.js):**
```javascript
// Auto-generated by scripts/build-cms-data.js
// Do not edit manually

export const careerData = {
  pt: {
    position: { ... },
    skills: { ... },
    history: [ ... ]
  },
  en: { ... },
  fr: { ... }
};
```

---

## 7. Component Changes

### 7.1 Projects Component

**Before:**
```javascript
import { projectsData } from "@/app/data/projects.server";
// Uses translations.js keys: projects.powerbi.name, projects.powerbi.description
```

**After:**
```javascript
import { projectsData } from "@/app/lib/projects-data";
import { useTranslation } from "@/app/hooks/useTranslation";

const { currentLanguage } = useTranslation();
const projects = projectsData[currentLanguage]?.projects || projectsData.pt.projects;
// Uses name and description directly from CMS data
```

### 7.2 ProjectModal Component

**Before:**
```javascript
import { getProjectModalData } from "@/app/data/projectsModal.server";
import { technologiesList } from "@/app/data/technologies.server";
```

**After:**
```javascript
import { projectsData } from "@/app/lib/projects-data";
import { technologiesList } from "@/app/data/technologies.server";

const modalData = projectsData[currentLanguage]?.projects.find(p => p.slug === slug)?.modal;
```

**Note:** `technologiesList` remains hardcoded (not part of this migration scope).

### 7.3 Summary, History, SkillsSummary Components

**Before:**
```javascript
import { careerSummary } from "@/app/data/career.server";
// Uses translations.js keys for descriptions
```

**After:**
```javascript
import { careerData } from "@/app/lib/career-data";
import { useTranslation } from "@/app/hooks/useTranslation";

const { currentLanguage } = useTranslation();
const career = careerData[currentLanguage] || careerData.pt;
// Uses name and description directly from CMS data
```

---

## 8. Translation Cleanup

Remove the following keys from `src/app/data/translations.js`:

**Projects keys (all locales):**
- `projects.title`
- `projects.access`
- `projects.details`
- `projects.powerbi.name`
- `projects.powerbi.description`
- `projects.farmaalg.name`
- `projects.farmaalg.description`
- `projects.focuspatrol.name`
- `projects.focuspatrol.description`

**Career keys (all locales):**
- `career.position.softwareEngineer`
- `career.position.frontendUiUxDesigner`
- `career.position.fullstackDeveloper`
- `career.position.frontendDeveloper`
- `career.position.frontendMobileDeveloper`
- `career.rubylabs.description`
- `career.gupy.description`
- `career.ticto.description`
- `career.clientar.description`
- `career.ecomp.description`

**Remaining in translations.js:**
- UI labels (apresentation.*, summary.*, education.*, skills.*, history.*, location.*)
- Blog labels (blog.*)
- Footer labels (footer.*)
- Project modal labels (projects.modal.impact.*, projects.modal.technologies, etc.)
- Modal close button (projects.modal.close)

---

## 9. Images

### 9.1 Hardcoded Images Inventory

| Image | Current Path | New Path | Action |
|-------|-------------|----------|--------|
| `powerbi-project.png` | `/powerbi-project.png` | `/images/projects/powerbi-project.png` | Move + update references |
| `farmaalg-project.png` | `/farmaalg-project.png` | `/images/projects/farmaalg-project.png` | Move + update references |
| `focus-patrol-project.png` | `/focus-patrol-project.png` | `/images/projects/focus-patrol-project.png` | Move + update references |
| `vue-effect.png` | `/blog/vue-effect.png` | `/images/blog/vue-effect.png` | Already correct ✅ |
| `rogeriobayer.png` | `/rogeriobayer.png` | `/rogeriobayer.png` | Keep as-is (site asset, not CMS content) |
| Company logos (7 SVGs) | `/*.svg` | `/*.svg` | Keep as-is (not in scope) |
| Technology logos (30+ SVGs) | `/*.svg` | `/*.svg` | Keep as-is (not in scope) |

### 9.2 CMS Media Configuration

**Decision:** Keep the existing `media_folder: public/images/blog`.

Project images are added infrequently (new projects). The recommended workflow:
1. Add project images manually to `public/images/projects/` via git commit
2. Reference them in the CMS JSON as `/images/projects/filename.png`

This avoids breaking existing blog image references and keeps the migration simple. If project image uploads via CMS become a frequent need, we can revisit changing `media_folder` to `public/images`.

---

## 10. Testing Strategy

### 10.1 Build Script Tests

Add tests for `scripts/build-cms-data.js`:
- Validate JSON parsing for all locales
- Check for duplicate project IDs
- Check for duplicate project slugs
- Validate required fields (id, slug, name, description)
- Fallback to pt when locale file is missing

### 10.2 Component Tests

Update existing tests:
- `Projects.test.jsx` — mock `projects-data.js` instead of `projects.server.js`
- `ProjectModal.test.jsx` — mock `projects-data.js`
- `Summary.test.jsx`, `History.test.jsx`, `SkillsSummary.test.jsx` — mock `career-data.js`
- `Footer.test.jsx` — no changes needed (socialLinks not migrated)

### 10.3 E2E Tests

Playwright E2E tests should continue working as long as generated data matches the expected structure.

---

## 11. Package.json Scripts

Add hooks to ensure data is built before dev/build/test:

```json
{
  "scripts": {
    "predev": "node scripts/build-cms-data.js && node scripts/build-blog-data.js",
    "prebuild": "node scripts/build-cms-data.js && node scripts/build-blog-data.js",
    "pretest": "node scripts/build-cms-data.js && node scripts/build-blog-data.js",
    "pretest:run": "node scripts/build-cms-data.js && node scripts/build-blog-data.js"
  }
}
```

Or create a single script that builds all data:

```json
{
  "scripts": {
    "build:data": "node scripts/build-cms-data.js && node scripts/build-blog-data.js",
    "predev": "npm run build:data",
    "prebuild": "npm run build:data",
    "pretest": "npm run build:data",
    "pretest:run": "npm run build:data"
  }
}
```

---

## 12. Migration Checklist

### Phase 1: Setup
- [ ] Create `content/projects/` and `content/career/` directories
- [ ] Create initial JSON files with inline i18n (single file per collection)
- [ ] Move project images to `public/images/projects/`

### Phase 2: Build System
- [ ] Create `scripts/build-cms-data.js`
- [ ] Update `package.json` pre-hooks
- [ ] Test build script locally

### Phase 3: CMS Configuration
- [ ] Update `public/admin/config.yml` with new collections
- [ ] Verify CMS UI loads correctly

### Phase 4: Code Migration
- [ ] Create `src/app/lib/projects-data.js` and `career-data.js` (generated)
- [ ] Update `Projects.jsx`
- [ ] Update `ProjectModal.jsx`
- [ ] Update `Summary.jsx`
- [ ] Update `History.jsx`
- [ ] Update `SkillsSummary.jsx`

### Phase 5: Cleanup
- [ ] Delete `src/app/data/projects.server.js`
- [ ] Delete `src/app/data/projectsModal.server.js`
- [ ] Delete `src/app/data/career.server.js`
- [ ] Remove keys from `translations.js`

### Phase 6: Testing
- [ ] Update unit tests
- [ ] Run full test suite
- [ ] Run E2E tests
- [ ] Manual CMS editing test

---

## 13. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cloudflare Workers can't read JSON at runtime | High | Build-time generation ensures JS modules |
| CMS users accidentally break JSON structure | Medium | Build script validation with clear error messages |
| Missing locale falls back to empty data | Medium | Build script enforces pt fallback |
| Images referenced in JSON don't exist | Low | Build script warns about missing image files |
| Translation keys still referenced in code | Medium | Comprehensive cleanup + linter checks |

---

## 14. Future Enhancements (Out of Scope)

- Migrate `companiesList` to CMS (if company info changes frequently)
- Migrate `technologiesList` to CMS (if adding new technologies often)
- Migrate `socialLinks` to CMS (if social profiles change)
- CMS-managed OG image (`rogeriobayer.png`)
- CMS-managed site metadata (title, description)
- Validate technology codes against `technologiesList` at build time
