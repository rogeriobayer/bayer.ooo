"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "portfolio",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("portfolio");

  useEffect(() => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme");
    if (current) {
      setTheme(current);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || "portfolio";
    const next = current === "portfolio" ? "portfolio-dark" : "portfolio";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    setTheme(next);

    // Update theme-color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", next === "portfolio-dark" ? "#0f0f0f" : "#fafaf9");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
