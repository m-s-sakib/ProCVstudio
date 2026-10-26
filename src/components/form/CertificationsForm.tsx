/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CertificationItem } from '../../types/cv';
import { Plus, Trash2, ArrowUp, ArrowDown, Award } from 'lucide-react';

interface CertificationsFormProps {
  certifications: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications, onChange }) => {
  const handleAdd = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      verificationUrl: '',
    };
    onChange([...certifications, newItem]);
  };

  const handleUpdate = (id: string, field: keyof CertificationItem, value: any) => {
    onChange(
      certifications.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(certifications.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certifications.length) return;
    const items = [...certifications];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Certifications & Licenses</h3>
          <p className="text-xs text-slate-500">Add verified professional certifications, cloud accreditations, or diplomas.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-medium">No certifications listed yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Certification" to show certificates from Google, AWS, Coursera, etc.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1} {cert.name || 'New Certificate'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === certifications.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cert.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Remove certification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleUpdate(cert.id, 'name', e.target.value)}
                    placeholder="e.g. Google Advanced Data Analytics Professional Certificate"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleUpdate(cert.id, 'issuer', e.target.value)}
                    placeholder="e.g. Google Career Certificates / Coursera"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={cert.issueDate}
                    onChange={(e) => handleUpdate(cert.id, 'issueDate', e.target.value)}
                    placeholder="e.g. Sep 2023"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={cert.expirationDate || ''}
                    onChange={(e) => handleUpdate(cert.id, 'expirationDate', e.target.value)}
                    placeholder="e.g. Sep 2026 or No Expiration"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={cert.credentialId || ''}
                    onChange={(e) => handleUpdate(cert.id, 'credentialId', e.target.value)}
                    placeholder="e.g. GCC-94820-ADA"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Verification URL (Clickable in exports)
                  </label>
                  <input
                    type="url"
                    value={cert.verificationUrl || ''}
                    onChange={(e) => handleUpdate(cert.id, 'verificationUrl', e.target.value)}
                    placeholder="https://coursera.org/verify/professional-cert/..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
