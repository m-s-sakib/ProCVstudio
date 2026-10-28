/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarriageBiodata } from '../../../types/biodata';
import { Heart, Sparkles, User, GraduationCap, Home, HeartHandshake, Phone, Mail, MapPin, Calendar, Compass } from 'lucide-react';

interface TemplateProps {
  biodata: MarriageBiodata;
  totalPages?: number;
}

export const RomanticElegantTemplate: React.FC<TemplateProps> = ({ biodata, totalPages = 1 }) => {
  const { personal, educationCareer, family, profile, preferences, contact, privacy, customization } = biodata;

  const fontClass =
    customization.fontFamily === 'serif'
      ? 'font-serif'
      : customization.fontFamily === 'classic'
      ? 'font-serif'
      : 'font-sans';

  const A4_HEIGHT_PX = 1123;
  const numPages = Math.max(1, totalPages);

  return (
    <div
      className={`w-full min-h-[1123px] bg-[#fffafb] text-[#3d2c2e] p-8 sm:p-12 leading-relaxed relative ${fontClass} selection:bg-rose-100`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative Elegant Outer & Inner Border for each A4 Page */}
      {Array.from({ length: numPages }).map((_, pageIdx) => {
        const pageTop = pageIdx * A4_HEIGHT_PX;
        return (
          <div
            key={`romantic-frame-${pageIdx}`}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${pageTop}px`,
              height: `${A4_HEIGHT_PX}px`,
            }}
          >
            <div className="absolute inset-3 sm:inset-4 border-2 border-[#e8b4b8] rounded-2xl pointer-events-none" />
            <div className="absolute inset-4 sm:inset-5 border border-[#f3d2d5] rounded-xl pointer-events-none" />

            {/* Corner Flourish Motifs */}
            <div className="absolute top-5 left-5 text-[#d8829d] pointer-events-none opacity-80">
              <Heart className="w-4 h-4 fill-[#fce7f3]" />
            </div>
            <div className="absolute top-5 right-5 text-[#d8829d] pointer-events-none opacity-80">
              <Heart className="w-4 h-4 fill-[#fce7f3]" />
            </div>
            <div className="absolute bottom-5 left-5 text-[#d8829d] pointer-events-none opacity-80">
              <Heart className="w-4 h-4 fill-[#fce7f3]" />
            </div>
            <div className="absolute bottom-5 right-5 text-[#d8829d] pointer-events-none opacity-80">
              <Heart className="w-4 h-4 fill-[#fce7f3]" />
            </div>
          </div>
        );
      })}

      <div className="relative z-10 max-w-3xl mx-auto space-y-7">
        {/* Header Section */}
        <header className="text-center space-y-2 pt-2 cv-item-avoid-break">
          {customization.showBismillah && customization.bismillahText && (
            <div className="text-lg sm:text-xl font-arabic text-[#9d3a5a] tracking-wider mb-2 font-serif">
              {customization.bismillahText}
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fdeef1] border border-[#f5c7d0] text-xs uppercase tracking-widest text-[#a8325a] font-semibold">
            <Sparkles className="w-3 h-3 text-[#d8829d]" />
            <span>{customization.title || 'Marriage Biodata'}</span>
            <Sparkles className="w-3 h-3 text-[#d8829d]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#6d1b37] drop-shadow-2xs">
            {personal.fullName || 'Candidate Full Name'}
          </h1>

          {educationCareer.currentOccupation && (
            <p className="text-sm sm:text-base font-medium text-[#8c3554] tracking-wide">
              {educationCareer.currentOccupation}
              {educationCareer.organization ? ` • ${educationCareer.organization}` : ''}
            </p>
          )}

          {customization.subtitleQuote && (
            <p className="text-xs sm:text-sm italic text-[#844d5a] max-w-xl mx-auto pt-1 font-serif">
              {customization.subtitleQuote}
            </p>
          )}

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#d8829d] to-transparent" />
            <div className="flex items-center gap-1 text-[#b8336a]">
              <Heart className="w-3.5 h-3.5 fill-[#f472b6] text-[#db2777]" />
            </div>
            <div className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#d8829d] to-transparent" />
          </div>
        </header>

        {/* Top Profile Card: Photo + Core Quick Stats */}
        <div
          data-cv-item="true"
          className="cv-item-avoid-break bg-white/80 backdrop-blur-xs rounded-xl p-5 border border-[#f3d2d5] shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          {privacy.showPhoto && personal.photoUrl ? (
            <div className="relative shrink-0">
              <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden border-3 border-[#e8b4b8] shadow-xs bg-rose-50">
                <img
                  src={personal.photoUrl}
                  alt={personal.fullName || 'Candidate Photo'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#e8b4b8] bg-[#fff1f2] flex items-center justify-center shrink-0 text-[#a8325a]">
              <User className="w-10 h-10 opacity-70" />
            </div>
          )}

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm">
            {personal.dateOfBirth && (
              <div className="flex items-center gap-2 text-[#4d2833]">
                <Calendar className="w-3.5 h-3.5 text-[#d8829d] shrink-0" />
                <span className="font-semibold text-[#8c3554]">DOB / Age:</span>
                <span>
                  {personal.dateOfBirth} {personal.age ? `(${personal.age})` : ''}
                </span>
              </div>
            )}
            {personal.height && (
              <div className="flex items-center gap-2 text-[#4d2833]">
                <span className="font-semibold text-[#8c3554]">Height:</span>
                <span>{personal.height}</span>
              </div>
            )}
            {personal.religion && (
              <div className="flex items-center gap-2 text-[#4d2833]">
                <span className="font-semibold text-[#8c3554]">Religion:</span>
                <span>
                  {personal.religion} {personal.casteOrSect ? `(${personal.casteOrSect})` : ''}
                </span>
              </div>
            )}
            {personal.maritalStatus && (
              <div className="flex items-center gap-2 text-[#4d2833]">
                <span className="font-semibold text-[#8c3554]">Marital Status:</span>
                <span>{personal.maritalStatus}</span>
              </div>
            )}
            {personal.nationality && (
              <div className="flex items-center gap-2 text-[#4d2833]">
                <span className="font-semibold text-[#8c3554]">Nationality:</span>
                <span>{personal.nationality}</span>
              </div>
            )}
            {personal.complexion && (
              <div className="flex items-center gap-2 text-[#4d2833]">
                <span className="font-semibold text-[#8c3554]">Complexion:</span>
                <span>{personal.complexion}</span>
              </div>
            )}
            {personal.bloodGroup && (
              <div className="flex items-center gap-2 text-[#4d2833]">
                <span className="font-semibold text-[#8c3554]">Blood Group:</span>
                <span>{personal.bloodGroup}</span>
              </div>
            )}
            {personal.currentLocation && (
              <div className="flex items-center gap-2 text-[#4d2833] sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-[#d8829d] shrink-0" />
                <span className="font-semibold text-[#8c3554]">Current Location:</span>
                <span>{personal.currentLocation}</span>
              </div>
            )}
            {privacy.showPermanentAddress && personal.permanentAddress && (
              <div className="flex items-start gap-2 text-[#4d2833] sm:col-span-2">
                <Home className="w-3.5 h-3.5 text-[#d8829d] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#8c3554]">Permanent Address:</span>{' '}
                  <span>{personal.permanentAddress}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 1: Education & Career */}
        {(educationCareer.highestDegree || educationCareer.currentOccupation) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#f3d2d5] cv-heading">
              <div className="w-6 h-6 rounded-full bg-[#fdeef1] flex items-center justify-center text-[#9d3a5a]">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#7a2040]">
                Education &amp; Career
              </h2>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-[#f3d2d5] space-y-2.5 text-xs sm:text-sm">
              {educationCareer.highestDegree && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Highest Qualification:</span>{' '}
                  <span className="font-medium text-[#2f1920]">
                    {educationCareer.highestDegree}
                    {educationCareer.majorOrField ? ` in ${educationCareer.majorOrField}` : ''}
                  </span>
                  {educationCareer.institution && (
                    <div className="text-xs text-[#6e414c] pl-1">
                      {educationCareer.institution}{' '}
                      {educationCareer.graduationYear ? `(${educationCareer.graduationYear})` : ''}
                    </div>
                  )}
                </div>
              )}

              {educationCareer.additionalEducation && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Academic Background:</span>{' '}
                  <span className="text-[#3b2228]">{educationCareer.additionalEducation}</span>
                </div>
              )}

              {educationCareer.currentOccupation && (
                <div data-cv-subitem="true" className="pt-1 border-t border-[#fae4e7] cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Current Occupation:</span>{' '}
                  <span className="font-medium text-[#2f1920]">
                    {educationCareer.designation || educationCareer.currentOccupation}
                  </span>
                  {educationCareer.organization && (
                    <div className="text-xs text-[#6e414c] pl-1">
                      {educationCareer.organization}
                      {educationCareer.workLocation ? ` • ${educationCareer.workLocation}` : ''}
                    </div>
                  )}
                </div>
              )}

              {privacy.showIncome && educationCareer.annualIncome && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Annual Income:</span>{' '}
                  <span className="text-[#3b2228]">{educationCareer.annualIncome}</span>
                </div>
              )}

              {educationCareer.careerAspirations && (
                <div className="text-xs italic text-[#724550] pt-1 cv-paragraph">
                  "{educationCareer.careerAspirations}"
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 2: Family Background */}
        {(family.fatherName || family.motherName || family.familyAbout) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#f3d2d5] cv-heading">
              <div className="w-6 h-6 rounded-full bg-[#fdeef1] flex items-center justify-center text-[#9d3a5a]">
                <Home className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#7a2040]">
                Family Background
              </h2>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-[#f3d2d5] space-y-2.5 text-xs sm:text-sm">
              <div data-cv-subitem="true" className="grid grid-cols-1 sm:grid-cols-2 gap-3 cv-item-avoid-break">
                {family.fatherName && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Father:</span>{' '}
                    <span className="text-[#3b2228] font-medium">{family.fatherName}</span>
                    {family.fatherOccupation && (
                      <div className="text-xs text-[#6e414c]">{family.fatherOccupation}</div>
                    )}
                  </div>
                )}
                {family.motherName && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Mother:</span>{' '}
                    <span className="text-[#3b2228] font-medium">{family.motherName}</span>
                    {family.motherOccupation && (
                      <div className="text-xs text-[#6e414c]">{family.motherOccupation}</div>
                    )}
                  </div>
                )}
              </div>

              {(family.numberOfBrothers || family.brotherDetails) && (
                <div data-cv-subitem="true" className="pt-1.5 border-t border-[#fae4e7] cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Brothers:</span>{' '}
                  <span className="text-[#3b2228]">
                    {family.numberOfBrothers} {family.brotherDetails ? `— ${family.brotherDetails}` : ''}
                  </span>
                </div>
              )}

              {(family.numberOfSisters || family.sisterDetails) && (
                <div data-cv-subitem="true" className="pt-1 border-t border-[#fae4e7] cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Sisters:</span>{' '}
                  <span className="text-[#3b2228]">
                    {family.numberOfSisters} {family.sisterDetails ? `— ${family.sisterDetails}` : ''}
                  </span>
                </div>
              )}

              <div data-cv-subitem="true" className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#fae4e7] text-xs text-[#6e414c] cv-item-avoid-break">
                {family.familyType && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Type:</span> {family.familyType} Family
                  </div>
                )}
                {family.familyStatus && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Status:</span> {family.familyStatus}
                  </div>
                )}
                {family.familyValues && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Values:</span> {family.familyValues}
                  </div>
                )}
              </div>

              {family.nativePlace && (
                <div data-cv-subitem="true" className="text-xs text-[#6e414c] cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Native Place / Ancestral Roots:</span>{' '}
                  {family.nativePlace} {family.ancestralRoots ? `(${family.ancestralRoots})` : ''}
                </div>
              )}

              {family.familyAbout && (
                <p className="text-xs italic text-[#724550] pt-1 cv-paragraph">
                  {family.familyAbout}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Section 3: Personal Profile & Lifestyle */}
        {(profile.aboutMe || profile.hobbiesAndInterests) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#f3d2d5] cv-heading">
              <div className="w-6 h-6 rounded-full bg-[#fdeef1] flex items-center justify-center text-[#9d3a5a]">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#7a2040]">
                About Me &amp; Lifestyle
              </h2>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-[#f3d2d5] space-y-2 text-xs sm:text-sm">
              {profile.aboutMe && (
                <p className="text-[#3b2228] leading-relaxed cv-paragraph">
                  {profile.aboutMe}
                </p>
              )}

              {profile.personalityTraits && (
                <div data-cv-subitem="true" className="pt-1.5 cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Personality Traits:</span>{' '}
                  <span className="text-[#3b2228]">{profile.personalityTraits}</span>
                </div>
              )}

              {profile.hobbiesAndInterests && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Hobbies &amp; Interests:</span>{' '}
                  <span className="text-[#3b2228]">{profile.hobbiesAndInterests}</span>
                </div>
              )}

              {profile.lifestyleAndDiet && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Lifestyle &amp; Diet:</span>{' '}
                  <span className="text-[#3b2228]">{profile.lifestyleAndDiet}</span>
                </div>
              )}

              {profile.personalValues && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Personal Values:</span>{' '}
                  <span className="text-[#3b2228]">{profile.personalValues}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 4: Partner Preferences */}
        {(preferences.ageRange || preferences.educationPreference || preferences.valuesExpectations) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#f3d2d5] cv-heading">
              <div className="w-6 h-6 rounded-full bg-[#fdeef1] flex items-center justify-center text-[#9d3a5a]">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#7a2040]">
                Partner Preferences
              </h2>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-[#f3d2d5] space-y-2 text-xs sm:text-sm">
              <div data-cv-subitem="true" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 cv-item-avoid-break">
                {preferences.ageRange && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Age Range:</span>{' '}
                    <span className="text-[#3b2228]">{preferences.ageRange}</span>
                  </div>
                )}
                {preferences.heightRange && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Height:</span>{' '}
                    <span className="text-[#3b2228]">{preferences.heightRange}</span>
                  </div>
                )}
                {preferences.maritalStatusPreference && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Marital Status:</span>{' '}
                    <span className="text-[#3b2228]">{preferences.maritalStatusPreference}</span>
                  </div>
                )}
                {preferences.locationPreference && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Location:</span>{' '}
                    <span className="text-[#3b2228]">{preferences.locationPreference}</span>
                  </div>
                )}
              </div>

              {preferences.educationPreference && (
                <div data-cv-subitem="true" className="pt-1.5 border-t border-[#fae4e7] cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Education:</span>{' '}
                  <span className="text-[#3b2228]">{preferences.educationPreference}</span>
                </div>
              )}

              {preferences.professionPreference && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Profession:</span>{' '}
                  <span className="text-[#3b2228]">{preferences.professionPreference}</span>
                </div>
              )}

              {preferences.valuesExpectations && (
                <div className="pt-1 cv-paragraph">
                  <span className="font-semibold text-[#8c3554]">Expectations &amp; Values:</span>{' '}
                  <span className="text-[#3b2228]">{preferences.valuesExpectations}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 5: Contact Details */}
        {(contact.contactPersonName || contact.phone || contact.email) && (
          <section data-cv-item="true" className="space-y-3 pt-2 cv-item-avoid-break">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#f3d2d5] cv-heading">
              <div className="w-6 h-6 rounded-full bg-[#fdeef1] flex items-center justify-center text-[#9d3a5a]">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#7a2040]">
                Contact &amp; Communication
              </h2>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f3d2d5] space-y-2 text-xs sm:text-sm">
              <div data-cv-subitem="true" className="flex flex-wrap items-center justify-between gap-2 cv-item-avoid-break">
                {contact.contactPersonName && (
                  <div>
                    <span className="font-semibold text-[#8c3554]">Contact Person:</span>{' '}
                    <span className="font-medium text-[#2f1920]">
                      {contact.contactPersonName}{' '}
                      {contact.relationship ? `(${contact.relationship})` : ''}
                    </span>
                  </div>
                )}
                {contact.convenientTimeToCall && (
                  <div className="text-xs text-[#724550]">
                    <span className="font-semibold text-[#8c3554]">Convenient Time:</span>{' '}
                    {contact.convenientTimeToCall}
                  </div>
                )}
              </div>

              <div data-cv-subitem="true" className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t border-[#fae4e7] cv-item-avoid-break">
                {privacy.showPhone && contact.phone && (
                  <div className="flex items-center gap-1.5 text-[#3b2228]">
                    <Phone className="w-3.5 h-3.5 text-[#d8829d]" />
                    <span className="font-semibold text-[#8c3554]">Phone:</span>
                    <span>{contact.phone}</span>
                  </div>
                )}
                {privacy.showPhone && contact.whatsapp && (
                  <div className="flex items-center gap-1.5 text-[#3b2228]">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                      WhatsApp:
                    </span>
                    <span>{contact.whatsapp}</span>
                  </div>
                )}
                {privacy.showEmail && contact.email && (
                  <div className="flex items-center gap-1.5 text-[#3b2228]">
                    <Mail className="w-3.5 h-3.5 text-[#d8829d]" />
                    <span className="font-semibold text-[#8c3554]">Email:</span>
                    <span>{contact.email}</span>
                  </div>
                )}
              </div>

              {contact.address && (
                <div data-cv-subitem="true" className="text-xs text-[#6e414c] pt-1 cv-item-avoid-break">
                  <span className="font-semibold text-[#8c3554]">Address:</span> {contact.address}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer Note */}
        <footer data-cv-item="true" className="text-center pt-4 border-t border-[#f3d2d5] text-[11px] text-[#915664] cv-item-avoid-break">
          <p>
            This document is prepared with sincere intentions for marriage alliance. All details provided are true to the best of our knowledge.
          </p>
        </footer>
      </div>
    </div>
  );
};
