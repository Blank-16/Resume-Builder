import { formatMonthYear } from "@/utils/resume";
import type { TemplateProps } from "@/types";

// General template — inspired by the uploaded Blank_CV.docx.
// Single-column, left-aligned name in a blockquote-style header,
// bold section headings, bullet-point driven experience/projects.

export function GeneralTemplate({ resume }: TemplateProps) {
  const p     = resume.personalInfo;
  const color = resume.accentColor || "#1e40af";

  const clean = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, "");

  return (
    <article className="bg-white text-gray-900 font-sans text-[13px] leading-relaxed">
      <div className="max-w-4xl mx-auto px-10 py-8">

        {/* Header — blockquote style matching the docx */}
        <header className="mb-7 pl-4 border-l-4" style={{ borderColor: color }}>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color }}>
            {p.fullName || "Your Name"}
          </h1>
          {p.location && (
            <p className="text-sm text-gray-500 mb-2">{p.location}</p>
          )}
          <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-sm text-gray-700">
            {p.phone && (
              <span>
                <span className="mr-0.5">📱</span>
                <a href={`tel:${p.phone}`}>{p.phone}</a>
              </span>
            )}
            {p.email && (
              <span>
                <span className="mr-0.5">✉</span>
                <a href={`mailto:${p.email}`}>{p.email}</a>
              </span>
            )}
            {p.linkedin && (
              <span>
                <span className="mr-0.5">🔗</span>
                <a href={p.linkedin} target="_blank" rel="noreferrer"
                  className="underline" style={{ color }}>
                  {clean(p.linkedin)}
                </a>
              </span>
            )}
            {p.github && (
              <span>
                <span className="mr-0.5">🐙</span>
                <a href={p.github} target="_blank" rel="noreferrer"
                  className="underline" style={{ color }}>
                  {clean(p.github)}
                </a>
              </span>
            )}
            {p.website && (
              <span>
                <a href={p.website} target="_blank" rel="noreferrer"
                  className="underline" style={{ color }}>
                  {clean(p.website)}
                </a>
              </span>
            )}
          </div>
        </header>

        {/* Objective */}
        {resume.professionalSummary && (
          <section className="mb-6">
            <SectionHeading color={color}>Objective</SectionHeading>
            <p className="text-gray-700 leading-relaxed">{resume.professionalSummary}</p>
          </section>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <section className="mb-6">
            <SectionHeading color={color}>Education</SectionHeading>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold" style={{ color }}>
                    {edu.institution}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="italic text-gray-700">
                      {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                      {edu.gpa && ` | CGPA: ${edu.gpa}`}
                    </div>
                    {edu.graduationDate && (
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatMonthYear(edu.graduationDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills — structured with categories */}
        {resume.skills.length > 0 && (
          <section className="mb-6">
            <SectionHeading color={color}>Technical Skills</SectionHeading>
            <div className="text-sm text-gray-700">
              <span className="font-bold" style={{ color }}>Skills: </span>
              {resume.skills.join(", ")}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section className="mb-6">
            <SectionHeading color={color}>Projects</SectionHeading>
            <div className="space-y-4">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  {/* Title line */}
                  <div className="flex items-center gap-2 flex-wrap font-semibold">
                    <span style={{ color }}>{proj.name}</span>
                    {proj.technologies.length > 0 && (
                      <span className="font-normal text-gray-500 text-xs">
                        | {proj.technologies.join(", ")}
                      </span>
                    )}
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer"
                        className="font-semibold underline text-xs" style={{ color }}>
                        Live
                      </a>
                    )}
                  </div>
                  {/* Description as bullet lines */}
                  {proj.description && (
                    <ul className="mt-1 space-y-0.5 text-gray-700">
                      {proj.description.split("\n").filter(Boolean).map((line, i) => {
                        const text = line.replace(/^[•\-*]\s*/, "");
                        return (
                          <li key={i} className="flex gap-1.5">
                            <span className="shrink-0 mt-px">•</span>
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <section className="mb-6">
            <SectionHeading color={color}>Experience</SectionHeading>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <span className="font-bold" style={{ color }}>{exp.company}</span>
                      {exp.position && (
                        <span className="font-semibold text-gray-700"> | {exp.position}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {exp.isCurrent
                        ? `${formatMonthYear(exp.startDate)} – Present`
                        : `${formatMonthYear(exp.startDate)} – ${formatMonthYear(exp.endDate)}`}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-1 space-y-0.5 text-gray-700">
                      {exp.description.split("\n").filter(Boolean).map((line, i) => {
                        const text = line.replace(/^[•\-*]\s*/, "");
                        return (
                          <li key={i} className="flex gap-1.5">
                            <span className="shrink-0 mt-px">•</span>
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {resume.certifications.length > 0 && (
          <section className="mb-6">
            <SectionHeading color={color}>Certifications</SectionHeading>
            <ul className="space-y-1">
              {resume.certifications.map((cert) => (
                <li key={cert.id} className="flex justify-between items-start gap-2">
                  <div className="flex gap-1.5">
                    <span className="shrink-0 mt-px">•</span>
                    <span>
                      <span className="font-semibold">{cert.name}</span>
                      {cert.issuer && (
                        <span className="text-gray-600">
                          {" "}(
                          {cert.url
                            ? <a href={cert.url} target="_blank" rel="noreferrer"
                                className="underline" style={{ color }}>{cert.issuer}</a>
                            : cert.issuer}
                          )
                        </span>
                      )}
                    </span>
                  </div>
                  {cert.date && (
                    <span className="text-xs text-gray-500 shrink-0">{formatMonthYear(cert.date)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </article>
  );
}

// Shared section heading — bold, coloured underline matching the docx style
function SectionHeading({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <h2
      className="font-bold text-sm uppercase tracking-wide pb-1 mb-3"
      style={{ color, borderBottom: `1.5px solid ${color}` }}
    >
      {children}
    </h2>
  );
}
