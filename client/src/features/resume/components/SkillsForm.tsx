import { X } from "lucide-react";
import { useState } from "react";

interface Props { data: string[]; onChange: (d: string[]) => void; }

export function SkillsForm({ data, onChange }: Props) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (!v || data.includes(v)) return;
    onChange([...data, v]);
    setInput("");
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Skills</h3>

      <div className="flex flex-wrap gap-2 min-h-10 p-2.5 rounded-lg"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
        {data.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
            <button type="button" onClick={() => onChange(data.filter((s) => s !== skill))}
              className="transition-opacity hover:opacity-60 ml-0.5">
              <X className="size-3" />
            </button>
          </span>
        ))}
        {data.length === 0 && (
          <span className="text-xs self-center pl-1" style={{ color: "var(--text-muted)" }}>
            Add skills below
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <input type="text" value={input} className="input"
          placeholder="TypeScript, React, Node.js…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <button type="button" onClick={add}
          className="btn btn-primary text-xs px-4 py-2 shrink-0">Add</button>
      </div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Press Enter or click Add to insert a skill.
      </p>
    </div>
  );
}
