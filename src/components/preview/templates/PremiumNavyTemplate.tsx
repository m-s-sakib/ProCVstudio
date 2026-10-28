/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CVData } from '../../../types/cv';
import { formatUrlLabel, mailtoHref, normalizeUrl, telHref } from '../../../utils/links';
import { ensureFullStop, renderSentenceSpans } from '../../../utils/sentenceUtils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  cv: CVData;
}

export const PremiumNavyTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, education, experience, projects, skillCategories, certifications, leadership, languages, interests, references, sectionVisibility, customization } = cv;
  const navyColor = customization.accentColor || '#0f2b48';

  return (
    <div className="font-modern text-slate-900 text-[12px] leading-normal bg-white min-h-[1050px] shadow-sm">
      {/* Top Navy Accent Strip */}
      <div style={{ backgroundColor: navyColor }} className="h-3 w-full" />

      <div className="p-8 sm:p-11">
        {/* Header Block */}
        <header className="mb-5 pb-4 border-b-2 border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 style={{ color: navyColor }} className="text-3xl font-extrabold tracking-tight uppercase">
                {personal.fullName || 'Full Name'}
              </h1>
              {personal.jobTitle && (
                <p className="text-xs font-bold tracking-widest uppercase text-slate-600 mt-1">
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
                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-300 shadow-2xs shrink-0"
              />
            )}
          </div>

          {/* Contact Details Bar with Navy accent markers */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-700">
            {personal.email && (
              <a href={mailtoHref(personal.email)} className="inline-flex items-center gap-1.5 hover:text-blue-900 font-medium">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{personal.email}</span>
              </a>
            )}
            {personal.phone && (
              <a href={telHref(personal.phone)} className="inline-flex items-center gap-1.5 hover:text-blue-900 font-medium">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{personal.phone}</span>
              </a>
            )}
            {personal.linkedin && (
              <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-900 font-medium">
                <Linkedin className="w-3 h-3 text-blue-700 shrink-0" />
                <span className="underline decoration-slate-300">{formatUrlLabel(personal.linkedin, 'LinkedIn')}</span>
              </a>
            )}
            {personal.github && (
              <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-900 font-medium">
                <Github className="w-3 h-3 text-slate-800 shrink-0" />
                <span className="underline decoration-slate-300">{formatUrlLabel(personal.github, 'GitHub')}</span>
              </a>
            )}
            {personal.website && (
              <a href={normalizeUrl(personal.website)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-900 font-medium">
                <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="underline decoration-slate-300">{formatUrlLabel(personal.website, 'Portfolio')}</span>
              </a>
            )}
          </div>
        </header>


        {/* Executive Summary */}
        {sectionVisibility.summary && personal.summary && (
          <section className="mb-4 cv-section-avoid-break">
            <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-300">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Executive Profile
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              {renderSentenceSpans(personal.summary)}
            </p>
          </section>
        )}

        {/* Experience */}
        {sectionVisibility.experience && experience.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Professional Experience
              </h2>
            </div>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900 text-[12.5px]">
                      {exp.jobTitle}
                      <span style={{ color: navyColor }} className="font-semibold text-xs"> | {exp.company}</span>
                    </div>
                    <div className="text-right text-[11px] font-bold text-slate-600">
                      {[exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                    </div>
                  </div>
                  {exp.location && (
                    <div className="text-[10.5px] text-slate-500 italic mb-1">{exp.location}</div>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc ml-4 space-y-1 text-slate-700 text-[11px] leading-relaxed">
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

        {/* Education */}
        {sectionVisibility.education && education.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Education & Credentials
              </h2>
            </div>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900">{edu.institution}</span>
                      <span className="text-slate-700 text-[11.5px]"> — {[edu.degree, edu.major].filter(Boolean).join(' in ')}</span>
                    </div>
                    <span className="text-right text-[11px] font-bold text-slate-600">
                      {[edu.startDate, edu.isCurrent ? 'Present' : edu.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-600 mt-0.5">
                    {edu.gpa && <span><strong className="text-slate-800">GPA:</strong> {edu.gpa}</span>}
                    {edu.location && <span><strong className="text-slate-800">Location:</strong> {edu.location}</span>}
                    {edu.achievements && <span><strong className="text-slate-800">Honors:</strong> {edu.achievements}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {sectionVisibility.projects && projects.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Key Initiatives & Projects
              </h2>
            </div>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} data-cv-item="true" className="cv-item-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900 text-[12px]">
                      {proj.name}
                      {proj.projectUrl && (
                        <a href={normalizeUrl(proj.projectUrl)} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-800 text-[10.5px] font-semibold underline">
                          [Project Link]
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={normalizeUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" className="ml-1 text-slate-700 text-[10.5px] font-semibold underline">
                          [Repo]
                        </a>
                      )}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-right text-[11px] font-semibold text-slate-600">
                        {[proj.startDate, proj.endDate].filter(Boolean).join(' – ')}
                      </span>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[10.5px] text-slate-600 italic">
                      Core Technologies: {proj.technologies}
                    </div>
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

        {/* Skills */}
        {sectionVisibility.skills && skillCategories.length > 0 && (
          <section className="mb-4 cv-item-avoid-break" data-cv-item="true">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Competencies & Capabilities
              </h2>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {skillCategories.map((cat) => cat.skills.length > 0 && (
                <div key={cat.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                  <span className="font-bold text-slate-900 min-w-[200px]">{cat.name}:</span>
                  <span className="text-slate-700">{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {sectionVisibility.certifications && certifications.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Certifications & Accreditations
              </h2>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {certifications.map((cert) => (
                <div key={cert.id} data-cv-item="true" className="cv-item-avoid-break flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                    {cert.verificationUrl && (
                      <a href={normalizeUrl(cert.verificationUrl)} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-800 text-[10px] underline">
                        [Verify]
                      </a>
                    )}
                  </div>
                  {cert.issueDate && (
                    <span className="text-slate-600 text-[10.5px] font-semibold">{cert.issueDate}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leadership & Activities */}
        {sectionVisibility.leadership && leadership.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Leadership & Governance
              </h2>
            </div>
            <div className="space-y-2">
              {leadership.map((lead) => (
                <div key={lead.id} data-cv-item="true" className="cv-item-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900 text-[11.5px]">
                      {lead.role}
                      {lead.organization && <span className="text-slate-600 font-normal">, {lead.organization}</span>}
                    </div>
                    {(lead.startDate || lead.endDate) && (
                      <span className="text-right text-[11px] font-semibold text-slate-600">
                        {[lead.startDate, lead.endDate].filter(Boolean).join(' – ')}
                      </span>
                    )}
                  </div>
                  {lead.bullets && lead.bullets.length > 0 && (
                    <ul className="list-disc ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
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
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Extracurricular Activities (ECA)
              </h2>
            </div>
            <div className="space-y-2.5">
              {cv.extracurricular.map((item) => (
                <div key={item.id} data-cv-item="true" className="cv-item-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900 text-[11.5px]">
                      {item.activity}
                      {item.role && <span style={{ color: navyColor }} className="font-semibold text-xs"> — {item.role}</span>}
                      {item.organization && <span className="text-slate-600 font-normal text-[11px]">, {item.organization}</span>}
                    </div>
                    {(item.startDate || item.endDate) && (
                      <span className="text-right text-[11px] font-semibold text-slate-600">
                        {[item.startDate, item.isCurrent ? 'Present' : item.endDate].filter(Boolean).join(' – ')}
                      </span>
                    )}
                  </div>
                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="list-disc ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
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
            <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Languages & Interests
              </h2>
            </div>
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
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-300 cv-heading">
              <span style={{ backgroundColor: navyColor }} className="w-2 h-2 shrink-0" />
              <h2 style={{ color: navyColor }} className="text-xs font-bold uppercase tracking-wider">
                Professional References
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {references.map((ref) => (
                <div key={ref.id} data-cv-item="true" className="cv-item-avoid-break border-l-2 border-slate-300 pl-2">
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-slate-600">{ref.title}, {ref.organization}</div>
                  <div className="text-slate-500 text-[10px]">
                    {[ref.email, ref.phone].filter(Boolean).join(' | ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
