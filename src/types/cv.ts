/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TemplateId = 'academic' | 'data-analyst' | 'premium-navy' | 'ats' | 'europass';
export type FontFamily = 'academic' | 'modern' | 'editorial' | 'mono';
export type FontSize = 'sm' | 'base' | 'lg';
export type Spacing = 'compact' | 'normal' | 'relaxed';

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  photoUrl?: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  summary: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  major: string;
  gpa?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  location?: string;
  coursework?: string;
  achievements?: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  employmentType?: string; // Full-time, Internship, Contract, Part-time
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
}

export interface LeadershipItem {
  id: string;
  role: string;
  organization: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  bullets: string[];
}

export interface ExtracurricularItem {
  id: string;
  activity: string;
  role: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  bullets: string[];
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Elementary';
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  email?: string;
  phone?: string;
}

export interface SectionVisibility {
  summary: boolean;
  education: boolean;
  experience: boolean;
  projects: boolean;
  skills: boolean;
  certifications: boolean;
  leadership: boolean;
  extracurricular: boolean;
  languages: boolean;
  interests: boolean;
  references: boolean;
}

export interface CustomizationOptions {
  templateId: TemplateId;
  fontFamily: FontFamily;
  fontSize: FontSize;
  accentColor: string;
  spacing: Spacing;
  showPhoto: boolean;
}

export interface CVData {
  id: string;
  title: string;
  updatedAt: string;
  personal: PersonalDetails;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  certifications: CertificationItem[];
  leadership: LeadershipItem[];
  extracurricular?: ExtracurricularItem[];
  languages: LanguageItem[];
  interests: string[];
  references: ReferenceItem[];
  sectionVisibility: SectionVisibility;
  customization: CustomizationOptions;
}
