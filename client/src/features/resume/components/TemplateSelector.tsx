import { getTemplate, templateDefinitions } from "@/features/templates/registry";
import type { TemplateId, TemplateProps } from "@/types";
import { createEmptyResume } from "@/utils/resume";

interface Props {
  selected:  TemplateId;
  onChange:  (id: TemplateId) => void;
  // Pass the live resume so previews show real content
  resume?:   TemplateProps["resume"];
}

// A frozen minimal resume used when no live data is passed
const PREVIEW_RESUME = Object.freeze({
  ...createEmptyResume(),
  personalInfo: {
    fullName: "Jane Smith",
    email:    "jane@example.com",
    phone:    "+1 555 000 0000",
    location: "San Francisco, CA",
    linkedin: "", github: "", website: "", image: "",
  },
  professionalSummary: "Results-driven engineer with 5+ years building scalable products.",
  experience: [{
    id: "1", position: "Senior Engineer", company: "Acme Corp",
    startDate: "2021-01", endDate: "", isCurrent: true,
    description: "Led platform team of 8. Reduced deploy time by 60%.",
  }],
  education: [{
    id: "1", institution: "MIT", degree: "BSc",
    field: "Computer Science", graduationDate: "2018-05", gpa: "3.9",
  }],
  skills: ["TypeScript", "React", "Node.js"],
  accentColor: "#4f46e5",
});

export function TemplateSelector({ selected, onChange, resume }: Props) {
  const previewData = resume ?? PREVIEW_RESUME;

  return (
    <div className="space-y-3">
      <label className="label">Template</label>
      <div className="grid grid-cols-2 gap-3">
        {templateDefinitions.map((tpl) => {
          const Template    = getTemplate(tpl.id);
          const isSelected  = selected === tpl.id;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onChange(tpl.id)}
              className="text-left rounded-xl overflow-hidden transition-all"
              style={{
                border:     `2px solid ${isSelected ? "var(--accent)" : "var(--border-strong)"}`,
                boxShadow:  isSelected ? "0 0 0 3px var(--accent-dim)" : "none",
                background: "var(--surface-raised)",
              }}
              title={tpl.name}
            >
              {/* Scaled-down live preview */}
              <div
                className="relative overflow-hidden bg-white"
                style={{ height: "130px", pointerEvents: "none" }}
              >
                <div style={{ transform: "scale(0.28)", transformOrigin: "top left", width: "357%", height: "357%" }}>
                  <Template resume={{ ...previewData, template: tpl.id }} />
                </div>
              </div>

              {/* Label row */}
              <div
                className="px-2.5 py-2 flex items-center justify-between"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div>
                  <p className="text-xs font-semibold" style={{ color: isSelected ? "var(--accent-text)" : "var(--text-primary)" }}>
                    {tpl.name}
                  </p>
                  <p className="text-[10px] leading-tight mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {tpl.description}
                  </p>
                </div>
                {isSelected && (
                  <span
                    className="size-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--accent)" }}
                  >
                    <svg className="size-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
