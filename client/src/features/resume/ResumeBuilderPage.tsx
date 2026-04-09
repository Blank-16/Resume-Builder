import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Briefcase, Download, Eye, EyeOff, FileText,
  FolderOpen, GraduationCap, Save, Share2, Sparkles, User,
  Award, ChevronLeft, ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useResumeBuilder }  from "@/features/resume/hooks/useResumeBuilder";
import { PersonalInfoForm }  from "@/features/resume/components/PersonalInfoForm";
import { SummaryForm }       from "@/features/resume/components/SummaryForm";
import { ExperienceForm }    from "@/features/resume/components/ExperienceForm";
import { EducationForm }     from "@/features/resume/components/EducationForm";
import { ProjectForm }       from "@/features/resume/components/ProjectForm";
import { SkillsForm }        from "@/features/resume/components/SkillsForm";
import { CertificationForm } from "@/features/resume/components/CertificationForm";
import { TemplateSelector }  from "@/features/resume/components/TemplateSelector";
import { ColorPicker }       from "@/features/resume/components/ColorPicker";
import { ResumePreview }     from "@/features/resume/components/ResumePreview";
import toast from "react-hot-toast";

interface Section { id: string; label: string; icon: LucideIcon; }

const SECTIONS: Section[] = [
  { id: "personal",       label: "Personal",   icon: User },
  { id: "summary",        label: "Summary",    icon: FileText },
  { id: "experience",     label: "Experience", icon: Briefcase },
  { id: "education",      label: "Education",  icon: GraduationCap },
  { id: "projects",       label: "Projects",   icon: FolderOpen },
  { id: "certifications", label: "Certs",      icon: Award },
  { id: "skills",         label: "Skills",     icon: Sparkles },
];

export function ResumeBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { resume, updateField, save, isSaving, isLoading, toggleVisibility } =
    useResumeBuilder({ resumeId: id ?? "" });
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const progress = ((activeIdx + 1) / SECTIONS.length) * 100;
  const active   = SECTIONS[activeIdx];

  function handleShare() {
    const url = `${window.location.origin}/preview/${id}`;
    if (navigator.share) void navigator.share({ url, title: resume.title });
    else { void navigator.clipboard.writeText(url); toast.success("Link copied"); }
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-sm"
        style={{ background: "var(--bg)", color: "var(--text-muted)" }}
      >
        <span className="spinner mr-2" /> Loading resume…
      </div>
    );
  }

  return (
    <div className="min-h-screen print:bg-white" style={{ background: "var(--bg-subtle)" }}>

      {/* ── Sticky top bar ── */}
      <header
        className="print:hidden anim-slide-left"
        style={{
          background:     "var(--surface)",
          borderBottom:   "1px solid var(--border)",
          padding:        "0 1.25rem",
          height:         "52px",
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
            to="/dashboard"
            className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            <ArrowLeft className="size-3.5" /> Dashboard
          </Link>
          <span style={{ color: "var(--border-strong)" }}>|</span>
          <input
            type="text"
            aria-label="Resume title"
            value={resume.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="text-sm font-semibold bg-transparent border-none outline-none w-48 truncate"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex items-center gap-2">
          {resume.isPublic && (
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5"
            >
              <Share2 className="size-3.5" /> Share
            </button>
          )}
          <button
            type="button"
            onClick={() => void toggleVisibility()}
            className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            {resume.isPublic
              ? <><Eye className="size-3.5" /> Public</>
              : <><EyeOff className="size-3.5" /> Private</>}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            <Download className="size-3.5" /> PDF
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() =>
              void toast.promise(save(), {
                loading: "Saving…",
                success: "Saved!",
                error: "Failed to save",
              })
            }
            className="btn btn-primary flex items-center gap-1.5 text-xs px-4 py-1.5"
          >
            {isSaving ? <span className="spinner" /> : <Save className="size-3.5" />}
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-5 grid lg:grid-cols-[460px_1fr] gap-5 print:block">

        {/* ── Left: editor panel ── */}
        <div className="print:hidden space-y-4">

          {/* Section editor card */}
          <div
            className="overflow-hidden"
            style={{
              background:   "var(--surface)",
              border:       "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              boxShadow:    "var(--shadow-sm)",
            }}
          >
            {/* Progress bar */}
            <div className="h-0.5" style={{ background: "var(--border)" }}>
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "var(--accent)" }}
              />
            </div>

            {/* Section tabs */}
            <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid var(--border)" }}>
              {SECTIONS.map((sec, i) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    data-active={activeIdx === i ? "true" : "false"}
                    onClick={() => setActiveIdx(i)}
                    className="section-tab"
                  >
                    <Icon className="size-3.5" />
                    {sec.label}
                  </button>
                );
              })}
            </div>

            {/* Active form */}
            <div className="p-5">
              {active?.id === "personal"       && <PersonalInfoForm  data={resume.personalInfo}        onChange={(v) => updateField("personalInfo", v)} />}
              {active?.id === "summary"        && <SummaryForm       data={resume.professionalSummary} onChange={(v) => updateField("professionalSummary", v)} />}
              {active?.id === "experience"     && <ExperienceForm    data={resume.experience}          onChange={(v) => updateField("experience", v)} />}
              {active?.id === "education"      && <EducationForm     data={resume.education}           onChange={(v) => updateField("education", v)} />}
              {active?.id === "projects"       && <ProjectForm       data={resume.projects}            onChange={(v) => updateField("projects", v)} />}
              {active?.id === "certifications" && <CertificationForm data={resume.certifications}      onChange={(v) => updateField("certifications", v)} />}
              {active?.id === "skills"         && <SkillsForm        data={resume.skills}              onChange={(v) => updateField("skills", v)} />}
            </div>

            {/* Prev / Next footer */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}
            >
              <button
                type="button"
                disabled={activeIdx === 0}
                onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
                className="btn btn-ghost flex items-center gap-1 text-xs px-3 py-1.5"
              >
                <ChevronLeft className="size-4" /> Prev
              </button>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {activeIdx + 1} / {SECTIONS.length}
              </span>
              <button
                type="button"
                disabled={activeIdx === SECTIONS.length - 1}
                onClick={() => setActiveIdx((i) => Math.min(i + 1, SECTIONS.length - 1))}
                className="btn btn-ghost flex items-center gap-1 text-xs px-3 py-1.5"
              >
                Next <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Style settings accordion */}
          <div
            className="overflow-hidden"
            style={{
              background:   "var(--surface)",
              border:       "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              boxShadow:    "var(--shadow-sm)",
            }}
          >
            {/* settings-btn class handles hover via CSS */}
            <button
              type="button"
              onClick={() => setShowSettings((s) => !s)}
              className="settings-btn w-full flex items-center justify-between px-5 py-3 text-sm font-medium"
              style={{ color: "var(--text-primary)", background: "transparent" }}
            >
              Style Settings
              <ChevronRight
                className="size-4 transition-transform"
                style={{
                  color:     "var(--text-muted)",
                  transform: showSettings ? "rotate(90deg)" : "none",
                }}
              />
            </button>
            {showSettings && (
              <div
                className="px-5 pb-5 space-y-5"
                style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}
              >
                <TemplateSelector
                  selected={resume.template}
                  onChange={(v) => updateField("template", v)}
                />
                <ColorPicker
                  value={resume.accentColor}
                  onChange={(v) => updateField("accentColor", v)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Right: live preview ── */}
        <div className="lg:sticky lg:top-[60px] self-start">
          <div
            className="origin-top-left print:transform-none print:w-auto"
            style={{ transform: "scale(0.74)", width: "135.1%" }}
          >
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
