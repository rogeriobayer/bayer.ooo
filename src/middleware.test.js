import { describe, expect, it } from "vitest";
import { markdownKeyFor, wantsMarkdown } from "./middleware";

describe("Markdown content negotiation", () => {
  it("accepts Markdown when it is the only requested representation", () => {
    expect(wantsMarkdown("text/markdown")).toBe(true);
  });

  it("respects representation quality values", () => {
    expect(wantsMarkdown("text/html;q=1, text/markdown;q=0.8")).toBe(false);
    expect(wantsMarkdown("text/html;q=0.5, text/markdown;q=0.8")).toBe(true);
    expect(wantsMarkdown("text/markdown;q=0")).toBe(false);
  });

  it("maps supported pages to generated Markdown", () => {
    expect(markdownKeyFor("/")).toBe("home");
    expect(markdownKeyFor("/blog")).toBe("blog");
    expect(markdownKeyFor("/blog/hash-tables")).toBe("blog/hash-tables");
    expect(markdownKeyFor("/extensions/")).toBe("extensions");
    expect(markdownKeyFor("/unknown")).toBeNull();
  });
});
