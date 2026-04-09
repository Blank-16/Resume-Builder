import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppStore";
import {
  FileText, Sparkles, Shield, Zap, ArrowRight,
  CheckCircle2, LayoutTemplate,
} from "lucide-react";

const FEATURES = [
  { icon: Sparkles,       title: "ATS-Optimised",     desc: "Semantic HTML that every applicant tracking system can parse without dropping your content." },
  { icon: LayoutTemplate, title: "Multiple Templates", desc: "Classic, Modern, Minimal, Executive — swap instantly with live preview." },
  { icon: Zap,            title: "Real-time Preview",  desc: "Every keystroke reflects immediately. No save-to-refresh loops." },
  { icon: Shield,         title: "Secure & Private",   desc: "Your data is yours. Share a public link only when you choose to." },
];

const BULLETS = [
  "Export to PDF in one click",
  "Drag-and-drop section ordering",
  "Accent colour customisation",
  "Public sharing with one link",
  "Projects, certifications & more",
];

const MOCK_SECTIONS = ["Personal Info", "Summary", "Experience", "Education", "Skills"];
const MOCK_TAGS     = ["TypeScript", "React", "Node.js", "MongoDB"];

export function HomePage() {
  const token  = useAppSelector((s) => s.auth.token);
  const ctaTo  = token ? "/dashboard" : "/login?mode=register";
  const ctaLbl = token ? "Go to Dashboard" : "Build my resume";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* ── Navbar ── */}
      <nav className="navbar justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4" style={{ color: "var(--accent-text)" }} />
          <span className="font-bold text-sm tracking-tight">ResumeBuilder</span>
        </div>
        <div className="flex items-center gap-3">
          {token ? (
            <Link to="/dashboard" className="btn btn-primary text-xs px-4 py-2">Dashboard</Link>
          ) : (
            <>
              {/* nav-link hover handled via CSS in index.css */}
              <Link to="/login" className="nav-text-link text-xs font-medium">
                Sign in
              </Link>
              <Link to="/login?mode=register" className="btn btn-primary text-xs px-4 py-2">
                Get started free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 px-5 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: "var(--accent-dim)", opacity: 0.6 }}
        />

        <div className="max-w-3xl mx-auto text-center relative">
          <span className="badge anim-fade-up delay-1 mb-8 inline-flex">
            <Sparkles className="size-3" /> ATS-friendly · TypeScript · Open templates
          </span>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.06] mb-6 anim-fade-up delay-2">
            Resumes that get{" "}
            <span className="text-gradient">past the bots</span>
            <br />and into interviews.
          </h1>

          <p
            className="text-lg leading-relaxed max-w-xl mx-auto mb-10 anim-fade-up delay-3"
            style={{ color: "var(--text-secondary)" }}
          >
            Build a polished, ATS-optimised resume in minutes. Pick a template,
            fill in your details, export to PDF — no design skills required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 anim-fade-up delay-4">
            <Link to={ctaTo} className="btn btn-primary px-7 py-3 text-sm group">
              {ctaLbl}
              <ArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {!token && (
              <Link to="/login" className="btn btn-ghost px-7 py-3 text-sm">
                Already have an account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── App preview mockup ── */}
      <section className="pb-20 px-5">
        <div className="max-w-4xl mx-auto anim-fade-up delay-5">
          <div className="card overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
            {/* Browser chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-raised)" }}
            >
              <span className="size-3 rounded-full" style={{ background: "rgba(239,68,68,0.55)" }} />
              <span className="size-3 rounded-full" style={{ background: "rgba(234,179,8,0.55)" }} />
              <span className="size-3 rounded-full" style={{ background: "rgba(34,197,94,0.55)" }} />
              <div
                className="flex-1 mx-4 h-5 rounded-md flex items-center px-3 text-[10px]"
                style={{ background: "var(--bg)", color: "var(--text-muted)" }}
              >
                resumebuilder.app/builder
              </div>
            </div>
            {/* Split layout */}
            <div className="grid grid-cols-[220px_1fr] min-h-[300px]">
              <div className="p-4 space-y-1.5" style={{ borderRight: "1px solid var(--border)" }}>
                {MOCK_SECTIONS.map((s, i) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs"
                    style={{
                      background: i === 0 ? "var(--accent-dim)" : "transparent",
                      color:      i === 0 ? "var(--accent-text)" : "var(--text-muted)",
                    }}
                  >
                    <span className="size-1.5 rounded-full bg-current shrink-0" />
                    {s}
                  </div>
                ))}
                <div className="pt-4 space-y-2">
                  {[72, 88, 55, 78].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 rounded-full"
                      style={{ width: `${w}%`, background: "var(--border-strong)" }}
                    />
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-7 w-44 rounded-lg" style={{ background: "var(--surface-raised)" }} />
                <div className="h-3 w-60 rounded"   style={{ background: "var(--border)" }} />
                <div className="h-3 w-48 rounded"   style={{ background: "var(--border)" }} />
                <div className="h-px"               style={{ background: "var(--border)" }} />
                <div className="space-y-2.5">
                  {[100, 84, 94, 68, 86].map((w, i) => (
                    <div key={i} className="h-2.5 rounded" style={{ width: `${w}%`, background: "var(--border)" }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {MOCK_TAGS.map((tag) => (
                    <span key={tag} className="badge text-[10px]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--accent-text)" }}
          >
            Features
          </p>
          <h2 className="text-center text-3xl font-bold mb-14">
            Everything you need to land the role
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              /* feature-card class handles hover via CSS — no inline handlers */
              <div
                key={title}
                className="card feature-card p-5 anim-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="size-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--accent-dim)" }}
                >
                  <Icon className="size-4" style={{ color: "var(--accent-text)" }} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div
            className="card p-10 text-center anim-scale-up"
            style={{ background: "linear-gradient(135deg, var(--accent-dim), transparent)" }}
          >
            <h2 className="text-3xl font-bold mb-6">Start building for free</h2>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
              {BULLETS.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <CheckCircle2 className="size-3.5 shrink-0" style={{ color: "var(--accent-text)" }} />
                  {b}
                </span>
              ))}
            </div>
            <Link to={ctaTo} className="btn btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm">
              {ctaLbl} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 px-5 text-center text-xs"
        style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        © {new Date().getFullYear()} ResumeBuilder · Built with TypeScript
      </footer>
    </div>
  );
}
