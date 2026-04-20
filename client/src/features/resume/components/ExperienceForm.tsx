import { PlusCircle, Trash2, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItem } from "@/features/resume/components/SortableItem";
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

function ExperienceEntryAI({
  entry, allEntries, onAccept,
}: {
  entry: ExperienceEntry; allEntries: ExperienceEntry[]; onAccept: (t: string) => void;
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

  const ai = useAISuggest({ field: "experience_description", context: aiContext, onAccept });

  return (
    <AISuggestionPanel
      isLoading={ai.isLoading} isOpen={ai.isOpen} suggestion={ai.suggestion}
      onGenerate={ai.generate} onAccept={ai.accept} onDismiss={ai.dismiss}
      buttonLabel="Write bullet points with AI"
    />
  );
}

export function ExperienceForm({ data, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(data[0]?.id ?? null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((e) => e.id === active.id);
      const newIndex = data.findIndex((e) => e.id === over.id);
      onChange(arrayMove(data, oldIndex, newIndex));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Work Experience</h3>
        <button type="button" onClick={add}
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{
            color: "var(--accent-text)",
            transition: "transform var(--t-fast) var(--ease-spring), opacity var(--t-fast)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}>
          <PlusCircle className="size-4" /> Add Entry
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-xs text-center py-6 rounded-xl"
          style={{ color: "var(--text-muted)", border: "2px dashed var(--border-strong)" }}>
          No experience added yet.
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={data.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 pl-5">
            {data.map((entry) => {
              const isOpen = openId === entry.id;
              return (
                <SortableItem key={entry.id} id={entry.id}>
                  <div className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)", transition: "border-color var(--t-fast)" }}>
                    <button type="button" className="accordion-header rounded-none"
                      onClick={() => setOpenId(isOpen ? null : entry.id)}>
                      <span className="truncate">{entry.position || entry.company || "New Entry"}</span>
                      <ChevronDown
                        className="size-4 shrink-0 accordion-chevron"
                        data-open={isOpen ? "true" : "false"}
                        style={{ color: "var(--text-muted)" }}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-3 space-y-3 accordion-body" style={{ background: "var(--surface)" }}>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label">Position</label>
                            <input type="text" value={entry.position} className="input" placeholder="Software Engineer"
                              onChange={(e) => update(entry.id, "position", e.target.value)} />
                          </div>
                          <div>
                            <label className="label">Company</label>
                            <input type="text" value={entry.company} className="input" placeholder="Acme Corp"
                              onChange={(e) => update(entry.id, "company", e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label">Start Date</label>
                            <input type="month" value={entry.startDate} className="input"
                              onChange={(e) => update(entry.id, "startDate", e.target.value)} />
                          </div>
                          <div>
                            <label className="label">End Date</label>
                            <input type="month" value={entry.endDate} className="input" disabled={entry.isCurrent}
                              onChange={(e) => update(entry.id, "endDate", e.target.value)} />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-xs cursor-pointer select-none"
                          style={{ color: "var(--text-secondary)" }}>
                          <input type="checkbox" checked={entry.isCurrent} className="rounded"
                            onChange={(e) => update(entry.id, "isCurrent", e.target.checked)} />
                          Currently working here
                        </label>
                        <ExperienceEntryAI entry={entry} allEntries={data}
                          onAccept={(t) => update(entry.id, "description", t)} />
                        <div>
                          <label className="label">Description</label>
                          <textarea value={entry.description} rows={5} className="textarea w-full"
                            placeholder={"• Led team of 4 to deliver payment service handling 10k+ transactions/day\n• Reduced API latency by 40% via query optimisation"}
                            onChange={(e) => update(entry.id, "description", e.target.value)} />
                        </div>
                        <button type="button" onClick={() => remove(entry.id)}
                          className="btn btn-danger flex items-center gap-1.5 text-xs px-3 py-1.5">
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
