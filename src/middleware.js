import { NextResponse } from "next/server";
import { agentContent } from "./generated/agent-content.js";

/**
 * Markdown-for-agents content negotiation.
 * When Accept prefers text/markdown, return the generated Markdown mirror
 * directly so the response works consistently in Next.js and OpenNext.
 */
export function wantsMarkdown(acceptHeader) {
  if (!acceptHeader) return false;

  const parts = acceptHeader.split(",").map((part) => {
    const [type, ...params] = part.trim().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const parsedQ = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
    const q = Number.isFinite(parsedQ) ? Math.min(1, Math.max(0, parsedQ)) : 0;
    return { type: type.trim().toLowerCase(), q };
  });

  const markdownQuality = Math.max(
    0,
    ...parts
      .filter((p) => p.type === "text/markdown" || p.type === "text/x-markdown")
      .map((p) => p.q),
  );
  if (markdownQuality === 0) return false;

  const htmlQuality = Math.max(0, ...parts.filter((p) => p.type === "text/html").map((p) => p.q));
  if (htmlQuality === 0) return true;

  return markdownQuality >= htmlQuality;
}

export function markdownKeyFor(pathname) {
  if (pathname === "/" || pathname === "") return "home";
  if (pathname === "/blog" || pathname === "/blog/") return "blog";
  if (pathname === "/extensions" || pathname === "/extensions/") return "extensions";

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) return `blog/${blogMatch[1]}`;

  return null;
}

export function middleware(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const accept = request.headers.get("accept") || "";
  if (!wantsMarkdown(accept)) {
    return NextResponse.next();
  }

  const key = markdownKeyFor(request.nextUrl.pathname);
  const markdown = key ? agentContent[key] : null;
  if (!markdown) {
    return NextResponse.next();
  }

  return new NextResponse(request.method === "HEAD" ? null : markdown, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Location": request.nextUrl.pathname,
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Language",
      "X-Markdown-Negotiated": "1",
      "X-Markdown-Tokens": String(Math.ceil(markdown.length / 4)),
    },
  });
}

export const config = {
  matcher: ["/", "/blog", "/blog/:slug*", "/extensions"],
};
