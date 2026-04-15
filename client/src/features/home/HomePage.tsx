import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppStore";
import {
  Sparkles, Shield, Zap, ArrowRight, CheckCircle2,
  LayoutTemplate, FileText, Star,
} from "lucide-react";

const FEATURES = [
  { icon: Sparkles,       title: "AI Writing",        desc: "Generate ATS-optimised bullet points and summaries powered by any OpenAI-compatible model." },
  { icon: LayoutTemplate, title: "4 Templates",        desc: "Classic, Modern, Minimal, Executive — switch with a live preview, no guesswork." },
  { icon: Zap,            title: "Real-time Preview",  desc: "Every keystroke reflects instantly. Autosaves every 3 seconds." },
  { icon: Shield,         title: "Private by Default", desc: "Your data stays yours. Share a public link only when you choose." },
];

const BULLETS = [
  "ATS score checker",
  "Drag-and-drop reordering",
  "Version history",
  "PDF export",
  "Public sharing",
];

const MOCK_SECTIONS = ["Personal Info", "Summary", "Experience", "Education", "Skills"];
const MOCK_TAGS = ["TypeScript", "React", "Node.js", "MongoDB"];

export function HomePage() {
  const token  = useAppSelector((s) => s.auth.token);
  const ctaTo  = token ? "/dashboard" : "/login?mode=register";
  const ctaLbl = token ? "Go to Dashboard" : "Start building free";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav className="navbar justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)", boxShadow: "var(--shadow-glow)" }}>
            <FileText className="size-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">ResumeBuilder</span>
        </div>
        <div className="flex items-center gap-3">
          {token ? (
            <Link to="/dashboard" className="btn btn-primary px-4 py-2 text-xs">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="nav-text-link text-xs">Sign in</Link>
              <Link to="/login?mode=register" className="btn btn-primary px-4 py-2 text-xs">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-5 overflow-hidden">
        {/* Background glows */}
        <div className="glow-orb w-[600px] h-[500px] -top-32 left-1/2 -translate-x-1/2"
          style={{ background: "var(--accent)" }} />
        <div className="glow-orb w-[300px] h-[300px] top-20 -right-20"
          style={{ background: "color-mix(in oklch, var(--accent) 60%, #e879f9)", opacity: 0.25 }} />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 badge mb-8 anim-fade-up delay-1 px-4 py-1.5">
            <Sparkles className="size-3" />
            AI-powered · ATS-optimised · Free to start
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04] mb-6 anim-fade-up delay-2"
            style={{ letterSpacing: "-0.03em" }}>
            Resumes that{" "}
            <span className="text-gradient">land jobs</span>,<br />
            not spam folders.
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 anim-fade-up delay-3"
            style={{ color: "var(--text-secondary)" }}>
            Build an ATS-ready resume in minutes. AI writes your bullet points,
            live preview shows every change, and one click exports to PDF.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 anim-fade-up delay-4">
            <Link to={ctaTo}
              className="btn btn-primary px-8 py-3.5 text-sm group w-full sm:w-auto justify-center"
              style={{ borderRadius: "var(--r-xl)" }}>
              {ctaLbl}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {!token && (
              <Link to="/login" className="btn btn-ghost px-8 py-3.5 text-sm w-full sm:w-auto justify-center"
                style={{ borderRadius: "var(--r-xl)" }}>
                Sign in
              </Link>
            )}
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-1.5 anim-fade-up delay-5">
            <div className="flex -space-x-1.5">
              {["#7c3aed","#0ea5e9","#10b981","#f59e0b","#ec4899"].map((c, i) => (
                <div key={i} className="size-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ borderColor: "var(--bg)", background: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 ml-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="size-3 fill-current" style={{ color: "#fbbf24" }} />)}
            </div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Used by thousands of job seekers
            </span>
          </div>
        </div>
      </section>

      {/* ── App preview ── */}
      <section className="pb-28 px-5">
        <div className="max-w-4xl mx-auto anim-fade-up delay-5">
          <div className="card-glass overflow-hidden" style={{ boxShadow: "var(--shadow-lg), var(--shadow-glow)" }}>
            {/* Gradient top bar */}
            <div className="h-0.5" style={{
              background: "linear-gradient(90deg, var(--accent), color-mix(in oklch, var(--accent) 50%, #e879f9), #0ea5e9)"
            }} />
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
              <span className="size-3 rounded-full" style={{ background: "rgba(248,113,113,0.7)" }} />
              <span className="size-3 rounded-full" style={{ background: "rgba(251,191,36,0.7)" }} />
              <span className="size-3 rounded-full" style={{ background: "rgba(52,211,153,0.7)" }} />
              <div className="flex-1 mx-4 h-5 rounded-lg flex items-center px-3 text-[10px]"
                style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}>
                resumebuilder.app/builder
              </div>
            </div>
            {/* Split UI */}
            <div className="grid grid-cols-[200px_1fr] min-h-[280px]">
              <div className="p-4 space-y-1" style={{ borderRight: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
                {MOCK_SECTIONS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium transition-colors"
                    style={{
                      background: i === 0 ? "var(--accent-dim)" : "transparent",
                      color:      i === 0 ? "var(--accent-text)" : "var(--text-muted)",
                    }}>
                    <span className="size-1.5 rounded-full bg-current shrink-0" />{s}
                  </div>
                ))}
                <div className="pt-3 space-y-2">
                  {[75, 90, 60, 82].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full"
                      style={{ width: `${w}%`, background: "var(--border-strong)" }} />
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-3" style={{ background: "var(--surface)" }}>
                <div className="h-6 w-40 rounded-xl skeleton" />
                <div className="h-2.5 w-56 rounded skeleton" />
                <div className="h-2.5 w-48 rounded skeleton" />
                <div className="h-px" style={{ background: "var(--border)" }} />
                <div className="space-y-2">
                  {[100, 88, 95, 72, 84].map((w, i) => (
                    <div key={i} className="h-2.5 rounded skeleton" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {MOCK_TAGS.map(t => (
                    <span key={t} className="skill-tag text-[10px] px-2.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-28 px-5 relative">
        <div className="glow-orb w-[400px] h-[400px] top-1/2 -translate-y-1/2 -left-40"
          style={{ background: "var(--accent)", opacity: 0.18 }} />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--accent-text)" }}>Features</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ letterSpacing: "-0.025em" }}>
              Everything to land the role
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title}
                className="card feature-card p-6 anim-fade-up"
                style={{ animationDelay: `${i * 75}ms` }}>
                <div className="size-10 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-dim), color-mix(in oklch, var(--accent-dim) 50%, transparent))",
                    boxShadow: "0 0 20px var(--accent-dim)",
                  }}>
                  <Icon className="size-5" style={{ color: "var(--accent-text)" }} />
                </div>
                <h3 className="font-bold text-sm mb-2">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(135deg, color-mix(in oklch, var(--accent) 20%, var(--surface)), var(--surface))",
              border: "1px solid color-mix(in oklch, var(--accent) 30%, var(--border))",
              boxShadow: "var(--shadow-lg), var(--shadow-glow)",
            }}>
            {/* Corner glow */}
            <div className="glow-orb w-64 h-64 -top-16 -right-16"
              style={{ background: "var(--accent)", opacity: 0.35 }} />

            <div className="relative">
              <h2 className="text-4xl font-black mb-4 tracking-tight" style={{ letterSpacing: "-0.025em" }}>
                Start building for free
              </h2>
              <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                No credit card. No templates locked behind a paywall. No watermarks.
              </p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
                {BULLETS.map(b => (
                  <span key={b} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <CheckCircle2 className="size-3.5 shrink-0" style={{ color: "var(--accent-text)" }} />
                    {b}
                  </span>
                ))}
              </div>

              <Link to={ctaTo}
                className="btn btn-primary inline-flex items-center gap-2 px-10 py-3.5 text-sm"
                style={{ borderRadius: "var(--r-xl)" }}>
                {ctaLbl} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-5 text-center" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="size-5 rounded-md flex items-center justify-center"
            style={{ background: "var(--accent)" }}>
            <FileText className="size-3 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">ResumeBuilder</span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} ResumeBuilder · Built with TypeScript &amp; React
        </p>
      </footer>
    </div>
  );
}
