import { useState } from 'react';
import { FileText, MapPin, Camera, Mic, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function FieldReportView() {
  const { t } = useLanguage();
  const { token, user } = useAuth();

  const [incidentType, setIncidentType] = useState('Infrastructure Damage');
  const [location, setLocation] = useState(user?.assignedArea || '');
  const [incidentSummary, setIncidentSummary] = useState('');
  const [damagesObserved, setDamagesObserved] = useState('');
  const [immediateNeeds, setImmediateNeeds] = useState('');
  const [affectedPeople, setAffectedPeople] = useState(0);
  const [flaggedUrgent, setFlaggedUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setIncidentType('Infrastructure Damage');
    setLocation(user?.assignedArea || '');
    setIncidentSummary('');
    setDamagesObserved('');
    setImmediateNeeds('');
    setAffectedPeople(0);
    setFlaggedUrgent(false);
  };

  const handleSubmit = async () => {
    if (!incidentType.trim()) {
      toast.error('Incident type is required');
      return;
    }
    if (!location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!incidentSummary.trim()) {
      toast.error('Incident summary is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(
        '/volunteer/field-reports',
        {
          incidentType,
          incidentTypeBn: incidentType,
          location,
          locationBn: location,
          district: location,
          districtBn: location,
          incidentSummary,
          incidentSummaryBn: incidentSummary,
          damagesObserved,
          immediateNeeds,
          affectedPeople,
          flaggedUrgent,
        },
        token,
      );
      toast.success('Field report submitted');
      resetForm();
    } catch (error) {
      console.error('Failed to submit field report', error);
      toast.error('Failed to submit field report');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white" title={t('incident_type')}>
                  <option value="Major Flooding">{t('major_flooding')}</option>
                  <option value="Infrastructure Damage">{t('infrastructure_damage')}</option>
                  <option value="Mass Evacuation">{t('mass_evacuation')}</option>
                  <option value="Medical Emergency">{t('medical_emergency')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('precise_location')}</label>
                <div className="flex gap-2">
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder={t('landmark_coordinates')} value={location} onChange={(e) => setLocation(e.target.value)} />
                  <button type="button" className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100" title={t('get_gps')}>
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('incident_summary')}</label>
              <textarea rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder={t('brief_description')} value={incidentSummary} onChange={(e) => setIncidentSummary(e.target.value)}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('damages_observed')}</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder={t('damages_placeholder')} value={damagesObserved} onChange={(e) => setDamagesObserved(e.target.value)}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('immediate_needs')}</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder={t('needs_placeholder')} value={immediateNeeds} onChange={(e) => setImmediateNeeds(e.target.value)}></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('affected_people_est')}</label>
              <input type="number" className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder={t('approximate_count')} value={affectedPeople} onChange={(e) => setAffectedPeople(Number(e.target.value || 0))} />
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
                  <input type="checkbox" className="sr-only peer" checked={flaggedUrgent} onChange={(e) => setFlaggedUrgent(e.target.checked)} title={t('flag_urgent')} aria-label={t('flag_urgent')} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
             </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white rounded-lg hover:bg-gray-50" onClick={resetForm}>{t('cancel')}</button>
            <button type="button" className="px-5 py-2 text-sm font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm disabled:opacity-60" onClick={() => void handleSubmit()} disabled={isSubmitting}>
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : t('submit_report_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
