import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Briefcase, Download, Eye, EyeOff, FileText,
  FolderOpen, GraduationCap, Save, Share2, Sparkles, User,
  Award, ChevronLeft, ChevronRight, Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useResumeBuilder }       from "@/features/resume/hooks/useResumeBuilder";
import { PersonalInfoForm }        from "@/features/resume/components/PersonalInfoForm";
import { SummaryForm }             from "@/features/resume/components/SummaryForm";
import { ExperienceForm }          from "@/features/resume/components/ExperienceForm";
import { EducationForm }           from "@/features/resume/components/EducationForm";
import { ProjectForm }             from "@/features/resume/components/ProjectForm";
import { SkillsForm }              from "@/features/resume/components/SkillsForm";
import { CertificationForm }       from "@/features/resume/components/CertificationForm";
import { TemplateSelector }        from "@/features/resume/components/TemplateSelector";
import { ColorPicker }             from "@/features/resume/components/ColorPicker";
import { ResumePreview }           from "@/features/resume/components/ResumePreview";
import { CompletionScore }         from "@/features/resume/components/CompletionScore";
import { ATSScorePanel }           from "@/features/resume/components/ATSScorePanel";
import { VersionHistoryDrawer }    from "@/features/resume/components/VersionHistoryDrawer";
import toast from "react-hot-toast";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

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

// Mobile tab options
type MobileTab = "editor" | "preview";

export function ResumeBuilderPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { resume, updateField, save, isSaving, isLoading, isDirty, toggleVisibility } =
    useResumeBuilder({ resumeId: id ?? "" });

  const [activeIdx,    setActiveIdx]    = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [mobileTab,    setMobileTab]    = useState<MobileTab>("editor");

  useEffect(() => {
    if (!id) navigate("/dashboard", { replace: true });
  }, [id, navigate]);

  const progress = ((activeIdx + 1) / SECTIONS.length) * 100;
  const active   = SECTIONS[activeIdx];

  function handleShare() {
    const url = `${window.location.origin}/preview/${id}`;
    if (navigator.share) void navigator.share({ url, title: resume.title });
    else { void navigator.clipboard.writeText(url); toast.success("Link copied"); }
  }

  if (!id) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm"
        style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
        <span className="spinner mr-2" /> Loading resume…
      </div>
    );
  }

  const editorPanel = (
    <div className="space-y-4">
      {/* Section editor card */}
      <div className="overflow-hidden" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)",
      }}>
        {/* Progress */}
        <div className="h-0.5" style={{ background: "var(--border)" }}>
          <div className="h-full progress-fill"
            style={{ width: `${progress}%`, background: "var(--accent)" }} />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid var(--border)" }}>
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <button key={sec.id} type="button"
                data-active={activeIdx === i ? "true" : "false"}
                onClick={() => setActiveIdx(i)}
                className="section-tab">
                <Icon className="size-3.5" />{sec.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="p-5">
          {active?.id === "personal"       && <PersonalInfoForm  data={resume.personalInfo}        onChange={(v) => updateField("personalInfo", v)} />}
          {active?.id === "summary"        && <SummaryForm       data={resume.professionalSummary} onChange={(v) => updateField("professionalSummary", v)} experience={resume.experience} skills={resume.skills} />}
          {active?.id === "experience"     && <ExperienceForm    data={resume.experience}          onChange={(v) => updateField("experience", v)} />}
          {active?.id === "education"      && <EducationForm     data={resume.education}           onChange={(v) => updateField("education", v)} />}
          {active?.id === "projects"       && <ProjectForm       data={resume.projects}            onChange={(v) => updateField("projects", v)} />}
          {active?.id === "certifications" && <CertificationForm data={resume.certifications}      onChange={(v) => updateField("certifications", v)} />}
          {active?.id === "skills"         && <SkillsForm        data={resume.skills}              onChange={(v) => updateField("skills", v)} />}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
          <button type="button" disabled={activeIdx === 0}
            onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
            className="btn btn-ghost flex items-center gap-1 text-xs px-3 py-1.5">
            <ChevronLeft className="size-4" /> Prev
          </button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {activeIdx + 1} / {SECTIONS.length}
          </span>
          <button type="button" disabled={activeIdx === SECTIONS.length - 1}
            onClick={() => setActiveIdx((i) => Math.min(i + 1, SECTIONS.length - 1))}
            className="btn btn-ghost flex items-center gap-1 text-xs px-3 py-1.5">
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Completion score */}
      <div className="overflow-hidden" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", padding: "1.25rem",
      }}>
        <CompletionScore resume={resume} />
      </div>

      {/* ATS score panel */}
      <ATSScorePanel resume={resume} />

      {/* Style settings */}
      <div className="overflow-hidden" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)",
      }}>
        <button type="button" onClick={() => setShowSettings((s) => !s)}
          className="settings-btn w-full flex items-center justify-between px-5 py-3 text-sm font-medium"
          style={{ color: "var(--text-primary)", background: "transparent" }}>
          Style Settings
          <ChevronRight className="size-4 accordion-chevron"
            data-open={showSettings ? "true" : "false"}
            style={{ color: "var(--text-muted)" }} />
        </button>
        {showSettings && (
          <div className="px-5 pb-5 space-y-5 accordion-body"
            style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <TemplateSelector
              selected={resume.template}
              onChange={(v) => updateField("template", v)}
              resume={resume}
            />
            <ColorPicker value={resume.accentColor} onChange={(v) => updateField("accentColor", v)} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen print:bg-white page-enter" style={{ background: "var(--bg-subtle)" }}>

      {/* Version history drawer */}
      {showVersions && (
        <VersionHistoryDrawer
          resume={resume}
          onClose={() => setShowVersions(false)}
          onRestore={(r) => { updateField("template", r.template); /* full restore via reload */ window.location.reload(); }}
        />
      )}

      {/* Top bar */}
      <header className="print:hidden" style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "0 1.25rem", height: "52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/dashboard" className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5 shrink-0">
            <ArrowLeft className="size-3.5" /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="hidden sm:inline" style={{ color: "var(--border-strong)" }}>|</span>
          <input type="text" aria-label="Resume title" value={resume.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="text-sm font-semibold bg-transparent border-none outline-none min-w-0 truncate"
            style={{ color: "var(--text-primary)", width: "140px" }} />
          {isDirty && (
            <span className="text-xs shrink-0 hidden sm:inline flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <span style={{
                display: "inline-block",
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: "var(--warning)",
                animation: "pulse-ring 1.5s ease infinite",
              }} />
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeSwitcher />
          <button type="button" onClick={() => setShowVersions(true)}
            title="Version history"
            className="btn btn-surface p-2">
            <Clock className="size-4" />
          </button>
          {resume.isPublic && (
            <button type="button" onClick={handleShare}
              className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5 hidden sm:flex">
              <Share2 className="size-3.5" /> Share
            </button>
          )}
          <button type="button" onClick={() => void toggleVisibility()}
            className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5 hidden sm:flex">
            {resume.isPublic ? <><Eye className="size-3.5" /> Public</> : <><EyeOff className="size-3.5" /> Private</>}
          </button>
          <button type="button" onClick={() => window.print()}
            className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5">
            <Download className="size-3.5" /> <span className="hidden sm:inline">PDF</span>
          </button>
          <button type="button" disabled={isSaving}
            onClick={() => void toast.promise(save(), { loading: "Saving…", success: "Saved!", error: "Failed to save" })}
            className="btn btn-primary flex items-center gap-1.5 text-xs px-4 py-1.5">
            {isSaving ? <span className="spinner" /> : <Save className="size-3.5" />}
            <span className="hidden sm:inline">{isSaving ? "Saving…" : "Save"}</span>
          </button>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="lg:hidden print:hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="tab-bar">
          <button type="button" data-active={mobileTab === "editor" ? "true" : "false"}
            onClick={() => setMobileTab("editor")} className="tab-bar-item">
            Edit
          </button>
          <button type="button" data-active={mobileTab === "preview" ? "true" : "false"}
            onClick={() => setMobileTab("preview")} className="tab-bar-item">
            Preview
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-5 print:block lg:grid lg:grid-cols-[460px_1fr] lg:gap-5">

        {/* Editor — shown on desktop always, on mobile only when tab=editor */}
        <div className={`print:hidden space-y-4 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}>
          {editorPanel}
        </div>

        {/* Preview — shown on desktop always, on mobile only when tab=preview */}
        <div className={`lg:sticky lg:top-[60px] self-start ${mobileTab === "editor" ? "hidden lg:block" : ""}`}>
          {/* Desktop: scaled preview */}
          <div className="hidden lg:block origin-top-left print:transform-none print:w-auto"
            style={{ transform: "scale(0.74)", width: "135.1%" }}>
            <ResumePreview resume={resume} />
          </div>
          {/* Mobile: full-width preview */}
          <div className="lg:hidden">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
