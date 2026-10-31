/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarriageBiodata } from '../../../types/biodata';
import { Sparkles, Home, GraduationCap, Phone, Mail, Calendar, Compass, User } from 'lucide-react';

interface TemplateProps {
  biodata: MarriageBiodata;
  totalPages?: number;
}

export const ClassicFamilyTemplate: React.FC<TemplateProps> = ({ biodata, totalPages = 1 }) => {
  const { personal, educationCareer, family, profile, preferences, contact, privacy, customization } = biodata;

  const A4_HEIGHT_PX = 1123;
  const numPages = Math.max(1, totalPages);

  return (
    <div
      className="w-full min-h-[1123px] bg-[#fffdfa] text-[#2c1810] p-12 leading-relaxed relative font-serif selection:bg-amber-100"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Traditional Double Ornate Border with Maroon and Gold for each A4 Page */}
      {Array.from({ length: numPages }).map((_, pageIdx) => {
        const pageTop = pageIdx * A4_HEIGHT_PX;
        return (
          <div
            key={`classic-frame-${pageIdx}`}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${pageTop}px`,
              height: `${A4_HEIGHT_PX}px`,
            }}
          >
            <div className="absolute inset-4 border-3 border-[#881337] rounded-xl pointer-events-none" />
            <div className="absolute inset-6 border border-[#d97706] rounded-lg pointer-events-none" />

            {/* Traditional Corner Symbols */}
            <div className="absolute top-7 left-7 text-[#d97706] pointer-events-none text-sm">卐 / ॐ / ❖</div>
            <div className="absolute top-7 right-7 text-[#d97706] pointer-events-none text-sm">❖</div>
            <div className="absolute bottom-7 left-7 text-[#d97706] pointer-events-none text-sm">❖</div>
            <div className="absolute bottom-7 right-7 text-[#d97706] pointer-events-none text-sm">❖</div>
          </div>
        );
      })}

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-1.5 pt-2 cv-item-avoid-break">
          {customization.showBismillah && customization.bismillahText ? (
            <div className="text-lg text-[#881337] font-bold">{customization.bismillahText}</div>
          ) : (
            <div className="text-xs uppercase tracking-widest text-[#b45309] font-bold font-sans">
              || Shree Ganeshay Namah ||
            </div>
          )}

          <div className="inline-block border-y-2 border-[#881337] py-1 px-6 my-1">
            <h1 className="text-3xl font-bold tracking-wide text-[#881337] uppercase">
              {customization.title || 'Bio-Data For Marriage'}
            </h1>
          </div>

          <div className="text-3xl font-extrabold text-[#701a75]">
            {personal.fullName || 'Candidate Full Name'}
          </div>

          {educationCareer.currentOccupation && (
            <p className="text-sm font-semibold text-[#881337] font-sans">
              {educationCareer.currentOccupation}
              {educationCareer.organization ? ` • ${educationCareer.organization}` : ''}
            </p>
          )}

          {customization.subtitleQuote && (
            <p className="text-xs italic text-[#78350f] max-w-xl mx-auto pt-1 cv-paragraph">
              {customization.subtitleQuote}
            </p>
          )}
        </header>

        {/* Traditional 2-Column Table Format for Personal Particulars */}
        <div data-cv-item="true" className="cv-item-avoid-break border border-[#b45309]/50 rounded-lg overflow-hidden bg-white/90 shadow-2xs">
          <div className="bg-[#881337] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-sans flex items-center justify-between cv-heading">
            <span>Personal Particulars</span>
            {personal.bloodGroup && <span>Blood Group: {personal.bloodGroup}</span>}
          </div>

          <div className="p-4 flex flex-row gap-5 items-start">
            {privacy.showPhoto && personal.photoUrl ? (
              <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-[#881337] shrink-0 bg-amber-50">
                <img
                  src={personal.photoUrl}
                  alt={personal.fullName || 'Photo'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex-1 w-full grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-sans">
              {personal.dateOfBirth && (
                <div>
                  <span className="font-bold text-[#881337]">Date of Birth:</span>{' '}
                  {personal.dateOfBirth} {personal.age ? `(${personal.age})` : ''}
                </div>
              )}
              {personal.height && (
                <div>
                  <span className="font-bold text-[#881337]">Height:</span> {personal.height}
                </div>
              )}
              {personal.religion && (
                <div>
                  <span className="font-bold text-[#881337]">Religion / Caste:</span>{' '}
                  {personal.religion} {personal.casteOrSect ? `(${personal.casteOrSect})` : ''}
                </div>
              )}
              {personal.maritalStatus && (
                <div>
                  <span className="font-bold text-[#881337]">Marital Status:</span>{' '}
                  {personal.maritalStatus}
                </div>
              )}
              {personal.complexion && (
                <div>
                  <span className="font-bold text-[#881337]">Complexion:</span> {personal.complexion}
                </div>
              )}
              {personal.motherTongue && (
                <div>
                  <span className="font-bold text-[#881337]">Mother Tongue:</span>{' '}
                  {personal.motherTongue}
                </div>
              )}
              {personal.currentLocation && (
                <div className="col-span-2">
                  <span className="font-bold text-[#881337]">Present Residence:</span>{' '}
                  {personal.currentLocation}
                </div>
              )}
              {privacy.showPermanentAddress && personal.permanentAddress && (
                <div className="col-span-2">
                  <span className="font-bold text-[#881337]">Native / Permanent Address:</span>{' '}
                  {personal.permanentAddress}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Education & Occupation Table */}
        {(educationCareer.highestDegree || educationCareer.currentOccupation) && (
          <div data-cv-item="true" className="cv-item-avoid-break border border-[#b45309]/50 rounded-lg overflow-hidden bg-white/90">
            <div className="bg-[#881337] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-sans cv-heading">
              Education &amp; Professional Profile
            </div>
            <div className="p-4 space-y-2 text-sm font-sans">
              {educationCareer.highestDegree && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-bold text-[#881337]">Qualification:</span>{' '}
                  {educationCareer.highestDegree}{' '}
                  {educationCareer.majorOrField ? `(${educationCareer.majorOrField})` : ''}
                  {educationCareer.institution && (
                    <div className="text-slate-600 text-xs">
                      {educationCareer.institution}{' '}
                      {educationCareer.graduationYear ? `[${educationCareer.graduationYear}]` : ''}
                    </div>
                  )}
                </div>
              )}
              {educationCareer.additionalEducation && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-bold text-[#881337]">Other Education:</span>{' '}
                  {educationCareer.additionalEducation}
                </div>
              )}
              {educationCareer.currentOccupation && (
                <div data-cv-subitem="true" className="pt-1 border-t border-amber-100 cv-item-avoid-break">
                  <span className="font-bold text-[#881337]">Designation / Occupation:</span>{' '}
                  {educationCareer.designation || educationCareer.currentOccupation}
                  {educationCareer.organization && (
                    <div className="text-slate-600 text-xs">
                      {educationCareer.organization}{' '}
                      {educationCareer.workLocation ? `• ${educationCareer.workLocation}` : ''}
                    </div>
                  )}
                </div>
              )}
              {privacy.showIncome && educationCareer.annualIncome && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-bold text-[#881337]">Annual Package / Income:</span>{' '}
                  {educationCareer.annualIncome}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Family Details Table */}
        {(family.fatherName || family.motherName || family.familyAbout) && (
          <div data-cv-item="true" className="cv-item-avoid-break border border-[#b45309]/50 rounded-lg overflow-hidden bg-white/90">
            <div className="bg-[#881337] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-sans cv-heading">
              Family Details &amp; Background
            </div>
            <div className="p-4 space-y-2 text-sm font-sans">
              <div data-cv-subitem="true" className="grid grid-cols-2 gap-3 cv-item-avoid-break">
                {family.fatherName && (
                  <div>
                    <span className="font-bold text-[#881337]">Father's Name:</span> {family.fatherName}
                    {family.fatherOccupation && (
                      <div className="text-xs text-slate-600">{family.fatherOccupation}</div>
                    )}
                  </div>
                )}
                {family.motherName && (
                  <div>
                    <span className="font-bold text-[#881337]">Mother's Name:</span> {family.motherName}
                    {family.motherOccupation && (
                      <div className="text-xs text-slate-600">{family.motherOccupation}</div>
                    )}
                  </div>
                )}
              </div>

              {(family.numberOfBrothers || family.numberOfSisters) && (
                <div data-cv-subitem="true" className="pt-2 border-t border-amber-100 grid grid-cols-2 gap-2 cv-item-avoid-break">
                  {family.numberOfBrothers && (
                    <div>
                      <span className="font-bold text-[#881337]">Brothers:</span>{' '}
                      {family.numberOfBrothers}{' '}
                      {family.brotherDetails ? `(${family.brotherDetails})` : ''}
                    </div>
                  )}
                  {family.numberOfSisters && (
                    <div>
                      <span className="font-bold text-[#881337]">Sisters:</span>{' '}
                      {family.numberOfSisters}{' '}
                      {family.sisterDetails ? `(${family.sisterDetails})` : ''}
                    </div>
                  )}
                </div>
              )}

              {(family.nativePlace || family.ancestralRoots || family.familyStatus) && (
                <div data-cv-subitem="true" className="pt-1 border-t border-amber-100 text-xs text-slate-600 cv-item-avoid-break">
                  {family.nativePlace && (
                    <div>
                      <span className="font-bold text-[#881337]">Native Place:</span>{' '}
                      {family.nativePlace}
                    </div>
                  )}
                  {family.familyStatus && (
                    <div>
                      <span className="font-bold text-[#881337]">Family Status / Values:</span>{' '}
                      {family.familyStatus} {family.familyValues ? `• ${family.familyValues}` : ''}
                    </div>
                  )}
                </div>
              )}

              {family.familyAbout && (
                <p className="text-xs italic text-slate-700 pt-1 font-serif cv-paragraph">
                  {family.familyAbout}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Partner Expectations */}
        {(preferences.ageRange || preferences.educationPreference || preferences.valuesExpectations) && (
          <div data-cv-item="true" className="cv-item-avoid-break border border-[#b45309]/50 rounded-lg overflow-hidden bg-white/90">
            <div className="bg-[#881337] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-sans cv-heading">
              Partner Preferences &amp; Expectations
            </div>
            <div className="p-4 space-y-2 text-sm font-sans">
              <div data-cv-subitem="true" className="grid grid-cols-2 gap-2 cv-item-avoid-break">
                {preferences.ageRange && (
                  <div>
                    <span className="font-bold text-[#881337]">Age Range:</span> {preferences.ageRange}
                  </div>
                )}
                {preferences.heightRange && (
                  <div>
                    <span className="font-bold text-[#881337]">Height:</span> {preferences.heightRange}
                  </div>
                )}
              </div>
              {preferences.educationPreference && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-bold text-[#881337]">Preferred Education / Career:</span>{' '}
                  {preferences.educationPreference}
                </div>
              )}
              {preferences.valuesExpectations && (
                <div className="text-xs pt-1 cv-paragraph">
                  <span className="font-bold text-[#881337]">Expectations:</span>{' '}
                  {preferences.valuesExpectations}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {(contact.contactPersonName || contact.phone || contact.email) && (
          <div data-cv-item="true" className="cv-item-avoid-break border border-[#b45309]/50 rounded-lg overflow-hidden bg-white/90">
            <div className="bg-[#881337] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-sans cv-heading">
              Contact &amp; Communication
            </div>
            <div className="p-4 space-y-2 text-sm font-sans">
              {contact.contactPersonName && (
                <div data-cv-subitem="true" className="cv-item-avoid-break">
                  <span className="font-bold text-[#881337]">Contact Person:</span>{' '}
                  {contact.contactPersonName}{' '}
                  {contact.relationship ? `(${contact.relationship})` : ''}
                </div>
              )}

              <div data-cv-subitem="true" className="flex flex-wrap items-center gap-6 pt-1 cv-item-avoid-break">
                {privacy.showPhone && contact.phone && (
                  <div>
                    <span className="font-bold text-[#881337]">Phone:</span> {contact.phone}
                  </div>
                )}
                {privacy.showEmail && contact.email && (
                  <div>
                    <span className="font-bold text-[#881337]">Email:</span> {contact.email}
                  </div>
                )}
              </div>

              {contact.convenientTimeToCall && (
                <div data-cv-subitem="true" className="text-xs text-slate-600 cv-item-avoid-break">
                  Calling Hours: {contact.convenientTimeToCall}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
