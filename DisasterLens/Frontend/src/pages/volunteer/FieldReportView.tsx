import React from 'react';
import { FileText, MapPin, Camera, Mic, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FieldReportView() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#1E3A8A]" />
            {t('detailed_field_report')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t('submit_comprehensive')}</p>
        </div>

        <form className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('incident_type')}</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  <option>{t('select_type_report')}</option>
                  <option>{t('major_flooding')}</option>
                  <option>{t('infrastructure_damage')}</option>
                  <option>{t('mass_evacuation')}</option>
                  <option>{t('medical_emergency')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('precise_location')}</label>
                <div className="flex gap-2">
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder={t('landmark_coordinates')} />
                  <button type="button" className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100" title={t('get_gps')}>
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('incident_summary')}</label>
              <textarea rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder={t('brief_description')}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('damages_observed')}</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder={t('damages_placeholder')}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('immediate_needs')}</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder={t('needs_placeholder')}></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('affected_people_est')}</label>
              <input type="number" className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder={t('approximate_count')} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('attach_photo')}</label>
                <button type="button" className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Camera className="w-4 h-4" /> {t('upload')}
                </button>
               </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('voice_note')}</label>
                <button type="button" className="w-full py-3 border border-[#1E3A8A] rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-[#1E3A8A] bg-blue-50 hover:bg-blue-100">
                  <Mic className="w-4 h-4" /> {t('record')}
                </button>
               </div>
            </div>

             <div className="flex items-center gap-3 pt-4">
               <span className="text-sm font-medium text-gray-700">{t('flag_urgent')}</span>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
             </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" className="px-5 py-2 text-sm font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm">
              <Send className="w-4 h-4" />
              {t('submit_report_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
