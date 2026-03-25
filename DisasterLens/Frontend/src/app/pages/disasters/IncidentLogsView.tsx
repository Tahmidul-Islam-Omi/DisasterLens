import { useState, useMemo } from 'react';
import { Filter, Search, AlertCircle, MapPin, Clock, ShieldCheck, FileWarning, ArrowUpRight, Activity } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const incidents = [
  { id: 'INC-092', time: '10:45 AM', location: 'Sylhet Sadar, Zone A', type: 'Medical Emergency', severity: 'Critical', source: 'Field Volunteer', verified: true, status: 'Active' },
  { id: 'INC-091', time: '10:30 AM', location: 'Sunamganj Route 4', type: 'Infrastructure Damage', severity: 'High', source: 'News API', verified: true, status: 'Active' },
  { id: 'INC-090', time: '10:15 AM', location: 'Netrokona Camp 2', type: 'Supply Shortage', severity: 'High', source: 'Social Media', verified: false, status: 'Investigating' },
  { id: 'INC-089', time: '09:50 AM', location: 'Habiganj Center', type: 'Evacuation Request', severity: 'Moderate', source: 'Local Authority', verified: true, status: 'Resolved' },
  { id: 'INC-088', time: '09:20 AM', location: 'Sylhet River Bank', type: 'Flood Level Critical', severity: 'Critical', source: 'IoT Sensor', verified: true, status: 'Active' },
  { id: 'INC-087', time: '08:45 AM', location: 'Moulvibazar', type: 'Power Outage', severity: 'Moderate', source: 'Utility DB', verified: true, status: 'Active' },
  { id: 'INC-086', time: '08:10 AM', location: 'Sunamganj Rural', type: 'Stranded Group', severity: 'High', source: 'Emergency Hotline', verified: false, status: 'Investigating' },
];

export default function IncidentLogsView() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState(incidents[0].id);
  const selected = useMemo(() => incidents.find(i => i.id === selectedId) ?? incidents[0], [selectedId]);

  const getSeverityClass = (s: string) =>
    s === 'Critical' ? 'bg-red-100 text-red-700' : s === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700';
  const getStatusClass = (s: string) =>
    s === 'Active' ? 'bg-red-100 text-red-700' : s === 'Investigating' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileWarning className="w-6 h-6 text-blue-900" />
              {t('incident.title')}
            </h2>
            <p className="text-gray-500 mt-1">{t('incident.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />{t('incident.filterLogs')}
            </button>
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" />{t('incident.verifySelected')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 lg:p-6 gap-6">
        <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-2 w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder={t('incident.searchPlaceholder')} className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select className="bg-gray-50 text-sm rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500">
              <option>{t('common.allSeverities')}</option>
              <option>Critical</option><option>High</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {incidents.map((incident) => (
              <div key={incident.id} onClick={() => setSelectedId(incident.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 mb-2 border-l-4 ${selected.id === incident.id ? 'bg-blue-50 border-blue-900 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 border border-gray-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">{incident.id}</span>
                    {incident.verified ? <ShieldCheck className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-orange-500" />}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500"><Clock className="w-3 h-3" />{incident.time}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{incident.type}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /><span className="truncate">{incident.location}</span></div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityClass(incident.severity)}`}>{incident.severity}</span>
                  <span className="text-xs text-gray-500">{incident.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded">{selected.id}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusClass(selected.status)}`}>{selected.status}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selected.type}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4" />{selected.location}</p>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><ArrowUpRight className="w-5 h-5" /></button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase">{t('incident.reportedTime')}</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" />{selected.time}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase">{t('incident.sourceInfo')}</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" />{selected.source}</p>
              </div>
            </div>
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-1"><Activity className="w-4 h-4" />{t('incident.aiSummary')}</h4>
              <p className="text-sm text-gray-700 leading-relaxed">Based on the reported data, this incident requires immediate coordinated response. Initial AI analysis suggests dispatching a rescue team within 30 minutes to prevent escalation.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">{t('incident.verificationStatus')}</h4>
              {selected.verified ? (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">{t('incident.verifiedByOfficialSource')}</p>
                    <p className="text-xs text-green-700 mt-1">{t('incident.confirmedGroundUnits')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-900">{t('incident.unverifiedReport')}</p>
                    <p className="text-xs text-orange-700 mt-1">{t('incident.pendingValidation')}</p>
                    <button className="mt-3 px-3 py-1.5 bg-white border border-orange-300 text-orange-700 text-xs font-bold rounded shadow-sm hover:bg-orange-100">{t('incident.requestFieldCheck')}</button>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button className="flex-1 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800">{t('incident.dispatchTeam')}</button>
              <button className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">{t('incident.updateStatus')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
