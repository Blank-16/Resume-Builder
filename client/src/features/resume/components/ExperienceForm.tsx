import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo } from "react";
import { generateId } from "@/utils/resume";
import { useAISuggest } from "@/features/resume/hooks/useAISuggest";
import { AISuggestionPanel } from "@/features/resume/components/AISuggestionPanel";
import type { ExperienceEntry } from "@/types";

interface Props {
  data:     ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
}

function empty(): ExperienceEntry {
  return {
    id: generateId(), company: "", position: "",
    startDate: "", endDate: "", isCurrent: false, description: "",
  };
}

// Per-entry AI sub-component keeps each entry's AI state isolated
function ExperienceEntryAI({
  entry,
  allEntries,
  onAccept,
}: {
  entry:      ExperienceEntry;
  allEntries: ExperienceEntry[];
  onAccept:   (text: string) => void;
}) {
  const aiContext = useMemo(() => ({
    currentText: entry.description,
    position:    entry.position,
    company:     entry.company,
    existingExperience: allEntries
      .filter((e) => e.id !== entry.id && (e.position || e.company))
      .slice(0, 2)
      .map((e) => ({ position: e.position, company: e.company, description: e.description })),
  }), [entry.description, entry.position, entry.company, allEntries]);

  const ai = useAISuggest({
    field:    "experience_description",
    context:  aiContext,
    onAccept,
  });

  return (
    <AISuggestionPanel
      isLoading={ai.isLoading}
      isOpen={ai.isOpen}
      suggestion={ai.suggestion}
      onGenerate={ai.generate}
      onAccept={ai.accept}
      onDismiss={ai.dismiss}
      buttonLabel="Write bullet points with AI"
    />
  );
}

export function ExperienceForm({ data, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(data[0]?.id ?? null);

  const add = () => {
    const e = empty();
    onChange([...data, e]);
    setOpenId(e.id);
  };

  const remove = (id: string) => {
    onChange(data.filter((e) => e.id !== id));
    if (openId === id) setOpenId(null);
  };

  const update = (id: string, field: keyof ExperienceEntry, val: string | boolean) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Work Experience
        </h3>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--accent-text)" }}
        >
          <PlusCircle className="size-4" /> Add Entry
        </button>
      </div>

      {data.length === 0 && (
        <p
          className="text-xs text-center py-6 rounded-xl"
          style={{ color: "var(--text-muted)", border: "2px dashed var(--border-strong)" }}
        >
          No experience added yet.
        </p>
      )}

      {data.map((entry) => {
        const isOpen = openId === entry.id;
        return (
          <div
            key={entry.id}
            className="overflow-hidden"
            style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}
          >
            <button
              type="button"
              className="accordion-header rounded-none"
              onClick={() => setOpenId(isOpen ? null : entry.id)}
            >
              <span className="truncate">
                {entry.position || entry.company || "New Entry"}
              </span>
              {isOpen
                ? <ChevronUp   className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                : <ChevronDown className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />}
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-3 space-y-3" style={{ background: "var(--surface)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Position</label>
                    <input
                      type="text" value={entry.position} className="input"
                      placeholder="Software Engineer"
                      onChange={(e) => update(entry.id, "position", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Company</label>
                    <input
                      type="text" value={entry.company} className="input"
                      placeholder="Acme Corp"
                      onChange={(e) => update(entry.id, "company", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Start Date</label>
                    <input
                      type="month" value={entry.startDate} className="input"
                      onChange={(e) => update(entry.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <input
                      type="month" value={entry.endDate} className="input"
                      disabled={entry.isCurrent}
                      onChange={(e) => update(entry.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>
                <label
                  className="flex items-center gap-2 text-xs cursor-pointer select-none"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <input
                    type="checkbox" checked={entry.isCurrent} className="rounded"
                    onChange={(e) => update(entry.id, "isCurrent", e.target.checked)}
                  />
                  Currently working here
                </label>

                {/* AI bullet point generator — isolated per entry */}
                <ExperienceEntryAI
                  entry={entry}
                  allEntries={data}
                  onAccept={(text) => update(entry.id, "description", text)}
                />

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={entry.description} rows={5} className="textarea w-full"
                    placeholder="• Led a team of 4 engineers to deliver a payment service handling 10k+ transactions/day&#10;• Reduced API latency by 40% through query optimisation and Redis caching"
                    onChange={(e) => update(entry.id, "description", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  className="btn btn-danger flex items-center gap-1.5 text-xs px-3 py-1.5"
                >
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
