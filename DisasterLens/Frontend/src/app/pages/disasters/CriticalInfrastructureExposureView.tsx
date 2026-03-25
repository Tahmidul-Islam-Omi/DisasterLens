import { useState } from 'react';
import { Building2, Activity, Car, Home, Zap, Filter, Search, MapPin, Users, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Infrastructure {
  id: string;
  name: string;
  type: string;
  location: string;
  hazard: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Operational' | 'Compromised' | 'Offline';
  population: string;
  coordinates: { x: number; y: number };
  icon: React.ElementType;
}

const data: Infrastructure[] = [
  { id: '1', name: 'Northern Province General Hospital', type: 'Hospital', location: 'Northern Province', hazard: 'Flood', severity: 'High', status: 'Compromised', population: '120,000', coordinates: { x: 35, y: 25 }, icon: Activity },
  { id: '2', name: 'Coastal Emergency Shelter B', type: 'Shelter', location: 'Eastern Coast', hazard: 'Cyclone', severity: 'High', status: 'Operational', population: '5,000', coordinates: { x: 75, y: 40 }, icon: Home },
  { id: '3', name: 'Grid Station Alpha', type: 'Power Facility', location: 'Central Region', hazard: 'Landslide', severity: 'Medium', status: 'Offline', population: '45,000', coordinates: { x: 50, y: 60 }, icon: Zap },
  { id: '4', name: 'Surma River Bridge N2', type: 'Bridge', location: 'Northern Province', hazard: 'Flood', severity: 'High', status: 'Compromised', population: 'N/A', coordinates: { x: 38, y: 30 }, icon: Car },
  { id: '5', name: 'Primary School Zone A', type: 'School', location: 'Southern District', hazard: 'Storm', severity: 'Low', status: 'Operational', population: '800', coordinates: { x: 45, y: 80 }, icon: Building2 },
  { id: '6', name: 'Coastal Highway E5', type: 'Road', location: 'Eastern Coast', hazard: 'Cyclone', severity: 'Medium', status: 'Operational', population: 'N/A', coordinates: { x: 70, y: 45 }, icon: Car },
];

const typeFilters = ['all', 'Hospital', 'Shelter', 'Power Facility', 'School'];
const severityFilters = ['All', 'High', 'Medium', 'Low'];

export default function CriticalInfrastructureExposureView() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Infrastructure | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('All');

  const filtered = data.filter(item =>
    (filterType === 'all' || item.type === filterType) &&
    (filterSeverity === 'All' || item.severity === filterSeverity)
  );

  const getSevColor = (s: string) => s === 'High' ? 'bg-red-100 text-red-600' : s === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600';
  const getStatusColor = (s: string) => s === 'Operational' ? 'text-green-600 bg-green-500' : s === 'Offline' ? 'text-red-600 bg-red-500' : 'text-orange-600 bg-orange-500';

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="p-6 pb-4 shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('infra.title')}</h1>
            <p className="text-gray-500">{t('infra.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder={t('infra.searchPlaceholder')} className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />{t('common.moreFilters')}
            </button>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {typeFilters.map(type => (
              <button key={type} onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === type ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex gap-2">
            {severityFilters.map(sev => (
              <button key={sev} onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${filterSeverity === sev
                  ? (sev === 'High' ? 'bg-red-100 border-red-200 text-red-700' : sev === 'Medium' ? 'bg-orange-100 border-orange-200 text-orange-700' : sev === 'Low' ? 'bg-yellow-100 border-yellow-200 text-yellow-700' : 'bg-gray-800 text-white border-gray-800')
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                {sev} Risk
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${selected ? 'w-[400px]' : 'w-1/2'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{filtered.length} {t('infra.assetsFound')}</span>
            <span className="text-xs text-gray-500">{t('infra.sortedBySeverity')}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.map(item => {
              const isSelected = selected?.id === item.id;
              const Icon = item.icon;
              return (
                <div key={item.id} onClick={() => setSelected(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getSevColor(item.severity)}`}><Icon className="w-5 h-5" /></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.type} • {item.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-gray-50 p-2 rounded flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Exposure</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <AlertTriangle className={`w-3 h-3 ${item.severity === 'High' ? 'text-red-500' : item.severity === 'Medium' ? 'text-orange-500' : 'text-yellow-500'}`} />
                        {item.hazard}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Status</span>
                      <span className={`text-sm font-medium flex items-center gap-1 ${getStatusColor(item.status).split(' ')[0]}`}>
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(item.status).split(' ')[1]}`} />{item.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative bg-blue-50/30">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="ieGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#ieGrid)" />
            </svg>
          </div>

          {selected ? (
            <div className="absolute right-6 top-6 bottom-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-900">{t('infra.assetDetails')}</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-xl ${getSevColor(selected.severity)}`}><selected.icon className="w-8 h-8" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selected.type} • {selected.location}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Current Status</h4>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">Operational Capacity</span>
                      <span className={`text-sm font-bold ${selected.status === 'Operational' ? 'text-green-600' : selected.status === 'Offline' ? 'text-red-600' : 'text-orange-600'}`}>
                        {selected.status === 'Operational' ? '100%' : selected.status === 'Offline' ? '0%' : '45%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${selected.status === 'Operational' ? 'bg-green-500 w-full' : selected.status === 'Offline' ? 'bg-red-500 w-0' : 'bg-orange-500 w-[45%]'}`} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Exposure Risk</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1 text-gray-500"><AlertTriangle className="w-4 h-4" /><span className="text-xs">Hazard Type</span></div>
                        <span className="font-semibold text-gray-900">{selected.hazard}</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1 text-gray-500"><ShieldAlert className="w-4 h-4" /><span className="text-xs">Severity</span></div>
                        <span className={`font-bold ${selected.severity === 'High' ? 'text-red-600' : selected.severity === 'Medium' ? 'text-orange-600' : 'text-yellow-600'}`}>{selected.severity} Risk</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Impact Analysis</h4>
                    <div className="bg-blue-50 text-blue-900 rounded-lg p-4 flex items-start gap-3">
                      <Users className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Population Affected</p>
                        <p className="text-2xl font-bold mt-1">{selected.population}</p>
                        <p className="text-xs text-blue-700 mt-1 opacity-80">Residents in service area</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 bg-blue-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800">{t('incident.dispatchTeam')}</button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">View Logs</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur px-6 py-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <MapPin className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <h3 className="text-gray-900 font-medium">{t('infra.selectPrompt')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('infra.clickItemDetails')}</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 z-10">
            {filtered.map(item => {
              const isSelected = selected?.id === item.id;
              const Icon = item.icon;
              const colorClass = item.severity === 'High' ? 'bg-red-500' : item.severity === 'Medium' ? 'bg-orange-500' : 'bg-yellow-500';
              return (
                <div key={`map-${item.id}`} className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-40'}`}
                  style={{ left: `${item.coordinates.x}%`, top: `${item.coordinates.y}%` }} onClick={() => setSelected(item)}>
                  {item.severity === 'High' && <div className="absolute -inset-2 rounded-full animate-ping opacity-75 bg-red-400" />}
                  <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 text-white ${isSelected ? 'border-blue-900 ring-4 ring-blue-100' : 'border-white'} ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isSelected && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 pointer-events-none z-50">{item.name}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
