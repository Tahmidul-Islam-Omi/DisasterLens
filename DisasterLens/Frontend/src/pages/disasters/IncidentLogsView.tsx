import { useTranslation } from 'react-i18next';
import React, { useState, useMemo } from 'react';
import { 
  Filter, Search, AlertCircle, MapPin, Clock, ShieldCheck, FileWarning, ArrowUpRight, Activity 
} from 'lucide-react';

export default function IncidentLogsView() {
  const { t, i18n } = useTranslation();
  
  const mockIncidents = useMemo(() => [
    { id: 'INC-092', time: '10:45 AM', location: 'Sylhet Sadar, Zone A', type: t('medical_emergency'), severity: t('critical'), source: t('source_field_volunteer'), verified: true, status: t('active') },
    { id: 'INC-091', time: '10:30 AM', location: 'Sunamganj Route 4', type: t('infrastructure'), severity: t('high'), source: t('source_news_api'), verified: true, status: t('active') },
    { id: 'INC-090', time: '10:15 AM', location: 'Netrokona Camp 2', type: t('supply_shortage'), severity: t('high'), source: t('source_social_media'), verified: false, status: t('investigating') },
    { id: 'INC-089', time: '09:50 AM', location: 'Habiganj Center', type: t('evacuation'), severity: t('moderate'), source: t('source_local_authority'), verified: true, status: t('resolved') },
    { id: 'INC-088', time: '09:20 AM', location: 'Sylhet River Bank', type: t('flood_level'), severity: t('critical'), source: t('source_iot_sensor'), verified: true, status: t('active') },
    { id: 'INC-087', time: '08:45 AM', location: 'Moulvibazar', type: t('power_outage'), severity: t('moderate'), source: t('source_utility_db'), verified: true, status: t('active') },
    { id: 'INC-086', time: '08:10 AM', location: 'Sunamganj Rural', type: t('stranded_group'), severity: t('high'), source: t('source_hotline'), verified: false, status: t('investigating') },
  ], [i18n.language, t]);

  const [selectedIncidentId, setSelectedIncidentId] = useState(mockIncidents[0]?.id ?? '');
  const selectedIncident = mockIncidents.find((incident) => incident.id === selectedIncidentId) ?? mockIncidents[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileWarning className="w-6 h-6 text-[#1E3A8A]" />
              {t('incident_command_logs')}
            </h2>
            <p className="text-gray-500 mt-1">{t('monitor_verify_dispatch')}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {t('filter_logs')}
            </button>
            <button className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-800 font-medium flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              {t('verify_selected')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 lg:p-6 gap-6">
        {/* Logs List */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-2 w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={t('search_incident_id')}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg text-sm"
              />
            </div>
            <select className="bg-gray-50 border-transparent text-sm rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500">
              <option>{t('all_severities')}</option>
              <option>{t('critical')}</option>
              <option>{t('high')}</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {mockIncidents.map((incident) => (
              <div 
                key={incident.id}
                onClick={() => setSelectedIncidentId(incident.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 mb-2 border-l-4 ${
                  selectedIncident?.id === incident.id 
                    ? 'bg-blue-50 border-[#1E3A8A] shadow-sm' 
                    : 'bg-white border-transparent hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">{incident.id}</span>
                    {incident.verified ? (
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Clock className="w-3 h-3" />
                    {incident.time}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{incident.type}</h3>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{incident.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    incident.severity === t('critical') || incident.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    incident.severity === t('high') || incident.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {incident.severity}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{t('source_short')}: <span className="text-gray-900">{incident.source}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="hidden lg:flex w-1/2 flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#1E3A8A] text-white text-xs font-bold px-2 py-1 rounded">
                  {selectedIncident.id}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  selectedIncident.status === t('active') ? 'bg-red-100 text-red-700' :
                  selectedIncident.status === t('investigating') ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedIncident.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedIncident.type}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {selectedIncident.location}
              </p>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase">{t('reported_time')}</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {selectedIncident.time}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase">{t('source_info')}</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  {selectedIncident.source}
                </p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <h4 className="text-sm font-bold text-[#1E3A8A] mb-2 flex items-center gap-1">
                <Activity className="w-4 h-4" /> {t('ai_situation_summary')}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {t('incident_ai_summary_mock')}
              </p>
            </div>

            {/* Verification Status */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">{t('verification_status')}</h4>
              {selectedIncident.verified ? (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">{t('verified_by_official_source')}</p>
                    <p className="text-xs text-green-700 mt-1">{t('confirmed_ground_units')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-900">{t('unverified_report')}</p>
                    <p className="text-xs text-orange-700 mt-1">{t('pending_validation')}</p>
                    <button className="mt-3 px-3 py-1.5 bg-white border border-orange-300 text-orange-700 text-xs font-bold rounded shadow-sm hover:bg-orange-100">
                      {t('request_field_check')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button className="flex-1 py-2.5 bg-[#1E3A8A] text-white rounded-lg font-medium shadow-sm hover:bg-blue-800 transition-colors">
                {t('dispatch_team', 'Dispatch Team')}
              </button>
              <button className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                {t('update_status', 'Update Status')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
