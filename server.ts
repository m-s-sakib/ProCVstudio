/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import mammoth from 'mammoth';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Increase payload limit for base64 PDF and DOCX uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Shared server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GenerateWithFallbackOptions {
  contents: any[];
  config?: any;
  preferredModel?: string;
}

/**
 * Executes a Gemini request with automatic retry for 503/429 transient errors
 * and seamless fallback across alternative Flash models ('gemini-3.8-flash' -> 'gemini-flash-latest' -> 'gemini-3.1-flash-lite')
 */
async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  options: GenerateWithFallbackOptions
) {
  const models = [
    options.preferredModel || 'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;

  for (let m = 0; m < models.length; m++) {
    const model = models[m];
    // Attempt up to 2 times per model if encountering high demand/503/429
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err?.status || err || '');
        const isTransient =
          errStr.includes('503') ||
          errStr.includes('high demand') ||
          errStr.includes('UNAVAILABLE') ||
          errStr.includes('429') ||
          errStr.includes('RESOURCE_EXHAUSTED') ||
          err?.status === 503 ||
          err?.status === 429;

        if (isTransient) {
          console.warn(
            `[Gemini ${model}] Attempt ${attempt}/2 encountered transient error: ${errStr}`
          );
          if (attempt < 2) {
            // Wait 1.5s before second attempt
            await sleep(1500);
            continue;
          }
          // Move on to next fallback model
          console.warn(`[Gemini] Switching from ${model} to next fallback model...`);
          break;
        } else {
          // Non-transient error, rethrow
          throw err;
        }
      }
    }
  }

  throw lastError;
}

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/cv/extract
 * Extracts structured CV information from uploaded PDF or DOCX file using Gemini 3.8 Flash
 */
app.post('/api/cv/extract', async (req: Request, res: Response) => {
  try {
    const { fileData, fileName, fileType } = req.body;

    if (!fileData) {
      return res.status(400).json({ success: false, error: 'No file data received' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment secrets.',
      });
    }

    const ai = getAiClient();
    const cleanBase64 = fileData.replace(/^data:.*?;base64,/, '');

    const isPdf =
      fileType?.includes('pdf') ||
      fileName?.toLowerCase().endsWith('.pdf') ||
      fileData.startsWith('data:application/pdf');

    const isDocx =
      fileType?.includes('word') ||
      fileType?.includes('officedocument') ||
      fileName?.toLowerCase().endsWith('.docx') ||
      fileName?.toLowerCase().endsWith('.doc');

    let contentsParts: any[] = [];

    const extractionInstructions = `
You are an expert executive CV parser and career counselor.
Your task is to accurately read and extract all information from the provided CV document into a strictly valid JSON object matching the requested schema.

CRITICAL EXTRACTION RULES:
1. FACTUAL ACCURACY: Strictly preserve original dates, names, company titles, schools, GPA, achievements, contact details, and URLs.
2. NEVER INVENT: Never fabricate or hallucinate qualifications, experiences, contacts, or dates not present in the CV.
3. CONTACT LINKS: Accurately capture full email addresses, telephone numbers with country codes, physical address (city and country), LinkedIn URLs or handles, GitHub URLs, and personal portfolio links.
4. WORK EXPERIENCE: Extract each job title, employer/company, employment type (Full-time, Part-time, Internship, Contract), dates (start and end, or mark isCurrent: true if current/present), location, and clean descriptive bullet points.
5. EDUCATION: Extract institution names, degrees (BSc, MSc, PhD, High School, etc.), major/field, GPA (if stated), dates, location, relevant coursework, and honors/awards.
6. SKILLS: Categorize skills sensibly (e.g. "Technical Skills", "Tools & Frameworks", "Languages", "Soft Skills") with individual skill items.
7. PROJECTS & CERTIFICATIONS: Extract project names, descriptions, technologies used, URLs, certification issuers, issue dates, and verification links.
8. SUMMARY: Extract the executive summary or career objective verbatim or with clean sentence flow.
9. PRESERVE ORIGINAL MEANING: Do not alter factual dates, metrics, or technologies.
`;

    if (isPdf) {
      // Gemini 3.8 Flash natively handles multimodal PDF documents including tables, columns, and OCR
      contentsParts = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanBase64,
          },
        },
        {
          text: `${extractionInstructions}\n\nParse this uploaded PDF CV and return the structured JSON object.`,
        },
      ];
    } else if (isDocx) {
      // Extract text from Word DOCX using mammoth
      const buffer = Buffer.from(cleanBase64, 'base64');
      const mammothResult = await mammoth.extractRawText({ buffer });
      const rawText = mammothResult.value;

      if (!rawText || rawText.trim().length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Could not extract readable text from the uploaded DOCX document. Please verify the file is not empty or corrupted.',
        });
      }

      contentsParts = [
        {
          text: `${extractionInstructions}\n\nHere is the raw text extracted from the user's DOCX CV document:\n\n---\n${rawText}\n---`,
        },
      ];
    } else {
      // Fallback: try plain text decoding or pdf inspection
      try {
        const buffer = Buffer.from(cleanBase64, 'base64');
        const textContent = buffer.toString('utf-8');
        contentsParts = [
          {
            text: `${extractionInstructions}\n\nHere is the document content:\n\n---\n${textContent.slice(0, 50000)}\n---`,
          },
        ];
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: 'Unsupported document format. Please upload a PDF or Word (.docx) CV.',
        });
      }
    }

    const response = await generateContentWithRetryAndFallback(ai, {
      preferredModel: 'gemini-3.8-flash',
      contents: contentsParts,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personal: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                jobTitle: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                city: { type: Type.STRING },
                country: { type: Type.STRING },
                website: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ['fullName', 'email'],
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  major: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  isCurrent: { type: Type.BOOLEAN },
                  location: { type: Type.STRING },
                  coursework: { type: Type.STRING },
                  achievements: { type: Type.STRING },
                },
                required: ['institution'],
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobTitle: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  employmentType: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  isCurrent: { type: Type.BOOLEAN },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['jobTitle', 'company'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.STRING },
                  projectUrl: { type: Type.STRING },
                  githubUrl: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                },
                required: ['name'],
              },
            },
            skillCategories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['name', 'skills'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  issueDate: { type: Type.STRING },
                  expirationDate: { type: Type.STRING },
                  credentialId: { type: Type.STRING },
                  verificationUrl: { type: Type.STRING },
                },
                required: ['name', 'issuer'],
              },
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  proficiency: { type: Type.STRING },
                },
                required: ['name'],
              },
            },
            interests: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  title: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                },
                required: ['name'],
              },
            },
          },
          required: ['personal', 'education', 'experience'],
        },
      },
    });

    const parsedJsonText = response.text || '{}';
    const extractedData = JSON.parse(parsedJsonText);

    // Normalize IDs and fallback structures to ensure 100% compatibility with existing templates
    const normalizedCV = {
      id: `cv_ai_${Date.now()}`,
      title: `${extractedData.personal?.fullName || 'Extracted'}'s CV (AI Updated)`,
      updatedAt: new Date().toISOString(),
      personal: {
        fullName: extractedData.personal?.fullName || '',
        jobTitle: extractedData.personal?.jobTitle || '',
        photoUrl: '',
        email: extractedData.personal?.email || '',
        phone: extractedData.personal?.phone || '',
        city: extractedData.personal?.city || '',
        country: extractedData.personal?.country || '',
        website: extractedData.personal?.website || '',
        linkedin: extractedData.personal?.linkedin || '',
        github: extractedData.personal?.github || '',
        summary: extractedData.personal?.summary || '',
      },
      education: (extractedData.education || []).map((edu: any, i: number) => ({
        id: `edu_ai_${Date.now()}_${i}`,
        institution: edu.institution || '',
        degree: edu.degree || '',
        major: edu.major || '',
        gpa: edu.gpa || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        isCurrent: Boolean(edu.isCurrent),
        location: edu.location || '',
        coursework: edu.coursework || '',
        achievements: edu.achievements || '',
      })),
      experience: (extractedData.experience || []).map((exp: any, i: number) => ({
        id: `exp_ai_${Date.now()}_${i}`,
        jobTitle: exp.jobTitle || '',
        company: exp.company || '',
        location: exp.location || '',
        employmentType: exp.employmentType || 'Full-time',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        isCurrent: Boolean(exp.isCurrent),
        bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
      })),
      projects: (extractedData.projects || []).map((proj: any, i: number) => ({
        id: `proj_ai_${Date.now()}_${i}`,
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || '',
        projectUrl: proj.projectUrl || '',
        githubUrl: proj.githubUrl || '',
        startDate: proj.startDate || '',
        endDate: proj.endDate || '',
      })),
      skillCategories: (extractedData.skillCategories || []).map((cat: any, i: number) => ({
        id: `skill_ai_${Date.now()}_${i}`,
        name: cat.name || 'Core Skills',
        skills: Array.isArray(cat.skills) ? cat.skills : [],
      })),
      certifications: (extractedData.certifications || []).map((cert: any, i: number) => ({
        id: `cert_ai_${Date.now()}_${i}`,
        name: cert.name || '',
        issuer: cert.issuer || '',
        issueDate: cert.issueDate || '',
        expirationDate: cert.expirationDate || '',
        credentialId: cert.credentialId || '',
        verificationUrl: cert.verificationUrl || '',
      })),
      leadership: [],
      languages: (extractedData.languages || []).map((lang: any, i: number) => ({
        id: `lang_ai_${Date.now()}_${i}`,
        name: lang.name || '',
        proficiency: lang.proficiency || 'Fluent',
      })),
      interests: Array.isArray(extractedData.interests) ? extractedData.interests : [],
      references: (extractedData.references || []).map((ref: any, i: number) => ({
        id: `ref_ai_${Date.now()}_${i}`,
        name: ref.name || '',
        title: ref.title || '',
        organization: ref.organization || '',
        email: ref.email || '',
        phone: ref.phone || '',
      })),
      sectionVisibility: {
        summary: Boolean(extractedData.personal?.summary),
        education: Boolean(extractedData.education?.length),
        experience: Boolean(extractedData.experience?.length),
        projects: Boolean(extractedData.projects?.length),
        skills: Boolean(extractedData.skillCategories?.length),
        certifications: Boolean(extractedData.certifications?.length),
        leadership: false,
        extracurricular: false,
        languages: Boolean(extractedData.languages?.length),
        interests: Boolean(extractedData.interests?.length),
        references: Boolean(extractedData.references?.length),
      },
      customization: {
        templateId: 'data-analyst',
        fontFamily: 'modern',
        fontSize: 'base',
        accentColor: '#1e3a8a',
        spacing: 'normal',
        showPhoto: false,
      },
    };

    return res.json({
      success: true,
      cv: normalizedCV,
      message: 'CV information extracted and organized successfully.',
    });
  } catch (error: any) {
    console.error('Error during AI CV extraction:', error);
    const errText = String(error?.message || error?.status || error || '');
    let friendlyMessage = 'Failed to extract CV details. Please check the document format and try again.';
    if (errText.includes('503') || errText.includes('high demand') || errText.includes('UNAVAILABLE')) {
      friendlyMessage = 'The AI service is experiencing high demand right now. Spikes in demand are usually temporary. Please click "Try Again" in a few moments.';
    }
    return res.status(500).json({
      success: false,
      error: friendlyMessage,
    });
  }
});

/**
 * POST /api/cv/improve-text
 * AI-powered writing polish that enhances phrasing, clarity, and professionalism without modifying facts
 */
app.post('/api/cv/improve-text', async (req: Request, res: Response) => {
  try {
    const { text, fieldType, roleContext } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text is required for improvement' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key is not configured.',
      });
    }

    const ai = getAiClient();

    const response = await generateContentWithRetryAndFallback(ai, {
      preferredModel: 'gemini-3.8-flash',
      contents: [
        {
          text: `You are an expert executive resume editor and recruiter.
Improve the following CV text (${fieldType || 'text block'}) to sound more impactful, active, and professional.
CRITICAL RULES:
- Strictly preserve all factual claims, tools, companies, metrics, and dates.
- Do NOT fabricate or invent anything new.
- Use strong action verbs (e.g., Spearheaded, Engineered, Accelerated, Orchestrated).
- Keep the length concise, matching standard professional resume conventions.
- Return ONLY the improved text directly without conversational commentary, markdown wrappers or preamble.

Context: ${roleContext || 'General Professional'}
Original Text:
"${text}"`,
        },
      ],
    });

    const improved = response.text?.trim() || text;

    return res.json({
      success: true,
      improvedText: improved,
    });
  } catch (error: any) {
    console.error('Error improving text:', error);
    const errText = String(error?.message || error?.status || error || '');
    let friendlyMessage = 'Failed to improve text. Please try again.';
    if (errText.includes('503') || errText.includes('high demand') || errText.includes('UNAVAILABLE')) {
      friendlyMessage = 'The AI service is experiencing high demand right now. Please try again in a few moments.';
    }
    return res.status(500).json({
      success: false,
      error: friendlyMessage,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
