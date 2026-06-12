import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "helix-theme";
const DEFAULT_THEME = "helix";

export const THEMES = [
  { id: "helix", label: "Helix Colibri", desc: "Purple editor theme" },
  { id: "catppuccin-mocha", label: "Catppuccin Mocha", desc: "Warm mauve tones" },
  { id: "tokyo-night", label: "Tokyo Night", desc: "Deep blue nightscape" },
  { id: "cyberpunk", label: "Cyberpunk", desc: "Neon glow overload" },
  { id: "mono-dark", label: "Mono Dark", desc: "Minimal greyscale" },
  { id: "mono-light", label: "Mono Light", desc: "Clean greyscale" },
  { id: "gruvbox", label: "Gruvbox", desc: "Earthy retro tones" },
  { id: "everforest", label: "Everforest", desc: "Forest green calm" },
];

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};
