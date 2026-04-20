import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  id:       string;
  children: ReactNode;
}

export function SortableItem({ id, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    opacity:    isDragging ? 0.4 : 1,
    zIndex:     isDragging ? 50 : "auto",
    scale:      isDragging ? "1.02" : "1",
    boxShadow:  isDragging ? "var(--shadow-lg)" : "none",
    borderRadius: "var(--r-md)",
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative group">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 rounded"
          style={{
            color: "var(--text-muted)",
            touchAction: "none",
            transition: "opacity var(--t-fast), color var(--t-fast), transform var(--t-fast) var(--ease-spring)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-text)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%)";
          }}
          aria-label="Drag to reorder"
          tabIndex={-1}
        >
          <GripVertical className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
