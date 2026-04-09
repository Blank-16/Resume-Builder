import { formatMonthYear } from "@/utils/resume";
import type { TemplateProps } from "@/types";

export function MinimalTemplate({ resume }: TemplateProps) {
  const { personalInfo: p, accentColor: color } = resume;

  return (
    <article className="max-w-3xl mx-auto px-10 py-10 bg-white text-gray-800 text-[13px] font-sans leading-relaxed">
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
          {p.fullName || "Your Name"}
        </h1>
        <div className="h-px w-12 mb-3" style={{ backgroundColor: color }} />
        <address className="not-italic flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
          {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
          {p.phone && <a href={`tel:${p.phone}`}>{p.phone}</a>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noreferrer">
              {p.linkedin.replace(/^https?:\/\/(www\.)?/i, "")}
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer">
              {p.github.replace(/^https?:\/\/(www\.)?/i, "")}
            </a>
          )}
          {p.website && (
            <a href={p.website} target="_blank" rel="noreferrer">
              {p.website.replace(/^https?:\/\/(www\.)?/i, "")}
            </a>
          )}
        </address>
      </header>

      {resume.professionalSummary && (
        <section aria-labelledby="summary-min" className="mb-6">
          <h2 id="summary-min" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
            About
          </h2>
          <p className="text-gray-700">{resume.professionalSummary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section aria-labelledby="exp-min" className="mb-6">
          <h2 id="exp-min" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
            Experience
          </h2>
          <div className="space-y-5">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline flex-wrap gap-1 mb-0.5">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <time className="text-xs text-gray-400">
                    {formatMonthYear(exp.startDate)} – {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
                  </time>
                </div>
                <p className="text-xs text-gray-500 mb-1">{exp.company}</p>
                {exp.description && (
                  <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section aria-labelledby="edu-min" className="mb-6">
          <h2 id="edu-min" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                  <p className="text-xs text-gray-500">
                    {[edu.degree, edu.field].filter(Boolean).join(", ")}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-400">GPA {edu.gpa}</p>}
                </div>
                {edu.graduationDate && (
                  <time className="text-xs text-gray-400">{formatMonthYear(edu.graduationDate)}</time>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section aria-labelledby="proj-min" className="mb-6">
          <h2 id="proj-min" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs" style={{ color }}>
                      ↗
                    </a>
                  )}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-400 mb-0.5">{proj.technologies.join(", ")}</p>
                )}
                {proj.description && <p className="text-gray-700">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section aria-labelledby="cert-min" className="mb-6">
          <h2 id="cert-min" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
            Certifications
          </h2>
          <ul className="space-y-1">
            {resume.certifications.map((cert) => (
              <li key={cert.id} className="flex justify-between flex-wrap gap-1 text-xs">
                <span>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-500"> · {cert.issuer}</span>}
                </span>
                {cert.date && <time className="text-gray-400">{formatMonthYear(cert.date)}</time>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section aria-labelledby="skills-min">
          <h2 id="skills-min" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
            Skills
          </h2>
          <p className="text-gray-700 text-xs">{resume.skills.join("  ·  ")}</p>
        </section>
      )}
    </article>
  );
}
