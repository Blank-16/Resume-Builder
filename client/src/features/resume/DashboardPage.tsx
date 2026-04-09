import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FilePlus, Trash2, Edit3, Clock, FileText, LogOut } from "lucide-react";
import { resumeApi } from "@/services/api";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { logout } from "@/store/features/authSlice";
import toast from "react-hot-toast";
import type { Resume } from "@/types";

export function DashboardPage() {
  const user     = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [resumes,  setResumes]  = useState<Resume[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    resumeApi
      .list()
      .then(({ data }) => setResumes(data.data ?? []))
      .catch(() => toast.error("Failed to load resumes"))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setCreating(true);
    try {
      const { data } = await resumeApi.create({ title: "Untitled Resume" });
      if (data.data) navigate(`/builder/${data.data._id}`);
    } catch {
      toast.error("Failed to create resume");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await resumeApi.delete(id);
      setResumes((p) => p.filter((r) => r._id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-subtle)" }}>
      {/* ── Header ── */}
      <header
        className="anim-slide-left"
        style={{
          background:     "var(--surface)",
          borderBottom:   "1px solid var(--border)",
          padding:        "0 1.5rem",
          height:         "56px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          position:       "sticky",
          top:            0,
          zIndex:         40,
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            title="Home"
            className="transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
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
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={creating}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <FilePlus className="size-4" />
            {creating ? "Creating…" : "New Resume"}
          </button>
          <button
            type="button"
            title="Sign out"
            onClick={() => { dispatch(logout()); navigate("/"); }}
            className="btn btn-surface p-2"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-xl animate-pulse"
                style={{ background: "var(--surface)" }}
              />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-24 anim-fade-up">
            <div
              className="size-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "var(--accent-dim)" }}
            >
              <FileText className="size-7" style={{ color: "var(--accent-text)" }} />
            </div>
            <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              No resumes yet
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Create your first ATS-ready resume in minutes.
            </p>
            <button
              type="button"
              onClick={() => void handleCreate()}
              className="btn btn-primary px-6 py-2.5 text-sm"
            >
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, i) => (
              /* resume-card class handles shadow hover via CSS */
              <div
                key={resume._id}
                className="card resume-card anim-fade-up"
                style={{ animationDelay: `${i * 55}ms`, boxShadow: "var(--shadow-sm)" }}
              >
                <div className="h-1.5 rounded-t-xl" style={{ background: resume.accentColor }} />
                <div className="p-5">
                  <h2 className="font-semibold truncate mb-0.5" style={{ color: "var(--text-primary)" }}>
                    {resume.title}
                  </h2>
                  <p className="text-xs capitalize mb-1" style={{ color: "var(--text-muted)" }}>
                    {resume.template}
                  </p>
                  <div className="flex items-center gap-1 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    <Clock className="size-3" />
                    {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/builder/${resume._id}`}
                      className="btn btn-surface flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5"
                    >
                      <Edit3 className="size-3.5" /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(resume._id)}
                      className="btn btn-danger p-1.5"
                    >
                      <Trash2 className="size-4" />
                    </button>
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
