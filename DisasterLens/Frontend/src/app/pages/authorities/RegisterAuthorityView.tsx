import React, { useState } from 'react';
import { Building, CheckCircle2, Clock, Save, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const recentRegistrations = [
  { name: 'Northern Emergency Response Unit', region: 'Northern Region', date: '2026-03-15', status: 'Active', statusColor: 'text-green-600 bg-green-50 border-green-100' },
  { name: 'Central Disaster Management Office', region: 'Central Region', date: '2026-03-13', status: 'Active', statusColor: 'text-green-600 bg-green-50 border-green-100' },
  { name: 'Coastal Relief Operations', region: 'Southern Coast', date: '2026-03-12', status: 'Pending Verification', statusColor: 'text-amber-600 bg-amber-50 border-amber-100' },
];

export default function RegisterAuthorityView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('authority.registerTitle')}</h1>
          <p className="text-gray-600">{t('authority.registerDesc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Building className="w-5 h-5 text-blue-900" /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Authority Registration Form</h2>
                  <p className="text-sm text-gray-500">Complete all required fields</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-8">
                <Section title="Basic Information">
                  <Field label="Authority Name" required><input type="text" required className={inputCls} placeholder="e.g. Eastern Province Emergency Response Unit" /></Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Authority Type" required>
                      <select required className={inputCls + ' bg-white'}>
                        <option value="">Select type</option>
                        <option value="response_unit">Emergency Response Unit</option>
                        <option value="management_office">Disaster Management Office</option>
                        <option value="relief_operation">Relief Operations Center</option>
                        <option value="medical">Medical Support Unit</option>
                      </select>
                    </Field>
                    <Field label="Jurisdiction Area" required><input type="text" required className={inputCls} placeholder="Coverage area or district" /></Field>
                  </div>
                </Section>

                <Section title="Location Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Region" required>
                      <select required className={inputCls + ' bg-white'}>
                        <option value="">Select region</option>
                        {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}
                      </select>
                    </Field>
                    <Field label="District" required><input type="text" required className={inputCls} placeholder="Enter district name" /></Field>
                  </div>
                  <Field label="Physical Address" required><input type="text" required className={inputCls} placeholder="Street / block address" /></Field>
                </Section>

                <Section title="Contact Information">
                  <Field label="Contact Person Name" required><input type="text" required className={inputCls} placeholder="Full name of primary contact" /></Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Email Address" required><input type="email" required className={inputCls} placeholder="official@authority.gov" /></Field>
                    <Field label="Phone Number" required><input type="tel" required className={inputCls} placeholder="+880 (1XX) XXX-XXXX" /></Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Emergency Hotline" required><input type="tel" required className={inputCls} placeholder="24/7 emergency number" /></Field>
                    <Field label="Available Personnel" required><input type="number" required min="1" className={inputCls} placeholder="0" /></Field>
                  </div>
                </Section>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <button type="reset" className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"><RotateCcw className="w-4 h-4" />Clear Form</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm disabled:opacity-70">
                    {isSubmitting ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Save className="w-4 h-4" />}
                    {t('authority.registerBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-6">Registration Stats</h3>
              <div className="space-y-4">
                {[
                  { icon: Building, label: 'Total Authorities', value: '156', color: 'text-gray-600' },
                  { icon: CheckCircle2, label: 'Active', value: '142', color: 'text-green-600' },
                  { icon: Clock, label: 'Pending', value: '14', color: 'text-amber-500' },
                ].map((s, i) => (
                  <div key={i} className={`flex items-center justify-between ${i < 2 ? 'pb-4 border-b border-gray-100' : ''}`}>
                    <div className={`flex items-center gap-2 ${s.color}`}><s.icon className="w-4 h-4" /><span className="text-sm">{s.label}</span></div>
                    <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-6">Recent Registrations</h3>
              <div className="space-y-4">
                {recentRegistrations.map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{r.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{r.region}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{r.date}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.statusColor}`}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{title}</h3>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}
