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

export const ATSTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, education, experience, projects, skillCategories, certifications, leadership, languages, interests, references, sectionVisibility } = cv;

  return (
    <div className="font-modern text-black text-[12px] leading-normal p-12 bg-white min-h-[1050px]">
      <header className="pb-3 mb-3 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-black">
          {personal.fullName || 'Candidate Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-xs font-semibold text-gray-800 uppercase mt-0.5">
            {personal.jobTitle}
          </p>
        )}
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
      </header>

      {sectionVisibility.summary && personal.summary && (
        <section className="mb-3.5 cv-section-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-black leading-relaxed text-[11px]">
            {renderSentenceSpans(personal.summary)}
          </p>
        </section>
      )}

      {sectionVisibility.skills && skillCategories.length > 0 && (
        <section className="mb-3.5 cv-section-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Skills
          </h2>
          <div className="space-y-1 text-[11px]">
            {skillCategories.map((cat) => cat.skills.length > 0 && (
              <div key={cat.id}>
                <strong>{cat.name}: </strong>
                <span>{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionVisibility.experience && experience.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex justify-between items-baseline font-bold text-black text-[11.5px]">
                  <span>{exp.jobTitle} - {exp.company}</span>
                  <span>{[exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' - ')}</span>
                </div>
                {exp.location && <div className="text-[10.5px] text-gray-700 italic">{exp.location}</div>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-black mt-1">
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

      {sectionVisibility.education && education.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex justify-between items-baseline font-bold text-black text-[11.5px]">
                  <span>{edu.institution}</span>
                  <span>{[edu.startDate, edu.isCurrent ? 'Present' : edu.endDate].filter(Boolean).join(' - ')}</span>
                </div>
                <div className="text-[11px] text-black">
                  {[edu.degree, edu.major].filter(Boolean).join(', ')}
                </div>
                {edu.gpa && <div className="text-[10.5px] text-gray-800">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionVisibility.projects && projects.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Projects
          </h2>
          <div className="space-y-2 text-[11px]">
            {projects.map((proj) => (
              <div key={proj.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{proj.name}</span>
                  {(proj.startDate || proj.endDate) && (
                    <span>{[proj.startDate, proj.endDate].filter(Boolean).join(' - ')}</span>
                  )}
                </div>
                {proj.technologies && <div className="italic text-gray-800">Technologies: {proj.technologies}</div>}
                {proj.description && (
                  <p className="text-black mt-0.5">
                    {renderSentenceSpans(proj.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionVisibility.certifications && certifications.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Certifications
          </h2>
          <div className="space-y-1 text-[11px]">
            {certifications.map((c) => (
              <div key={c.id} data-cv-item="true" className="cv-item-avoid-break flex justify-between items-baseline">
                <span><strong>{c.name}</strong>{c.issuer ? ` - ${c.issuer}` : ''}</span>
                {c.issueDate && <span>{c.issueDate}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionVisibility.leadership && leadership.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Leadership & Governance
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {leadership.map((l) => (
              <div key={l.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="font-bold">{l.role}{l.organization ? ` - ${l.organization}` : ''}</div>
                {l.bullets && (
                  <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-black mt-0.5">
                    {l.bullets.map((b, i) => b.trim() && (
                      <li key={i} className="leading-snug">
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

      {sectionVisibility.extracurricular && cv.extracurricular && cv.extracurricular.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Extracurricular Activities (ECA)
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {cv.extracurricular.map((item) => (
              <div key={item.id} data-cv-item="true" className="cv-item-avoid-break">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{item.activity}{item.role ? ` - ${item.role}` : ''}</span>
                  {(item.startDate || item.endDate) && (
                    <span>{[item.startDate, item.isCurrent ? 'Present' : item.endDate].filter(Boolean).join(' - ')}</span>
                  )}
                </div>
                {item.organization && <div className="italic text-gray-800">{item.organization}</div>}
                {item.bullets && (
                  <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-black mt-0.5">
                    {item.bullets.map((b, i) => b.trim() && (
                      <li key={i} className="leading-snug">
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

      {(sectionVisibility.languages || sectionVisibility.interests) && (
        <section className="mb-3.5 cv-item-avoid-break" data-cv-item="true">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 cv-heading">
            Additional Information
          </h2>
          <div className="text-[11px] space-y-1">
            {sectionVisibility.languages && languages.length > 0 && (
              <div><strong>Languages:</strong> {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}</div>
            )}
            {sectionVisibility.interests && interests.length > 0 && (
              <div><strong>Interests:</strong> {interests.join(', ')}</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
