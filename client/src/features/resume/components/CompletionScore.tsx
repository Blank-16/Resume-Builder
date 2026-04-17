import { useMemo } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { Resume } from "@/types";

interface SectionCheck {
  label:    string;
  done:     boolean;
  weight:   number;  // relative importance
}

function useCompletionChecks(resume: Resume): SectionCheck[] {
  return useMemo(() => [
    { label: "Full name",        done: !!resume.personalInfo.fullName.trim(),        weight: 10 },
    { label: "Email",            done: !!resume.personalInfo.email.trim(),            weight: 10 },
    { label: "Phone",            done: !!resume.personalInfo.phone.trim(),            weight: 5  },
    { label: "Location",         done: !!resume.personalInfo.location.trim(),         weight: 5  },
    { label: "LinkedIn",         done: !!resume.personalInfo.linkedin.trim(),         weight: 5  },
    { label: "Professional summary", done: resume.professionalSummary.trim().length > 50, weight: 20 },
    { label: "Work experience",  done: resume.experience.length > 0,                weight: 20 },
    { label: "Education",        done: resume.education.length > 0,                 weight: 10 },
    { label: "Skills",           done: resume.skills.length >= 3,                   weight: 10 },
    { label: "Projects",         done: resume.projects.length > 0,                  weight: 5  },
  ], [resume]);
}

interface Props {
  resume: Resume;
}

export function CompletionScore({ resume }: Props) {
  const checks      = useCompletionChecks(resume);
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const doneWeight  = checks.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
  const score       = Math.round((doneWeight / totalWeight) * 100);
  const remaining   = checks.filter((c) => !c.done);

  const color =
    score >= 80 ? "var(--success)"  :
    score >= 50 ? "var(--accent)"   :
    "var(--danger)";

  const label =
    score >= 80 ? "Strong"   :
    score >= 50 ? "Good"     :
    "Needs work";

  // SVG ring params
  const r           = 18;
  const circumference = 2 * Math.PI * r;
  const dash        = (score / 100) * circumference;

  return (
    <div className="space-y-3">
      <label className="label">Resume Completeness</label>

      {/* Score ring + label */}
      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
        <svg width="52" height="52" viewBox="0 0 52 52">
          {/* Track */}
          <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" stroke="var(--border-strong)" />
          {/* Fill */}
          <circle
            cx="26" cy="26" r={r} fill="none" strokeWidth="5"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            className="score-ring"
            style={{ transition: "stroke-dasharray 0.6s var(--ease-spring)" }}
          />
          <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
            {score}%
          </text>
        </svg>

        <div>
          <p className="text-sm font-semibold" style={{ color }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {checks.filter((c) => c.done).length}/{checks.length} sections complete
          </p>
        </div>
      </div>

      {/* Remaining items */}
      {remaining.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            To improve your score:
          </p>
          {remaining.slice(0, 4).map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <AlertCircle className="size-3.5 shrink-0" style={{ color: "var(--danger)" }} />
              {c.label}
            </div>
          ))}
          {remaining.length > 4 && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              +{remaining.length - 4} more
            </p>
          )}
        </div>
      )}

      {remaining.length === 0 && (
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--success)" }}>
          <CheckCircle2 className="size-3.5" /> All sections complete!
        </div>
      )}
    </div>
  );
}
