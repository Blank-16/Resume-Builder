import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FilePlus, Trash2, Edit3, Clock, FileText,
  LogOut, Copy, Check, X, MoreHorizontal, Settings,
  Sparkles, ChevronRight,
} from "lucide-react";
import { resumeApi } from "@/services/api";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { logout } from "@/store/features/authSlice";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import type { Resume } from "@/types";

interface DeleteTarget { id: string; title: string; }
interface RenameState  { id: string; value: string; }

const TEMPLATE_COLORS: Record<string, string> = {
  classic:   "#7c3aed",
  modern:    "#0ea5e9",
  minimal:   "#10b981",
  executive: "#f59e0b",
};

export function DashboardPage() {
  const user     = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [resumes,      setResumes]      = useState<Resume[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [creating,     setCreating]     = useState(false);
  const [duplicating,  setDuplicating]  = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [rename,       setRename]       = useState<RenameState | null>(null);
  const [openMenuId,   setOpenMenuId]   = useState<string | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Dashboard — ResumeBuilder";
    resumeApi.list()
      .then(({ data }) => setResumes(data.data ?? []))
      .catch(() => toast.error("Failed to load resumes"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (rename) renameInputRef.current?.select(); }, [rename?.id]);

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
    } finally { setCreating(false); }
  }

  async function handleDuplicate(id: string) {
    setDuplicating(id); setOpenMenuId(null);
    try {
      const { data } = await resumeApi.duplicate(id);
      if (data.data) { setResumes(p => [data.data!, ...p]); toast.success("Resume duplicated"); }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to duplicate");
    } finally { setDuplicating(null); }
  }

  function startRename(r: Resume) { setOpenMenuId(null); setRename({ id: r._id, value: r.title }); }

  async function commitRename() {
    if (!rename) return;
    const trimmed = rename.value.trim();
    if (!trimmed) { setRename(null); return; }
    setResumes(p => p.map(r => r._id === rename.id ? { ...r, title: trimmed } : r));
    setRename(null);
    try {
      await resumeApi.update(rename.id, { title: trimmed });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to rename");
      resumeApi.list().then(({ data }) => setResumes(data.data ?? [])).catch(() => null);
    }
  }

  async function executeDelete() {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    const prev = resumes;
    setResumes(p => p.filter(r => r._id !== id));
    try {
      await resumeApi.delete(id); toast.success("Resume deleted");
    } catch (err: unknown) {
      setResumes(prev);
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {deleteTarget && (
        <ConfirmModal
          title="Delete resume"
          message={`"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete" danger
          onConfirm={() => void executeDelete()}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Header ── */}
      <header className="anim-slide-left" style={{
        background: "color-mix(in oklch, var(--surface) 90%, transparent)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        padding: "0 1.5rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
            <div className="size-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent)" }}>
              <FileText className="size-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:inline">ResumeBuilder</span>
          </Link>
          <span className="text-xs" style={{ color: "var(--border-strong)" }}>/</span>
          <div>
            <h1 className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
              My Resumes
            </h1>
            <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text-muted)" }}>
              {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void handleCreate()} disabled={creating}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 text-xs">
            {creating ? <span className="spinner" /> : <FilePlus className="size-3.5" />}
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
      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl skeleton" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-28 anim-fade-up">
            {/* Empty state illustration */}
            <div className="relative inline-flex mb-8">
              <div className="size-20 rounded-3xl flex items-center justify-center"
                style={{ background: "var(--accent-dim)", boxShadow: "0 0 40px var(--accent-dim)" }}>
                <FileText className="size-10" style={{ color: "var(--accent-text)" }} />
              </div>
              <div className="absolute -top-1 -right-1 size-6 rounded-full flex items-center justify-center"
                style={{ background: "var(--accent)", boxShadow: "var(--shadow-glow)" }}>
                <Sparkles className="size-3 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 tracking-tight">No resumes yet</h2>
            <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
              Create your first ATS-ready resume in minutes — it&apos;s free.
            </p>
            <button type="button" onClick={() => void handleCreate()}
              className="btn btn-primary px-8 py-3 text-sm" style={{ borderRadius: "var(--r-xl)" }}>
              Create my first resume
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, i) => {
              const accent = TEMPLATE_COLORS[resume.template] ?? resume.accentColor;
              return (
                <div key={resume._id}
                  className="card resume-card anim-fade-up group"
                  style={{ animationDelay: `${i * 50}ms`, boxShadow: "var(--shadow-sm)" }}>
                  {/* Gradient accent header */}
                  <div className="h-1" style={{
                    background: `linear-gradient(90deg, ${accent}, color-mix(in oklch, ${accent} 50%, #e879f9))`
                  }} />

                  <div className="p-5">
                    {rename?.id === resume._id ? (
                      <div className="flex items-center gap-1.5 mb-3">
                        <input ref={renameInputRef} type="text" value={rename.value}
                          onChange={(e) => setRename({ id: resume._id, value: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void commitRename();
                            if (e.key === "Escape") setRename(null);
                          }}
                          className="input text-sm font-semibold py-1 px-2 flex-1" maxLength={100} />
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
                      <h2 className="font-bold truncate mb-0.5 cursor-pointer"
                        style={{ color: "var(--text-primary)" }}
                        onDoubleClick={() => startRename(resume)}
                        title="Double-click to rename">
                        {resume.title}
                      </h2>
                    )}

                    <p className="text-xs capitalize mb-1.5 font-medium" style={{ color: accent }}>
                      {resume.template}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                      <Clock className="size-3" />
                      {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/builder/${resume._id}`}
                        className="btn btn-surface flex-1 flex items-center justify-center gap-1.5 text-xs py-2">
                        <Edit3 className="size-3.5" /> Edit
                      </Link>

                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button type="button" title="More options"
                          onClick={() => setOpenMenuId(id => id === resume._id ? null : resume._id)}
                          className="btn btn-surface p-2">
                          {duplicating === resume._id
                            ? <span className="spinner" style={{ borderTopColor: "var(--text-secondary)" }} />
                            : <MoreHorizontal className="size-4" />}
                        </button>

                        {openMenuId === resume._id && (
                          <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden anim-scale-up"
                            style={{
                              zIndex: 50,
                              background: "var(--surface-raised)",
                              border: "1px solid var(--border-strong)",
                              borderRadius: "var(--r-xl)",
                              boxShadow: "var(--shadow-lg)",
                            }}>
                            {[
                              { icon: Edit3,  label: "Rename",    action: () => startRename(resume), color: "var(--text-secondary)" },
                              { icon: Copy,   label: "Duplicate", action: () => void handleDuplicate(resume._id), color: "var(--text-secondary)" },
                            ].map(({ icon: Icon, label, action, color }) => (
                              <button key={label} type="button" onClick={action}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors"
                                style={{ color }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                <Icon className="size-3.5" /> {label}
                              </button>
                            ))}
                            <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }} />
                            <button type="button"
                              onClick={() => setDeleteTarget({ id: resume._id, title: resume.title })}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors"
                              style={{ color: "var(--danger)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--danger-dim)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                              <Trash2 className="size-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
