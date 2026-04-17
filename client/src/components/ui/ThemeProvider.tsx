import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppStore";

// Syncs Redux theme state → <html> data-theme attribute on every change.
// Mount once inside <Provider> at the app root.
export function ThemeProvider() {
  const theme = useAppSelector((s) => s.theme.current);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.removeAttribute("data-theme"); // light IS :root
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
}
