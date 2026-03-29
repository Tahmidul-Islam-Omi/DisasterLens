import { useLanguage } from '../i18n/LanguageContext';
import React, { useEffect, useState } from 'react';
import { 
  Filter, Search, AlertCircle, MapPin, Clock, ShieldCheck, FileWarning, ArrowUpRight, Activity
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type Incident = {
  id: string;
  type: string;
  typeBn: string;
  location: string;
  locationBn: string;
  timeReported: string;
  timeReportedBn: string;
  source: string;
  sourceBn: string;
  verified: boolean;
  status: string;
  severity: string;
};

export function IncidentLogsView() {
  const { t, d } = useLanguage();
  const { token } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.get<Incident[]>('/authority/incidents', token);
        setIncidents(data);
        setSelectedIncident(data[0] || null);
      } catch (error) {
        console.error('Failed to load incidents', error);
      }
    };
    void loadData();
  }, []);

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
            <p className="text-gray-500 text-sm mt-1">{t('incident_logs_desc')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t('live_stream_active')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Logs List */}
        <div className="w-2/3 border-r border-gray-200 flex flex-col bg-white">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center bg-gray-50">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('search_incidents')} 
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              {t('severity')}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              {t('district_filter')}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              {t('source')}
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {incidents.map((incident) => (
              <div 
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedIncident.id === incident.id ? 'bg-blue-50 border-l-4 border-l-[#1E3A8A]' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-gray-500">{incident.id}</span>
                    {incident.verified ? (
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {d(incident.timeReported, incident.timeReportedBn)}
                  </span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{d(incident.type, incident.typeBn)}</h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {d(incident.location, incident.locationBn)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      incident.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      incident.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {t(incident.severity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel (Detail View) */}
        <div className="w-1/3 bg-[#F8FAFC] flex flex-col">
          {selectedIncident ? (
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{d(selectedIncident.type, selectedIncident.typeBn)}</h3>
                  <p className="font-mono text-sm text-gray-500">{selectedIncident.id}</p>
                </div>
                <button className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" title={t('view')} aria-label={t('view')}>
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('incident_details')}</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">{t('location')}</p>
                        <p className="text-sm font-medium text-gray-900">{d(selectedIncident.location, selectedIncident.locationBn)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">{t('time_reported')}</p>
                        <p className="text-sm font-medium text-gray-900">{d(selectedIncident.timeReported, selectedIncident.timeReportedBn)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">{t('severity')}</p>
                        <p className={`text-sm font-medium ${selectedIncident.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>{t(selectedIncident.severity)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('intelligence_source')}</h4>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{d(selectedIncident.source, selectedIncident.sourceBn)}</p>
                    {selectedIncident.verified ? (
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 border border-green-200">
                        <ShieldCheck className="w-3 h-3" /> {t('verified')}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                        <AlertCircle className="w-3 h-3" /> {t('unverified')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{t('source_reliability')}: {selectedIncident.verified ? 'High (98%)' : 'Moderate (65%)'}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('status_actions')}</h4>
                  
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedIncident.status === 'active' ? 'bg-[#1E3A8A] text-white' : 
                      selectedIncident.status === 'investigating' ? 'bg-amber-500 text-white' : 
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {t(selectedIncident.status)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
                      {t('dispatch_resources')}
                    </button>
                    <button className="w-full py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      {t('update_status_btn')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              {t('select_incident')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}