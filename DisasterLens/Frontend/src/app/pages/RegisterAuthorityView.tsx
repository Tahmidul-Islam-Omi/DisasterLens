import React, { useState } from 'react';
import { Building, CheckCircle2, Clock, ShieldAlert, Save, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function RegisterAuthorityView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('register_local_authority')}</h1>
          <p className="text-gray-600">{t('register_authority_desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t('authority_registration_form')}</h2>
                  <p className="text-sm text-gray-500">{t('complete_required_fields')}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{t('basic_information')}</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('authority_name')} <span className="text-red-500">*</span></label>
                      <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('enter_authority_name')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('authority_type')} <span className="text-red-500">*</span></label>
                        <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                          <option value="">{t('select_type')}</option>
                          <option value="response_unit">{t('emergency_response_unit')}</option>
                          <option value="management_office">{t('disaster_management_office')}</option>
                          <option value="relief_operation">{t('relief_operations_center')}</option>
                          <option value="medical">{t('medical_support_unit')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('jurisdiction_area')} <span className="text-red-500">*</span></label>
                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('coverage_area')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{t('location_details')}</h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('region')} <span className="text-red-500">*</span></label>
                        <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                          <option value="">{t('select_region')}</option>
                          <option value="dhaka">Dhaka</option>
                          <option value="chittagong">Chittagong</option>
                          <option value="sylhet">Sylhet</option>
                          <option value="rajshahi">Rajshahi</option>
                          <option value="khulna">Khulna</option>
                          <option value="barishal">Barishal</option>
                          <option value="rangpur">Rangpur</option>
                          <option value="mymensingh">Mymensingh</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('district')} <span className="text-red-500">*</span></label>
                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('enter_district')} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('physical_address')} <span className="text-red-500">*</span></label>
                      <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('street_address')} />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{t('contact_information')}</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_person_name')} <span className="text-red-500">*</span></label>
                      <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('full_name_primary')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('email_address')} <span className="text-red-500">*</span></label>
                        <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="official@authority.gov" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone_number_label')} <span className="text-red-500">*</span></label>
                        <input type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="+880 (1XX) XXX-XXXX" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('emergency_hotline')} <span className="text-red-500">*</span></label>
                        <input type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('emergency_number')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('available_personnel')} <span className="text-red-500">*</span></label>
                        <input type="number" required min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <button type="reset" className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    {t('clear_form')}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div> : <Save className="w-4 h-4" />}
                    {t('register_authority_btn')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-6">{t('registration_stats')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600"><Building className="w-4 h-4" /><span className="text-sm">{t('total_authorities')}</span></div>
                  <span className="text-lg font-bold text-gray-900">156</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-4 h-4" /><span className="text-sm">{t('active')}</span></div>
                  <span className="text-lg font-bold text-green-600">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-500"><Clock className="w-4 h-4" /><span className="text-sm">{t('pending')}</span></div>
                  <span className="text-lg font-bold text-amber-500">14</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-6">{t('recent_registrations')}</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Northern Emergency Response Unit</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{t('northern_region')}</p>
                      <p className="text-[10px] text-gray-400 mt-1">2026-03-15</p>
                    </div>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{t('active')}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Central Disaster Management Office</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{t('central_region')}</p>
                      <p className="text-[10px] text-gray-400 mt-1">2026-03-13</p>
                    </div>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{t('active')}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Coastal Relief Operations</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{t('southern_coast')}</p>
                      <p className="text-[10px] text-gray-400 mt-1">2026-03-12</p>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">{t('pending_verification')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
