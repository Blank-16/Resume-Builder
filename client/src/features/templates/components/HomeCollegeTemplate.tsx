import { formatMonthYear } from "@/utils/resume";
import type { TemplateProps } from "@/types";

// College/campus recruitment style — clean blue-and-white,
// section headers with bottom border, left-aligned two-column contact row.
// Mirrors the uploaded React component exactly.

export function HomeCollegeTemplate({ resume }: TemplateProps) {
  const p     = resume.personalInfo;
  const color = resume.accentColor || "#1e3a8a"; // blue-900 default

  const clean = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, "");

  return (
    <article className="bg-white text-gray-800 font-sans text-[13px] leading-relaxed">
      <div className="max-w-4xl mx-auto p-8">

        {/* Top border */}
        <div className="h-1 bg-black mb-6" />

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2 tracking-tight" style={{ color }}>
            {p.fullName || "Your Name"}
          </h1>
          <div className="flex justify-between items-start text-sm">
            <div className="space-y-0.5">
              {p.linkedin && (
                <div>
                  <span className="font-semibold">LinkedIn: </span>
                  <a href={p.linkedin} target="_blank" rel="noreferrer"
                    className="underline" style={{ color: "#1d4ed8" }}>
                    {clean(p.linkedin)}
                  </a>
                </div>
              )}
              {p.github && (
                <div>
                  <span className="font-semibold">Github: </span>
                  <a href={p.github} target="_blank" rel="noreferrer"
                    className="underline" style={{ color: "#1d4ed8" }}>
                    {clean(p.github)}
                  </a>
                </div>
              )}
              {p.website && (
                <div>
                  <span className="font-semibold">Website: </span>
                  <a href={p.website} target="_blank" rel="noreferrer"
                    className="underline" style={{ color: "#1d4ed8" }}>
                    {clean(p.website)}
                  </a>
                </div>
              )}
            </div>
            <div className="text-right space-y-0.5">
              {p.email && (
                <div>
                  <span className="font-semibold">Email: </span>
                  {p.email}
                </div>
              )}
              {p.phone && (
                <div>
                  <span className="font-semibold">Mobile: </span>
                  {p.phone}
                </div>
              )}
              {p.location && (
                <div>
                  <span className="font-semibold">Location: </span>
                  {p.location}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Objective / Summary */}
        {resume.professionalSummary && (
          <section className="mb-6">
            <h2 className="border-b border-black pb-1 mb-3 font-bold text-sm uppercase tracking-wide"
              style={{ color }}>
              OBJECTIVE
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {resume.professionalSummary}
            </p>
          </section>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="border-b border-black pb-1 mb-3 font-bold text-sm uppercase tracking-wide"
              style={{ color }}>
              SKILLS
            </h2>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="font-semibold" style={{ color: "#1d4ed8" }}>Skills: </span>
                {resume.skills.join(", ")}
              </li>
            </ul>
          </section>
        )}

        {/* Experience / Internship */}
        {resume.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="border-b border-black pb-1 mb-3 font-bold text-sm uppercase tracking-wide"
              style={{ color }}>
              INTERNSHIP
            </h2>
            <div className="space-y-4 text-sm">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-semibold underline" style={{ color: "#1d4ed8" }}>
                        {exp.company}
                      </span>
                      {exp.position && (
                        <span className="text-gray-700"> — {exp.position}</span>
                      )}
                    </div>
                    <div className="text-right text-gray-600 shrink-0">
                      {exp.isCurrent
                        ? `Since ${formatMonthYear(exp.startDate)}`
                        : `${formatMonthYear(exp.startDate)} – ${formatMonthYear(exp.endDate)}`}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="ml-4 text-gray-700 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="border-b border-black pb-1 mb-3 font-bold text-sm uppercase tracking-wide"
              style={{ color }}>
              PROJECTS
            </h2>
            <div className="space-y-4 text-sm">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold underline" style={{ color: "#1d4ed8" }}>
                        {proj.name}
                      </span>
                      {proj.type && (
                        <span className="text-gray-600">— {proj.type}</span>
                      )}
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer"
                          className="underline text-xs" style={{ color: "#1d4ed8" }}>
                          Link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 space-y-1">
                    {proj.technologies.length > 0 && (
                      <div>
                        <span className="font-semibold">Tech: </span>
                        {proj.technologies.join(", ")}
                      </div>
                    )}
                    {proj.description && (
                      <div className="text-gray-700 whitespace-pre-line">{proj.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="border-b border-black pb-1 mb-3 font-bold text-sm uppercase tracking-wide"
              style={{ color }}>
              CERTIFICATES
            </h2>
            <ul className="space-y-1 text-sm">
              {resume.certifications.map((cert) => (
                <li key={cert.id} className="flex justify-between">
                  <span>
                    <span className="font-semibold">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-600"> by {cert.issuer}</span>}
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noreferrer"
                        className="ml-1 underline" style={{ color: "#1d4ed8" }}>
                        View
                      </a>
                    )}
                  </span>
                  {cert.date && (
                    <span className="text-gray-500 shrink-0">{formatMonthYear(cert.date)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <section className="mb-6">
            <h2 className="border-b border-black pb-1 mb-3 font-bold text-sm uppercase tracking-wide"
              style={{ color }}>
              EDUCATION
            </h2>
            <div className="space-y-3 text-sm">
              {resume.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold" style={{ color: "#1d4ed8" }}>
                      {edu.institution}
                    </div>
                    <div className="italic text-gray-700">
                      {[edu.degree, edu.field].filter(Boolean).join(" — ")}
                      {edu.gpa && `, CGPA: ${edu.gpa}`}
                    </div>
                  </div>
                  {edu.graduationDate && (
                    <div className="text-right text-gray-600 shrink-0">
                      <div className="italic">{formatMonthYear(edu.graduationDate)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
}
