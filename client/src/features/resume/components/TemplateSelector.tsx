import { templateDefinitions } from "@/features/templates/registry";
import type { TemplateId } from "@/types";

interface Props { selected: TemplateId; onChange: (id: TemplateId) => void; }

export function TemplateSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="label">Template</label>
      <div className="grid grid-cols-2 gap-2">
        {templateDefinitions.map((tpl) => (
          <button key={tpl.id} type="button" onClick={() => onChange(tpl.id)}
            className="text-left px-3 py-2 rounded-lg border text-xs transition-all"
            style={{
              background:   selected === tpl.id ? "var(--accent-dim)"      : "var(--surface-raised)",
              borderColor:  selected === tpl.id ? "var(--accent)"          : "var(--border-strong)",
              color:        selected === tpl.id ? "var(--accent-text)"     : "var(--text-secondary)",
              fontWeight:   selected === tpl.id ? "600"                    : "400",
            }}>
            <span className="block font-medium">{tpl.name}</span>
            <span className="block text-[10px] leading-tight mt-0.5" style={{ color: "var(--text-muted)" }}>
              {tpl.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
