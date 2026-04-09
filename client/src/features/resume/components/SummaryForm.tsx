interface Props {
  data: string;
  onChange: (value: string) => void;
}

export function SummaryForm({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Professional Summary
        </h3>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Write 2–4 sentences highlighting your expertise and goals.
          ATS systems scan this heavily — include keywords from the target job posting.
        </p>
      </div>
      <textarea
        value={data}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Results-driven software engineer with 5+ years building scalable web applications…"
        className="textarea w-full"
      />
      <div className="flex justify-end">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{data.length} characters</span>
      </div>
    </div>
  );
}
