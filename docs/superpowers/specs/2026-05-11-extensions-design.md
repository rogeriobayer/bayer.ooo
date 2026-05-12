# Design: Página /extensions

**Data:** 2026-05-11
**Escopo:** Nova rota `/extensions` para listar extensões do navegador, configuráveis via CMS JSON com i18n.

---

## 1. Contexto

O site já possui:
- `/blog` — posts em Markdown com frontmatter, gerados por `build-blog-data.js`
- Seção Projects na home — dados em `content/projects/projects.json`, i18n inline, gerados por `build-cms-data.js`
- `ProjectModal.jsx` — modal reutilizável para detalhes de projetos

A nova página `/extensions` seguirá o padrão dos projects (CMS JSON + i18n), mas como rota separada (igual ao `/blog`).

---

## 2. Schema JSON

Arquivo fonte: `content/extensions/extensions.json`

Estrutura de cada extensão:

```json
{
  "id": 1,
  "slug": "focus-patrol",
  "name": {
    "pt": "Focus Patrol",
    "en": "Focus Patrol",
    "fr": "Focus Patrol"
  },
  "icon": "/images/extensions/focus-patrol-icon.png",
  "description": {
    "pt": "Extensão de foco e produtividade...",
    "en": "Focus and productivity extension...",
    "fr": "Extension de concentration..."
  },
  "link": "https://chrome.google.com/webstore/detail/...",
  "downloads": "12.5K",
  "releaseDate": "2025-03-15",
  "frameworks": ["javascript", "chrome"],
  "modal": {
    "images": ["/images/extensions/focus-patrol-1.png"],
    "technologies": [
      { "code": "javascript", "role": { "pt": "Lógica principal", "en": "Core logic", "fr": "Logique principale" } }
    ],
    "impact": [
      { "value": "5.0 ★", "label": { "pt": "Web Store", "en": "Web Store", "fr": "Web Store" } }
    ],
    "details": {
      "pt": "Texto longo com mais informações...",
      "en": "Long text with more info...",
      "fr": "Texte long avec plus d'infos..."
    }
  }
}
```

Observações:
- `name`, `description`, `modal.technologies[].role`, `modal.impact[].label`, `modal.details` são i18n inline.
- `downloads` é uma string formatada (ex: "12.5K", "1.2M").
- `releaseDate` é ISO 8601 (`YYYY-MM-DD`).
- `icon` funciona como `image` nos projects.

---

## 3. Página `/extensions`

Rota: `src/app/extensions/page.js`

Estrutura:
- Metadata (title, description, OG, Twitter)
- `Header`
- `<main>` com título e descrição da página
- Lista de extensões usando o componente `Projects` adaptado
- `Footer`

O componente `Projects` será adaptado para aceitar uma prop `type`:
- `type="projects"` (padrão): comportamento atual, dados de `projectsData`
- `type="extensions"`: dados de `extensionsData`, labels e campos ajustados

---

## 4. Adaptações nos Componentes

### 4.1 `Projects.jsx`

Nova prop `type` com valores `"projects" | "extensions"`.

Quando `type === "extensions"`:
- Fonte de dados: `extensionsData[currentLanguage]`
- Card exibe:
  - Ícone à esquerda (mesmo layout `card-side`)
  - Nome, frameworks (badges), descrição
  - **Novo:** linha com downloads e data de lançamento
  - Botão "Instalar" (link externo para loja) em vez de "Acessar"
  - Botão "Mais informações" abre modal
- Modal: passa dados da extensão

### 4.2 `ProjectModal.jsx`

Adicionar suporte a campos opcionais de extensão:
- `releaseDate`: exibido no header do modal
- `details`: texto longo renderizado abaixo das tecnologias (usa `react-markdown` se houver formatação)
- `downloads`: exibido próximo ao título ou no header

Se o campo não existir (projetos antigos), o modal continua funcionando normalmente.

---

## 5. Campos Visuais

### Card (lista)

```
┌─────────────────────────────────────────────┐
│  [Ícone]  Nome da Extensão                  │
│           [JS] [Chrome]                     │
│           Descrição curta...                │
│           ⬇️ 12.5K downloads • 15/03/2025   │
│           [Instalar] [Mais informações]     │
└─────────────────────────────────────────────┘
```

### Modal (detalhes)

- Screenshots (carrossel, se múltiplas)
- Tecnologias e papéis (lista)
- **Data de lançamento** destacada
- Texto longo `details`
- Métricas de impacto (badges/valores)

---

## 6. Build & CMS

### Script `build-cms-data.js`

Adicionar chamada:

```js
buildDataFile(
  path.join(CONTENT_DIR, 'extensions', 'extensions.json'),
  path.join(LIB_DIR, 'extensions-data.js'),
  'extensionsData'
);
```

Gera `src/app/lib/extensions-data.js` com a mesma estrutura i18n dos projects.

### Script `build-blog-data.js`

Não precisa de alteração.

---

## 7. Traduções

Adicionar chaves no `translations.js`:
- `extensions.title`
- `extensions.description`
- `extensions.install`
- `extensions.moreInfo`
- `extensions.downloads`
- `extensions.releaseDate`

---

## 8. Testes

- Teste unitário para `extensions-data.js` (verificar se gera corretamente)
- Teste de renderização do card de extensão
- Teste de modal com campos `details` e `releaseDate`
- Teste E2E: navegação para `/extensions`, clique no card, abertura do modal

---

## 9. SEO & Metadata

A página `/extensions` terá metadata estática completa (title, description, OG, Twitter, canonical), seguindo o padrão da `/blog`.

---

## 10. Decisões de Design

| Decisão | Justificativa |
|---------|---------------|
| JSON em vez de Markdown | Dados altamente estruturados (downloads, datas, tecnologias) |
| Reutilizar `Projects`/`ProjectModal` | Consistência visual, menos código para manter |
| Prop `type` no `Projects` | Mínima intrusão no código existente |
| `downloads` como string | Flexibilidade de formatação ("12.5K", "1M+") |
| `releaseDate` como ISO | Fácil de formatar e ordenar |

---

## 11. Arquivos Afetados

**Novos:**
- `content/extensions/extensions.json`
- `src/app/lib/extensions-data.js` (gerado)
- `src/app/extensions/page.js`

**Modificados:**
- `scripts/build-cms-data.js`
- `src/app/lib/projects-data.js` (referência, não alterado diretamente)
- `src/app/components/Projects.jsx`
- `src/app/components/ProjectModal.jsx`
- `src/app/data/translations.js`

**Testes:**
- Novos testes para extensões
- `src/app/__tests__/build.test.js` (atualizar para validar `extensions-data.js`)
