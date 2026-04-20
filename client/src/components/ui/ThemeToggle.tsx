import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { setTheme, type Theme } from "@/store/features/themeSlice";

const THEMES: { id: Theme; label: string; icon: string; desc: string }[] = [
  { id: "light",  label: "Light",  icon: "☀️", desc: "Clean & bright" },
  { id: "dark",   label: "Dark",   icon: "🌙", desc: "Easy on the eyes" },
  { id: "ocean",  label: "Ocean",  icon: "🌊", desc: "Deep blue" },
  { id: "forest", label: "Forest", icon: "🌿", desc: "Natural green" },
];

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const current  = useAppSelector((s) => s.theme.current);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const active = THEMES.find((t) => t.id === current) ?? THEMES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title="Switch theme"
        onClick={() => setOpen((v) => !v)}
        className="btn btn-surface p-2 gap-1.5 text-xs font-medium"
        aria-label="Theme switcher"
      >
        <span>{active.icon}</span>
        <span className="hidden sm:inline">{active.label}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 overflow-hidden anim-slide-up"
          style={{
            zIndex:     200,
            background: "var(--surface-raised)",
            border:     "1px solid var(--border-strong)",
            borderRadius: "var(--r-xl)",
            boxShadow:  "var(--shadow-lg)",
          }}
        >
          <div className="p-1.5">
            {THEMES.map((t) => {
              const isActive = t.id === current;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { dispatch(setTheme(t.id)); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs"
                  style={{
                    background:  isActive ? "var(--accent-dim)" : "transparent",
                    color:       isActive ? "var(--accent-text)" : "var(--text-secondary)",
                    transition:  "background var(--t-fast), transform var(--t-fast) var(--ease-spring)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "var(--bg-subtle)";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <span className="text-base leading-none">{t.icon}</span>
                  <div>
                    <p className="font-semibold leading-none mb-0.5">{t.label}</p>
                    <p className="text-[10px] leading-none" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                  </div>
                  {isActive && (
                    <svg className="ml-auto size-3.5 shrink-0" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
