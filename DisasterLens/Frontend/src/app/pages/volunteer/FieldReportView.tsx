import { FileText, MapPin, Camera, Mic, Send } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function FieldReportView() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-900" />
            {t('volunteer.fieldReportTitle')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t('volunteer.fieldReportSubtitle')}</p>
        </div>
        <form className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.incidentType')}</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  <option>Select incident type</option>
                  <option>Major Flooding</option>
                  <option>Infrastructure Damage</option>
                  <option>Mass Evacuation</option>
                  <option>Medical Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.preciseLocation')}</label>
                <div className="flex gap-2">
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Landmark or coordinates" />
                  <button type="button" className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"><MapPin className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.incidentSummary')}</label>
              <textarea rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder="Brief description of what you observed" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.damagesObserved')}</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder="Property damage, road conditions, infrastructure..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.immediateNeeds')}</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder="Food, water, medical aid, evacuation..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.affectedPeopleEst')}</label>
              <input type="number" className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Approximate count" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('volunteer.attachPhoto')}</label>
                <button type="button" className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><Camera className="w-4 h-4" />Upload</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('volunteer.voiceNote')}</label>
                <button type="button" className="w-full py-3 border border-blue-900 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100"><Mic className="w-4 h-4" />Record</button>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <span className="text-sm font-medium text-gray-700">{t('volunteer.flagUrgent')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
              </label>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button type="button" className="px-5 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm"><Send className="w-4 h-4" />{t('volunteer.submitReport')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
