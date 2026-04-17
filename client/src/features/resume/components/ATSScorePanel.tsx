import { useMemo, useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { Resume } from "@/types";

interface ATSCheck {
  category: string;
  passed:   boolean;
  message:  string;
  tip:      string;
}

function useATSChecks(resume: Resume): ATSCheck[] {
  return useMemo(() => {
    const p = resume.personalInfo;
    const hasEmail   = !!p.email.trim();
    const hasPhone   = !!p.phone.trim();
    const hasLinkedIn= !!p.linkedin.trim();
    const summaryLen = resume.professionalSummary.trim().length;
    const expCount   = resume.experience.length;
    const skillCount = resume.skills.length;
    const allExpHaveDesc = resume.experience.every(
      (e) => e.description.trim().length > 30
    );
    const bulletsUsed = resume.experience.some(
      (e) => e.description.includes("•") || e.description.includes("-")
    );
    const hasNumbers = resume.experience.some(
      (e) => /\d+[%$xX]|\d+\s*(percent|hours|users|customers|days|team|people)/i.test(e.description)
    );
    const summaryHasKeywords = resume.skills.some(
      (s) => resume.professionalSummary.toLowerCase().includes(s.toLowerCase())
    );

    return [
      {
        category: "Contact Info",
        passed:   hasEmail && hasPhone,
        message:  hasEmail && hasPhone ? "Email and phone present" : "Missing email or phone",
        tip:      "ATS systems extract contact info from the top of your resume.",
      },
      {
        category: "LinkedIn",
        passed:   hasLinkedIn,
        message:  hasLinkedIn ? "LinkedIn URL included" : "No LinkedIn URL",
        tip:      "Many ATS systems score resumes higher when LinkedIn is present.",
      },
      {
        category: "Summary Length",
        passed:   summaryLen >= 100 && summaryLen <= 600,
        message:  summaryLen < 100 ? "Summary too short (< 100 chars)" :
                  summaryLen > 600 ? "Summary too long (> 600 chars)" :
                  "Summary length is ideal",
        tip:      "2–4 concise sentences is the sweet spot for ATS parsing.",
      },
      {
        category: "Keyword Alignment",
        passed:   summaryHasKeywords,
        message:  summaryHasKeywords ? "Skills appear in summary" : "Summary missing skill keywords",
        tip:      "Mirror keywords from your skills section in your summary.",
      },
      {
        category: "Experience",
        passed:   expCount >= 1 && allExpHaveDesc,
        message:  expCount === 0 ? "No experience entries" :
                  !allExpHaveDesc ? "Some entries missing descriptions" :
                  "All experience entries have descriptions",
        tip:      "Every role needs at least a 1–2 sentence description.",
      },
      {
        category: "Bullet Points",
        passed:   bulletsUsed,
        message:  bulletsUsed ? "Bullet-style descriptions found" : "No bullet points detected",
        tip:      "Start each description line with • for ATS-friendly formatting.",
      },
      {
        category: "Quantified Impact",
        passed:   hasNumbers,
        message:  hasNumbers ? "Quantified achievements found" : "No numbers or metrics found",
        tip:      "Add numbers: '40% faster', '$2M revenue', '10,000 users'.",
      },
      {
        category: "Skills Section",
        passed:   skillCount >= 5,
        message:  skillCount < 5 ? `Only ${skillCount} skills listed` : `${skillCount} skills listed`,
        tip:      "List 8–15 skills. ATS systems match job keywords against this section.",
      },
    ];
  }, [resume]);
}

interface Props { resume: Resume; }

export function ATSScorePanel({ resume }: Props) {
  const [expanded, setExpanded] = useState(false);
  const checks     = useATSChecks(resume);
  const passed     = checks.filter((c) => c.passed).length;
  const score      = Math.round((passed / checks.length) * 100);

  const color =
    score >= 75 ? "var(--success)"  :
    score >= 50 ? "var(--accent)"   :
    "var(--danger)";

  const label =
    score >= 75 ? "ATS Ready"      :
    score >= 50 ? "Needs polish"   :
    "High risk";

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
    >
      {/* Header / toggle */}
      <button
        type="button"
        className="settings-btn w-full flex items-center justify-between px-4 py-3"
        style={{ color: "var(--text-primary)", background: "transparent" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4" style={{ color: "var(--accent-text)" }} />
          <span className="text-sm font-medium">ATS Score</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "var(--accent-dim)", color }}
          >
            {score}% — {label}
          </span>
        </div>
        {expanded
          ? <ChevronUp   className="size-4" style={{ color: "var(--text-muted)" }} />
          : <ChevronDown className="size-4" style={{ color: "var(--text-muted)" }} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          {checks.map((check) => (
            <div
              key={check.category}
              className="rounded-lg p-3 space-y-1"
              style={{
                background: check.passed ? "color-mix(in oklch, var(--success) 8%, transparent)"
                                         : "var(--danger-dim)",
                border:     `1px solid ${check.passed ? "color-mix(in oklch, var(--success) 20%, transparent)"
                                                       : "color-mix(in oklch, var(--danger) 20%, transparent)"}`,
              }}
            >
              <div className="flex items-center gap-2">
                {check.passed
                  ? <CheckCircle2 className="size-3.5 shrink-0" style={{ color: "var(--success)" }} />
                  : <AlertTriangle className="size-3.5 shrink-0" style={{ color: "var(--danger)" }} />}
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  {check.category}
                </span>
              </div>
              <p className="text-xs pl-5" style={{ color: "var(--text-secondary)" }}>
                {check.message}
              </p>
              {!check.passed && (
                <div className="flex items-start gap-1.5 pl-5">
                  <Info className="size-3 shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {check.tip}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
