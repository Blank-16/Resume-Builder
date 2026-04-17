import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resumeApi } from "@/services/api";
import { ResumePreview } from "@/features/resume/components/ResumePreview";
import { createEmptyResume } from "@/utils/resume";
import { useAppSelector } from "@/hooks/useAppStore";
import { FileText, ArrowRight } from "lucide-react";
import type { Resume } from "@/types";

export function PublicPreviewPage() {
  const { id }    = useParams<{ id: string }>();
  const token     = useAppSelector((s) => s.auth.token);
  const [resume,   setResume]   = useState<Resume>(createEmptyResume());
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    resumeApi.getPublic(id)
      .then(({ data }) => { if (data.data) setResume(data.data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm"
        style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
        <span className="spinner mr-2" />Loading…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ background: "var(--bg)" }}>
        <FileText className="size-12 opacity-30" style={{ color: "var(--text-muted)" }} />
        <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Resume not found
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          This resume is private or no longer exists.
        </p>
        <Link to="/" className="btn btn-primary px-6 py-2.5 text-sm">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen print:bg-white" style={{ background: "var(--bg-subtle)" }}>

      {/* Branded top bar */}
      <header className="print:hidden" style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem", height: "52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-75">
          <FileText className="size-4" style={{ color: "var(--accent-text)" }} />
          <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
            ResumeBuilder
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <p className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
            Viewing <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{resume.title}</span>
          </p>
          {token ? (
            <Link to="/dashboard" className="btn btn-primary flex items-center gap-1.5 text-xs px-4 py-2">
              My Dashboard <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <Link to="/login?mode=register"
              className="btn btn-primary flex items-center gap-1.5 text-xs px-4 py-2">
              Build yours free <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* Resume */}
      <div className="max-w-4xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
        <ResumePreview resume={resume} />
      </div>

      {/* Bottom CTA banner */}
      {!token && (
        <div className="print:hidden py-10 px-4 text-center" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Like this resume?
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Build your own ATS-ready resume for free in minutes.
          </p>
          <Link to="/login?mode=register"
            className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
            Create my resume <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
