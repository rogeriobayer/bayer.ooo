"use client";

import { useEffect } from "react";

async function fetchMarkdown(path) {
  const response = await fetch(path, { headers: { Accept: "text/markdown" } });
  if (!response.ok) throw new Error(`Unable to read ${path}`);
  return response.text();
}

function createTools() {
  const readOnlyAnnotations = { readOnlyHint: true };

  return [
    {
      name: "get_portfolio_overview",
      title: "Get portfolio overview",
      description: "Read Rogério Bayer's React and Vue specialization, complete full-stack and UI/UX expertise, best-fit work, projects, and contact links.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: () => fetchMarkdown("/"),
      annotations: readOnlyAnnotations,
    },
    {
      name: "list_blog_posts",
      title: "List blog posts",
      description: "List published technical articles with titles, excerpts, tags, and canonical URLs.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: () => fetchMarkdown("/blog"),
      annotations: readOnlyAnnotations,
    },
    {
      name: "read_blog_post",
      title: "Read blog post",
      description: "Read one published technical article using a canonical slug from list_blog_posts.",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "Canonical article slug returned by list_blog_posts.",
            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      execute: ({ slug } = {}) => {
        if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          throw new Error("A valid canonical blog slug is required.");
        }
        return fetchMarkdown(`/blog/${slug}`);
      },
      annotations: readOnlyAnnotations,
    },
  ];
}

export default function WebMcpProvider() {
  useEffect(() => {
    const tools = createTools();
    const legacyContext = navigator.modelContext;

    if (typeof legacyContext?.provideContext === "function") {
      legacyContext.provideContext({ tools });
    }

    const currentContext = document.modelContext;
    if (typeof currentContext?.registerTool !== "function") return undefined;

    const controller = new AbortController();
    for (const tool of tools) {
      Promise.resolve(currentContext.registerTool(tool, { signal: controller.signal })).catch(() => {});
    }

    return () => controller.abort();
  }, []);

  return null;
}
