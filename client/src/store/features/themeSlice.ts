import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "ocean" | "forest";

interface ThemeState {
  current: Theme;
}

function initTheme(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored && ["light","dark","ocean","forest"].includes(stored)) return stored;
  return "light"; // light is the default
}

const themeSlice = createSlice({
  name: "theme",
  initialState: { current: initTheme() } as ThemeState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.current = action.payload;
      localStorage.setItem("theme", action.payload);
      applyThemeToDOM(action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.removeAttribute("data-theme"); // light is :root — no attribute needed
  } else {
    root.setAttribute("data-theme", theme);
  }
}

// Call once on startup before first paint to avoid flash
export function applyStoredTheme() {
  const stored = (localStorage.getItem("theme") ?? "light") as Theme;
  applyThemeToDOM(stored);
}
