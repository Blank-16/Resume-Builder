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
    transition,
    opacity:    isDragging ? 0.5 : 1,
    zIndex:     isDragging ? 10 : "auto",
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative group">
        {/* Drag handle — shown on hover */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 rounded"
          style={{ color: "var(--text-muted)", touchAction: "none" }}
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
