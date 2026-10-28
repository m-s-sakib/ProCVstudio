/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { StudentCVData } from '../types/studentCv';
import { normalizeUrl } from './links';
import { applyPageBoundaries } from './pagination';
import { downloadPdfSafely, downloadBlobFile, getSafeCanvasScale } from './mobileDownload';

export interface ExportStudentPdfOptions {
  elementId?: string;
}

/**
 * Downloads a high-resolution PDF for the Student CV with clickable links,
 * consistent page margins, and intelligent page breaks preventing sentence splitting.
 */
export async function exportStudentPdf(
  cv: StudentCVData,
  options?: ExportStudentPdfOptions
): Promise<{ blobUrl: string }> {
  const elementId = options?.elementId || 'student-cv-render';
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Student CV document element not found for PDF export.');
  }

  // Neutralize ancestor transforms
  const ancestorTransforms: Array<{ el: HTMLElement; transform: string; transition: string }> = [];
  let ancestor = element.parentElement;
  while (ancestor && ancestor !== document.body) {
    if (ancestor.style.transform && ancestor.style.transform !== 'none') {
      ancestorTransforms.push({
        el: ancestor,
        transform: ancestor.style.transform,
        transition: ancestor.style.transition,
      });
      ancestor.style.transform = 'none';
      ancestor.style.transition = 'none';
    }
    ancestor = ancestor.parentElement;
  }

  const originalTransform = element.style.transform;
  const originalTransition = element.style.transition;
  element.style.transform = 'none';
  element.style.transition = 'none';

  const originalMinHeight = element.style.minHeight;

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Apply intelligent page breaks to prevent sentence/block splitting
    applyPageBoundaries(element);

    const targetWidth = element.offsetWidth || 794;
    const pageHeightPx = Math.round(targetWidth * (297 / 210));
    const totalPages = Math.max(1, Math.ceil((element.offsetHeight - 20) / pageHeightPx));

    // Pad container to exact multiple of A4 page height for full background coverage
    element.style.minHeight = `${totalPages * pageHeightPx}px`;

    const containerRect = element.getBoundingClientRect();
    const linkElements = Array.from(element.querySelectorAll('a[href]'));

    const linksData = linkElements.map((a) => {
      const rect = a.getBoundingClientRect();
      return {
        href: (a as HTMLAnchorElement).href,
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        w: rect.width,
        h: rect.height,
      };
    });

    const safeScale = getSafeCanvasScale(element.offsetHeight);

    const canvas = await html2canvas(element, {
      scale: safeScale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: targetWidth,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc, clonedElement) => {
        clonedElement.style.transform = 'none';
        clonedElement.style.transition = 'none';
        let p = clonedElement.parentElement;
        while (p && p !== clonedDoc.body) {
          p.style.transform = 'none';
          p.style.transition = 'none';
          p = p.parentElement;
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pageHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 1;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages
    while (heightLeft > 2) {
      position = -(pageCount * pageHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      pageCount++;
    }

    // Embed links
    const mmPerPx = pdfWidth / containerRect.width;
    linksData.forEach((link) => {
      if (!link.href || link.w <= 0 || link.h <= 0) return;
      const xMm = link.x * mmPerPx;
      const yMm = link.y * mmPerPx;
      const wMm = Math.max(link.w * mmPerPx, 2);
      const hMm = Math.max(link.h * mmPerPx, 2);

      const targetPage = Math.floor(yMm / pageHeight) + 1;
      const yOnPageMm = yMm % pageHeight;

      if (targetPage <= pageCount) {
        pdf.setPage(targetPage);
        pdf.link(xMm, yOnPageMm, wMm, hMm, { url: link.href });
      }
    });

    const cleanName = (cv.personal.fullName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const { blobUrl } = downloadPdfSafely(pdf, `${cleanName}_Student_CV.pdf`);
    return { blobUrl };
  } finally {
    element.style.minHeight = originalMinHeight;
    ancestorTransforms.forEach(({ el, transform, transition }) => {
      el.style.transform = transform;
      el.style.transition = transition;
    });
    element.style.transform = originalTransform;
    element.style.transition = originalTransition;
    // Re-apply boundaries for the live preview
    applyPageBoundaries(element);
  }
}

/**
 * Downloads native editable Word (.docx) for the Student CV
 */
export async function exportStudentDocx(cv: StudentCVData): Promise<{ blobUrl: string }> {
  const font = 'Arial';
  const primaryColor = cv.templateId === 'student-modern' ? '1D4ED8' : '111827';

  const children: Paragraph[] = [];

  // 1. Full Name
  children.push(
    new Paragraph({
      alignment: cv.templateId === 'student-simple' ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: cv.personal.fullName || 'Student Name',
          bold: true,
          size: 36, // 18pt
          font,
          color: primaryColor,
        }),
      ],
    })
  );

  // 2. Contact details line
  const contactParts: (TextRun | ExternalHyperlink)[] = [];
  const addDivider = () => {
    if (contactParts.length > 0) {
      contactParts.push(new TextRun({ text: '  |  ', font, size: 18, color: '64748B' }));
    }
  };

  if (cv.personal.email) {
    addDivider();
    contactParts.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: cv.personal.email, font, size: 18, color: '0284C7', underline: {} })],
        link: `mailto:${cv.personal.email}`,
      })
    );
  }

  if (cv.personal.phone) {
    addDivider();
    contactParts.push(new TextRun({ text: cv.personal.phone, font, size: 18, color: '334155' }));
  }

  if (cv.personal.city || cv.personal.country) {
    addDivider();
    const loc = [cv.personal.city, cv.personal.country].filter(Boolean).join(', ');
    contactParts.push(new TextRun({ text: loc, font, size: 18, color: '334155' }));
  }

  if (cv.personal.linkedin) {
    addDivider();
    contactParts.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: 'LinkedIn Profile', font, size: 18, color: '0284C7', underline: {} })],
        link: normalizeUrl(cv.personal.linkedin),
      })
    );
  }

  if (cv.personal.github) {
    addDivider();
    contactParts.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: 'GitHub Profile', font, size: 18, color: '0284C7', underline: {} })],
        link: normalizeUrl(cv.personal.github),
      })
    );
  }

  if (cv.personal.website) {
    addDivider();
    contactParts.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: 'Portfolio Website', font, size: 18, color: '0284C7', underline: {} })],
        link: normalizeUrl(cv.personal.website),
      })
    );
  }

  children.push(
    new Paragraph({
      alignment: cv.templateId === 'student-simple' ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 180 },
      children: contactParts,
    })
  );

  const makeHeading = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          font,
          color: primaryColor,
        }),
      ],
    });
  };

  // 3. Career Objective
  if (cv.objective && cv.objective.trim()) {
    children.push(makeHeading('Career Objective'));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: cv.objective, font, size: 20, color: '1E293B' })],
      })
    );
  }

  // 4. Education
  if (cv.education && cv.education.length > 0) {
    children.push(makeHeading('Education'));
    cv.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 30 },
          children: [
            new TextRun({
              text: `${edu.degree}${edu.department ? ` in ${edu.department}` : ''}`,
              bold: true,
              font,
              size: 21,
              color: '0F172A',
            }),
            new TextRun({
              text: `  (${[edu.startYear, edu.graduationYear].filter(Boolean).join(' – ')})`,
              font,
              size: 19,
              color: '475569',
            }),
          ],
        })
      );

      const eduSubParts: string[] = [edu.institution];
      if (edu.currentYearSemester) eduSubParts.push(edu.currentYearSemester);
      if (edu.gpa) eduSubParts.push(`GPA: ${edu.gpa}`);

      children.push(
        new Paragraph({
          spacing: { after: 90 },
          children: [
            new TextRun({
              text: eduSubParts.join('  •  '),
              font,
              size: 19,
              color: '334155',
            }),
          ],
        })
      );
    });
  }

  // 5. Skills
  const hasSkills =
    cv.skills.technical.length > 0 ||
    cv.skills.computer.length > 0 ||
    cv.skills.communication.length > 0 ||
    cv.skills.other.length > 0;

  if (hasSkills) {
    children.push(makeHeading('Skills & Competencies'));
    if (cv.skills.technical.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Technical Skills: ', bold: true, font, size: 20 }),
            new TextRun({ text: cv.skills.technical.join(', '), font, size: 20, color: '334155' }),
          ],
        })
      );
    }
    if (cv.skills.computer.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Computer & Software Tools: ', bold: true, font, size: 20 }),
            new TextRun({ text: cv.skills.computer.join(', '), font, size: 20, color: '334155' }),
          ],
        })
      );
    }
    if (cv.skills.communication.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Communication Skills: ', bold: true, font, size: 20 }),
            new TextRun({ text: cv.skills.communication.join(', '), font, size: 20, color: '334155' }),
          ],
        })
      );
    }
    if (cv.skills.other.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'Other Relevant Strengths: ', bold: true, font, size: 20 }),
            new TextRun({ text: cv.skills.other.join(', '), font, size: 20, color: '334155' }),
          ],
        })
      );
    }
  }

  // 6. Projects
  if (cv.projects && cv.projects.length > 0) {
    children.push(makeHeading('Academic & Personal Projects'));
    cv.projects.forEach((proj) => {
      const projChildren: (TextRun | ExternalHyperlink)[] = [
        new TextRun({ text: proj.name, bold: true, font, size: 21, color: '0F172A' }),
      ];

      if (proj.technologies) {
        projChildren.push(
          new TextRun({ text: `  [Tech: ${proj.technologies}]`, font, size: 19, color: '2563EB' })
        );
      }

      children.push(
        new Paragraph({
          spacing: { before: 60, after: 30 },
          children: projChildren,
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: proj.description, font, size: 20, color: '334155' })],
          })
        );
      }

      if (proj.projectUrl || proj.githubUrl) {
        const linkRuns: (TextRun | ExternalHyperlink)[] = [];
        if (proj.projectUrl) {
          linkRuns.push(
            new ExternalHyperlink({
              children: [new TextRun({ text: 'Live Demo', font, size: 18, color: '0284C7', underline: {} })],
              link: normalizeUrl(proj.projectUrl),
            })
          );
        }
        if (proj.projectUrl && proj.githubUrl) {
          linkRuns.push(new TextRun({ text: '  •  ', font, size: 18, color: '94A3B8' }));
        }
        if (proj.githubUrl) {
          linkRuns.push(
            new ExternalHyperlink({
              children: [new TextRun({ text: 'GitHub Repository', font, size: 18, color: '0284C7', underline: {} })],
              link: normalizeUrl(proj.githubUrl),
            })
          );
        }

        children.push(
          new Paragraph({
            spacing: { after: 90 },
            children: linkRuns,
          })
        );
      }
    });
  }

  // 7. Work / Internship Experience (Optional)
  if (cv.experience && cv.experience.length > 0) {
    children.push(makeHeading('Work Experience & Internships'));
    cv.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 30 },
          children: [
            new TextRun({
              text: `${exp.jobTitle} — ${exp.company}`,
              bold: true,
              font,
              size: 21,
              color: '0F172A',
            }),
            new TextRun({ text: `  (${exp.duration})`, font, size: 19, color: '475569' }),
          ],
        })
      );

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities
          .filter((r) => r.trim())
          .forEach((resp) => {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [new TextRun({ text: resp, font, size: 20, color: '334155' })],
              })
            );
          });
      }
    });
  }

  // 8. Certifications & Achievements (Optional)
  if (cv.certifications && cv.certifications.length > 0) {
    children.push(makeHeading('Certifications & Achievements'));
    cv.certifications.forEach((cert) => {
      const runs: (TextRun | ExternalHyperlink)[] = [
        new TextRun({ text: cert.name, bold: true, font, size: 20, color: '0F172A' }),
      ];
      if (cert.organization) {
        runs.push(new TextRun({ text: ` — ${cert.organization}`, font, size: 20, color: '475569' }));
      }
      if (cert.year) {
        runs.push(new TextRun({ text: ` (${cert.year})`, font, size: 19, color: '64748B' }));
      }
      if (cert.link) {
        runs.push(new TextRun({ text: '  ', font, size: 18 }));
        runs.push(
          new ExternalHyperlink({
            children: [new TextRun({ text: '[Verify]', font, size: 18, color: '0284C7', underline: {} })],
            link: normalizeUrl(cert.link),
          })
        );
      }
      children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: runs }));
    });
  }

  // 9. Extracurricular Activities (Optional)
  if (cv.extracurricular && cv.extracurricular.length > 0) {
    children.push(makeHeading('Extracurricular & Leadership Activities'));
    cv.extracurricular.forEach((eca) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({ text: eca.title, bold: true, font, size: 20, color: '0F172A' }),
            new TextRun({ text: ` (${eca.category})`, font, size: 18, color: '2563EB' }),
          ],
        })
      );
      if (eca.description) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: eca.description, font, size: 19, color: '334155' })],
          })
        );
      }
    });
  }

  // 10. Languages
  if (cv.languages && cv.languages.length > 0) {
    children.push(makeHeading('Languages'));
    const langString = cv.languages.map((l) => `${l.name} (${l.proficiency})`).join('  •  ');
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: langString, font, size: 20, color: '1E293B' })],
      })
    );
  }

  // 11. References (Only if enabled)
  if (cv.showReferences && cv.references && cv.references.length > 0) {
    children.push(makeHeading('References'));
    cv.references.forEach((ref) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [new TextRun({ text: ref.name, bold: true, font, size: 20, color: '0F172A' })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${ref.designation}, ${ref.institution}${ref.email ? ` | ${ref.email}` : ''}${ref.phone ? ` | ${ref.phone}` : ''}`,
              font,
              size: 19,
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
            margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5 inch margins
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (cv.personal.fullName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_Student_CV.docx`;
  return downloadBlobFile(blob, filename);
}

/**
 * Print student CV via browser print dialog
 */
export function printStudentCV(cv?: StudentCVData): void {
  const originalTitle = document.title;
  if (cv?.personal.fullName) {
    const cleanName = cv.personal.fullName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `${cleanName}_Student_CV`;
  }
  window.print();
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
