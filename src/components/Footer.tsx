/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
  const { t } = useLanguage();

  const openAbout = () => {
    setModalContent({
      title: t.footer.aboutTitle,
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>{t.footer.aboutP1}</p>
          <p>{t.footer.aboutP2}</p>
          <p className="font-semibold text-slate-800">{t.footer.aboutHighlights}</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>{t.footer.aboutH1}</li>
            <li>{t.footer.aboutH2}</li>
            <li>{t.footer.aboutH3}</li>
          </ul>
        </div>
      ),
    });
  };

  const openPrivacy = () => {
    setModalContent({
      title: t.footer.privacyTitle,
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            {t.footer.privacyH1}
          </p>
          <p>{t.footer.privacyP1}</p>
          <p>{t.footer.privacyP2}</p>
          <p>{t.footer.privacyP3}</p>
        </div>
      ),
    });
  };

  const openTerms = () => {
    setModalContent({
      title: t.footer.termsTitle,
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>{t.footer.termsP1}</p>
          <p>{t.footer.termsP2}</p>
          <p>{t.footer.termsP3}</p>
        </div>
      ),
    });
  };

  const openContact = () => {
    setModalContent({
      title: t.footer.contactTitle,
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>{t.footer.contactP1}</p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-semibold text-slate-800">{t.footer.contactDirect}</div>
            <div className="text-blue-600 font-mono text-[11px] mt-0.5">salmansakib427@gmail.com</div>
          </div>
          <p className="text-[11px] text-slate-400">
            {t.footer.contactResponseTime}
          </p>
        </div>
      ),
    });
  };

  return (
    <>
      <footer className="bg-white border-t border-slate-200 py-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3 text-center sm:text-left justify-center md:justify-start">
            <div className="flex items-center">
              <img
                src="/assets/aistudio/ProCVmaKer_Resume_Builder_Logo_ccf153de.png"
                alt="ProCVmaKer Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-xs text-slate-400">
              © {new Date().getFullYear()} {t.footer.copyright}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t.footer.madeByPrefix}{' '}
              <a
                href="https://salmansakib.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-colors"
              >
                MS.SAKIB
              </a>
              {t.footer.madeBySuffix}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500">
            <button
              type="button"
              onClick={openAbout}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {t.footer.about}
            </button>
            <button
              type="button"
              onClick={openPrivacy}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {t.footer.privacy}
            </button>
            <button
              type="button"
              onClick={openTerms}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {t.footer.terms}
            </button>
            <button
              type="button"
              onClick={openContact}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {t.footer.contact}
            </button>
          </div>
        </div>
      </footer>

      {/* Info Dialog Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{modalContent.title}</h3>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">{modalContent.content}</div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                {t.footer.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
