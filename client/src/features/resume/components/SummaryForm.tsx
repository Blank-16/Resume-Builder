import { useMemo } from "react";
import { useAISuggest } from "@/features/resume/hooks/useAISuggest";
import { AISuggestionPanel } from "@/features/resume/components/AISuggestionPanel";
import type { ExperienceEntry } from "@/types";

interface Props {
  data:       string;
  onChange:   (value: string) => void;
  // Context passed in from the builder for better AI suggestions
  experience?: ExperienceEntry[];
  skills?:     string[];
}

export function SummaryForm({ data, onChange, experience = [], skills = [] }: Props) {
  // Build AI context — memoised so useAISuggest doesn't re-create on every keystroke
  const aiContext = useMemo(() => ({
    currentText:        data,
    existingExperience: experience.slice(0, 4).map((e) => ({
      position:    e.position,
      company:     e.company,
      description: e.description,
    })),
    skills: skills.slice(0, 10),
  }), [data, experience, skills]);

  const ai = useAISuggest({
    field:    "summary",
    context:  aiContext,
    onAccept: onChange,
  });

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Professional Summary
        </h3>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Write 2–4 sentences highlighting your expertise and goals.
          ATS systems scan this section heavily — use keywords from the target job posting.
        </p>
      </div>

      {/* AI panel sits above the textarea */}
      <AISuggestionPanel
        isLoading={ai.isLoading}
        isOpen={ai.isOpen}
        suggestion={ai.suggestion}
        onGenerate={ai.generate}
        onAccept={ai.accept}
        onDismiss={ai.dismiss}
        buttonLabel="Write with AI"
      />

      <textarea
        value={data}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Results-driven software engineer with 5+ years building scalable web applications…"
        className="textarea w-full"
      />

      <div className="flex justify-end">
        <span className="text-xs" style={{
          color: data.length > 1800 ? "var(--danger)" : data.length > 1200 ? "var(--warning)" : "var(--text-muted)",
          transition: "color var(--t-base) var(--ease-out)",
          fontVariantNumeric: "tabular-nums",
        }}>
          {data.length} / 2000 characters
        </span>
      </div>
    </div>
  );
}
