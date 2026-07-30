import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FaviconLinks from "../FaviconLinks";

describe("FaviconLinks", () => {
  it("renders a single animated favicon source", () => {
    render(<FaviconLinks />);
    const icons = [...document.head.querySelectorAll('link[rel="icon"]')];

    expect(icons).toHaveLength(1);
    expect(icons[0]).toHaveAttribute("href", "/favicon-frames/loop-000.png");
    expect(icons[0]).toHaveAttribute("type", "image/png");
    expect(icons[0]).toHaveAttribute("data-animated-favicon");
  });
});
