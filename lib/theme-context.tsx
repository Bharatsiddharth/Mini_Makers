"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultValue: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {},
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or system preference
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    
    let newTheme: Theme = "light";
    
    if (storedTheme) {
      newTheme = storedTheme;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      newTheme = "dark";
    }
    
    setTheme(newTheme);
    applyTheme(newTheme);
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: isMounted ? theme : "light", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return defaultValue;
  }
  return context;
}
