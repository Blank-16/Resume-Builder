import { useState } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppStore";
import { setCredentials } from "@/store/features/authSlice";
import { authApi } from "@/services/api";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [params]  = useSearchParams();

  const [isReg, setIsReg]         = useState(params.get("mode") === "register");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]            = useState({ name: "", email: "", password: "" });

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    "/dashboard";

  const set = (field: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = isReg
        ? await authApi.register(form)
        : await authApi.login({ email: form.email, password: form.password });

      if (data.data) {
        // setCredentials now also sets loading=false internally
        dispatch(setCredentials(data.data));
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : isReg
          ? "Registration failed"
          : "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "var(--accent-dim)", opacity: 0.7 }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8 anim-fade-up">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-5 transition-opacity hover:opacity-75"
            style={{ color: "var(--text-secondary)" }}
          >
            <FileText className="size-5" style={{ color: "var(--accent-text)" }} />
            <span className="font-bold text-sm tracking-tight">ResumeBuilder</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
            {isReg ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isReg ? "Start building ATS-ready resumes" : "Sign in to continue"}
          </p>
        </div>

        {/* Form card */}
        <div className="card-raised p-6 anim-fade-up delay-2">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            {isReg && (
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Jane Smith"
                  className="input"
                />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="jane@example.com"
                className="input"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={isReg ? "new-password" : "current-password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={isReg ? "Min. 8 characters" : "••••••••"}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full py-2.5 text-sm mt-1"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="spinner" /> Please wait…
                </span>
              ) : isReg ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
            {isReg ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsReg((v) => !v)}
              className="font-semibold transition-opacity hover:opacity-75"
              style={{ color: "var(--accent-text)" }}
            >
              {isReg ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
