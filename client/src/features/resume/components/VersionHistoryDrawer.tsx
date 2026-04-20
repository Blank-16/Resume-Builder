import { useState, useCallback } from "react";
import { X, Clock, RotateCcw, Save } from "lucide-react";
import { resumeApi } from "@/services/api";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import type { Resume, ResumeSnapshot } from "@/types";

interface Props {
  resume:   Resume;
  onClose:  () => void;
  onRestore:(resume: Resume) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }) + " at " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function VersionHistoryDrawer({ resume, onClose, onRestore }: Props) {
  const [versions,    setVersions]    = useState<ResumeSnapshot[]>(resume.versions ?? []);
  const [saving,      setSaving]      = useState(false);
  const [restoring,   setRestoring]   = useState<string | null>(null);
  const [confirmSnap, setConfirmSnap] = useState<ResumeSnapshot | null>(null);

  const handleSaveVersion = useCallback(async () => {
    setSaving(true);
    try {
      const { data } = await resumeApi.saveVersion(resume._id);
      if (data.data) {
        setVersions(data.data.versions ?? []);
        toast.success("Version saved");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save version");
    } finally {
      setSaving(false);
    }
  }, [resume._id]);

  const handleRestore = useCallback(async (snapshotId: string) => {
    setRestoring(snapshotId);
    setConfirmSnap(null);
    try {
      const { data } = await resumeApi.restoreVersion(resume._id, snapshotId);
      if (data.data) {
        onRestore(data.data);
        toast.success("Version restored");
        onClose();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to restore version");
    } finally {
      setRestoring(null);
    }
  }, [resume._id, onRestore, onClose]);

  const sorted = [...versions].reverse(); // newest first

  return (
    <>
      {/* Confirm restore modal */}
      {confirmSnap && (
        <ConfirmModal
          title="Restore this version?"
          message={`Your current resume will be replaced with the version from ${formatDate(confirmSnap.savedAt)}. This cannot be undone.`}
          confirmLabel="Restore"
          onConfirm={() => void handleRestore(confirmSnap.snapshotId)}
          onCancel={() => setConfirmSnap(null)}
        />
      )}

      <div className="drawer-overlay" onClick={onClose} />

      <div className="drawer">
        <div className="drawer-header">
          <div className="flex items-center gap-2">
            <Clock className="size-4" style={{ color: "var(--accent-text)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Version History
            </h2>
          </div>
          <button type="button" onClick={onClose} className="btn btn-surface p-1.5">
            <X className="size-4" />
          </button>
        </div>

        <div className="drawer-body space-y-4">
          {/* Save current version */}
          <button
            type="button"
            onClick={() => void handleSaveVersion()}
            disabled={saving}
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
          >
            {saving ? <span className="spinner" /> : <Save className="size-4" />}
            {saving ? "Saving…" : "Save current version"}
          </button>

          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Up to 10 versions saved. Oldest are removed automatically.
          </p>

          {/* Version list */}
          {sorted.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="size-8 mx-auto mb-3 opacity-30" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                No saved versions yet
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Click "Save current version" to create a snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map((snap, i) => (
                <div
                  key={snap.snapshotId}
                  className="rounded-xl p-3.5 anim-fade-up"
                  style={{
                    background:     "var(--surface-raised)",
                    border:         "1px solid var(--border)",
                    animationDelay: `${i * 40}ms`,
                    transition:     "border-color var(--t-fast), box-shadow var(--t-fast)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "color-mix(in oklch, var(--accent) 35%, var(--border))";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {snap.title}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {formatDate(snap.savedAt)}
                        {i === 0 && (
                          <span className="ml-2 px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: "var(--accent-dim)", color: "var(--accent-text)" }}>
                            Latest
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfirmSnap(snap)}
                      disabled={restoring === snap.snapshotId}
                      className="btn btn-ghost flex items-center gap-1.5 text-xs px-2.5 py-1.5 shrink-0"
                    >
                      {restoring === snap.snapshotId
                        ? <span className="spinner" />
                        : <RotateCcw className="size-3.5" />}
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
