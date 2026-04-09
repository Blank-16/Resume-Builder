const PRESETS = ["#2563EB","#7c3aed","#16A34A","#DC2626","#9333EA","#EA580C","#0891B2","#CA8A04"];

interface Props { value: string; onChange: (c: string) => void; }

export function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="label">Accent Colour</label>
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((color) => (
          <button key={color} type="button" title={color} onClick={() => onChange(color)}
            className="size-6 rounded-full transition-transform"
            style={{
              backgroundColor: color,
              outline:         value === color ? `2px solid var(--text-primary)` : "none",
              outlineOffset:   "2px",
              transform:       value === color ? "scale(1.15)" : "scale(1)",
            }} />
        ))}
        <input type="color" value={value} title="Custom colour" onChange={(e) => onChange(e.target.value)}
          className="size-6 rounded-full cursor-pointer" style={{ border: "1px solid var(--border-strong)" }} />
      </div>
    </div>
  );
}
