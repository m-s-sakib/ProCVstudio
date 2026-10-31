/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarriageBiodata } from '../../../types/biodata';
import { GraduationCap, Home, BookOpen, User, Phone, Mail, MapPin, Calendar, Compass } from 'lucide-react';

interface TemplateProps {
  biodata: MarriageBiodata;
  totalPages?: number;
}

export const TraditionalIslamicTemplate: React.FC<TemplateProps> = ({ biodata, totalPages = 1 }) => {
  const { personal, educationCareer, family, profile, preferences, contact, privacy, customization } = biodata;

  const A4_HEIGHT_PX = 1123;
  const numPages = Math.max(1, totalPages);

  return (
    <div
      className="w-full min-h-[1123px] bg-[#fcfdfa] text-[#1a2e22] p-12 leading-relaxed relative font-serif selection:bg-emerald-100"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Islamic Arch & Gold Border Motif for each A4 Page */}
      {Array.from({ length: numPages }).map((_, pageIdx) => {
        const pageTop = pageIdx * A4_HEIGHT_PX;
        return (
          <div
            key={`islamic-frame-${pageIdx}`}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${pageTop}px`,
              height: `${A4_HEIGHT_PX}px`,
            }}
          >
            <div className="absolute inset-4 border-2 border-[#15803d]/40 rounded-2xl pointer-events-none" />
            <div className="absolute inset-5 border border-[#d4af37]/60 rounded-xl pointer-events-none" />

            {/* Star / Crescent Ornaments in Corners */}
            <div className="absolute top-5 left-5 text-[#b45309] pointer-events-none text-xs">۞</div>
            <div className="absolute top-5 right-5 text-[#b45309] pointer-events-none text-xs">۞</div>
            <div className="absolute bottom-5 left-5 text-[#b45309] pointer-events-none text-xs">۞</div>
            <div className="absolute bottom-5 right-5 text-[#b45309] pointer-events-none text-xs">۞</div>
          </div>
        );
      })}

      <div className="relative z-10 max-w-3xl mx-auto space-y-7">
        {/* Header */}
        <header className="text-center space-y-2 pt-2 cv-item-avoid-break">
          {/* Bismillah Always Present or Configured */}
          <div className="text-2xl text-[#064e3b] font-bold tracking-widest font-serif drop-shadow-2xs">
            {customization.bismillahText || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs uppercase tracking-widest text-emerald-800 font-semibold font-sans">
            <span>{customization.title || 'Islamic Marriage Biodata'}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#064e3b]">
            {personal.fullName || 'Candidate Full Name'}
          </h1>

          {educationCareer.currentOccupation && (
            <p className="text-base font-medium text-[#047857] font-sans">
              {educationCareer.currentOccupation}
              {educationCareer.organization ? ` • ${educationCareer.organization}` : ''}
            </p>
          )}

          {customization.subtitleQuote && (
            <p className="text-sm italic text-[#166534] max-w-xl mx-auto pt-1 cv-paragraph">
              {customization.subtitleQuote}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <div className="text-[#b45309] text-xs">❖ ❖ ❖</div>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>
        </header>

        {/* Top Profile Summary with Photo */}
        <div
          data-cv-item="true"
          className="cv-item-avoid-break bg-[#f2f8f4] rounded-xl p-5 border border-emerald-200 shadow-2xs flex flex-row items-start gap-6"
        >
          {privacy.showPhoto && personal.photoUrl ? (
            <div className="relative shrink-0">
              <div className="w-36 h-44 rounded-xl overflow-hidden border-3 border-[#047857]/40 shadow-xs bg-emerald-50">
                <img
                  src={personal.photoUrl}
                  alt={personal.fullName || 'Photo'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full border-2 border-emerald-300 bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-800">
              <User className="w-10 h-10 opacity-70" />
            </div>
          )}

          <div className="flex-1 w-full grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-sans">
            {personal.dateOfBirth && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-semibold text-emerald-900">DOB / Age:</span>
                <span>
                  {personal.dateOfBirth} {personal.age ? `(${personal.age})` : ''}
                </span>
              </div>
            )}
            {personal.height && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-900">Height:</span>
                <span>{personal.height}</span>
              </div>
            )}
            {personal.religion && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-900">Deen / Sect:</span>
                <span>
                  {personal.religion} {personal.casteOrSect ? `• ${personal.casteOrSect}` : ''}
                </span>
              </div>
            )}
            {personal.maritalStatus && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-900">Marital Status:</span>
                <span>{personal.maritalStatus}</span>
              </div>
            )}
            {personal.complexion && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-900">Complexion:</span>
                <span>{personal.complexion}</span>
              </div>
            )}
            {personal.bloodGroup && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-900">Blood Group:</span>
                <span>{personal.bloodGroup}</span>
              </div>
            )}
            {personal.currentLocation && (
              <div className="flex items-center gap-2 col-span-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-semibold text-emerald-900">Current Residence:</span>
                <span>{personal.currentLocation}</span>
              </div>
            )}
            {privacy.showPermanentAddress && personal.permanentAddress && (
              <div className="flex items-start gap-2 col-span-2">
                <Home className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-900">Permanent Address:</span>{' '}
                  <span>{personal.permanentAddress}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Education & Profession */}
        {(educationCareer.highestDegree || educationCareer.currentOccupation) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-700/20 cv-heading">
              <h2 className="text-lg font-bold text-[#064e3b] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Education &amp; Occupation</span>
              </h2>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-emerald-100 space-y-2 text-sm font-sans">
              {educationCareer.highestDegree && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Highest Degree:</span>{' '}
                  <span className="font-medium text-slate-900">
                    {educationCareer.highestDegree}
                    {educationCareer.majorOrField ? ` (${educationCareer.majorOrField})` : ''}
                  </span>
                  {educationCareer.institution && (
                    <div className="text-xs text-slate-600 pl-1">
                      {educationCareer.institution}{' '}
                      {educationCareer.graduationYear ? `• Graduated ${educationCareer.graduationYear}` : ''}
                    </div>
                  )}
                </div>
              )}

              {educationCareer.additionalEducation && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Academic Background:</span>{' '}
                  <span className="text-slate-800">{educationCareer.additionalEducation}</span>
                </div>
              )}

              {educationCareer.currentOccupation && (
                <div data-cv-subitem="true" className="pt-1 border-t border-emerald-50 cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Profession / Designation:</span>{' '}
                  <span className="font-medium text-slate-900">
                    {educationCareer.designation || educationCareer.currentOccupation}
                  </span>
                  {educationCareer.organization && (
                    <div className="text-xs text-slate-600 pl-1">
                      {educationCareer.organization}
                      {educationCareer.workLocation ? ` (${educationCareer.workLocation})` : ''}
                    </div>
                  )}
                </div>
              )}

              {privacy.showIncome && educationCareer.annualIncome && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Annual Income:</span>{' '}
                  <span className="text-slate-800">{educationCareer.annualIncome}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Family Details */}
        {(family.fatherName || family.motherName || family.familyAbout) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-700/20 cv-heading">
              <h2 className="text-lg font-bold text-[#064e3b] flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-700" />
                <span>Family Background &amp; Heritage</span>
              </h2>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-emerald-100 space-y-2 text-sm font-sans">
              <div data-cv-subitem="true" className="grid grid-cols-2 gap-3 cv-item-avoid-break">
                {family.fatherName && (
                  <div>
                    <span className="font-semibold text-emerald-900">Father's Name:</span>{' '}
                    <span className="text-slate-900 font-medium">{family.fatherName}</span>
                    {family.fatherOccupation && (
                      <div className="text-xs text-slate-600">{family.fatherOccupation}</div>
                    )}
                  </div>
                )}
                {family.motherName && (
                  <div>
                    <span className="font-semibold text-emerald-900">Mother's Name:</span>{' '}
                    <span className="text-slate-900 font-medium">{family.motherName}</span>
                    {family.motherOccupation && (
                      <div className="text-xs text-slate-600">{family.motherOccupation}</div>
                    )}
                  </div>
                )}
              </div>

              {(family.numberOfBrothers || family.brotherDetails) && (
                <div data-cv-subitem="true" className="pt-1 border-t border-emerald-50 cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Brothers:</span>{' '}
                  <span className="text-slate-800">
                    {family.numberOfBrothers} {family.brotherDetails ? `(${family.brotherDetails})` : ''}
                  </span>
                </div>
              )}

              {(family.numberOfSisters || family.sisterDetails) && (
                <div data-cv-subitem="true" className="pt-1 border-t border-emerald-50 cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Sisters:</span>{' '}
                  <span className="text-slate-800">
                    {family.numberOfSisters} {family.sisterDetails ? `(${family.sisterDetails})` : ''}
                  </span>
                </div>
              )}

              <div data-cv-subitem="true" className="grid grid-cols-3 gap-2 pt-1 border-t border-emerald-50 text-xs text-slate-600 cv-item-avoid-break">
                {family.familyValues && (
                  <div>
                    <span className="font-semibold text-emerald-900">Religious Environment:</span>{' '}
                    {family.familyValues}
                  </div>
                )}
                {family.familyStatus && (
                  <div>
                    <span className="font-semibold text-emerald-900">Family Status:</span>{' '}
                    {family.familyStatus}
                  </div>
                )}
                {family.nativePlace && (
                  <div>
                    <span className="font-semibold text-emerald-900">Native Roots:</span>{' '}
                    {family.nativePlace}
                  </div>
                )}
              </div>

              {family.familyAbout && (
                <p className="text-xs italic text-slate-700 pt-1 font-serif cv-paragraph">
                  {family.familyAbout}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Deen, Akhlaq & Personal Profile */}
        {(profile.aboutMe || profile.personalValues) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-700/20 cv-heading">
              <h2 className="text-lg font-bold text-[#064e3b] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Religious Practice &amp; Personal Profile</span>
              </h2>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-emerald-100 space-y-2 text-sm font-sans">
              {profile.aboutMe && (
                <p className="text-slate-800 leading-relaxed font-serif cv-paragraph">
                  {profile.aboutMe}
                </p>
              )}

              {profile.personalValues && (
                <div data-cv-subitem="true" className="pt-1 cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Islamic Practice &amp; Values:</span>{' '}
                  <span className="text-slate-800">{profile.personalValues}</span>
                </div>
              )}

              {profile.lifestyleAndDiet && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Diet &amp; Lifestyle:</span>{' '}
                  <span className="text-slate-800">{profile.lifestyleAndDiet}</span>
                </div>
              )}

              {profile.hobbiesAndInterests && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Interests &amp; Activities:</span>{' '}
                  <span className="text-slate-800">{profile.hobbiesAndInterests}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Partner Preferences */}
        {(preferences.ageRange || preferences.educationPreference || preferences.valuesExpectations) && (
          <section data-cv-item="true" className="space-y-3 cv-item-avoid-break">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-700/20 cv-heading">
              <h2 className="text-lg font-bold text-[#064e3b] flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>Partner Expectations</span>
              </h2>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-emerald-100 space-y-2 text-sm font-sans">
              <div data-cv-subitem="true" className="grid grid-cols-2 gap-2 cv-item-avoid-break">
                {preferences.ageRange && (
                  <div>
                    <span className="font-semibold text-emerald-900">Age:</span>{' '}
                    <span>{preferences.ageRange}</span>
                  </div>
                )}
                {preferences.heightRange && (
                  <div>
                    <span className="font-semibold text-emerald-900">Height:</span>{' '}
                    <span>{preferences.heightRange}</span>
                  </div>
                )}
              </div>

              {preferences.educationPreference && (
                <div data-cv-subitem="true" className="pt-1 border-t border-emerald-50 cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Educational Background:</span>{' '}
                  <span>{preferences.educationPreference}</span>
                </div>
              )}

              {preferences.valuesExpectations && (
                <div className="pt-1 cv-paragraph">
                  <span className="font-semibold text-emerald-900">Character &amp; Religious Commitment:</span>{' '}
                  <span>{preferences.valuesExpectations}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact Information */}
        {(contact.contactPersonName || contact.phone || contact.email) && (
          <section data-cv-item="true" className="space-y-3 pt-2 cv-item-avoid-break">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-700/20 cv-heading">
              <h2 className="text-lg font-bold text-[#064e3b] flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Guardian &amp; Contact Information</span>
              </h2>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-emerald-100 space-y-2 text-sm font-sans">
              {contact.contactPersonName && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Contact Person / Guardian:</span>{' '}
                  <span className="font-medium text-slate-900">
                    {contact.contactPersonName}{' '}
                    {contact.relationship ? `(${contact.relationship})` : ''}
                  </span>
                </div>
              )}

              <div data-cv-subitem="true" className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-emerald-50 cv-item-avoid-break">
                {privacy.showPhone && contact.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-semibold text-emerald-900">Phone:</span>
                    <span>{contact.phone}</span>
                  </div>
                )}
                {privacy.showPhone && contact.whatsapp && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                      WhatsApp:
                    </span>
                    <span>{contact.whatsapp}</span>
                  </div>
                )}
                {privacy.showEmail && contact.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-semibold text-emerald-900">Email:</span>
                    <span>{contact.email}</span>
                  </div>
                )}
              </div>

              {contact.convenientTimeToCall && (
                <div data-cv-subitem="true" className="text-xs text-slate-600 pt-1 cv-item-avoid-break">
                  <span className="font-semibold text-emerald-900">Suitable Calling Time:</span>{' '}
                  {contact.convenientTimeToCall}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Modest Footer Dua */}
        <footer data-cv-item="true" className="text-center pt-4 border-t border-emerald-200 text-xs text-emerald-800 italic font-serif cv-item-avoid-break">
          <p>
            رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
          </p>
          <p className="text-[11px] text-slate-600 not-italic pt-1 font-sans">
            "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us a leader for the righteous." (Surah Al-Furqan 25:74)
          </p>
        </footer>
      </div>
    </div>
  );
};
