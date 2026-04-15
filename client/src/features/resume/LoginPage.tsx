import { useState } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppStore";
import { setCredentials } from "@/store/features/authSlice";
import { authApi } from "@/services/api";
import { FileText, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [isReg,      setIsReg]      = useState(params.get("mode") === "register");
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/dashboard";
  const set  = (f: keyof typeof form, v: string) => setForm((p) => ({ ...p, [f]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = isReg
        ? await authApi.register({ ...form, rememberMe })
        : await authApi.login({ email: form.email, password: form.password, rememberMe });
      if (data.data) { dispatch(setCredentials(data.data)); navigate(from, { replace: true }); }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : isReg ? "Registration failed" : "Login failed");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg)" }}>
      {/* Background glows */}
      <div className="glow-orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "var(--accent)", opacity: 0.2 }} />
      <div className="glow-orb w-[250px] h-[250px] top-1/4 right-0"
        style={{ background: "color-mix(in oklch, var(--accent) 50%, #e879f9)", opacity: 0.15 }} />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8 anim-fade-up">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 transition-opacity hover:opacity-75">
            <div className="size-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)", boxShadow: "var(--shadow-glow)" }}>
              <FileText className="size-4 text-white" />
            </div>
            <span className="font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>ResumeBuilder</span>
          </Link>
          <h1 className="text-2xl font-black mb-1.5 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            {isReg ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isReg ? "Start building ATS-ready resumes" : "Sign in to continue"}
          </p>
        </div>

        {/* Card */}
        <div className="card-glass p-7 anim-fade-up delay-2"
          style={{ boxShadow: "var(--shadow-lg)" }}>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            {isReg && (
              <div>
                <label className="label">Full Name</label>
                <input type="text" required autoComplete="name" value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Jane Smith" className="input" />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" required autoComplete="email" value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="jane@example.com" className="input" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required minLength={8}
                autoComplete={isReg ? "new-password" : "current-password"}
                value={form.password} onChange={(e) => set("password", e.target.value)}
                placeholder={isReg ? "Min. 8 characters" : "••••••••"}
                className="input" />
            </div>

            {!isReg && (
              <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none"
                style={{ color: "var(--text-secondary)" }}>
                <input type="checkbox" checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} className="rounded" />
                Remember me for 7 days
                <span className="ml-auto text-[10px]" style={{ color: "var(--text-muted)" }}>
                  (default 24 h)
                </span>
              </label>
            )}

            <button type="submit" disabled={submitting}
              className="btn btn-primary w-full py-3 text-sm"
              style={{ borderRadius: "var(--r-lg)", marginTop: "0.5rem" }}>
              {submitting
                ? <span className="flex items-center gap-2"><span className="spinner" />Please wait…</span>
                : <span className="flex items-center gap-2">
                    {isReg ? "Create Account" : "Sign In"}
                    <ArrowRight className="size-4" />
                  </span>}
            </button>
          </form>

          <div className="mt-5 pt-5 text-center" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {isReg ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => setIsReg(v => !v)}
                className="font-semibold transition-opacity hover:opacity-75"
                style={{ color: "var(--accent-text)" }}>
                {isReg ? "Sign in" : "Create one free"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
