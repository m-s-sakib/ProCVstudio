/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarriageBiodata } from '../../../types/biodata';
import { Mail, Phone, MapPin, Calendar, Heart, Shield, Sparkles } from 'lucide-react';

interface TemplateProps {
  biodata: MarriageBiodata;
}

export const ModernMinimalTemplate: React.FC<TemplateProps> = ({ biodata }) => {
  const { personal, educationCareer, family, profile, preferences, contact, privacy, customization } = biodata;

  return (
    <div
      className="w-full min-h-[1123px] bg-white text-slate-800 p-8 sm:p-12 leading-relaxed relative font-sans selection:bg-slate-200"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Sleek Minimal Border */}
      <div className="absolute inset-4 sm:inset-5 border border-slate-200 rounded-lg pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-7">
        {/* Header */}
        <header className="border-b border-slate-200 pb-5 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                {customization.title || 'Marriage Biodata'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
                {personal.fullName || 'Candidate Name'}
              </h1>
              {educationCareer.currentOccupation && (
                <p className="text-sm sm:text-base font-medium text-slate-600 mt-1">
                  {educationCareer.currentOccupation}
                  {educationCareer.organization ? ` • ${educationCareer.organization}` : ''}
                </p>
              )}
            </div>

            {/* Photo */}
            {privacy.showPhoto && personal.photoUrl ? (
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden border border-slate-300 shadow-xs shrink-0 bg-slate-100">
                <img
                  src={personal.photoUrl}
                  alt={personal.fullName || 'Candidate'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
          </div>

          {customization.subtitleQuote && (
            <p className="text-xs sm:text-sm text-slate-500 italic mt-3 pt-2 border-t border-slate-100">
              {customization.subtitleQuote}
            </p>
          )}
        </header>

        {/* Vital Personal Information Grid */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-800 rounded-full" />
            <span>Personal Particulars</span>
          </h2>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs sm:text-sm">
            {personal.dateOfBirth && (
              <div>
                <span className="text-slate-500 block text-[11px]">Date of Birth</span>
                <span className="font-semibold text-slate-900">{personal.dateOfBirth}</span>
              </div>
            )}
            {personal.age && (
              <div>
                <span className="text-slate-500 block text-[11px]">Age</span>
                <span className="font-semibold text-slate-900">{personal.age}</span>
              </div>
            )}
            {personal.height && (
              <div>
                <span className="text-slate-500 block text-[11px]">Height</span>
                <span className="font-semibold text-slate-900">{personal.height}</span>
              </div>
            )}
            {personal.maritalStatus && (
              <div>
                <span className="text-slate-500 block text-[11px]">Marital Status</span>
                <span className="font-semibold text-slate-900">{personal.maritalStatus}</span>
              </div>
            )}
            {personal.religion && (
              <div>
                <span className="text-slate-500 block text-[11px]">Religion</span>
                <span className="font-semibold text-slate-900">
                  {personal.religion} {personal.casteOrSect ? `(${personal.casteOrSect})` : ''}
                </span>
              </div>
            )}
            {personal.complexion && (
              <div>
                <span className="text-slate-500 block text-[11px]">Complexion</span>
                <span className="font-semibold text-slate-900">{personal.complexion}</span>
              </div>
            )}
            {personal.bloodGroup && (
              <div>
                <span className="text-slate-500 block text-[11px]">Blood Group</span>
                <span className="font-semibold text-slate-900">{personal.bloodGroup}</span>
              </div>
            )}
            {personal.currentLocation && (
              <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200">
                <span className="text-slate-500 block text-[11px]">Current Location</span>
                <span className="font-semibold text-slate-900">{personal.currentLocation}</span>
              </div>
            )}
            {privacy.showPermanentAddress && personal.permanentAddress && (
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-500 block text-[11px]">Permanent Address</span>
                <span className="font-semibold text-slate-900">{personal.permanentAddress}</span>
              </div>
            )}
          </div>
        </section>

        {/* Education & Career */}
        {(educationCareer.highestDegree || educationCareer.currentOccupation) && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-800 rounded-full" />
              <span>Education & Career</span>
            </h2>

            <div className="border border-slate-200 rounded-lg p-4 space-y-3 text-xs sm:text-sm">
              {educationCareer.highestDegree && (
                <div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base">
                    {educationCareer.highestDegree}
                    {educationCareer.majorOrField ? ` in ${educationCareer.majorOrField}` : ''}
                  </div>
                  {educationCareer.institution && (
                    <div className="text-slate-600">
                      {educationCareer.institution}{' '}
                      {educationCareer.graduationYear ? `(${educationCareer.graduationYear})` : ''}
                    </div>
                  )}
                  {educationCareer.additionalEducation && (
                    <div className="text-slate-500 text-xs mt-1">
                      {educationCareer.additionalEducation}
                    </div>
                  )}
                </div>
              )}

              {educationCareer.currentOccupation && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-slate-900">
                    {educationCareer.designation || educationCareer.currentOccupation}
                  </div>
                  {educationCareer.organization && (
                    <div className="text-slate-600">
                      {educationCareer.organization}
                      {educationCareer.workLocation ? ` • ${educationCareer.workLocation}` : ''}
                    </div>
                  )}
                </div>
              )}

              {privacy.showIncome && educationCareer.annualIncome && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Compensation:</span>{' '}
                  {educationCareer.annualIncome}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Family Background */}
        {(family.fatherName || family.motherName || family.familyAbout) && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-800 rounded-full" />
              <span>Family Background</span>
            </h2>

            <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {family.fatherName && (
                  <div>
                    <span className="text-slate-500 block text-[11px]">Father</span>
                    <span className="font-bold text-slate-900">{family.fatherName}</span>
                    {family.fatherOccupation && (
                      <div className="text-slate-600 text-xs">{family.fatherOccupation}</div>
                    )}
                  </div>
                )}
                {family.motherName && (
                  <div>
                    <span className="text-slate-500 block text-[11px]">Mother</span>
                    <span className="font-bold text-slate-900">{family.motherName}</span>
                    {family.motherOccupation && (
                      <div className="text-slate-600 text-xs">{family.motherOccupation}</div>
                    )}
                  </div>
                )}
              </div>

              {(family.numberOfBrothers || family.numberOfSisters) && (
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {family.numberOfBrothers && (
                    <div>
                      <span className="text-slate-500 text-xs">Brothers:</span>{' '}
                      <span className="font-semibold text-slate-900">
                        {family.numberOfBrothers} {family.brotherDetails ? `(${family.brotherDetails})` : ''}
                      </span>
                    </div>
                  )}
                  {family.numberOfSisters && (
                    <div>
                      <span className="text-slate-500 text-xs">Sisters:</span>{' '}
                      <span className="font-semibold text-slate-900">
                        {family.numberOfSisters} {family.sisterDetails ? `(${family.sisterDetails})` : ''}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {(family.familyType || family.familyStatus || family.nativePlace) && (
                <div className="text-xs text-slate-500 pt-1">
                  {[
                    family.familyType ? `${family.familyType} Family` : null,
                    family.familyStatus,
                    family.familyValues ? `${family.familyValues} Values` : null,
                    family.nativePlace ? `Native: ${family.nativePlace}` : null,
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </div>
              )}

              {family.familyAbout && (
                <p className="text-xs text-slate-600 italic pt-1">{family.familyAbout}</p>
              )}
            </div>
          </section>
        )}

        {/* Profile & Values */}
        {(profile.aboutMe || profile.hobbiesAndInterests) && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-800 rounded-full" />
              <span>Personal Outlook & Lifestyle</span>
            </h2>

            <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs sm:text-sm">
              {profile.aboutMe && <p className="text-slate-700 leading-relaxed">{profile.aboutMe}</p>}

              {profile.hobbiesAndInterests && (
                <div className="pt-1">
                  <span className="font-semibold text-slate-900">Hobbies & Passions:</span>{' '}
                  <span className="text-slate-600">{profile.hobbiesAndInterests}</span>
                </div>
              )}

              {profile.lifestyleAndDiet && (
                <div>
                  <span className="font-semibold text-slate-900">Diet & Lifestyle:</span>{' '}
                  <span className="text-slate-600">{profile.lifestyleAndDiet}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Partner Preferences */}
        {(preferences.ageRange || preferences.educationPreference || preferences.valuesExpectations) && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-800 rounded-full" />
              <span>Partner Expectations</span>
            </h2>

            <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {preferences.ageRange && (
                  <div>
                    <span className="text-slate-500 text-xs">Preferred Age:</span>{' '}
                    <span className="font-semibold text-slate-800">{preferences.ageRange}</span>
                  </div>
                )}
                {preferences.heightRange && (
                  <div>
                    <span className="text-slate-500 text-xs">Preferred Height:</span>{' '}
                    <span className="font-semibold text-slate-800">{preferences.heightRange}</span>
                  </div>
                )}
              </div>

              {preferences.educationPreference && (
                <div>
                  <span className="text-slate-500 text-xs">Education & Profession:</span>{' '}
                  <span className="text-slate-800">{preferences.educationPreference}</span>
                </div>
              )}

              {preferences.valuesExpectations && (
                <div className="text-xs text-slate-600 pt-1">
                  <span className="font-semibold text-slate-800">Values & Expectations:</span>{' '}
                  {preferences.valuesExpectations}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact Details */}
        {(contact.contactPersonName || contact.phone || contact.email) && (
          <section className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-800 rounded-full" />
              <span>Contact Information</span>
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs sm:text-sm space-y-2">
              {contact.contactPersonName && (
                <div>
                  <span className="font-bold text-slate-900">
                    {contact.contactPersonName}{' '}
                    {contact.relationship ? `(${contact.relationship})` : ''}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-1">
                {privacy.showPhone && contact.phone && (
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {privacy.showEmail && contact.email && (
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{contact.email}</span>
                  </div>
                )}
              </div>

              {contact.convenientTimeToCall && (
                <div className="text-xs text-slate-500 pt-1">
                  Calling Hours: {contact.convenientTimeToCall}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
