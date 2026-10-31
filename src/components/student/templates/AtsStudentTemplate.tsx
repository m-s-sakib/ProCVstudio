/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudentCVData } from '../../../types/studentCv';
import { mailtoHref, telHref, normalizeUrl, formatUrlLabel } from '../../../utils/links';

interface TemplateProps {
  cv: StudentCVData;
}

export const AtsStudentTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, objective, education, skills, projects, experience, certifications, extracurricular, languages, showReferences, references } = cv;

  const hasSkills =
    skills.technical.length > 0 ||
    skills.computer.length > 0 ||
    skills.communication.length > 0 ||
    skills.other.length > 0;

  return (
    <div className="font-modern text-black text-[12px] leading-normal p-12 bg-white min-h-[1050px]">
      {/* ATS Standard Header */}
      <header className="pb-3 mb-3 border-b border-black cv-item-avoid-break">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-black">
              {personal.fullName || 'Candidate Name'}
            </h1>
            <div className="flex flex-wrap gap-x-2 text-[11px] text-gray-800 mt-1.5">
              {personal.email && (
                <a href={mailtoHref(personal.email)} className="underline">
                  {personal.email}
                </a>
              )}
              {personal.phone && (
                <>
                  <span>•</span>
                  <a href={telHref(personal.phone)}>{personal.phone}</a>
                </>
              )}
              {(personal.city || personal.country) && (
                <>
                  <span>•</span>
                  <span>{[personal.city, personal.country].filter(Boolean).join(', ')}</span>
                </>
              )}
              {personal.linkedin && (
                <>
                  <span>•</span>
                  <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="underline">
                    {formatUrlLabel(personal.linkedin, 'LinkedIn')}
                  </a>
                </>
              )}
              {personal.github && (
                <>
                  <span>•</span>
                  <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="underline">
                    {formatUrlLabel(personal.github, 'GitHub')}
                  </a>
                </>
              )}
              {personal.website && (
                <>
                  <span>•</span>
                  <a href={normalizeUrl(personal.website)} target="_blank" rel="noopener noreferrer" className="underline">
                    {formatUrlLabel(personal.website, 'Portfolio')}
                  </a>
                </>
              )}
            </div>
          </div>
          {personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName || 'Candidate Photo'}
              className="w-16 h-20 object-cover border border-black shrink-0"
            />
          )}
        </div>
      </header>

      {/* Career Objective */}
      {objective && objective.trim() && (
        <section className="mb-3.5 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Career Objective
          </h2>
          <p className="text-black leading-relaxed text-[11px] cv-paragraph">
            {objective}
          </p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 cv-heading">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-black text-[12px]">
                    {edu.degree}
                    {edu.department && ` - ${edu.department}`}
                  </div>
                  <div className="text-right text-[11px] font-semibold text-gray-800">
                    {[edu.startYear, edu.graduationYear].filter(Boolean).join(' - ')}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-800">
                  <div>{edu.institution}</div>
                  <div className="space-x-2">
                    {edu.currentYearSemester && <span>{edu.currentYearSemester}</span>}
                    {edu.gpa && <span>(GPA: {edu.gpa})</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="mb-3.5 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Technical &amp; Personal Skills
          </h2>
          <div className="space-y-1 text-[11px]">
            {skills.technical.length > 0 && (
              <div data-cv-subitem="true" className="cv-item-avoid-break">
                <strong>Technical Skills: </strong>
                <span>{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.computer.length > 0 && (
              <div data-cv-subitem="true" className="cv-item-avoid-break">
                <strong>Software &amp; Tools: </strong>
                <span>{skills.computer.join(', ')}</span>
              </div>
            )}
            {skills.communication.length > 0 && (
              <div data-cv-subitem="true" className="cv-item-avoid-break">
                <strong>Communication Skills: </strong>
                <span>{skills.communication.join(', ')}</span>
              </div>
            )}
            {skills.other.length > 0 && (
              <div data-cv-subitem="true" className="cv-item-avoid-break">
                <strong>Other Relevant Skills: </strong>
                <span>{skills.other.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 cv-heading">
            Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-black text-[12px]">
                    {proj.name}
                    {proj.technologies && ` [Tech: ${proj.technologies}]`}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-black text-[11px] leading-relaxed mt-0.5 cv-paragraph">
                    {proj.description}
                  </p>
                )}
                <div className="flex gap-3 text-[10px] text-gray-700 mt-0.5">
                  {proj.projectUrl && (
                    <a href={normalizeUrl(proj.projectUrl)} target="_blank" rel="noopener noreferrer" className="underline">
                      Project Link: {formatUrlLabel(proj.projectUrl)}
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={normalizeUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" className="underline">
                      GitHub: {formatUrlLabel(proj.githubUrl)}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience or Internship (Optional) */}
      {experience && experience.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 cv-heading">
            Experience / Internships
          </h2>
          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-black text-[12px]">
                    {exp.jobTitle} - {exp.company}
                  </div>
                  <div className="text-right text-[11px] font-semibold text-gray-800">
                    {exp.duration}
                  </div>
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc ml-4 mt-0.5 space-y-0.5 text-black text-[11px] leading-relaxed">
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

      {/* Certifications and Achievements */}
      {certifications && certifications.length > 0 && (
        <section className="mb-3.5 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Certifications &amp; Achievements
          </h2>
          <div className="space-y-1 text-[11px]">
            {certifications.map((cert) => (
              <div key={cert.id} data-cv-subitem="true" className="flex justify-between cv-item-avoid-break">
                <div>
                  <strong>{cert.name}</strong>
                  {cert.organization && ` - ${cert.organization}`}
                  {cert.link && (
                    <a href={normalizeUrl(cert.link)} target="_blank" rel="noopener noreferrer" className="underline ml-2">
                      (Link)
                    </a>
                  )}
                </div>
                {cert.year && <span>{cert.year}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extracurricular Activities */}
      {extracurricular && extracurricular.length > 0 && (
        <section className="mb-3.5 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Extracurricular &amp; Leadership
          </h2>
          <div className="space-y-1 text-[11px]">
            {extracurricular.map((eca) => (
              <div key={eca.id} data-cv-item="true" className="cv-item-avoid-break">
                <strong>{eca.title}</strong>
                {eca.category && ` (${eca.category})`}
                {eca.description && <div className="text-black text-[10.5px] cv-paragraph">{eca.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-3.5 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-4 text-[11px]">
            {languages.map((lang) => (
              <span key={lang.id} data-cv-subitem="true" className="cv-item-avoid-break">
                <strong>{lang.name}:</strong> {lang.proficiency}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* References (Only if enabled) */}
      {showReferences && references && references.length > 0 && (
        <section className="mb-2 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            References
          </h2>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {references.map((ref) => (
              <div key={ref.id} data-cv-item="true" className="border border-black p-1.5 cv-item-avoid-break">
                <div className="font-bold">{ref.name}</div>
                <div>{ref.designation}</div>
                <div>{ref.institution}</div>
                {ref.email && <div>{ref.email}</div>}
                {ref.phone && <div>{ref.phone}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
