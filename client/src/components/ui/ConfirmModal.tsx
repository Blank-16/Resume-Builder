import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  title:       string;
  message:     string;
  confirmLabel?: string;
  cancelLabel?:  string;
  danger?:       boolean;
  onConfirm:   () => void;
  onCancel:    () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  danger       = false,
  onConfirm,
  onCancel,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open — safer default for destructive actions
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            {danger && (
              <div
                className="size-8 rounded-xl flex items-center justify-center shrink-0 anim-bounce-in"
                style={{ background: "var(--danger-dim)" }}
              >
                <AlertTriangle className="size-4" style={{ color: "var(--danger)" }} />
              </div>
            )}
            <h2
              id="modal-title"
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-surface p-1.5"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="btn btn-ghost px-4 py-2 text-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn px-4 py-2 text-sm ${danger ? "btn-danger" : "btn-primary"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
