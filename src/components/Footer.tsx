/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Shield, FileCode2, Mail, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const openAbout = () => {
    setModalContent({
      title: 'About ProCVmaKer',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            ProCVmaKer is an open, private, and client-first CV and Resume Builder designed to give candidates total control over their career documents without paywalls, hidden watermarks, or intrusive subscriptions.
          </p>
          <p>
            Our templates are crafted based on real-world hiring standards across elite academic institutions, data analytics companies, and Fortune 500 engineering organizations.
          </p>
          <p>
            Key Highlights:
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>True editable Word .docx generation using native paragraph runs and tables.</li>
            <li>Selectable, clickable PDF exports preserving full hyperlink fidelity.</li>
            <li>Zero cloud data leakage: your personal details stay in your local browser session.</li>
          </ul>
        </div>
      ),
    });
  };

  const openPrivacy = () => {
    setModalContent({
      title: 'Privacy Policy & Local Storage Notice',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Your Data Stays on Your Device.
          </p>
          <p>
            ProCVmaKer values your privacy above all else. We do not transmit, sell, or index your personal information, work history, or contact details to any remote backend server.
          </p>
          <p>
            All draft resumes are stored strictly in your browser's standard <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-800">localStorage</code>. This means your drafts remain on this specific device and will only be cleared if you manually clear your browser's site data or click "Clear All Data".
          </p>
          <p>
            No external analytics trackers or third-party cookies are used.
          </p>
        </div>
      ),
    });
  };

  const openTerms = () => {
    setModalContent({
      title: 'Terms of Use',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            By using ProCVmaKer, you are granted complete, royalty-free ownership of any CV, resume, or document generated using this platform.
          </p>
          <p>
            You are free to download, distribute, print, and submit your exported .docx and .pdf files to any employer, university, scholarship board, or client worldwide.
          </p>
          <p>
            The software is provided "as is", without warranty of any kind, express or implied.
          </p>
        </div>
      ),
    });
  };

  const openContact = () => {
    setModalContent({
      title: 'Contact & Support',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Have feedback, feature suggestions, or questions regarding ProCVmaKer? We would love to hear from you.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-semibold text-slate-800">Direct Support:</div>
            <div className="text-blue-600 font-mono text-[11px] mt-0.5">salmansakib427@gmail.com</div>
          </div>
          <p className="text-[11px] text-slate-400">
            Average response time: within 24 hours on business days.
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
              © {new Date().getFullYear()} Professional CV Builder.
            </span>
            <span className="text-xs text-slate-500 font-medium">
              (Made by{' '}
              <a
                href="https://salmansakib.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-colors"
              >
                MS.SAKIB
              </a>
              )
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500">
            <button
              type="button"
              onClick={openAbout}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={openPrivacy}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={openTerms}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={openContact}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Contact
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
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
