/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BiodataTemplateId =
  | 'romantic-elegant'
  | 'traditional-islamic'
  | 'modern-minimal'
  | 'premium-floral'
  | 'classic-family';

export type BiodataColorTheme =
  | 'rose-gold'
  | 'royal-emerald'
  | 'burgundy-gold'
  | 'modern-slate'
  | 'floral-blush';

export type BiodataFontFamily = 'serif' | 'sans' | 'classic';

export interface BiodataPersonalInfo {
  fullName: string;
  photoUrl?: string;
  dateOfBirth?: string;
  age?: string;
  height?: string;
  religion?: string;
  casteOrSect?: string;
  maritalStatus?: string; // Never Married, Divorced, Widowed, Awaiting Divorce
  nationality?: string;
  complexion?: string;
  bloodGroup?: string;
  motherTongue?: string;
  currentLocation?: string; // City, State, Country
  permanentAddress?: string;
}

export interface BiodataEducationCareer {
  highestDegree?: string;
  majorOrField?: string;
  institution?: string;
  graduationYear?: string;
  additionalEducation?: string;
  currentOccupation?: string;
  designation?: string;
  organization?: string;
  workLocation?: string;
  annualIncome?: string;
  careerAspirations?: string;
}

export interface BiodataFamily {
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  numberOfBrothers?: string;
  brotherDetails?: string;
  numberOfSisters?: string;
  sisterDetails?: string;
  familyType?: 'Nuclear' | 'Joint' | string;
  familyStatus?: 'Middle Class' | 'Upper Middle Class' | 'Affluent' | string;
  familyValues?: 'Traditional' | 'Moderate' | 'Religious' | 'Modern' | string;
  nativePlace?: string;
  ancestralRoots?: string;
  familyAbout?: string;
}

export interface BiodataProfile {
  aboutMe?: string;
  hobbiesAndInterests?: string;
  personalityTraits?: string;
  lifestyleAndDiet?: string; // e.g. Halal, Vegetarian, Non-vegetarian
  personalValues?: string;
}

export interface BiodataPreferences {
  ageRange?: string;
  heightRange?: string;
  educationPreference?: string;
  professionPreference?: string;
  locationPreference?: string;
  maritalStatusPreference?: string;
  valuesExpectations?: string;
  otherNotes?: string;
}

export interface BiodataContact {
  contactPersonName?: string;
  relationship?: string; // Self, Father, Mother, Brother, Guardian
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  convenientTimeToCall?: string;
}

export interface BiodataPrivacySettings {
  showPhoto: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showIncome: boolean;
  showPermanentAddress: boolean;
}

export interface BiodataCustomization {
  templateId: BiodataTemplateId;
  colorTheme: BiodataColorTheme;
  fontFamily: BiodataFontFamily;
  title: string;
  showBismillah: boolean;
  bismillahText?: string;
  subtitleQuote?: string;
}

export interface MarriageBiodata {
  personal: BiodataPersonalInfo;
  educationCareer: BiodataEducationCareer;
  family: BiodataFamily;
  profile: BiodataProfile;
  preferences: BiodataPreferences;
  contact: BiodataContact;
  privacy: BiodataPrivacySettings;
  customization: BiodataCustomization;
}
