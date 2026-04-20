import { PlusCircle, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { generateId } from "@/utils/resume";
import type { CertificationEntry } from "@/types";

interface Props { data: CertificationEntry[]; onChange: (d: CertificationEntry[]) => void; }

function empty(): CertificationEntry {
  return { id: generateId(), name: "", issuer: "", date: "", url: "" };
}

export function CertificationForm({ data, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(data[0]?.id ?? null);

  const add = () => { const e = empty(); onChange([...data, e]); setOpenId(e.id); };
  const remove = (id: string) => { onChange(data.filter((e) => e.id !== id)); if (openId === id) setOpenId(null); };
  const update = (id: string, field: keyof CertificationEntry, val: string) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Certifications</h3>
        <button type="button" onClick={add}
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{
            color: "var(--accent-text)",
            transition: "transform var(--t-fast) var(--ease-spring)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}>
          <PlusCircle className="size-4" /> Add
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-xs text-center py-6 rounded-xl" style={{ color: "var(--text-muted)", border: "2px dashed var(--border-strong)" }}>
          No certifications added yet.
        </p>
      )}

      {data.map((entry) => {
        const isOpen = openId === entry.id;
        return (
          <div key={entry.id} className="overflow-hidden"
            style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)", transition: "border-color var(--t-fast)" }}>
            <button type="button" className="accordion-header rounded-none"
              onClick={() => setOpenId(isOpen ? null : entry.id)}>
              <span className="truncate">{entry.name || "New Certification"}</span>
              <ChevronDown
                className="size-4 shrink-0 accordion-chevron"
                data-open={isOpen ? "true" : "false"}
                style={{ color: "var(--text-muted)" }}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-3 space-y-3 accordion-body" style={{ background: "var(--surface)" }}>
                <div>
                  <label className="label">Certification Name</label>
                  <input type="text" value={entry.name} className="input" placeholder="AWS Solutions Architect"
                    onChange={(e) => update(entry.id, "name", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Issuer</label>
                    <input type="text" value={entry.issuer} className="input" placeholder="Amazon"
                      onChange={(e) => update(entry.id, "issuer", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input type="month" value={entry.date} className="input"
                      onChange={(e) => update(entry.id, "date", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Credential URL (optional)</label>
                  <input type="url" value={entry.url} className="input" placeholder="https://…"
                    onChange={(e) => update(entry.id, "url", e.target.value)} />
                </div>
                <button type="button" onClick={() => remove(entry.id)}
                  className="btn btn-danger flex items-center gap-1.5 text-xs px-3 py-1.5">
                  <Trash2 className="size-3.5" /> Remove
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
