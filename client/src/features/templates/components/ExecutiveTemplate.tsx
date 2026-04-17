import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { formatMonthYear } from "@/utils/resume";
import type { TemplateProps } from "@/types";

export function ExecutiveTemplate({ resume }: TemplateProps) {
  const { personalInfo: p, accentColor: color } = resume;

  return (
    <article className="max-w-4xl mx-auto bg-white text-gray-900 text-[13px] font-sans">
      {/* Top band */}
      <header className="px-10 pt-10 pb-6" style={{ borderBottom: `4px solid ${color}` }}>
        <h1 className="text-4xl font-black tracking-tight uppercase text-gray-900 mb-1">
          {p.fullName || "Your Name"}
        </h1>
        <address className="not-italic flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500 mt-3">
          {p.email && (
            <span className="flex items-center gap-1">
              <Mail className="size-3" />
              <a href={`mailto:${p.email}`}>{p.email}</a>
            </span>
          )}
          {p.phone && (
            <span className="flex items-center gap-1">
              <Phone className="size-3" />
              <a href={`tel:${p.phone}`}>{p.phone}</a>
            </span>
          )}
          {p.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {p.location}
            </span>
          )}
          {p.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="size-3" />
              <a href={p.linkedin} target="_blank" rel="noreferrer">
                {p.linkedin.replace(/^https?:\/\/(www\.)?/i, "")}
              </a>
            </span>
          )}
          {p.github && (
            <span className="flex items-center gap-1">
              <Github className="size-3" />
              <a href={p.github} target="_blank" rel="noreferrer">
                {p.github.replace(/^https?:\/\/(www\.)?/i, "")}
              </a>
            </span>
          )}
          {p.website && (
            <span className="flex items-center gap-1">
              <Globe className="size-3" />
              <a href={p.website} target="_blank" rel="noreferrer">
                {p.website.replace(/^https?:\/\/(www\.)?/i, "")}
              </a>
            </span>
          )}
        </address>
      </header>

      <div className="px-10 py-8 space-y-6">
        {resume.professionalSummary && (
          <section aria-labelledby="summary-exec">
            <h2
              id="summary-exec"
              className="text-xs font-black uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ color, borderColor: color }}
            >
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.professionalSummary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section aria-labelledby="exp-exec">
            <h2
              id="exp-exec"
              className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b"
              style={{ color, borderColor: color }}
            >
              Professional Experience
            </h2>
            <div className="space-y-5">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-[1fr_auto] gap-x-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                    <p className="font-semibold text-gray-600">{exp.company}</p>
                    {exp.description && (
                      <p className="text-gray-700 whitespace-pre-line mt-1.5 text-xs leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-gray-400 text-right shrink-0 pt-0.5">
                    {formatMonthYear(exp.startDate)}
                    <br />
                    {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
                  </time>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {resume.education.length > 0 && (
            <section aria-labelledby="edu-exec">
              <h2
                id="edu-exec"
                className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b"
                style={{ color, borderColor: color }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                    <p className="text-xs text-gray-600">
                      {[edu.degree, edu.field].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {edu.graduationDate && formatMonthYear(edu.graduationDate)}
                      {edu.gpa && ` · GPA ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.skills.length > 0 && (
            <section aria-labelledby="skills-exec">
              <h2
                id="skills-exec"
                className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b"
                style={{ color, borderColor: color }}
              >
                Core Competencies
              </h2>
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                {resume.skills.map((skill, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-center gap-1">
                    <span className="size-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {resume.projects.length > 0 && (
          <section aria-labelledby="proj-exec">
            <h2
              id="proj-exec"
              className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b"
              style={{ color, borderColor: color }}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.type && <span className="text-xs text-gray-400">({proj.type})</span>}
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color }}>
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.technologies.length > 0 && (
                    <p className="text-xs text-gray-400 mb-0.5">{proj.technologies.join(", ")}</p>
                  )}
                  {proj.description && <p className="text-xs text-gray-700">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.certifications.length > 0 && (
          <section aria-labelledby="cert-exec">
            <h2
              id="cert-exec"
              className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b"
              style={{ color, borderColor: color }}
            >
              Certifications
            </h2>
            <ul className="space-y-1">
              {resume.certifications.map((cert) => (
                <li key={cert.id} className="flex justify-between flex-wrap gap-1 text-xs">
                  <span>
                    <span className="font-semibold">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-500"> · {cert.issuer}</span>}
                  </span>
                  {cert.date && <time className="text-gray-400">{formatMonthYear(cert.date)}</time>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
