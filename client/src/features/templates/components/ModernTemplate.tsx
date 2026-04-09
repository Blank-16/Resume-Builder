import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";
import { formatMonthYear } from "@/utils/resume";
import type { TemplateProps } from "@/types";

export function ModernTemplate({ resume }: TemplateProps) {
  const { personalInfo: p, accentColor: color } = resume;

  return (
    <article className="max-w-4xl mx-auto bg-white text-gray-800 text-[13px] flex min-h-full font-sans">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 text-white py-10 px-6 space-y-6" style={{ backgroundColor: color }}>
        <div>
          <h1 className="text-xl font-bold leading-tight">{p.fullName || "Your Name"}</h1>
        </div>

        <address className="not-italic space-y-2 text-xs opacity-90">
          {p.email && (
            <div className="flex items-start gap-2">
              <Mail className="size-3 mt-0.5 shrink-0" />
              <a href={`mailto:${p.email}`} className="break-all">{p.email}</a>
            </div>
          )}
          {p.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-3 shrink-0" />
              <a href={`tel:${p.phone}`}>{p.phone}</a>
            </div>
          )}
          {p.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-3 shrink-0" />
              <span>{p.location}</span>
            </div>
          )}
          {p.linkedin && (
            <div className="flex items-start gap-2">
              <Linkedin className="size-3 mt-0.5 shrink-0" />
              <a href={p.linkedin} target="_blank" rel="noreferrer" className="break-all">
                {p.linkedin.replace(/^https?:\/\/(www\.)?/i, "")}
              </a>
            </div>
          )}
          {p.github && (
            <div className="flex items-start gap-2">
              <Github className="size-3 mt-0.5 shrink-0" />
              <a href={p.github} target="_blank" rel="noreferrer" className="break-all">
                {p.github.replace(/^https?:\/\/(www\.)?/i, "")}
              </a>
            </div>
          )}
          {p.website && (
            <div className="flex items-start gap-2">
              <Globe className="size-3 mt-0.5 shrink-0" />
              <a href={p.website} target="_blank" rel="noreferrer" className="break-all">
                {p.website.replace(/^https?:\/\/(www\.)?/i, "")}
              </a>
            </div>
          )}
        </address>

        {resume.skills.length > 0 && (
          <section aria-labelledby="skills-modern">
            <h2 id="skills-modern" className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
              Skills
            </h2>
            <ul className="space-y-1">
              {resume.skills.map((skill, i) => (
                <li key={i} className="text-xs flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-white/60 shrink-0" aria-hidden />
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {resume.certifications.length > 0 && (
          <section aria-labelledby="cert-modern">
            <h2 id="cert-modern" className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
              Certifications
            </h2>
            <ul className="space-y-2">
              {resume.certifications.map((cert) => (
                <li key={cert.id} className="text-xs">
                  <p className="font-semibold">{cert.name}</p>
                  {cert.issuer && <p className="opacity-80">{cert.issuer}</p>}
                  {cert.date && <p className="opacity-60">{formatMonthYear(cert.date)}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 py-10 px-8 space-y-6">
        {resume.professionalSummary && (
          <section aria-labelledby="summary-modern">
            <h2 id="summary-modern" className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.professionalSummary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section aria-labelledby="exp-modern">
            <h2 id="exp-modern" className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
              Experience
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                    </div>
                    <time className="text-xs text-gray-400 shrink-0">
                      {formatMonthYear(exp.startDate)} – {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
                    </time>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 whitespace-pre-line text-xs mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.education.length > 0 && (
          <section aria-labelledby="edu-modern">
            <h2 id="edu-modern" className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
              Education
            </h2>
            <div className="space-y-3">
              {resume.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                    <p className="text-gray-600 text-xs">
                      {[edu.degree, edu.field].filter(Boolean).join(" · ")}
                    </p>
                    {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
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
          <section aria-labelledby="proj-modern">
            <h2 id="proj-modern" className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
              Projects
            </h2>
            <div className="space-y-3">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.type && <span className="text-xs text-gray-400">({proj.type})</span>}
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color }}>
                        View
                      </a>
                    )}
                  </div>
                  {proj.technologies.length > 0 && (
                    <p className="text-xs text-gray-400 mb-1">{proj.technologies.join(", ")}</p>
                  )}
                  {proj.description && <p className="text-xs text-gray-700">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </article>
  );
}
