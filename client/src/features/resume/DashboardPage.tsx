import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FilePlus, Trash2, Edit3, Clock, FileText,
  LogOut, Copy, Check, X, MoreHorizontal,
  Settings, Sparkles, ChevronRight,
} from "lucide-react";
import { resumeApi } from "@/services/api";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { logout } from "@/store/features/authSlice";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import toast from "react-hot-toast";
import type { Resume } from "@/types";

interface DeleteTarget { id: string; title: string; }
interface RenameState  { id: string; value: string; }

const TEMPLATE_COLORS: Record<string, string> = {
  classic:          "#7c3aed",
  modern:           "#0ea5e9",
  minimal:          "#64748b",
  executive:        "#d97706",
  home_college:     "#1e40af",
  general_template: "#059669",
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
      toast.error(err instanceof Error ? err.message : "Failed to create");
    } finally { setCreating(false); }
  }

  async function handleDuplicate(id: string) {
    setDuplicating(id); setOpenMenuId(null);
    try {
      const { data } = await resumeApi.duplicate(id);
      if (data.data) { setResumes(p => [data.data!, ...p]); toast.success("Duplicated"); }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setDuplicating(null); }
  }

  async function commitRename() {
    if (!rename) return;
    const trimmed = rename.value.trim();
    if (!trimmed) { setRename(null); return; }
    setResumes(p => p.map(r => r._id === rename.id ? { ...r, title: trimmed } : r));
    setRename(null);
    try {
      await resumeApi.update(rename.id, { title: trimmed });
    } catch {
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
      await resumeApi.delete(id); toast.success("Deleted");
    } catch {
      setResumes(prev); toast.error("Failed to delete");
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {deleteTarget && (
        <ConfirmModal
          title="Delete resume"
          message={`"${deleteTarget.title}" will be permanently deleted.`}
          confirmLabel="Delete" danger
          onConfirm={() => void executeDelete()}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className="sidebar w-56 shrink-0 h-screen sticky top-0 hidden lg:flex">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="size-7 rounded-lg flex items-center justify-center bg-accent"
            style={{ background: "var(--accent)" }}>
            <FileText className="size-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text-nav)" }}>
            ResumeBuilder
          </span>
        </div>

        <div className="divider mx-4" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5">
          <Link to="/dashboard" className="sidebar-item" data-active="true">
            <FileText className="size-4" /> My Resumes
          </Link>
          <Link to="/settings" className="sidebar-item">
            <Settings className="size-4" /> Settings
          </Link>
        </nav>

        {/* User */}
        <div className="p-4">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "var(--accent)" }}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text-nav)" }}>
                {user?.name}
              </p>
              <p className="text-[10px] truncate" style={{ color: "var(--text-nav-muted)" }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => { dispatch(logout()); navigate("/"); }}
            className="sidebar-item w-full mt-1 text-xs"
            style={{ color: "var(--text-nav-muted)" }}>
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="anim-slide-left flex items-center justify-between px-6 h-14 shrink-0"
          style={{
            background: "var(--surface)", borderBottom: "1px solid var(--border)",
            position: "sticky", top: 0, zIndex: 40,
          }}>
          <div>
            <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>My Resumes</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button type="button" onClick={() => void handleCreate()} disabled={creating}
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-xs">
              {creating ? <span className="spinner" /> : <FilePlus className="size-3.5" />}
              {creating ? "Creating…" : "New Resume"}
            </button>
            {/* Mobile logout */}
            <button type="button" title="Sign out" className="btn btn-surface p-2 lg:hidden"
              onClick={() => { dispatch(logout()); navigate("/"); }}>
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl skeleton" />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-24 anim-fade-up">
              <div className="relative inline-flex mb-6">
                <div className="size-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--accent-dim)" }}>
                  <FileText className="size-8" style={{ color: "var(--accent-text)" }} />
                </div>
                <div className="absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--accent)" }}>
                  <Sparkles className="size-2.5 text-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold mb-2">No resumes yet</h2>
              <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
                Create your first ATS-ready resume — it&apos;s free.
              </p>
              <button type="button" onClick={() => void handleCreate()}
                className="btn btn-primary px-7 py-2.5 text-sm" style={{ borderRadius: "var(--r-xl)" }}>
                Create resume <ChevronRight className="size-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {resumes.map((resume, i) => {
                const accent = TEMPLATE_COLORS[resume.template] ?? resume.accentColor;
                return (
                  <div key={resume._id}
                    className="card resume-card anim-fade-up group"
                    style={{ animationDelay: `${i * 45}ms` }}>
                    {/* Colour stripe */}
                    <div className="h-1 rounded-t-xl"
                      style={{ background: `linear-gradient(90deg, ${accent}, color-mix(in oklch, ${accent} 60%, #84cc16))` }} />

                    <div className="p-4">
                      {rename?.id === resume._id ? (
                        <div className="flex items-center gap-1 mb-3">
                          <input ref={renameInputRef} type="text" value={rename.value}
                            onChange={(e) => setRename({ id: resume._id, value: e.target.value })}
                            onKeyDown={(e) => { if (e.key === "Enter") void commitRename(); if (e.key === "Escape") setRename(null); }}
                            className="input text-sm font-semibold py-1 px-2 flex-1" maxLength={100} />
                          <button type="button" onClick={() => void commitRename()} className="btn btn-primary p-1.5"><Check className="size-3.5" /></button>
                          <button type="button" onClick={() => setRename(null)} className="btn btn-surface p-1.5"><X className="size-3.5" /></button>
                        </div>
                      ) : (
                        <h2 className="font-semibold truncate mb-0.5 cursor-pointer text-sm"
                          style={{ color: "var(--text-primary)" }}
                          onDoubleClick={() => setRename({ id: resume._id, value: resume.title })}>
                          {resume.title}
                        </h2>
                      )}

                      <p className="text-xs font-medium capitalize mb-1.5" style={{ color: accent }}>
                        {resume.template.replace("_", " ")}
                      </p>
                      <div className="flex items-center gap-1 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                        <Clock className="size-3" />
                        {new Date(resume.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to={`/builder/${resume._id}`}
                          className="btn btn-surface flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5">
                          <Edit3 className="size-3.5" /> Edit
                        </Link>
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button type="button"
                            onClick={() => setOpenMenuId(id => id === resume._id ? null : resume._id)}
                            className="btn btn-surface p-1.5">
                            {duplicating === resume._id
                              ? <span className="spinner" />
                              : <MoreHorizontal className="size-4" />}
                          </button>
                          {openMenuId === resume._id && (
                            <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden anim-scale-up"
                              style={{ zIndex: 50, background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-lg)" }}>
                              {[
                                { icon: Edit3,  label: "Rename",    fn: () => setRename({ id: resume._id, value: resume.title }) },
                                { icon: Copy,   label: "Duplicate", fn: () => void handleDuplicate(resume._id) },
                              ].map(({ icon: Icon, label, fn }) => (
                                <button key={label} type="button" onClick={() => { fn(); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors"
                                  style={{ color: "var(--text-secondary)" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                  <Icon className="size-3.5" /> {label}
                                </button>
                              ))}
                              <div style={{ height: "1px", background: "var(--border)" }} />
                              <button type="button"
                                onClick={() => { setDeleteTarget({ id: resume._id, title: resume.title }); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs"
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
    </div>
  );
}
