/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarriageBiodata } from '../../../types/biodata';
import { Heart, Flower2, GraduationCap, Home, Phone, Mail, MapPin, Calendar, Compass, Sparkles } from 'lucide-react';

interface TemplateProps {
  biodata: MarriageBiodata;
}

export const PremiumFloralTemplate: React.FC<TemplateProps> = ({ biodata }) => {
  const { personal, educationCareer, family, profile, preferences, contact, privacy, customization } = biodata;

  return (
    <div
      className="w-full min-h-[1123px] bg-[#fffaf8] text-[#3e2723] p-8 sm:p-12 leading-relaxed relative font-serif selection:bg-rose-100"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Delicate Double Floral Border */}
      <div className="absolute inset-3 sm:inset-4 border border-[#e5b7b9] rounded-2xl pointer-events-none" />
      <div className="absolute inset-5 sm:inset-6 border-2 border-dashed border-[#f2d0d2] rounded-xl pointer-events-none" />

      {/* Floral Icons in Corners */}
      <div className="absolute top-7 left-7 text-[#c26d83] pointer-events-none opacity-80">
        <Flower2 className="w-5 h-5" />
      </div>
      <div className="absolute top-7 right-7 text-[#c26d83] pointer-events-none opacity-80">
        <Flower2 className="w-5 h-5" />
      </div>
      <div className="absolute bottom-7 left-7 text-[#c26d83] pointer-events-none opacity-80">
        <Flower2 className="w-5 h-5" />
      </div>
      <div className="absolute bottom-7 right-7 text-[#c26d83] pointer-events-none opacity-80">
        <Flower2 className="w-5 h-5" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-7">
        {/* Header */}
        <header className="text-center space-y-2 pt-2">
          {customization.showBismillah && customization.bismillahText && (
            <div className="text-lg sm:text-xl text-[#9b3b55] font-bold mb-2">
              {customization.bismillahText}
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#fdecef] text-xs uppercase tracking-widest text-[#9b3b55] font-semibold font-sans">
            <Sparkles className="w-3 h-3 text-[#c26d83]" />
            <span>{customization.title || 'Marriage Biodata'}</span>
            <Sparkles className="w-3 h-3 text-[#c26d83]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#701a35]">
            {personal.fullName || 'Candidate Full Name'}
          </h1>

          {educationCareer.currentOccupation && (
            <p className="text-sm sm:text-base font-medium text-[#883650]">
              {educationCareer.currentOccupation}
              {educationCareer.organization ? ` • ${educationCareer.organization}` : ''}
            </p>
          )}

          {customization.subtitleQuote && (
            <p className="text-xs sm:text-sm italic text-[#7d4e5a] max-w-xl mx-auto pt-1">
              {customization.subtitleQuote}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-[#c26d83] text-xs">❦</span>
            <div className="w-28 h-[1px] bg-[#e5b7b9]" />
            <span className="text-[#c26d83] text-xs">❦</span>
          </div>
        </header>

        {/* Profile Stats with Photo */}
        <div className="bg-white/85 rounded-xl p-5 border border-[#f2d0d2] shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {privacy.showPhoto && personal.photoUrl ? (
            <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden border-2 border-[#e5b7b9] shadow-xs bg-rose-50 shrink-0">
              <img
                src={personal.photoUrl}
                alt={personal.fullName || 'Photo'}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#e5b7b9] bg-[#fff5f6] flex items-center justify-center shrink-0 text-[#9b3b55]">
              <Flower2 className="w-10 h-10 opacity-70" />
            </div>
          )}

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm font-sans">
            {personal.dateOfBirth && (
              <div>
                <span className="font-semibold text-[#883650]">DOB / Age:</span>{' '}
                <span>
                  {personal.dateOfBirth} {personal.age ? `(${personal.age})` : ''}
                </span>
              </div>
            )}
            {personal.height && (
              <div>
                <span className="font-semibold text-[#883650]">Height:</span>{' '}
                <span>{personal.height}</span>
              </div>
            )}
            {personal.religion && (
              <div>
                <span className="font-semibold text-[#883650]">Religion:</span>{' '}
                <span>
                  {personal.religion} {personal.casteOrSect ? `(${personal.casteOrSect})` : ''}
                </span>
              </div>
            )}
            {personal.maritalStatus && (
              <div>
                <span className="font-semibold text-[#883650]">Marital Status:</span>{' '}
                <span>{personal.maritalStatus}</span>
              </div>
            )}
            {personal.complexion && (
              <div>
                <span className="font-semibold text-[#883650]">Complexion:</span>{' '}
                <span>{personal.complexion}</span>
              </div>
            )}
            {personal.bloodGroup && (
              <div>
                <span className="font-semibold text-[#883650]">Blood Group:</span>{' '}
                <span>{personal.bloodGroup}</span>
              </div>
            )}
            {personal.currentLocation && (
              <div className="sm:col-span-2">
                <span className="font-semibold text-[#883650]">Location:</span>{' '}
                <span>{personal.currentLocation}</span>
              </div>
            )}
            {privacy.showPermanentAddress && personal.permanentAddress && (
              <div className="sm:col-span-2">
                <span className="font-semibold text-[#883650]">Permanent Address:</span>{' '}
                <span>{personal.permanentAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education & Career */}
        {(educationCareer.highestDegree || educationCareer.currentOccupation) && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#701a35] flex items-center gap-2 pb-1 border-b border-[#f2d0d2]">
              <GraduationCap className="w-4 h-4 text-[#c26d83]" />
              <span>Academic & Career Journey</span>
            </h2>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f2d0d2] space-y-2 text-xs sm:text-sm font-sans">
              {educationCareer.highestDegree && (
                <div>
                  <span className="font-semibold text-[#883650]">Qualification:</span>{' '}
                  <span className="font-medium text-[#2d1b22]">
                    {educationCareer.highestDegree}
                    {educationCareer.majorOrField ? ` in ${educationCareer.majorOrField}` : ''}
                  </span>
                  {educationCareer.institution && (
                    <div className="text-xs text-[#6e414c]">
                      {educationCareer.institution}{' '}
                      {educationCareer.graduationYear ? `(${educationCareer.graduationYear})` : ''}
                    </div>
                  )}
                </div>
              )}

              {educationCareer.currentOccupation && (
                <div className="pt-1 border-t border-[#fcedef]">
                  <span className="font-semibold text-[#883650]">Occupation:</span>{' '}
                  <span className="font-medium text-[#2d1b22]">
                    {educationCareer.designation || educationCareer.currentOccupation}
                  </span>
                  {educationCareer.organization && (
                    <div className="text-xs text-[#6e414c]">
                      {educationCareer.organization}
                      {educationCareer.workLocation ? ` • ${educationCareer.workLocation}` : ''}
                    </div>
                  )}
                </div>
              )}

              {privacy.showIncome && educationCareer.annualIncome && (
                <div>
                  <span className="font-semibold text-[#883650]">Income:</span>{' '}
                  <span>{educationCareer.annualIncome}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Family Background */}
        {(family.fatherName || family.motherName || family.familyAbout) && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#701a35] flex items-center gap-2 pb-1 border-b border-[#f2d0d2]">
              <Home className="w-4 h-4 text-[#c26d83]" />
              <span>Family Heritage</span>
            </h2>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f2d0d2] space-y-2 text-xs sm:text-sm font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {family.fatherName && (
                  <div>
                    <span className="font-semibold text-[#883650]">Father:</span>{' '}
                    <span className="font-medium text-[#2d1b22]">{family.fatherName}</span>
                    {family.fatherOccupation && (
                      <div className="text-xs text-[#6e414c]">{family.fatherOccupation}</div>
                    )}
                  </div>
                )}
                {family.motherName && (
                  <div>
                    <span className="font-semibold text-[#883650]">Mother:</span>{' '}
                    <span className="font-medium text-[#2d1b22]">{family.motherName}</span>
                    {family.motherOccupation && (
                      <div className="text-xs text-[#6e414c]">{family.motherOccupation}</div>
                    )}
                  </div>
                )}
              </div>

              {(family.numberOfBrothers || family.numberOfSisters) && (
                <div className="pt-1.5 border-t border-[#fcedef] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {family.numberOfBrothers && (
                    <div>
                      <span className="font-semibold text-[#883650]">Brothers:</span>{' '}
                      {family.numberOfBrothers} {family.brotherDetails ? `(${family.brotherDetails})` : ''}
                    </div>
                  )}
                  {family.numberOfSisters && (
                    <div>
                      <span className="font-semibold text-[#883650]">Sisters:</span>{' '}
                      {family.numberOfSisters} {family.sisterDetails ? `(${family.sisterDetails})` : ''}
                    </div>
                  )}
                </div>
              )}

              {family.familyAbout && (
                <p className="text-xs italic text-[#724550] pt-1 font-serif">
                  {family.familyAbout}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Personal Profile & Interests */}
        {(profile.aboutMe || profile.hobbiesAndInterests) && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#701a35] flex items-center gap-2 pb-1 border-b border-[#f2d0d2]">
              <Heart className="w-4 h-4 text-[#c26d83]" />
              <span>Personal Outlook</span>
            </h2>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f2d0d2] space-y-2 text-xs sm:text-sm font-sans">
              {profile.aboutMe && <p className="leading-relaxed font-serif text-[#3e2723]">{profile.aboutMe}</p>}
              {profile.hobbiesAndInterests && (
                <div>
                  <span className="font-semibold text-[#883650]">Interests:</span>{' '}
                  <span>{profile.hobbiesAndInterests}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Partner Preferences */}
        {(preferences.ageRange || preferences.educationPreference || preferences.valuesExpectations) && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#701a35] flex items-center gap-2 pb-1 border-b border-[#f2d0d2]">
              <Compass className="w-4 h-4 text-[#c26d83]" />
              <span>Partner Expectations</span>
            </h2>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f2d0d2] space-y-2 text-xs sm:text-sm font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {preferences.ageRange && (
                  <div>
                    <span className="font-semibold text-[#883650]">Age:</span> {preferences.ageRange}
                  </div>
                )}
                {preferences.heightRange && (
                  <div>
                    <span className="font-semibold text-[#883650]">Height:</span> {preferences.heightRange}
                  </div>
                )}
              </div>
              {preferences.educationPreference && (
                <div>
                  <span className="font-semibold text-[#883650]">Education & Career:</span>{' '}
                  {preferences.educationPreference}
                </div>
              )}
              {preferences.valuesExpectations && (
                <div className="pt-1">
                  <span className="font-semibold text-[#883650]">Expectations:</span>{' '}
                  {preferences.valuesExpectations}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact Details */}
        {(contact.contactPersonName || contact.phone || contact.email) && (
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-[#701a35] flex items-center gap-2 pb-1 border-b border-[#f2d0d2]">
              <Phone className="w-4 h-4 text-[#c26d83]" />
              <span>Contact Information</span>
            </h2>

            <div className="bg-white/90 rounded-xl p-4 border border-[#f2d0d2] space-y-2 text-xs sm:text-sm font-sans">
              {contact.contactPersonName && (
                <div className="font-bold text-[#2d1b22]">
                  {contact.contactPersonName}{' '}
                  {contact.relationship ? `(${contact.relationship})` : ''}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-1">
                {privacy.showPhone && contact.phone && (
                  <div>
                    <span className="font-semibold text-[#883650]">Phone:</span> {contact.phone}
                  </div>
                )}
                {privacy.showEmail && contact.email && (
                  <div>
                    <span className="font-semibold text-[#883650]">Email:</span> {contact.email}
                  </div>
                )}
              </div>

              {contact.convenientTimeToCall && (
                <div className="text-xs text-[#6e414c] pt-1">
                  Best Time to Reach: {contact.convenientTimeToCall}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
