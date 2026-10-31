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

export const SimpleStudentTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, objective, education, skills, projects, experience, certifications, extracurricular, languages, showReferences, references } = cv;

  const hasSkills =
    skills.technical.length > 0 ||
    skills.computer.length > 0 ||
    skills.communication.length > 0 ||
    skills.other.length > 0;

  return (
    <div className="font-modern text-slate-800 text-[12px] leading-relaxed p-12 bg-white min-h-[1050px]">
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-3 mb-4 text-center cv-item-avoid-break">
        {personal.photoUrl && (
          <div className="flex justify-center mb-2.5">
            <img
              src={personal.photoUrl}
              alt={personal.fullName || 'Student'}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-300 shadow-2xs"
            />
          </div>
        )}

        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900">
          {personal.fullName || 'Student Name'}
        </h1>

        {/* Contact Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-2">
          {personal.email && (
            <a href={mailtoHref(personal.email)} className="hover:text-blue-700 underline decoration-slate-300">
              {personal.email}
            </a>
          )}
          {personal.phone && (
            <>
              <span className="text-slate-400">•</span>
              <a href={telHref(personal.phone)} className="hover:text-blue-700">
                {personal.phone}
              </a>
            </>
          )}
          {(personal.city || personal.country) && (
            <>
              <span className="text-slate-400">•</span>
              <span>{[personal.city, personal.country].filter(Boolean).join(', ')}</span>
            </>
          )}
          {personal.linkedin && (
            <>
              <span className="text-slate-400">•</span>
              <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 underline decoration-slate-300">
                {formatUrlLabel(personal.linkedin, 'LinkedIn')}
              </a>
            </>
          )}
          {personal.github && (
            <>
              <span className="text-slate-400">•</span>
              <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 underline decoration-slate-300">
                {formatUrlLabel(personal.github, 'GitHub')}
              </a>
            </>
          )}
          {personal.website && (
            <>
              <span className="text-slate-400">•</span>
              <a href={normalizeUrl(personal.website)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 underline decoration-slate-300">
                {formatUrlLabel(personal.website, 'Portfolio')}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Career Objective */}
      {objective && objective.trim() && (
        <section className="mb-4 cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-300 cv-heading">
            Career Objective
          </h2>
          <p className="text-slate-700 leading-relaxed text-[11.5px] text-justify cv-paragraph">
            {objective}
          </p>
        </section>
      )}

      {/* Education (Top Priority for Students) */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-300 cv-heading">
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-slate-900 text-[12px]">
                    {edu.degree}
                    {edu.department && (
                      <span className="font-medium text-slate-700"> in {edu.department}</span>
                    )}
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-600">
                    {[edu.startYear, edu.graduationYear].filter(Boolean).join(' – ')}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 mt-0.5">
                  <span className="font-medium">{edu.institution}</span>
                  <div className="flex items-center gap-3">
                    {edu.currentYearSemester && (
                      <span className="text-blue-800 font-medium">{edu.currentYearSemester}</span>
                    )}
                    {edu.gpa && (
                      <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded">
                        {edu.gpa.toLowerCase().includes('gpa') ? edu.gpa : `GPA: ${edu.gpa}`}
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-300 cv-heading">
            Skills
          </h2>
          <div className="space-y-1.5 text-[11.5px]">
            {skills.technical.length > 0 && (
              <div data-cv-subitem="true" className="grid grid-cols-12 gap-2 cv-item-avoid-break">
                <span className="col-span-3 font-bold text-slate-900">
                  Technical Skills:
                </span>
                <span className="col-span-9 text-slate-700">
                  {skills.technical.join(', ')}
                </span>
              </div>
            )}
            {skills.computer.length > 0 && (
              <div data-cv-subitem="true" className="grid grid-cols-12 gap-2 cv-item-avoid-break">
                <span className="col-span-3 font-bold text-slate-900">
                  Software &amp; Tools:
                </span>
                <span className="col-span-9 text-slate-700">
                  {skills.computer.join(', ')}
                </span>
              </div>
            )}
            {skills.communication.length > 0 && (
              <div data-cv-subitem="true" className="grid grid-cols-12 gap-2 cv-item-avoid-break">
                <span className="col-span-3 font-bold text-slate-900">
                  Communication:
                </span>
                <span className="col-span-9 text-slate-700">
                  {skills.communication.join(', ')}
                </span>
              </div>
            )}
            {skills.other.length > 0 && (
              <div data-cv-subitem="true" className="grid grid-cols-12 gap-2 cv-item-avoid-break">
                <span className="col-span-3 font-bold text-slate-900">
                  Other Strengths:
                </span>
                <span className="col-span-9 text-slate-700">
                  {skills.other.join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-300 cv-heading">
            Academic &amp; Personal Projects
          </h2>
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
                        className="text-[10px] text-blue-700 hover:underline font-normal inline-flex items-center gap-0.5"
                      >
                        [Live Demo]
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={normalizeUrl(proj.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-700 hover:underline font-normal inline-flex items-center gap-0.5"
                      >
                        [GitHub]
                      </a>
                    )}
                  </div>
                </div>
                {proj.technologies && (
                  <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                    Technologies: {proj.technologies}
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

      {/* Work Experience or Internship (Optional - skipped if empty) */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-300 cv-heading">
            Work Experience &amp; Internships
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-slate-900 text-[12px]">
                    {exp.jobTitle}
                    <span className="font-medium text-slate-700"> — {exp.company}</span>
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-300 cv-heading">
            Certifications &amp; Achievements
          </h2>
          <div className="space-y-1 text-[11px]">
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
                      Verify
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

      {/* Extracurricular Activities (Optional) */}
      {extracurricular && extracurricular.length > 0 && (
        <section className="mb-4 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-300 cv-heading">
            Extracurricular &amp; Leadership Activities
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {extracurricular.map((eca) => (
              <div key={eca.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="font-bold text-slate-900">
                  {eca.title}
                  {eca.category && (
                    <span className="text-slate-500 font-normal text-[10px]"> ({eca.category})</span>
                  )}
                </div>
                {eca.description && (
                  <div className="text-slate-700 text-[10.5px] mt-0.5 cv-paragraph">{eca.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-4 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-300 cv-heading">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-700">
            {languages.map((lang) => (
              <div key={lang.id} data-cv-subitem="true" className="cv-item-avoid-break">
                <span className="font-bold text-slate-900">{lang.name}: </span>
                <span>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References (Only if enabled) */}
      {showReferences && references && references.length > 0 && (
        <section className="mb-2 cv-section-avoid-break cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-300 cv-heading">
            References
          </h2>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {references.map((ref) => (
              <div key={ref.id} data-cv-item="true" className="p-2 border border-slate-200 rounded cv-item-avoid-break">
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
