import React from 'react';
import { ClipboardCheck, MapPin, Camera, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LogActivityView() {
  const { t } = useTranslation();
  const activityTags = [
    t('household_visit'), t('rescued_people'), t('relief_distributed'), t('blocked_road'),
    t('shelter_status'), t('water_shortage'), t('medical_need'), t('missing_person_sighting')
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-[#1E3A8A]" />
            {t('log_activity_title')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t('log_activity_desc')}</p>
        </div>

        <form className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('village_location')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" defaultValue="Sector 4, Sylhet" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('time_of_activity')}</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="time" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" defaultValue="14:30" />
                  </div>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('activity_type')}</label>
              <div className="flex flex-wrap gap-2">
                {activityTags.map(tag => (
                  <button type="button" key={tag} className="px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] focus:bg-blue-50 focus:border-[#1E3A8A] focus:text-[#1E3A8A] transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{t('households')}</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{t('people_rescued_label')}</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{t('relief_kits')}</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
              <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder={t('provide_details')}></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('photo_evidence')}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Camera className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-xs font-medium text-gray-900">{t('take_photo_upload')}</p>
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('urgency_level')}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="urgency" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-700">{t('routine')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="urgency" className="text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-gray-700">{t('urgent')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              {t('cancel')}
            </button>
            <button type="button" className="px-5 py-2 text-sm font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              {t('save_log')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
