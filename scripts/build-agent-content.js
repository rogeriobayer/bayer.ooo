const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const OUT_DIR = path.join(ROOT, "public", "agents");
const WELL_KNOWN = path.join(ROOT, "public", ".well-known");

const SITE = "https://bayer.ooo";
const AUTHOR = "Rogério Bayer";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const postsBySlug = {};
  for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
    const match = file.match(/^(.+)\.(pt|en|fr)\.md$/);
    if (!match) continue;

    const [, slug, lang] = match;
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);

    if (!postsBySlug[slug]) postsBySlug[slug] = { slug, translations: {} };
    postsBySlug[slug].translations[lang] = {
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      cover: data.cover || null,
      author: data.author || AUTHOR,
      content: content.trim(),
      lang,
    };
  }

  return Object.values(postsBySlug).sort((a, b) => {
    const dateA = new Date(a.translations.pt?.date || a.translations.en?.date || 0);
    const dateB = new Date(b.translations.pt?.date || b.translations.en?.date || 0);
    return dateB - dateA;
  });
}

function buildHomeMarkdown(posts) {
  const lines = [
    `# ${AUTHOR}`,
    "",
    "> Full-Stack Developer portfolio — React, Vue, Node.js, Cloudflare.",
    "",
    `- Site: ${SITE}`,
    `- Blog: ${SITE}/blog`,
    `- Extensions: ${SITE}/extensions`,
    `- Contact: https://www.linkedin.com/in/rogeriobayer/`,
    `- Email: contact via site footer`,
    "",
    "## About",
    "",
    "Personal portfolio of Rogério Bayer with multi-language support (Portuguese, English, French).",
    "Content language is negotiated via Accept-Language.",
    "",
    "## Main sections",
    "",
    "- `/` — profile, skills, experience, projects",
    "- `/blog` — technical articles",
    "- `/extensions` — browser extensions",
    "",
    "## Recent blog posts",
    "",
  ];

  for (const post of posts.slice(0, 12)) {
    const t = post.translations.en || post.translations.pt || Object.values(post.translations)[0];
    lines.push(`- [${t.title}](${SITE}/blog/${post.slug}) — ${t.excerpt}`);
  }

  lines.push(
    "",
    "## Agent discovery",
    "",
    `- [llms.txt](${SITE}/llms.txt)`,
    `- [API catalog](${SITE}/.well-known/api-catalog)`,
    `- [Agent skills index](${SITE}/.well-known/agent-skills/index.json)`,
    `- [Sitemap](${SITE}/sitemap.xml)`,
    `- [robots.txt](${SITE}/robots.txt)`,
    "",
    "Request any HTML page with `Accept: text/markdown` to receive a Markdown representation.",
    "",
  );

  return lines.join("\n");
}

function buildPostMarkdown(post) {
  const t = post.translations.en || post.translations.pt || Object.values(post.translations)[0];
  const langs = Object.keys(post.translations).join(", ");

  return [
    `# ${t.title}`,
    "",
    `- Author: ${t.author}`,
    `- Date: ${t.date}`,
    `- URL: ${SITE}/blog/${post.slug}`,
    `- Languages: ${langs}`,
    t.tags?.length ? `- Tags: ${t.tags.join(", ")}` : null,
    t.excerpt ? `- Excerpt: ${t.excerpt}` : null,
    "",
    "---",
    "",
    t.content,
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildLlmsTxt(posts) {
  const lines = [
    `# ${AUTHOR}`,
    "",
    `> Portfolio and technical blog at ${SITE}`,
    "",
    "## Pages",
    "",
    `- [Home](${SITE}/): Profile, skills, experience, projects`,
    `- [Blog](${SITE}/blog): Technical articles (PT/EN/FR)`,
    `- [Extensions](${SITE}/extensions): Browser extensions`,
    "",
    "## Blog posts",
    "",
  ];

  for (const post of posts) {
    const t = post.translations.en || post.translations.pt || Object.values(post.translations)[0];
    lines.push(`- [${t.title}](${SITE}/blog/${post.slug}): ${t.excerpt}`);
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [API catalog](${SITE}/.well-known/api-catalog)`,
    `- [Agent skills](${SITE}/.well-known/agent-skills/index.json)`,
    `- [auth.md](${SITE}/auth.md)`,
    `- [Sitemap](${SITE}/sitemap.xml)`,
    "",
    "## Notes for agents",
    "",
    "- Public site, no authentication required for reading content.",
    "- Prefer `Accept: text/markdown` for machine-readable page content.",
    "- Primary contact: LinkedIn https://www.linkedin.com/in/rogeriobayer/",
    "",
  );

  return lines.join("\n");
}

function sha256Hex(input) {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(input).digest("hex");
}

function buildAgentSkillsIndex() {
  const skills = [
    {
      name: "browse-portfolio",
      type: "http",
      description: "Read portfolio profile, projects, and contact pointers as Markdown.",
      url: `${SITE}/`,
    },
    {
      name: "list-blog-posts",
      type: "http",
      description: "List technical blog posts with titles, excerpts, and URLs.",
      url: `${SITE}/blog`,
    },
    {
      name: "read-blog-post",
      type: "http",
      description: "Read a blog post in Markdown via Accept: text/markdown on /blog/{slug}.",
      url: `${SITE}/blog/{slug}`,
    },
  ].map((skill) => ({
    ...skill,
    sha256: sha256Hex(`${skill.name}|${skill.type}|${skill.description}|${skill.url}`),
  }));

  return {
    $schema: "https://agentskills.io/schema/agent-skills-index-v0.2.0.json",
    name: "bayer.ooo agent skills",
    description: "Discovery index for public content skills on bayer.ooo",
    skills,
  };
}

function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: `${SITE}/`,
        "service-desc": [
          {
            href: `${SITE}/.well-known/api-catalog`,
            type: "application/linkset+json",
          },
        ],
        "service-doc": [
          {
            href: `${SITE}/llms.txt`,
            type: "text/plain",
          },
        ],
        status: [
          {
            href: `${SITE}/`,
            type: "text/html",
          },
        ],
      },
      {
        anchor: `${SITE}/blog`,
        "service-doc": [
          {
            href: `${SITE}/llms.txt`,
            type: "text/plain",
          },
          {
            href: `${SITE}/sitemap.xml`,
            type: "application/xml",
          },
        ],
      },
      {
        anchor: `${SITE}/sitemap.xml`,
        "service-desc": [
          {
            href: `${SITE}/sitemap.xml`,
            type: "application/xml",
          },
        ],
      },
    ],
  };
}

function buildAuthMd() {
  return [
    "# auth.md",
    "",
    `${SITE} is a public portfolio and blog.`,
    "",
    "## Authentication",
    "",
    "- No authentication is required to read site content.",
    "- There are no protected APIs or OAuth flows on this domain.",
    "- Agents may freely fetch HTML or Markdown representations of public pages.",
    "",
    "## Preferred access",
    "",
    "1. Start at `/llms.txt` for a site map optimized for language models.",
    "2. Request pages with `Accept: text/markdown` for Markdown bodies.",
    "3. Use `/sitemap.xml` for full URL discovery.",
    "",
    "## Contact",
    "",
    "- LinkedIn: https://www.linkedin.com/in/rogeriobayer/",
    `- Site: ${SITE}`,
    "",
  ].join("\n");
}

function buildExtensionsMarkdown() {
  return [
    "# Browser Extensions",
    "",
    `URL: ${SITE}/extensions`,
    "",
    "Browser extensions built by Rogério Bayer for productivity and focus.",
    "",
    "Request this page with `Accept: text/html` for the interactive UI,",
    "or continue from the homepage Markdown for a full site overview.",
    "",
    `- Home: ${SITE}/`,
    `- Blog: ${SITE}/blog`,
    `- llms.txt: ${SITE}/llms.txt`,
    "",
  ].join("\n");
}

function buildBlogIndexMarkdown(posts) {
  const lines = [
    "# Blog — Rogério Bayer",
    "",
    `URL: ${SITE}/blog`,
    "",
    "Technical articles on software development, AI, frontend, and tooling.",
    "Posts are available in Portuguese, English, and French.",
    "",
    "## Posts",
    "",
  ];

  for (const post of posts) {
    const t = post.translations.en || post.translations.pt || Object.values(post.translations)[0];
    lines.push(`### [${t.title}](${SITE}/blog/${post.slug})`);
    lines.push("");
    lines.push(t.excerpt || "");
    lines.push("");
    if (t.tags?.length) lines.push(`Tags: ${t.tags.join(", ")}`);
    lines.push("");
  }

  return lines.join("\n");
}

function main() {
  const posts = readBlogPosts();

  ensureDir(path.join(OUT_DIR, "blog"));
  ensureDir(path.join(WELL_KNOWN, "agent-skills"));
  ensureDir(WELL_KNOWN);

  fs.writeFileSync(path.join(OUT_DIR, "home.md"), buildHomeMarkdown(posts));
  fs.writeFileSync(path.join(OUT_DIR, "blog.md"), buildBlogIndexMarkdown(posts));
  fs.writeFileSync(path.join(OUT_DIR, "extensions.md"), buildExtensionsMarkdown());

  for (const post of posts) {
    fs.writeFileSync(path.join(OUT_DIR, "blog", `${post.slug}.md`), buildPostMarkdown(post));
  }

  fs.writeFileSync(path.join(ROOT, "public", "llms.txt"), buildLlmsTxt(posts));
  fs.writeFileSync(path.join(ROOT, "public", "auth.md"), buildAuthMd());
  fs.writeFileSync(
    path.join(WELL_KNOWN, "api-catalog"),
    JSON.stringify(buildApiCatalog(), null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(WELL_KNOWN, "agent-skills", "index.json"),
    JSON.stringify(buildAgentSkillsIndex(), null, 2) + "\n",
  );

  console.log(`Generated agent content for ${posts.length} posts`);
}

main();
