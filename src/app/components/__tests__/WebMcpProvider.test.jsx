import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import WebMcpProvider from "../WebMcpProvider";

afterEach(() => {
  delete navigator.modelContext;
  delete document.modelContext;
});

describe("WebMcpProvider", () => {
  it("registers read-only tools with the legacy WebMCP API used by the scanner", async () => {
    const provideContext = vi.fn();
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: { provideContext },
    });

    render(<WebMcpProvider />);

    await waitFor(() => expect(provideContext).toHaveBeenCalledOnce());
    const { tools } = provideContext.mock.calls[0][0];
    expect(tools.map((tool) => tool.name)).toEqual([
      "get_portfolio_overview",
      "list_blog_posts",
      "read_blog_post",
    ]);
    expect(tools.every((tool) => tool.annotations.readOnlyHint)).toBe(true);
  });

  it("supports the current document.modelContext API", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: { registerTool },
    });

    const { unmount } = render(<WebMcpProvider />);

    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3));
    expect(registerTool.mock.calls.map(([tool]) => tool.name)).toEqual([
      "get_portfolio_overview",
      "list_blog_posts",
      "read_blog_post",
    ]);
    unmount();
  });
});
