import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { setTheme, type Theme } from "@/store/features/themeSlice";
import { Sun, Moon, Waves, Trees } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Compact icon-pill that sits in any app header.
// Shows 4 theme options as icons in a pill - active one highlighted.
const THEMES: { id: Theme; icon: LucideIcon; label: string }[] = [
  { id: "light", icon: Sun, label: "Light" },
  { id: "dark", icon: Moon, label: "Dark" },
  { id: "ocean", icon: Waves, label: "Ocean" },
  { id: "forest", icon: Trees, label: "Forest" },
];

export function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const current = useAppSelector((s) => s.theme.current);

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {THEMES.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            title={t.label}
            className="theme-toggle-option flex items-center justify-center"
            data-active={current === t.id ? "true" : "false"}
            onClick={() => dispatch(setTheme(t.id))}
            aria-pressed={current === t.id}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
