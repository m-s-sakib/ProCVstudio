/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudentTemplateId = 'student-simple' | 'student-modern' | 'student-ats';

export interface StudentPersonal {
  fullName: string;
  photoUrl?: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface StudentEducation {
  id: string;
  institution: string;
  degree: string;
  department: string;
  currentYearSemester?: string;
  gpa?: string;
  startYear: string;
  graduationYear: string; // or Expected Graduation Year
}

export interface StudentSkills {
  technical: string[];
  computer: string[];
  communication: string[];
  other: string[];
}

export interface StudentProject {
  id: string;
  name: string;
  description: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
}

export interface StudentExperience {
  id: string;
  jobTitle: string; // or Internship Role
  company: string; // or Organization
  duration: string; // e.g. "Summer 2024 (3 Months)"
  responsibilities: string[];
}

export interface StudentCertification {
  id: string;
  name: string;
  organization?: string;
  link?: string;
  year?: string;
}

export interface StudentExtracurricular {
  id: string;
  title: string;
  category: 'Club Membership' | 'Volunteering' | 'Leadership Activities' | 'Sports' | 'Other';
  description?: string;
}

export interface StudentLanguage {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface StudentReference {
  id: string;
  name: string;
  designation: string;
  institution: string;
  email?: string;
  phone?: string;
}

export interface StudentCVCustomization {
  accentColor: string;
  fontFamily: 'modern' | 'academic' | 'clean';
  fontSize: 'sm' | 'base' | 'lg';
}

export interface StudentCVData {
  id: string;
  title: string;
  updatedAt: string;
  templateId: StudentTemplateId;
  personal: StudentPersonal;
  objective: string;
  education: StudentEducation[];
  skills: StudentSkills;
  projects: StudentProject[];
  experience: StudentExperience[];
  certifications: StudentCertification[];
  extracurricular: StudentExtracurricular[];
  languages: StudentLanguage[];
  showReferences: boolean;
  references: StudentReference[];
  customization: StudentCVCustomization;
}
