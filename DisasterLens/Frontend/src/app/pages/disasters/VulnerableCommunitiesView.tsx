import { useState } from 'react';
import { Users, MapPin, AlertTriangle, Home, Car, TrendingUp, Search, Filter, ShieldAlert, ChevronRight, Activity, Layers, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Community {
  id: string;
  name: string;
  district: string;
  population: string;
  riskLevel: 'Critical' | 'High' | 'Moderate';
  priorityScore: number;
  shelterAccess: string;
  roadAccessibility: string;
  hazards: string[];
  coordinates: { x: number; y: number };
  breakdown: { elevation: string; density: string; shelterDistance: string; history: string };
}

const communities: Community[] = [
  { id: 'c1', name: 'Char Ilisha', district: 'Bhola, Barishal Division', population: '4,200', riskLevel: 'Critical', priorityScore: 94, shelterAccess: 'Very Poor', roadAccessibility: 'Compromised', hazards: ['Flash Flood', 'Landslide'], coordinates: { x: 30, y: 25 }, breakdown: { elevation: 'Located in low-lying floodplain, 1.2m below sea level', density: 'High', shelterDistance: '4.5 km', history: 'Flooded 3 times in last 5 years' } },
  { id: 'c2', name: 'Kutubdia Island', district: 'Cox\'s Bazar, Chittagong Division', population: '2,800', riskLevel: 'Critical', priorityScore: 88, shelterAccess: 'Moderate', roadAccessibility: 'At Risk', hazards: ['Cyclone', 'Storm Surge'], coordinates: { x: 75, y: 40 }, breakdown: { elevation: 'Sea level, no natural barriers', density: 'Moderate', shelterDistance: '1.2 km', history: 'Major cyclone exposure in 2017 and 2020' } },
  { id: 'c3', name: 'Bandarban Highlands', district: 'Bandarban, Chittagong Division', population: '1,500', riskLevel: 'High', priorityScore: 76, shelterAccess: 'Very Poor', roadAccessibility: 'Limited (1 route)', hazards: ['Landslide'], coordinates: { x: 50, y: 50 }, breakdown: { elevation: 'Steep incline with unstable slope', density: 'Low', shelterDistance: '8.0 km', history: 'Multiple road washouts in past 3 years' } },
  { id: 'c4', name: 'Demra Industrial', district: 'Dhaka, Dhaka Division', population: '12,000', riskLevel: 'High', priorityScore: 72, shelterAccess: 'Good', roadAccessibility: 'Operational', hazards: ['Urban Flooding'], coordinates: { x: 40, y: 75 }, breakdown: { elevation: 'Moderate', density: 'Very High — limits evacuation', shelterDistance: '0.5 km', history: 'Chronic drainage failures during monsoon' } },
];

export default function VulnerableCommunitiesView() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Community | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="p-6 pb-4 shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('community.vulnerableTitle')}</h1>
            <p className="text-gray-500">{t('community.vulnerableSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder={t('community.searchCommunities')} className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />{t('common.filters')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-col border-r border-gray-200 bg-white w-[450px] shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium text-gray-700">{t('community.rankedByPriority')}</span></div>
            <span className="text-xs text-gray-500">{t('community.topCritical')}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {communities.map((c, index) => (
              <div key={c.id} onClick={() => setSelected(c)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selected?.id === c.id ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white ${index === 0 ? 'bg-red-600' : index === 1 ? 'bg-red-500' : 'bg-orange-500'}`}>#{index + 1}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight">{c.name}</h3>
                      <p className="text-xs text-gray-500">{c.district}</p>
                    </div>
                  </div>
                  <div className="text-right"><div className="text-lg font-bold text-gray-900">{c.priorityScore}</div><div className="text-[10px] text-gray-500 uppercase">{t('community.score')}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Users className="w-4 h-4 text-gray-400" />{c.population}</div>
                  <div className="flex items-center gap-2 text-sm"><ShieldAlert className={`w-4 h-4 ${c.riskLevel === 'Critical' ? 'text-red-500' : 'text-orange-500'}`} /><span className={`font-medium ${c.riskLevel === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>{c.riskLevel}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Home className="w-4 h-4 text-gray-400" /><span className="truncate">Shelter: {c.shelterAccess}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Car className="w-4 h-4 text-gray-400" /><span className="truncate">Roads: {c.roadAccessibility}</span></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.hazards.map(h => <span key={h} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs border border-red-100">{h}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative bg-blue-50/30">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="vcGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#vcGrid)" />
            </svg>
          </div>

          {selected && (
            <div className="absolute right-6 top-6 w-96 bg-white/95 backdrop-blur rounded-xl shadow-2xl border border-gray-200 z-20 flex flex-col max-h-[calc(100%-48px)]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-xl">
                <h3 className="font-semibold text-gray-900">{t('community.vulnerabilityAnalysis')}</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selected.district}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" />{t('community.riskDrivers')}</h4>
                  {[
                    { icon: Layers, color: 'red', label: t('community.topographyElevation'), value: selected.breakdown.elevation },
                    { icon: Users, color: 'orange', label: t('community.populationDensity'), value: `${selected.breakdown.density} — limits evacuation options` },
                    { icon: Home, color: 'yellow', label: t('community.shelterAccessibility'), value: `${selected.breakdown.shelterDistance} to nearest shelter` },
                    { icon: Activity, color: 'gray', label: t('community.hazardHistory'), value: selected.breakdown.history },
                  ].map((item, idx) => (
                    <div key={idx} className={`bg-${item.color}-50 p-3 rounded-lg border border-${item.color}-100 flex items-start gap-3`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-600 mt-0.5 shrink-0`} />
                      <div><p className={`text-sm font-medium text-${item.color}-900`}>{item.label}</p><p className={`text-xs text-${item.color}-700 mt-0.5`}>{item.value}</p></div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-100">
                    <button className="w-full bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 flex items-center justify-center gap-2">
                      {t('community.initializeEvacuation')}<ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full mt-2 bg-white text-gray-700 border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">{t('community.dispatchAdvanceTeam')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-0 z-10">
            {communities.map(c => {
              const isSelected = selected?.id === c.id;
              return (
                <div key={`map-${c.id}`} className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-40'}`}
                  style={{ left: `${c.coordinates.x}%`, top: `${c.coordinates.y}%` }} onClick={() => setSelected(c)}>
                  <div className={`absolute -inset-4 rounded-full animate-ping opacity-30 ${c.riskLevel === 'Critical' ? 'bg-red-500' : 'bg-orange-500'}`} />
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 text-white ${isSelected ? 'border-blue-900 ring-4 ring-blue-100' : 'border-white'} ${c.riskLevel === 'Critical' ? 'bg-red-600' : 'bg-orange-500'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
