import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { setTheme, type Theme } from "@/store/features/themeSlice";

// Compact icon-pill that sits in any app header.
// Shows 4 theme options as emoji icons in a pill — active one highlighted.
const THEMES: { id: Theme; icon: string; label: string }[] = [
  { id: "light",  icon: "☀️", label: "Light"  },
  { id: "dark",   icon: "🌙", label: "Dark"   },
  { id: "ocean",  icon: "🌊", label: "Ocean"  },
  { id: "forest", icon: "🌿", label: "Forest" },
];

export function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const current  = useAppSelector((s) => s.theme.current);

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.label}
          className="theme-toggle-option"
          data-active={current === t.id ? "true" : "false"}
          onClick={() => dispatch(setTheme(t.id))}
          aria-pressed={current === t.id}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
