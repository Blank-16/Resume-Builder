import { Sparkles, Check, X, Loader2 } from "lucide-react";

interface Props {
  isLoading:  boolean;
  isOpen:     boolean;
  suggestion: string;
  onGenerate: () => void;
  onAccept:   () => void;
  onDismiss:  () => void;
  buttonLabel?: string;
}

export function AISuggestionPanel({
  isLoading,
  isOpen,
  suggestion,
  onGenerate,
  onAccept,
  onDismiss,
  buttonLabel = "Write with AI",
}: Props) {
  return (
    <div className="space-y-3">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => void onGenerate()}
        disabled={isLoading}
        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-60"
        style={{
          background:  "var(--accent-dim)",
          color:       "var(--accent-text)",
          border:      "1px solid color-mix(in oklch, var(--accent) 35%, transparent)",
        }}
      >
        {isLoading
          ? <Loader2 className="size-3.5 animate-spin" />
          : <Sparkles className="size-3.5" />}
        {isLoading ? "Generating…" : buttonLabel}
      </button>

      {/* Suggestion preview panel */}
      {isOpen && suggestion && (
        <div
          className="rounded-xl p-4 space-y-3 anim-fade-up"
          style={{
            background:  "var(--accent-dim)",
            border:      "1px solid color-mix(in oklch, var(--accent) 30%, transparent)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 shrink-0" style={{ color: "var(--accent-text)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--accent-text)" }}>
              AI Suggestion
            </span>
          </div>

          {/* Suggestion text */}
          <p
            className="text-xs leading-relaxed whitespace-pre-line"
            style={{ color: "var(--text-primary)" }}
          >
            {suggestion}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onAccept}
              className="btn btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
            >
              <Check className="size-3.5" /> Use this
            </button>
            <button
              type="button"
              onClick={() => void onGenerate()}
              disabled={isLoading}
              className="btn btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
            >
              <Sparkles className="size-3.5" /> Regenerate
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5"
            >
              <X className="size-3.5" /> Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
