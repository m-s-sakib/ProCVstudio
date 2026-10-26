/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CVData } from '../../../types/cv';
import { formatUrlLabel, mailtoHref, normalizeUrl, telHref } from '../../../utils/links';
import { ensureFullStop, renderSentenceSpans } from '../../../utils/sentenceUtils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface TemplateProps {
  cv: CVData;
}

export const EuropassTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const {
    personal,
    education,
    experience,
    projects,
    skillCategories,
    certifications,
    leadership,
    extracurricular,
    languages,
    interests,
    references,
    sectionVisibility,
  } = cv;

  const europassBlue = '#0e4194'; // Official European Union Europass Blue

  return (
    <div className="font-modern text-slate-800 text-[11.5px] leading-relaxed p-8 sm:p-12 bg-white min-h-[1050px]">
      {/* Official Europass Header Banner */}
      <div className="flex items-start justify-between border-b-2 border-[#0e4194] pb-4 mb-6">
        <div className="flex items-start gap-5">
          {/* Profile Photo - Europass Passport Style */}
          {personal.photoUrl ? (
            <img
              src={personal.photoUrl}
              alt={personal.fullName || 'Passport Photo'}
              className="w-24 h-28 object-cover border border-slate-300 shadow-2xs shrink-0 rounded-xs"
            />
          ) : (
            <div className="w-24 h-28 bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 rounded-xs">
              <span className="text-[10px] text-center font-medium px-2">Passport Photo (Optional)</span>
            </div>
          )}

          {/* Name & Contact Info */}
          <div className="space-y-1">
            <h1 style={{ color: europassBlue }} className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {personal.fullName || 'Candidate Name'}
            </h1>

            {personal.jobTitle && (
              <div className="text-xs font-bold text-slate-700 tracking-wide uppercase mt-0.5">
                <span className="text-slate-400 font-normal lowercase">position applied for: </span>
                <span style={{ color: europassBlue }}>{personal.jobTitle}</span>
              </div>
            )}

            <div className="text-[11px] text-slate-600 space-y-0.5 pt-1.5">
              {(personal.city || personal.country) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{[personal.city, personal.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={telHref(personal.phone)} className="hover:underline text-slate-800 font-medium">
                    {personal.phone}
                  </a>
                </div>
              )}
              {personal.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={mailtoHref(personal.email)} className="hover:underline text-blue-700 font-medium">
                    {personal.email}
                  </a>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={normalizeUrl(personal.website)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                    {formatUrlLabel(personal.website, 'Website')}
                  </a>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-[#0077b5] shrink-0" />
                  <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                    {formatUrlLabel(personal.linkedin, 'LinkedIn Profile')}
                  </a>
                </div>
              )}
              {personal.github && (
                <div className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                    {formatUrlLabel(personal.github, 'GitHub Repository')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Europass Official Brand Mark */}
        <div className="flex flex-col items-end shrink-0 hidden sm:flex">
          <div className="flex items-center gap-1.5 bg-[#0e4194] text-white px-3 py-1 rounded-sm shadow-2xs">
            <div className="w-4 h-4 rounded-full border border-amber-300 flex items-center justify-center text-[7px] text-amber-300 font-bold">
              ★
            </div>
            <span className="font-bold text-sm tracking-tight lowercase">europass</span>
          </div>
          <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            European Standard CV
          </span>
        </div>
      </div>

      {/* Summary / Profile Statement */}
      {sectionVisibility.summary && personal.summary && (
        <section className="mb-5 cv-section-avoid-break">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider">
                About Me / Profile
              </h2>
            </div>
            <div className="col-span-8 text-slate-700 text-justify text-[11px] leading-relaxed">
              {renderSentenceSpans(personal.summary)}
            </div>
          </div>
          <div className="border-b border-slate-200 mt-3" />
        </section>
      )}

      {/* WORK EXPERIENCE (Europass 2-Column Grid) */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section className="mb-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Work Experience
              </h2>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-xs font-extrabold text-slate-900">
                      {exp.jobTitle}
                    </span>
                    <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {[exp.startDate, exp.isCurrent ? 'Current' : exp.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-[#0e4194]">
                    {exp.company}
                    {exp.location && <span className="text-slate-600 font-normal"> · {exp.location}</span>}
                    {exp.employmentType && <span className="text-slate-500 font-normal text-[10px]"> ({exp.employmentType})</span>}
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc ml-4 space-y-1 text-slate-700 text-[11px] mt-1.5">
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
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* EDUCATION AND TRAINING */}
      {sectionVisibility.education && education.length > 0 && (
        <section className="mb-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Education and Training
              </h2>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-4">
              {education.map((edu) => (
                <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-xs font-extrabold text-slate-900">
                      {[edu.degree, edu.major].filter(Boolean).join(' in ')}
                    </span>
                    <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {[edu.startDate, edu.isCurrent ? 'Current' : edu.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-[#0e4194]">
                    {edu.institution}
                    {edu.location && <span className="text-slate-600 font-normal"> · {edu.location}</span>}
                  </div>

                  {edu.gpa && (
                    <div className="text-[10.5px] text-slate-700">
                      <strong className="text-slate-900">Final Grade / Academic Standing:</strong> {edu.gpa}
                    </div>
                  )}

                  {edu.coursework && (
                    <div className="text-[10.5px] text-slate-600">
                      <strong className="text-slate-700">Principal subjects covered:</strong> {edu.coursework}
                    </div>
                  )}

                  {edu.achievements && (
                    <div className="text-[10.5px] text-slate-600">
                      <strong className="text-slate-700">Honours & Awards:</strong> {edu.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* DIGITAL & TECHNICAL SKILLS */}
      {sectionVisibility.skills && skillCategories.length > 0 && (
        <section className="mb-5 cv-item-avoid-break" data-cv-item="true">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Digital & Technical Skills
              </h2>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-2">
              {skillCategories.map((cat) => cat.skills.length > 0 && (
                <div key={cat.id} className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">{cat.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-[10.5px] font-medium bg-slate-100 text-slate-800 border border-slate-200 rounded-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* LANGUAGE SKILLS (Europass CEFR Standard) */}
      {sectionVisibility.languages && languages.length > 0 && (
        <section className="mb-5 cv-item-avoid-break" data-cv-item="true">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Language Skills
              </h2>
              <p className="text-[9.5px] text-slate-400 mt-0.5">CEFR European Framework</p>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {languages.map((l) => (
                  <div key={l.id} className="p-2 border border-slate-200 rounded-sm bg-slate-50/50 flex items-center justify-between">
                    <span className="font-bold text-slate-900">{l.name}</span>
                    <span className="text-[10px] font-bold text-[#0e4194] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {l.proficiency === 'Native' ? 'Mother tongue (C2)' : `${l.proficiency} user`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* PROJECTS & PUBLICATIONS */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section className="mb-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Projects & Publications
              </h2>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} data-cv-item="true" className="cv-item-avoid-break space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <div className="text-xs font-bold text-slate-900">
                      {proj.name}
                      {proj.projectUrl && (
                        <a href={normalizeUrl(proj.projectUrl)} target="_blank" rel="noopener noreferrer" className="ml-2 text-[10px] text-blue-700 underline font-normal">
                          [Link]
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={normalizeUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10px] text-slate-700 underline font-normal">
                          [Code]
                        </a>
                      )}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {[proj.startDate, proj.endDate].filter(Boolean).join(' – ')}
                      </span>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[10px] text-slate-600 italic">
                      Tools: {proj.technologies}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-[11px] text-slate-700 mt-0.5 leading-snug">
                      {renderSentenceSpans(proj.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* CERTIFICATIONS */}
      {sectionVisibility.certifications && certifications.length > 0 && (
        <section className="mb-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Certifications
              </h2>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-2 text-[11px]">
              {certifications.map((cert) => (
                <div key={cert.id} data-cv-item="true" className="cv-item-avoid-break flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                    {cert.verificationUrl && (
                      <a href={normalizeUrl(cert.verificationUrl)} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 underline text-[10px]">
                        [Certificate Link]
                      </a>
                    )}
                  </div>
                  {cert.issueDate && <span className="text-slate-500 text-[10.5px] font-medium">{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* EXTRACURRICULAR ACTIVITIES (ECA) */}
      {sectionVisibility.extracurricular && extracurricular && extracurricular.length > 0 && (
        <section className="mb-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Extracurricular (ECA)
              </h2>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-2.5">
              {extracurricular.map((item) => (
                <div key={item.id} data-cv-item="true" className="cv-item-avoid-break space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{item.activity}</span>
                      {item.role && <span className="text-[11px] font-semibold text-[#0e4194]"> — {item.role}</span>}
                      {item.organization && <span className="text-[11px] text-slate-600"> · {item.organization}</span>}
                    </div>
                    {(item.startDate || item.endDate) && (
                      <span className="text-[10px] text-slate-500 font-medium">
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
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* LEADERSHIP & VOLUNTEERING */}
      {sectionVisibility.leadership && leadership.length > 0 && (
        <section className="mb-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Leadership & Volunteering
              </h2>
            </div>

            <div className="col-span-8 space-y-2">
              {leadership.map((lead) => (
                <div key={lead.id} data-cv-item="true" className="cv-item-avoid-break space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <div className="text-xs font-bold text-slate-900">
                      {lead.role}
                      {lead.organization && <span className="text-[11px] text-slate-600 font-normal"> — {lead.organization}</span>}
                    </div>
                    {(lead.startDate || lead.endDate) && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {[lead.startDate, lead.endDate].filter(Boolean).join(' – ')}
                      </span>
                    )}
                  </div>
                  {lead.bullets && lead.bullets.length > 0 && (
                    <ul className="list-disc ml-4 text-[11px] text-slate-700 space-y-0.5">
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
          </div>
          <div className="border-b border-slate-200 mt-4" />
        </section>
      )}

      {/* ADDITIONAL INFORMATION / INTERESTS */}
      {((sectionVisibility.interests && interests.length > 0) || (sectionVisibility.references && references.length > 0)) && (
        <section className="cv-item-avoid-break" data-cv-item="true">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <h2 style={{ color: europassBlue }} className="text-xs font-bold uppercase tracking-wider cv-heading">
                Additional Information
              </h2>
            </div>

            <div className="col-span-12 sm:col-span-8 space-y-2 text-[11px]">
              {sectionVisibility.interests && interests.length > 0 && (
                <div>
                  <strong className="text-slate-900">Hobbies and interests: </strong>
                  <span className="text-slate-700">{interests.join(', ')}</span>
                </div>
              )}
              {sectionVisibility.references && references.length > 0 && (
                <div>
                  <strong className="text-slate-900">References: </strong>
                  <span className="text-slate-700">
                    {references.map((r) => `${r.name} (${r.title}, ${r.organization})`).join('; ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
