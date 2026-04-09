import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { generateId } from "@/utils/resume";
import type { EducationEntry } from "@/types";

interface Props {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
}

function empty(): EducationEntry {
  return { id: generateId(), institution: "", degree: "", field: "", graduationDate: "", gpa: "" };
}

export function EducationForm({ data, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(data[0]?.id ?? null);

  const add = () => { const e = empty(); onChange([...data, e]); setOpenId(e.id); };
  const remove = (id: string) => { onChange(data.filter((e) => e.id !== id)); if (openId === id) setOpenId(null); };
  const update = (id: string, field: keyof EducationEntry, val: string) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Education</h3>
        <button type="button" onClick={add}
          className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--accent-text)" }}>
          <PlusCircle className="size-4" /> Add Entry
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-xs text-center py-6 rounded-xl" style={{ color: "var(--text-muted)", border: "2px dashed var(--border-strong)" }}>
          No education added yet.
        </p>
      )}

      {data.map((entry) => {
        const isOpen = openId === entry.id;
        return (
          <div key={entry.id} className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
            <button type="button" className="accordion-header rounded-none"
              onClick={() => setOpenId(isOpen ? null : entry.id)}>
              <span className="truncate">{entry.institution || "New Entry"}</span>
              {isOpen ? <ChevronUp className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      : <ChevronDown className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-3 space-y-3" style={{ background: "var(--surface)" }}>
                <div>
                  <label className="label">Institution</label>
                  <input type="text" value={entry.institution} className="input" placeholder="MIT"
                    onChange={(e) => update(entry.id, "institution", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Degree</label>
                    <input type="text" value={entry.degree} className="input" placeholder="BSc"
                      onChange={(e) => update(entry.id, "degree", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Field of Study</label>
                    <input type="text" value={entry.field} className="input" placeholder="Computer Science"
                      onChange={(e) => update(entry.id, "field", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Graduation Date</label>
                    <input type="month" value={entry.graduationDate} className="input"
                      onChange={(e) => update(entry.id, "graduationDate", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">GPA (optional)</label>
                    <input type="text" value={entry.gpa} className="input" placeholder="3.8"
                      onChange={(e) => update(entry.id, "gpa", e.target.value)} />
                  </div>
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
