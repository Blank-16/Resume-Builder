import { PlusCircle, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { generateId } from "@/utils/resume";
import type { ProjectEntry } from "@/types";

interface Props { data: ProjectEntry[]; onChange: (d: ProjectEntry[]) => void; }

function empty(): ProjectEntry {
  return { id: generateId(), name: "", type: "", description: "", url: "", technologies: [] };
}

export function ProjectForm({ data, onChange }: Props) {
  const [openId, setOpenId]    = useState<string | null>(data[0]?.id ?? null);
  const [techIn, setTechIn]    = useState<Record<string, string>>({});

  const add = () => { const e = empty(); onChange([...data, e]); setOpenId(e.id); };
  const remove = (id: string) => { onChange(data.filter((e) => e.id !== id)); if (openId === id) setOpenId(null); };
  const update = (id: string, field: keyof ProjectEntry, val: unknown) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const addTech = (id: string) => {
    const v = (techIn[id] ?? "").trim();
    if (!v) return;
    const entry = data.find((e) => e.id === id);
    if (!entry) return;
    update(id, "technologies", [...entry.technologies, v]);
    setTechIn((p) => ({ ...p, [id]: "" }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Projects</h3>
        <button type="button" onClick={add}
          className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--accent-text)" }}>
          <PlusCircle className="size-4" /> Add Project
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-xs text-center py-6 rounded-xl" style={{ color: "var(--text-muted)", border: "2px dashed var(--border-strong)" }}>
          No projects added yet.
        </p>
      )}

      {data.map((entry) => {
        const isOpen = openId === entry.id;
        return (
          <div key={entry.id} className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
            <button type="button" className="accordion-header rounded-none"
              onClick={() => setOpenId(isOpen ? null : entry.id)}>
              <span className="truncate">{entry.name || "New Project"}</span>
              {isOpen ? <ChevronUp className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      : <ChevronDown className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-3 space-y-3" style={{ background: "var(--surface)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Project Name</label>
                    <input type="text" value={entry.name} className="input" placeholder="My App"
                      onChange={(e) => update(entry.id, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Type</label>
                    <input type="text" value={entry.type} className="input" placeholder="Web App"
                      onChange={(e) => update(entry.id, "type", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">URL (optional)</label>
                  <input type="url" value={entry.url} className="input" placeholder="https://github.com/…"
                    onChange={(e) => update(entry.id, "url", e.target.value)} />
                </div>
                <div>
                  <label className="label">Technologies</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {entry.technologies.map((t) => (
                      <span key={t} className="skill-tag">
                        {t}
                        <button type="button" onClick={() => update(entry.id, "technologies", entry.technologies.filter((x) => x !== t))}
                          className="transition-opacity hover:opacity-60">
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={techIn[entry.id] ?? ""} className="input"
                      placeholder="React, TypeScript…"
                      onChange={(e) => setTechIn((p) => ({ ...p, [entry.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(entry.id); } }} />
                    <button type="button" onClick={() => addTech(entry.id)}
                      className="btn btn-surface text-xs px-3 py-1.5 shrink-0">Add</button>
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea value={entry.description} rows={3} className="textarea w-full"
                    placeholder="What did you build and why?"
                    onChange={(e) => update(entry.id, "description", e.target.value)} />
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
