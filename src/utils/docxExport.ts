/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { CVData } from '../types/cv';
import { formatUrlLabel, normalizeUrl } from './links';

export async function exportToDocx(cv: CVData): Promise<void> {
  const isAcademic = cv.customization.templateId === 'academic';
  const isNavy = cv.customization.templateId === 'premium-navy';
  const isEuropass = cv.customization.templateId === 'europass';
  const font = isAcademic ? 'Georgia' : 'Arial';
  const primaryColor = isEuropass ? '0E4194' : isNavy ? '0F2B48' : isAcademic ? '1E293B' : '1E3A8A';

  const noBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  const children: (Paragraph | Table)[] = [];

  // --- HEADER: NAME & JOB TITLE ---
  if (cv.personal.fullName) {
    children.push(
      new Paragraph({
        alignment: isAcademic ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: cv.personal.fullName,
            bold: true,
            size: isAcademic ? 36 : 40, // 18pt or 20pt
            font,
            color: primaryColor,
          }),
        ],
      })
    );
  }

  if (cv.personal.jobTitle && !isAcademic) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: isEuropass ? `POSITION APPLIED FOR: ${cv.personal.jobTitle}` : cv.personal.jobTitle,
            size: isEuropass ? 20 : 24, // 10pt or 12pt
            bold: isEuropass,
            font,
            color: isEuropass ? '0E4194' : '475569',
          }),
        ],
      })
    );
  }

  // --- CONTACT ROW WITH HYPERLINKS ---
  const contactRuns: (TextRun | ExternalHyperlink)[] = [];

  const addSeparator = () => {
    if (contactRuns.length > 0) {
      contactRuns.push(
        new TextRun({
          text: '  |  ',
          size: 18,
          font,
          color: '94A3B8',
        })
      );
    }
  };

  if (cv.personal.email) {
    addSeparator();
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: cv.personal.email,
            size: 18,
            font,
            color: '0284C7',
            underline: {},
          }),
        ],
        link: `mailto:${cv.personal.email.trim()}`,
      })
    );
  }

  if (cv.personal.phone) {
    addSeparator();
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: cv.personal.phone,
            size: 18,
            font,
            color: '334155',
          }),
        ],
        link: `tel:${cv.personal.phone.trim().replace(/[^0-9+]/g, '')}`,
      })
    );
  }

  if (cv.personal.city || cv.personal.country) {
    addSeparator();
    const loc = [cv.personal.city, cv.personal.country].filter(Boolean).join(', ');
    contactRuns.push(
      new TextRun({
        text: loc,
        size: 18,
        font,
        color: '334155',
      })
    );
  }

  if (cv.personal.linkedin) {
    addSeparator();
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: formatUrlLabel(cv.personal.linkedin, 'LinkedIn'),
            size: 18,
            font,
            color: '0284C7',
            underline: {},
          }),
        ],
        link: normalizeUrl(cv.personal.linkedin),
      })
    );
  }

  if (cv.personal.github) {
    addSeparator();
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: formatUrlLabel(cv.personal.github, 'GitHub'),
            size: 18,
            font,
            color: '0284C7',
            underline: {},
          }),
        ],
        link: normalizeUrl(cv.personal.github),
      })
    );
  }

  if (cv.personal.website) {
    addSeparator();
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: formatUrlLabel(cv.personal.website, 'Portfolio'),
            size: 18,
            font,
            color: '0284C7',
            underline: {},
          }),
        ],
        link: normalizeUrl(cv.personal.website),
      })
    );
  }

  if (contactRuns.length > 0) {
    children.push(
      new Paragraph({
        alignment: isAcademic ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 180 },
        children: contactRuns,
      })
    );
  }

  // Helper for Section Heading
  const addSectionHeader = (title: string) => {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: primaryColor,
            space: 4,
            style: BorderStyle.SINGLE,
            size: isEuropass ? 10 : isNavy ? 12 : 6,
          },
        },
        children: [
          new TextRun({
            text: isAcademic || isEuropass ? title.toUpperCase() : title,
            bold: true,
            size: 22, // 11pt
            font,
            color: primaryColor,
          }),
        ],
      })
    );
  };

  // Helper for 2-column header row (Left: Title/Degree, Right: Date/Location)
  const createSplitRow = (leftRuns: (TextRun | ExternalHyperlink)[], rightRuns: TextRun[]) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: noBorders,
              children: [
                new Paragraph({
                  spacing: { after: 40 },
                  children: leftRuns,
                }),
              ],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              borders: noBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 40 },
                  children: rightRuns,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // --- SUMMARY ---
  if (cv.sectionVisibility.summary && cv.personal.summary) {
    addSectionHeader(isAcademic ? 'RESEARCH PROFILE' : 'PROFESSIONAL SUMMARY');
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: cv.personal.summary,
            size: 19,
            font,
            color: '334155',
          }),
        ],
      })
    );
  }

  // --- EDUCATION ---
  if (cv.sectionVisibility.education && cv.education.length > 0) {
    addSectionHeader('EDUCATION');
    cv.education.forEach((edu) => {
      const leftRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: edu.institution,
          bold: true,
          size: 20,
          font,
          color: '0F172A',
        }),
      ];
      if (edu.degree || edu.major) {
        const degreeInfo = [edu.degree, edu.major].filter(Boolean).join(' in ');
        leftRuns.push(
          new TextRun({
            text: ` — ${degreeInfo}`,
            italics: true,
            size: 19,
            font,
            color: '334155',
          })
        );
      }

      const dateStr = [edu.startDate, edu.isCurrent ? 'Present' : edu.endDate].filter(Boolean).join(' – ');
      const rightRuns: TextRun[] = [];
      if (dateStr) {
        rightRuns.push(
          new TextRun({
            text: dateStr,
            bold: isAcademic,
            italics: !isAcademic,
            size: 18,
            font,
            color: '475569',
          })
        );
      }

      children.push(createSplitRow(leftRuns, rightRuns));

      if (edu.gpa) {
        children.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({ text: 'GPA/Grade: ', bold: true, size: 18, font, color: '334155' }),
              new TextRun({ text: edu.gpa, size: 18, font, color: '475569' }),
            ],
          })
        );
      }

      if (edu.coursework) {
        children.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({ text: 'Relevant Coursework: ', bold: true, size: 18, font, color: '334155' }),
              new TextRun({ text: edu.coursework, size: 18, font, color: '475569' }),
            ],
          })
        );
      }

      if (edu.achievements) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Honors & Achievements: ', bold: true, size: 18, font, color: '334155' }),
              new TextRun({ text: edu.achievements, size: 18, font, color: '475569' }),
            ],
          })
        );
      }
    });
  }

  // --- WORK EXPERIENCE ---
  if (cv.sectionVisibility.experience && cv.experience.length > 0) {
    addSectionHeader(isAcademic ? 'RESEARCH & ACADEMIC APPOINTMENTS' : 'WORK EXPERIENCE');
    cv.experience.forEach((exp) => {
      const leftRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: exp.jobTitle,
          bold: true,
          size: 20,
          font,
          color: '0F172A',
        }),
        new TextRun({
          text: ` | ${exp.company}`,
          italics: true,
          size: 19,
          font,
          color: primaryColor,
        }),
      ];

      if (exp.location) {
        leftRuns.push(
          new TextRun({
            text: ` (${exp.location})`,
            size: 18,
            font,
            color: '64748B',
          })
        );
      }

      const dateStr = [exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' – ');
      const rightRuns: TextRun[] = [
        new TextRun({
          text: dateStr,
          italics: true,
          size: 18,
          font,
          color: '475569',
        }),
      ];

      children.push(createSplitRow(leftRuns, rightRuns));

      exp.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 19,
                  font,
                  color: '334155',
                }),
              ],
            })
          );
        }
      });
    });
  }

  // --- PROJECTS ---
  if (cv.sectionVisibility.projects && cv.projects.length > 0) {
    addSectionHeader(isAcademic ? 'PUBLICATIONS & RESEARCH PROJECTS' : 'KEY PROJECTS');
    cv.projects.forEach((proj) => {
      const leftRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: proj.name,
          bold: true,
          size: 20,
          font,
          color: '0F172A',
        }),
      ];

      if (proj.githubUrl) {
        leftRuns.push(new TextRun({ text: '  [', size: 17, font, color: '94A3B8' }));
        leftRuns.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: 'GitHub',
                size: 17,
                font,
                color: '0284C7',
                underline: {},
              }),
            ],
            link: normalizeUrl(proj.githubUrl),
          })
        );
        leftRuns.push(new TextRun({ text: ']', size: 17, font, color: '94A3B8' }));
      }

      if (proj.projectUrl) {
        leftRuns.push(new TextRun({ text: '  [', size: 17, font, color: '94A3B8' }));
        leftRuns.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: 'Demo',
                size: 17,
                font,
                color: '0284C7',
                underline: {},
              }),
            ],
            link: normalizeUrl(proj.projectUrl),
          })
        );
        leftRuns.push(new TextRun({ text: ']', size: 17, font, color: '94A3B8' }));
      }

      const dateStr = [proj.startDate, proj.endDate].filter(Boolean).join(' – ');
      const rightRuns: TextRun[] = dateStr
        ? [new TextRun({ text: dateStr, italics: true, size: 18, font, color: '475569' })]
        : [];

      children.push(createSplitRow(leftRuns, rightRuns));

      if (proj.technologies) {
        children.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({ text: 'Technologies: ', bold: true, size: 18, font, color: '334155' }),
              new TextRun({ text: proj.technologies, italics: true, size: 18, font, color: '475569' }),
            ],
          })
        );
      }

      if (proj.description) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: proj.description,
                size: 19,
                font,
                color: '334155',
              }),
            ],
          })
        );
      }
    });
  }

  // --- SKILLS ---
  if (cv.sectionVisibility.skills && cv.skillCategories.length > 0) {
    addSectionHeader('SKILLS & COMPETENCIES');
    cv.skillCategories.forEach((cat) => {
      if (cat.skills && cat.skills.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: `${cat.name}: `,
                bold: true,
                size: 19,
                font,
                color: '0F172A',
              }),
              new TextRun({
                text: cat.skills.join(', '),
                size: 19,
                font,
                color: '334155',
              }),
            ],
          })
        );
      }
    });
  }

  // --- CERTIFICATIONS ---
  if (cv.sectionVisibility.certifications && cv.certifications.length > 0) {
    addSectionHeader('CERTIFICATIONS');
    cv.certifications.forEach((cert) => {
      const leftRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: cert.name,
          bold: true,
          size: 19,
          font,
          color: '0F172A',
        }),
      ];

      if (cert.issuer) {
        leftRuns.push(
          new TextRun({
            text: ` — ${cert.issuer}`,
            size: 18,
            font,
            color: '475569',
          })
        );
      }

      if (cert.verificationUrl) {
        leftRuns.push(new TextRun({ text: '  [', size: 17, font, color: '94A3B8' }));
        leftRuns.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: 'Verify',
                size: 17,
                font,
                color: '0284C7',
                underline: {},
              }),
            ],
            link: normalizeUrl(cert.verificationUrl),
          })
        );
        leftRuns.push(new TextRun({ text: ']', size: 17, font, color: '94A3B8' }));
      }

      const dateStr = cert.issueDate ? `Issued: ${cert.issueDate}` : '';
      const rightRuns: TextRun[] = dateStr
        ? [new TextRun({ text: dateStr, italics: true, size: 18, font, color: '475569' })]
        : [];

      children.push(createSplitRow(leftRuns, rightRuns));
    });
  }

  // --- LEADERSHIP & ACTIVITIES ---
  if (cv.sectionVisibility.leadership && cv.leadership.length > 0) {
    addSectionHeader(isAcademic ? 'SERVICE & LEADERSHIP' : 'LEADERSHIP & ACTIVITIES');
    cv.leadership.forEach((lead) => {
      const leftRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: lead.role,
          bold: true,
          size: 19,
          font,
          color: '0F172A',
        }),
      ];
      if (lead.organization) {
        leftRuns.push(
          new TextRun({
            text: ` — ${lead.organization}`,
            italics: true,
            size: 18,
            font,
            color: '334155',
          })
        );
      }

      const dateStr = [lead.startDate, lead.endDate].filter(Boolean).join(' – ');
      const rightRuns: TextRun[] = dateStr
        ? [new TextRun({ text: dateStr, italics: true, size: 18, font, color: '475569' })]
        : [];

      children.push(createSplitRow(leftRuns, rightRuns));

      lead.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 19,
                  font,
                  color: '334155',
                }),
              ],
            })
          );
        }
      });
    });
  }

  // --- EXTRACURRICULAR ACTIVITIES (ECA) ---
  if (cv.sectionVisibility.extracurricular && cv.extracurricular && cv.extracurricular.length > 0) {
    addSectionHeader('EXTRACURRICULAR ACTIVITIES (ECA)');
    cv.extracurricular.forEach((item) => {
      const leftRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: item.activity,
          bold: true,
          size: 19,
          font,
          color: '0F172A',
        }),
      ];
      if (item.role) {
        leftRuns.push(
          new TextRun({
            text: ` — ${item.role}`,
            italics: true,
            size: 18,
            font,
            color: '334155',
          })
        );
      }
      if (item.organization) {
        leftRuns.push(
          new TextRun({
            text: ` (${item.organization})`,
            size: 18,
            font,
            color: '64748B',
          })
        );
      }

      const dateStr = [item.startDate, item.isCurrent ? 'Present' : item.endDate].filter(Boolean).join(' – ');
      const rightRuns: TextRun[] = dateStr
        ? [new TextRun({ text: dateStr, italics: true, size: 18, font, color: '475569' })]
        : [];

      children.push(createSplitRow(leftRuns, rightRuns));

      item.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 19,
                  font,
                  color: '334155',
                }),
              ],
            })
          );
        }
      });
    });
  }

  // --- LANGUAGES & INTERESTS ---
  const showLang = cv.sectionVisibility.languages && cv.languages.length > 0;
  const showInt = cv.sectionVisibility.interests && cv.interests.length > 0;
  if (showLang || showInt) {
    addSectionHeader('LANGUAGES & INTERESTS');
    if (showLang) {
      const langList = cv.languages.map((l) => `${l.name} (${l.proficiency})`).join(', ');
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Languages: ', bold: true, size: 19, font, color: '0F172A' }),
            new TextRun({ text: langList, size: 19, font, color: '334155' }),
          ],
        })
      );
    }
    if (showInt) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Interests: ', bold: true, size: 19, font, color: '0F172A' }),
            new TextRun({ text: cv.interests.join(', '), size: 19, font, color: '334155' }),
          ],
        })
      );
    }
  }

  // --- REFERENCES ---
  if (cv.sectionVisibility.references && cv.references.length > 0) {
    addSectionHeader('REFERENCES');
    cv.references.forEach((ref) => {
      children.push(
        new Paragraph({
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: `${ref.name} — ${ref.title}, ${ref.organization}`,
              bold: true,
              size: 19,
              font,
              color: '0F172A',
            }),
            new TextRun({
              text: [ref.email, ref.phone].filter(Boolean).join(' | '),
              size: 18,
              font,
              color: '475569',
            }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (cv.personal.fullName || 'Professional').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_CV.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
