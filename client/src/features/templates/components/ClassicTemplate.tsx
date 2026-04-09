import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";
import { formatMonthYear } from "@/utils/resume";
import type { TemplateProps } from "@/types";

export function ClassicTemplate({ resume }: TemplateProps) {
  const { personalInfo: p, accentColor: color } = resume;

  return (
    <article className="max-w-4xl mx-auto px-10 py-10 bg-white text-gray-800 leading-relaxed font-serif text-[13px]">
      {/* ATS: h1 for name */}
      <header className="mb-6 pb-5 border-b-2" style={{ borderColor: color }}>
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color }}>
          {p.fullName || "Your Name"}
        </h1>
        <address className="not-italic flex flex-wrap gap-x-5 gap-y-1 text-gray-600 text-xs">
          {p.email && (
            <span className="flex items-center gap-1">
              <Mail className="size-3" aria-hidden />
              <a href={`mailto:${p.email}`}>{p.email}</a>
            </span>
          )}
          {p.phone && (
            <span className="flex items-center gap-1">
              <Phone className="size-3" aria-hidden />
              <a href={`tel:${p.phone}`}>{p.phone}</a>
            </span>
          )}
          {p.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {p.location}
            </span>
          )}
          {p.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="size-3" aria-hidden />
              <a href={p.linkedin} target="_blank" rel="noreferrer">{p.linkedin.replace(/^https?:\/\/(www\.)?/i, "")}</a>
            </span>
          )}
          {p.github && (
            <span className="flex items-center gap-1">
              <Github className="size-3" aria-hidden />
              <a href={p.github} target="_blank" rel="noreferrer">{p.github.replace(/^https?:\/\/(www\.)?/i, "")}</a>
            </span>
          )}
          {p.website && (
            <span className="flex items-center gap-1">
              <Globe className="size-3" aria-hidden />
              <a href={p.website} target="_blank" rel="noreferrer">{p.website.replace(/^https?:\/\/(www\.)?/i, "")}</a>
            </span>
          )}
        </address>
      </header>

      {resume.professionalSummary && (
        <section aria-labelledby="summary-heading" className="mb-5">
          <h2 id="summary-heading" className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resume.professionalSummary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section aria-labelledby="exp-heading" className="mb-5">
          <h2 id="exp-heading" className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="pl-3 border-l-2" style={{ borderColor: color }}>
                <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="font-semibold text-gray-700">{exp.company}</p>
                  </div>
                  <time className="text-xs text-gray-500 shrink-0">
                    {formatMonthYear(exp.startDate)} – {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
                  </time>
                </div>
                {exp.description && (
                  <p className="text-gray-700 whitespace-pre-line mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section aria-labelledby="edu-heading" className="mb-5">
          <h2 id="edu-heading" className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-700">{[edu.degree, edu.field].filter(Boolean).join(" · ")}</p>
                  {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                {edu.graduationDate && (
                  <time className="text-xs text-gray-500 shrink-0">
                    {formatMonthYear(edu.graduationDate)}
                  </time>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section aria-labelledby="proj-heading" className="mb-5">
          <h2 id="proj-heading" className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
            Projects
          </h2>
          <div className="space-y-3">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  {proj.type && <span className="text-xs text-gray-500">({proj.type})</span>}
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color }}>
                      Link
                    </a>
                  )}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 mb-1">{proj.technologies.join(", ")}</p>
                )}
                {proj.description && <p className="text-gray-700">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section aria-labelledby="cert-heading" className="mb-5">
          <h2 id="cert-heading" className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
            Certifications
          </h2>
          <ul className="space-y-1">
            {resume.certifications.map((cert) => (
              <li key={cert.id} className="flex justify-between flex-wrap gap-1">
                <span>
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-600"> · {cert.issuer}</span>}
                </span>
                {cert.date && <time className="text-xs text-gray-500">{formatMonthYear(cert.date)}</time>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>
            Skills
          </h2>
          <p className="text-gray-700">{resume.skills.join(" · ")}</p>
        </section>
      )}
    </article>
  );
}
