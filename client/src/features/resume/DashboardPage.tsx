import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FilePlus, Trash2, Edit3, Clock, FileText,
  LogOut, Copy, Check, X, MoreHorizontal, Settings,
} from "lucide-react";
import { resumeApi } from "@/services/api";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { logout } from "@/store/features/authSlice";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import type { Resume } from "@/types";

interface DeleteTarget { id: string; title: string; }
interface RenameState  { id: string; value: string; }

export function DashboardPage() {
  const user     = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [resumes,       setResumes]       = useState<Resume[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [creating,      setCreating]      = useState(false);
  const [duplicating,   setDuplicating]   = useState<string | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<DeleteTarget | null>(null);
  const [rename,        setRename]        = useState<RenameState | null>(null);
  const [openMenuId,    setOpenMenuId]    = useState<string | null>(null);

  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "My Resumes — ResumeBuilder";
    resumeApi
      .list()
      .then(({ data }) => setResumes(data.data ?? []))
      .catch(() => toast.error("Failed to load resumes"))
      .finally(() => setLoading(false));
  }, []);

  // Focus rename input when it appears
  useEffect(() => {
    if (rename) renameInputRef.current?.select();
  }, [rename?.id]);

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const close = () => setOpenMenuId(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenuId]);

  async function handleCreate() {
    setCreating(true);
    try {
      const { data } = await resumeApi.create({ title: "Untitled Resume" });
      if (data.data) navigate(`/builder/${data.data._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create resume");
    } finally {
      setCreating(false);
    }
  }

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    setOpenMenuId(null);
    try {
      const { data } = await resumeApi.duplicate(id);
      if (data.data) {
        setResumes((p) => [data.data!, ...p]);
        toast.success("Resume duplicated");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to duplicate");
    } finally {
      setDuplicating(null);
    }
  }

  function startRename(resume: Resume) {
    setOpenMenuId(null);
    setRename({ id: resume._id, value: resume.title });
  }

  async function commitRename() {
    if (!rename) return;
    const trimmed = rename.value.trim();
    if (!trimmed) { setRename(null); return; }

    // Optimistic update
    setResumes((p) =>
      p.map((r) => (r._id === rename.id ? { ...r, title: trimmed } : r))
    );
    setRename(null);

    try {
      await resumeApi.update(rename.id, { title: trimmed });
    } catch (err: unknown) {
      // Rollback title on failure
      toast.error(err instanceof Error ? err.message : "Failed to rename");
      resumeApi.list().then(({ data }) => setResumes(data.data ?? [])).catch(() => null);
    }
  }

  function confirmDelete(resume: Resume) {
    setOpenMenuId(null);
    setDeleteTarget({ id: resume._id, title: resume.title });
  }

  async function executeDelete() {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);

    // Optimistic removal
    const prev = resumes;
    setResumes((p) => p.filter((r) => r._id !== id));

    try {
      await resumeApi.delete(id);
      toast.success("Resume deleted");
    } catch (err: unknown) {
      setResumes(prev);
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-subtle)" }}>

      {/* ── Confirm delete modal ── */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete resume"
          message={`"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => void executeDelete()}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Header ── */}
      <header
        className="anim-slide-left"
        style={{
          background: "var(--surface)", borderBottom: "1px solid var(--border)",
          padding: "0 1.5rem", height: "56px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 40,
        }}
      >
        <div className="flex items-center gap-3">
          <Link to="/" title="Home" className="transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}>
            <FileText className="size-4" />
          </Link>
          <span style={{ color: "var(--border-strong)" }}>|</span>
          <div>
            <h1 className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
              My Resumes
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void handleCreate()} disabled={creating}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FilePlus className="size-4" />
            {creating ? "Creating…" : "New Resume"}
          </button>
          <Link to="/settings" title="Settings" className="btn btn-surface p-2">
            <Settings className="size-4" />
          </Link>
          <button type="button" title="Sign out"
            onClick={() => { dispatch(logout()); navigate("/"); }}
            className="btn btn-surface p-2">
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          /* Skeleton loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl animate-pulse"
                style={{ background: "var(--surface)" }} />
            ))}
          </div>

        ) : resumes.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 anim-fade-up">
            <div className="size-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "var(--accent-dim)" }}>
              <FileText className="size-8" style={{ color: "var(--accent-text)" }} />
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              No resumes yet
            </h2>
            <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
              Create your first ATS-ready resume in minutes. It&apos;s free.
            </p>
            <button type="button" onClick={() => void handleCreate()}
              className="btn btn-primary px-8 py-2.5 text-sm">
              Create my first resume
            </button>
          </div>

        ) : (
          /* Resume grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, i) => (
              <div
                key={resume._id}
                className="card resume-card anim-fade-up"
                style={{ animationDelay: `${i * 55}ms`, boxShadow: "var(--shadow-sm)" }}
              >
                {/* Accent stripe */}
                <div className="h-1.5 rounded-t-xl" style={{ background: resume.accentColor }} />

                <div className="p-5">
                  {/* Title — inline rename when active */}
                  {rename?.id === resume._id ? (
                    <div className="flex items-center gap-1.5 mb-1">
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={rename.value}
                        onChange={(e) => setRename({ id: resume._id, value: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void commitRename();
                          if (e.key === "Escape") setRename(null);
                        }}
                        className="input text-sm font-semibold py-1 px-2 flex-1"
                        maxLength={100}
                      />
                      <button type="button" onClick={() => void commitRename()}
                        className="btn btn-primary p-1.5" title="Save">
                        <Check className="size-3.5" />
                      </button>
                      <button type="button" onClick={() => setRename(null)}
                        className="btn btn-surface p-1.5" title="Cancel">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <h2
                      className="font-semibold truncate mb-0.5 cursor-pointer"
                      style={{ color: "var(--text-primary)" }}
                      onDoubleClick={() => startRename(resume)}
                      title="Double-click to rename"
                    >
                      {resume.title}
                    </h2>
                  )}

                  <p className="text-xs capitalize mb-1" style={{ color: "var(--text-muted)" }}>
                    {resume.template}
                  </p>
                  <div className="flex items-center gap-1 text-xs mb-4"
                    style={{ color: "var(--text-muted)" }}>
                    <Clock className="size-3" />
                    {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/builder/${resume._id}`}
                      className="btn btn-surface flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5"
                    >
                      <Edit3 className="size-3.5" /> Edit
                    </Link>

                    {/* Overflow menu */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        title="More options"
                        onClick={() => setOpenMenuId((id) => id === resume._id ? null : resume._id)}
                        className="btn btn-surface p-1.5"
                      >
                        {duplicating === resume._id
                          ? <span className="spinner" style={{ borderTopColor: "var(--text-secondary)" }} />
                          : <MoreHorizontal className="size-4" />}
                      </button>

                      {openMenuId === resume._id && (
                        <div
                          className="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden anim-scale-up"
                          style={{
                            zIndex: 50,
                            background:  "var(--surface-raised)",
                            border:      "1px solid var(--border-strong)",
                            boxShadow:   "var(--shadow-lg)",
                          }}
                        >
                          <button type="button"
                            onClick={() => startRename(resume)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <Edit3 className="size-3.5" /> Rename
                          </button>
                          <button type="button"
                            onClick={() => void handleDuplicate(resume._id)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <Copy className="size-3.5" /> Duplicate
                          </button>
                          <div style={{ height: "1px", background: "var(--border)" }} />
                          <button type="button"
                            onClick={() => confirmDelete(resume)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors"
                            style={{ color: "var(--danger)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--danger-dim)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <Trash2 className="size-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
