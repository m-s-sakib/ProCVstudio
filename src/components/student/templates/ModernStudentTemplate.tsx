/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudentCVData } from '../../../types/studentCv';
import { mailtoHref, telHref, normalizeUrl, formatUrlLabel } from '../../../utils/links';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, GraduationCap, Wrench, FolderGit2, Briefcase, Award, Users, Globe2, BookOpen } from 'lucide-react';

interface TemplateProps {
  cv: StudentCVData;
}

export const ModernStudentTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, objective, education, skills, projects, experience, certifications, extracurricular, languages, showReferences, references, customization } = cv;
  const accent = customization?.accentColor || '#1d4ed8';

  const hasSkills =
    skills.technical.length > 0 ||
    skills.computer.length > 0 ||
    skills.communication.length > 0 ||
    skills.other.length > 0;

  return (
    <div className="font-modern text-slate-800 text-[12px] leading-relaxed p-8 sm:p-11 bg-white min-h-[1050px]">
      {/* Top Accent Strip */}
      <div style={{ backgroundColor: accent }} className="h-2 -mt-8 sm:-mt-11 -mx-8 sm:-mx-11 mb-6" />

      {/* Modern Header */}
      <header className="pb-4 mb-4 border-b border-slate-200 cv-item-avoid-break">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 style={{ color: accent }} className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {personal.fullName || 'Tanvir Ahmed'}
            </h1>
            <p className="text-xs font-semibold text-slate-600 mt-0.5 tracking-wide uppercase">
              Student / Entry-Level Candidate
            </p>

            {(personal.city || personal.country) && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{[personal.city, personal.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>

          {personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName || 'Student'}
              className="w-20 h-20 rounded-xl object-cover border-2 border-slate-200 shadow-2xs shrink-0"
            />
          )}
        </div>

        {/* Contact links bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600 mt-3 pt-2.5 border-t border-slate-100">
          {personal.email && (
            <a href={mailtoHref(personal.email)} className="inline-flex items-center gap-1 hover:text-blue-700">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={telHref(personal.phone)} className="inline-flex items-center gap-1 hover:text-blue-700">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.linkedin && (
            <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-blue-700">
              <Linkedin className="w-3 h-3 text-[#0077b5] shrink-0" />
              <span className="underline decoration-slate-300">{formatUrlLabel(personal.linkedin, 'LinkedIn')}</span>
            </a>
          )}
          {personal.github && (
            <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-blue-700">
              <Github className="w-3 h-3 text-slate-800 shrink-0" />
              <span className="underline decoration-slate-300">{formatUrlLabel(personal.github, 'GitHub')}</span>
            </a>
          )}
          {personal.website && (
            <a href={normalizeUrl(personal.website)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-blue-700">
              <Globe className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="underline decoration-slate-300">{formatUrlLabel(personal.website, 'Portfolio')}</span>
            </a>
          )}
        </div>
      </header>

      {/* Career Objective */}
      {objective && objective.trim() && (
        <section className="mb-4 cv-item-avoid-break" data-cv-item="true">
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            <BookOpen style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Career Objective
            </h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11.5px] bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 cv-paragraph">
            {objective}
          </p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-1.5 pb-1 mb-2 border-b border-slate-200 cv-heading">
            <GraduationCap style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Education
            </h2>
          </div>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break pl-2.5 border-l-2 border-blue-200">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-slate-900 text-[12.5px]">
                    {edu.degree}
                    {edu.department && (
                      <span className="font-semibold text-slate-700"> — {edu.department}</span>
                    )}
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-600">
                    {[edu.startYear, edu.graduationYear].filter(Boolean).join(' – ')}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 mt-0.5">
                  <span className="font-medium text-slate-800">{edu.institution}</span>
                  <div className="flex items-center gap-2">
                    {edu.currentYearSemester && (
                      <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[10.5px]">
                        {edu.currentYearSemester}
                      </span>
                    )}
                    {edu.gpa && (
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10.5px]">
                        {edu.gpa.toLowerCase().includes('gpa') ? edu.gpa : `CGPA: ${edu.gpa}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="mb-4 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            <Wrench style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Skills &amp; Competencies
            </h2>
          </div>
          <div className="space-y-2 text-[11px]">
            {skills.technical.length > 0 && (
              <div data-cv-subitem="true" className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 cv-item-avoid-break">
                <span className="font-bold text-slate-900 mr-2">Technical Skills:</span>
                <span className="text-slate-700">{skills.technical.join('  •  ')}</span>
              </div>
            )}
            {skills.computer.length > 0 && (
              <div data-cv-subitem="true" className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 cv-item-avoid-break">
                <span className="font-bold text-slate-900 mr-2">Computer &amp; Software Tools:</span>
                <span className="text-slate-700">{skills.computer.join('  •  ')}</span>
              </div>
            )}
            {skills.communication.length > 0 && (
              <div data-cv-subitem="true" className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 cv-item-avoid-break">
                <span className="font-bold text-slate-900 mr-2">Communication:</span>
                <span className="text-slate-700">{skills.communication.join('  •  ')}</span>
              </div>
            )}
            {skills.other.length > 0 && (
              <div data-cv-subitem="true" className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 cv-item-avoid-break">
                <span className="font-bold text-slate-900 mr-2">Interpersonal &amp; Other:</span>
                <span className="text-slate-700">{skills.other.join('  •  ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-1.5 pb-1 mb-2 border-b border-slate-200 cv-heading">
            <FolderGit2 style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Projects
            </h2>
          </div>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-slate-900 text-[12px] flex items-center gap-2">
                    <span>{proj.name}</span>
                    {proj.projectUrl && (
                      <a
                        href={normalizeUrl(proj.projectUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-700 hover:underline font-semibold"
                      >
                        [Live App]
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={normalizeUrl(proj.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-700 hover:underline font-semibold"
                      >
                        [Code Repo]
                      </a>
                    )}
                  </div>
                </div>
                {proj.technologies && (
                  <div className="text-[10.5px] text-blue-900 font-medium mt-0.5">
                    Stack: {proj.technologies}
                  </div>
                )}
                {proj.description && (
                  <p className="text-slate-700 text-[11px] leading-relaxed mt-1 cv-paragraph">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience or Internship (Optional) */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-1.5 pb-1 mb-2 border-b border-slate-200 cv-heading">
            <Briefcase style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Internship &amp; Work Experience
            </h2>
          </div>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-slate-900 text-[12px]">
                    {exp.jobTitle}
                    <span className="font-semibold text-blue-900"> — {exp.company}</span>
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-600">
                    {exp.duration}
                  </div>
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc ml-4 mt-1 space-y-0.5 text-slate-700 text-[11px] leading-relaxed">
                    {exp.responsibilities.filter((r) => r.trim()).map((resp, i) => (
                      <li key={i} className="cv-item-avoid-break">{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications and Achievements (Optional) */}
      {certifications && certifications.length > 0 && (
        <section className="mb-4 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            <Award style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Certifications &amp; Achievements
            </h2>
          </div>
          <div className="space-y-1.5 text-[11px]">
            {certifications.map((cert) => (
              <div key={cert.id} data-cv-subitem="true" className="flex flex-wrap items-baseline justify-between cv-item-avoid-break">
                <div>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  {cert.organization && (
                    <span className="text-slate-600"> — {cert.organization}</span>
                  )}
                  {cert.link && (
                    <a
                      href={normalizeUrl(cert.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[10px] text-blue-700 underline"
                    >
                      [Verify]
                    </a>
                  )}
                </div>
                {cert.year && (
                  <span className="text-slate-500 font-semibold">{cert.year}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extracurricular Activities */}
      {extracurricular && extracurricular.length > 0 && (
        <section className="mb-4 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            <Users style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Extracurricular &amp; Leadership
            </h2>
          </div>
          <div className="space-y-1.5 text-[11px]">
            {extracurricular.map((eca) => (
              <div key={eca.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="font-bold text-slate-900">
                  {eca.title}
                  {eca.category && (
                    <span className="text-blue-800 font-normal text-[10px]"> · {eca.category}</span>
                  )}
                </div>
                {eca.description && (
                  <div className="text-slate-600 text-[10.5px] mt-0.5 cv-paragraph">{eca.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-4 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            <Globe2 style={{ color: accent }} className="w-3.5 h-3.5 shrink-0" />
            <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider">
              Languages
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {languages.map((lang) => (
              <span key={lang.id} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium cv-item-avoid-break">
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* References (Only if explicitly enabled) */}
      {showReferences && references && references.length > 0 && (
        <section className="mb-2 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 style={{ color: accent }} className="text-xs font-bold uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            {references.map((ref) => (
              <div key={ref.id} data-cv-item="true" className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg cv-item-avoid-break">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-slate-700 text-[10.5px]">{ref.designation}</div>
                <div className="text-slate-600 text-[10.5px]">{ref.institution}</div>
                {ref.email && <div className="text-blue-700 text-[10px]">{ref.email}</div>}
                {ref.phone && <div className="text-slate-600 text-[10px]">{ref.phone}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
