/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CVData } from '../../../types/cv';
import { formatUrlLabel, mailtoHref, normalizeUrl, telHref } from '../../../utils/links';
import { ensureFullStop, renderSentenceSpans } from '../../../utils/sentenceUtils';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

interface TemplateProps {
  cv: CVData;
}

export const ModernDataAnalystTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, education, experience, projects, skillCategories, certifications, leadership, languages, interests, references, sectionVisibility } = cv;

  return (
    <div className="font-modern text-slate-800 text-[12px] leading-normal p-8 sm:p-11 bg-white min-h-[1050px]">
      {/* Header: Left-aligned modern layout */}
      <header className="pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {personal.fullName || 'Salman Sakib'}
            </h1>
            {personal.jobTitle && (
              <p className="text-sm font-semibold text-blue-900 mt-0.5 tracking-wide">
                {personal.jobTitle}
              </p>
            )}
            {(personal.city || personal.country) && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{[personal.city, personal.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
          {personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName || 'Profile'}
              className="w-16 h-16 rounded-lg object-cover border border-slate-300 shadow-2xs shrink-0"
            />
          )}
        </div>

        {/* Contact links bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600 mt-2.5 pt-2 border-t border-slate-100">
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
              <Linkedin className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="underline decoration-slate-300">{formatUrlLabel(personal.linkedin, 'LinkedIn')}</span>
            </a>
          )}
          {personal.github && (
            <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-blue-700">
              <Github className="w-3 h-3 text-slate-700 shrink-0" />
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

      {/* Summary */}
      {sectionVisibility.summary && personal.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-[11.5px]">
            {renderSentenceSpans(personal.summary)}
          </p>
        </section>
      )}

      {/* Technical Skills - Categorized and Structured */}
      {sectionVisibility.skills && skillCategories.length > 0 && (
        <section className="mb-4 cv-section-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-200">
            Technical & Analytical Skills
          </h2>
          <div className="space-y-1 text-[11px]">
            {skillCategories.map((cat) => cat.skills.length > 0 && (
              <div key={cat.id} className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-slate-900">
                  {cat.name}
                </span>
                <span className="col-span-8 text-slate-700">
                  {cat.skills.join('  •  ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 cv-heading">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="font-bold text-slate-900 text-[12.5px]">
                    {exp.jobTitle}
                    <span className="font-semibold text-blue-900 text-xs"> — {exp.company}</span>
                    {exp.employmentType && (
                      <span className="text-slate-500 font-normal text-[10.5px]"> ({exp.employmentType})</span>
                    )}
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-600">
                    {[exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                    {exp.location && <span className="text-slate-500 font-normal"> · {exp.location}</span>}
                  </div>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 mt-1 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                    {exp.bullets.map((b, idx) => {
                      const cleanBullet = ensureFullStop(b);
                      return cleanBullet ? (
                        <li key={idx} className="leading-snug">
                          {cleanBullet}
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 cv-heading">
            Machine Learning & Data Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[12px]">{proj.name}</span>
                    {proj.projectUrl && (
                      <a
                        href={normalizeUrl(proj.projectUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[10px] text-blue-700 font-medium hover:underline"
                      >
                        Demo <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={normalizeUrl(proj.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[10px] text-slate-700 font-medium hover:underline"
                      >
                        Code <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-right text-[11px] text-slate-500">
                      {[proj.startDate, proj.endDate].filter(Boolean).join(' – ')}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[10.5px] text-blue-900 font-medium mt-0.5">
                    Stack: <span className="font-normal text-slate-700">{proj.technologies}</span>
                  </p>
                )}
                {proj.description && (
                  <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                    {renderSentenceSpans(proj.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 cv-heading">
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-slate-700 text-[11.5px]"> — {[edu.degree, edu.major].filter(Boolean).join(' in ')}</span>
                  </div>
                  <span className="text-right text-[11px] font-semibold text-slate-600">
                    {[edu.startDate, edu.isCurrent ? 'Present' : edu.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 mt-0.5">
                  {edu.gpa && <span><strong className="text-slate-800">GPA:</strong> {edu.gpa}</span>}
                  {edu.location && <span><strong className="text-slate-800">Location:</strong> {edu.location}</span>}
                </div>
                {edu.coursework && (
                  <p className="text-[10.5px] text-slate-600 mt-0.5">
                    <strong className="text-slate-700">Coursework:</strong> {edu.coursework}
                  </p>
                )}
                {edu.achievements && (
                  <p className="text-[10.5px] text-slate-600 mt-0.5">
                    <strong className="text-slate-700">Honors:</strong> {edu.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {sectionVisibility.certifications && certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 cv-heading">
            Certifications
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {certifications.map((cert) => (
              <div key={cert.id} data-cv-item="true" className="cv-item-avoid-break flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  {cert.issuer && <span className="text-slate-600"> · {cert.issuer}</span>}
                  {cert.credentialId && <span className="text-slate-400 text-[10px]"> (ID: {cert.credentialId})</span>}
                  {cert.verificationUrl && (
                    <a href={normalizeUrl(cert.verificationUrl)} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 underline text-[10px]">
                      Verify
                    </a>
                  )}
                </div>
                {cert.issueDate && <span className="text-slate-600 font-medium text-[10.5px]">{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership & Activities */}
      {sectionVisibility.leadership && leadership.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 cv-heading">
            Leadership & Governance
          </h2>
          <div className="space-y-2">
            {leadership.map((lead) => (
              <div key={lead.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-[11.5px]">{lead.role}</span>
                    {lead.organization && <span className="text-slate-600 text-[11px]"> — {lead.organization}</span>}
                  </div>
                  {(lead.startDate || lead.endDate) && (
                    <span className="text-right text-[11px] text-slate-500">
                      {[lead.startDate, lead.endDate].filter(Boolean).join(' – ')}
                    </span>
                  )}
                </div>
                {lead.bullets && lead.bullets.length > 0 && (
                  <ul className="list-disc ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                    {lead.bullets.map((b, idx) => {
                      const cleanBullet = ensureFullStop(b);
                      return cleanBullet ? (
                        <li key={idx} className="leading-snug">
                          {cleanBullet}
                        </li>
                      ) : null;
                    })}
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 cv-heading">
            Extracurricular Activities (ECA)
          </h2>
          <div className="space-y-2.5">
            {cv.extracurricular.map((item) => (
              <div key={item.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-[11.5px]">{item.activity}</span>
                    {item.role && <span className="font-semibold text-blue-900 text-[11px]"> — {item.role}</span>}
                    {item.organization && <span className="text-slate-600 text-[11px]"> · {item.organization}</span>}
                  </div>
                  {(item.startDate || item.endDate) && (
                    <span className="text-right text-[11px] text-slate-500">
                      {[item.startDate, item.isCurrent ? 'Present' : item.endDate].filter(Boolean).join(' – ')}
                    </span>
                  )}
                </div>
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="list-disc ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                    {item.bullets.map((b, idx) => {
                      const cleanBullet = ensureFullStop(b);
                      return cleanBullet ? (
                        <li key={idx} className="leading-snug">
                          {cleanBullet}
                        </li>
                      ) : null;
                    })}
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-1.5 border-b border-slate-200 cv-heading">
            Languages & Interests
          </h2>
          <div className="space-y-1 text-[11px] text-slate-700">
            {sectionVisibility.languages && languages.length > 0 && (
              <div>
                <strong className="text-slate-900">Languages: </strong>
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
              </div>
            )}
            {sectionVisibility.interests && interests.length > 0 && (
              <div>
                <strong className="text-slate-900">Interests: </strong>
                {interests.join(', ')}
              </div>
            )}
          </div>
        </section>
      )}

      {/* References */}
      {sectionVisibility.references && references.length > 0 && (
        <section className="cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 cv-heading">
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            {references.map((ref) => (
              <div key={ref.id} data-cv-item="true" className="cv-item-avoid-break p-2 bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-slate-600">{ref.title}, {ref.organization}</div>
                <div className="text-slate-500 text-[10px] mt-0.5">
                  {[ref.email, ref.phone].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
