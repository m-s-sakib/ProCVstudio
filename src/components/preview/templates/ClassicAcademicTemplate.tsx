/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CVData } from '../../../types/cv';
import { formatUrlLabel, mailtoHref, normalizeUrl, telHref } from '../../../utils/links';
import { ensureFullStop, renderSentenceSpans } from '../../../utils/sentenceUtils';

interface TemplateProps {
  cv: CVData;
}

export const ClassicAcademicTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, education, experience, projects, skillCategories, certifications, leadership, languages, interests, references, sectionVisibility } = cv;

  return (
    <div className="font-academic text-slate-900 text-[12px] leading-relaxed p-8 sm:p-12 bg-white min-h-[1050px]">
      {/* Centered Academic Header */}
      <header className="text-center pb-4 mb-4 border-b border-slate-300">
        {personal.photoUrl && (
          <div className="flex justify-center mb-3">
            <img
              src={personal.photoUrl}
              alt={personal.fullName || 'Profile'}
              className="w-16 h-16 rounded-full object-cover border border-slate-300 shadow-2xs"
            />
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase mb-1">
          {personal.fullName || 'Full Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-xs italic text-slate-700 mb-2">
            {personal.jobTitle}
          </p>
        )}

        {/* Contact row with pipe separators */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-slate-700">
          {personal.email && (
            <a href={mailtoHref(personal.email)} className="hover:text-blue-800 underline decoration-slate-400">
              {personal.email}
            </a>
          )}
          {personal.phone && (
            <>
              <span className="text-slate-400">|</span>
              <a href={telHref(personal.phone)} className="hover:text-blue-800">
                {personal.phone}
              </a>
            </>
          )}
          {(personal.city || personal.country) && (
            <>
              <span className="text-slate-400">|</span>
              <span>{[personal.city, personal.country].filter(Boolean).join(', ')}</span>
            </>
          )}
          {personal.linkedin && (
            <>
              <span className="text-slate-400">|</span>
              <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 underline decoration-slate-400">
                {formatUrlLabel(personal.linkedin, 'LinkedIn')}
              </a>
            </>
          )}
          {personal.github && (
            <>
              <span className="text-slate-400">|</span>
              <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 underline decoration-slate-400">
                {formatUrlLabel(personal.github, 'GitHub')}
              </a>
            </>
          )}
          {personal.website && (
            <>
              <span className="text-slate-400">|</span>
              <a href={normalizeUrl(personal.website)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 underline decoration-slate-400">
                {formatUrlLabel(personal.website, 'Scholar / Web')}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary / Research Profile */}
      {sectionVisibility.summary && personal.summary && (
        <section className="mb-4 cv-section-avoid-break">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2">
            Research Profile & Objective
          </h2>
          <p className="text-justify text-slate-800 leading-normal">
            {renderSentenceSpans(personal.summary)}
          </p>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break text-slate-800">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.institution}</span>
                  <span className="text-right text-[11px] font-bold text-slate-700">
                    {[edu.startDate, edu.isCurrent ? 'Present' : edu.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="italic">
                    {[edu.degree, edu.major].filter(Boolean).join(' in ')}
                  </span>
                  {edu.location && <span className="text-slate-600 italic">{edu.location}</span>}
                </div>
                {edu.gpa && (
                  <p className="text-[11px] mt-0.5">
                    <span className="font-semibold">Academic Standing / GPA:</span> {edu.gpa}
                  </p>
                )}
                {edu.coursework && (
                  <p className="text-[11px] text-slate-700 mt-0.5">
                    <span className="font-semibold">Coursework:</span> {edu.coursework}
                  </p>
                )}
                {edu.achievements && (
                  <p className="text-[11px] text-slate-700 mt-0.5">
                    <span className="font-semibold">Honors & Awards:</span> {edu.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience / Research Appointments */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Research & Professional Appointments
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break text-slate-800">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{exp.company}</span>
                    <span className="italic text-slate-700 text-[11px]"> — {exp.jobTitle}</span>
                  </div>
                  <span className="text-right text-[11px] font-bold text-slate-700">
                    {[exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-[11px] text-slate-600 italic mb-1">{exp.location}</div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-slate-800">
                    {exp.bullets.map((b, idx) => b.trim() && (
                      <li key={idx} className="leading-snug">
                        {ensureFullStop(b.trim())}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications & Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Publications & Selected Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} data-cv-item="true" className="cv-item-avoid-break text-slate-800">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900">
                    {proj.name}
                    {proj.projectUrl && (
                      <a href={normalizeUrl(proj.projectUrl)} target="_blank" rel="noopener noreferrer" className="ml-2 text-[10px] font-normal text-blue-800 underline">
                        [Link]
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={normalizeUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10px] font-normal text-blue-800 underline">
                        [Code]
                      </a>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-right text-[11px] font-bold text-slate-700">
                      {[proj.startDate, proj.endDate].filter(Boolean).join(' – ')}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <div className="text-[11px] italic text-slate-700 mb-0.5">
                    Methods & Technologies: {proj.technologies}
                  </div>
                )}
                {proj.description && (
                  <p className="text-slate-800 text-[11px] leading-snug">
                    {renderSentenceSpans(proj.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills && skillCategories.length > 0 && (
        <section className="mb-4 cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Technical & Scholarly Skills
          </h2>
          <div className="space-y-1 text-[11px]">
            {skillCategories.map((cat) => cat.skills.length > 0 && (
              <div key={cat.id}>
                <span className="font-bold text-slate-900">{cat.name}: </span>
                <span className="text-slate-800">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Fellowships */}
      {sectionVisibility.certifications && certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Certifications & Accreditations
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {certifications.map((cert) => (
              <div key={cert.id} data-cv-item="true" className="cv-item-avoid-break flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  {cert.issuer && <span className="italic text-slate-700"> — {cert.issuer}</span>}
                  {cert.verificationUrl && (
                    <a href={normalizeUrl(cert.verificationUrl)} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10px] text-blue-800 underline">
                      [Verify]
                    </a>
                  )}
                </div>
                {cert.issueDate && (
                  <span className="text-slate-700 text-[11px] font-bold">{cert.issueDate}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership & Academic Service */}
      {sectionVisibility.leadership && leadership.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Leadership & Academic Service
          </h2>
          <div className="space-y-2">
            {leadership.map((lead) => (
              <div key={lead.id} data-cv-item="true" className="cv-item-avoid-break text-slate-800">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{lead.role}</span>
                    {lead.organization && <span className="italic text-slate-700 text-[11px]">, {lead.organization}</span>}
                  </div>
                  {(lead.startDate || lead.endDate) && (
                    <span className="text-right text-[11px] font-bold text-slate-700">
                      {[lead.startDate, lead.endDate].filter(Boolean).join(' – ')}
                    </span>
                  )}
                </div>
                {lead.bullets && lead.bullets.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-[11px]">
                    {lead.bullets.map((b, idx) => b.trim() && (
                      <li key={idx} className="leading-snug">
                        {ensureFullStop(b.trim())}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extracurricular Activities (ECA) */}
      {sectionVisibility.extracurricular && cv.extracurricular && cv.extracurricular.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Extracurricular Activities (ECA)
          </h2>
          <div className="space-y-2">
            {cv.extracurricular.map((item) => (
              <div key={item.id} data-cv-item="true" className="cv-item-avoid-break text-slate-800">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{item.activity}</span>
                    {item.role && <span className="italic text-slate-700 text-[11px]"> — {item.role}</span>}
                    {item.organization && <span className="text-slate-600 text-[11px]">, {item.organization}</span>}
                  </div>
                  {(item.startDate || item.endDate) && (
                    <span className="text-right text-[11px] font-bold text-slate-700">
                      {[item.startDate, item.isCurrent ? 'Present' : item.endDate].filter(Boolean).join(' – ')}
                    </span>
                  )}
                </div>
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-[11px]">
                    {item.bullets.map((b, idx) => b.trim() && (
                      <li key={idx} className="leading-snug">
                        {ensureFullStop(b.trim())}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Interests */}
      {(sectionVisibility.languages || sectionVisibility.interests) && (
        <section className="mb-4 cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Languages & Personal Interests
          </h2>
          <div className="space-y-1 text-[11px]">
            {sectionVisibility.languages && languages.length > 0 && (
              <div>
                <span className="font-bold text-slate-900">Languages: </span>
                <span className="text-slate-800">{languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}</span>
              </div>
            )}
            {sectionVisibility.interests && interests.length > 0 && (
              <div>
                <span className="font-bold text-slate-900">Interests & Activities: </span>
                <span className="text-slate-800">{interests.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* References */}
      {sectionVisibility.references && references.length > 0 && (
        <section className="mb-4 cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5 mb-2 cv-heading">
            Academic References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            {references.map((ref) => (
              <div key={ref.id} data-cv-item="true" className="cv-item-avoid-break border-l border-slate-400 pl-2">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="italic text-slate-700">{ref.title}, {ref.organization}</div>
                <div className="text-slate-600 text-[10px]">
                  {[ref.email, ref.phone].filter(Boolean).join(' | ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
