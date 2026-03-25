import { useState } from 'react';
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Home, 
  Car, 
  TrendingUp,
  Search,
  Filter,
  ShieldAlert,
  ChevronRight,
  Activity,
  Layers,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Community = {
  id: string;
  name: string;
  district: string;
  population: string;
  riskLevel: 'Critical' | 'High' | 'Moderate';
  priorityScore: number;
  shelterAccess: string;
  roadAccessibility: string;
  hazardExposure: string[];
  coordinates: { x: number, y: number };
  breakdown: {
    elevation: string;
    density: string;
    shelterDistance: string;
    history: string;
  };
};

const mockCommunities: Community[] = [
  {
    id: 'c1', name: 'Riverbed Settlement Alpha', district: 'Northern Valley', population: '4,200', riskLevel: 'Critical', priorityScore: 94,
    shelterAccess: 'Poor', roadAccessibility: 'Compromised', hazardExposure: ['Flash Flood', 'Landslide'], coordinates: { x: 30, y: 25 },
    breakdown: { elevation: 'Low (Floodplain)', density: 'High', shelterDistance: '4.5 km', history: 'Flooded 3x in 5 years' }
  },
  {
    id: 'c2', name: 'Coastal Village B', district: 'Eastern Coast', population: '2,800', riskLevel: 'Critical', priorityScore: 88,
    shelterAccess: 'Moderate', roadAccessibility: 'At Risk', hazardExposure: ['Cyclone', 'Storm Surge'], coordinates: { x: 75, y: 40 },
    breakdown: { elevation: 'Sea Level', density: 'Medium', shelterDistance: '1.2 km', history: 'High cyclone exposure' }
  },
  {
    id: 'c3', name: 'Hillside Commune 4', district: 'Central Region', population: '1,500', riskLevel: 'High', priorityScore: 76,
    shelterAccess: 'Very Poor', roadAccessibility: 'Limited (1 route)', hazardExposure: ['Landslide'], coordinates: { x: 50, y: 50 },
    breakdown: { elevation: 'Steep Incline', density: 'Low', shelterDistance: '8.0 km', history: 'Frequent road washouts' }
  },
  {
    id: 'c4', name: 'Urban Periphery South', district: 'Southern District', population: '12,000', riskLevel: 'High', priorityScore: 72,
    shelterAccess: 'Good', roadAccessibility: 'Operational', hazardExposure: ['Urban Flooding'], coordinates: { x: 40, y: 75 },
    breakdown: { elevation: 'Moderate', density: 'Very High', shelterDistance: '0.5 km', history: 'Drainage system failures' }
  },
];

export function VulnerableCommunitiesView() {
  const { t } = useTranslation();
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('vulnerable_communities')}</h1>
            <p className="text-gray-500">{t('spatial_analysis')}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('search_communities')} 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              {t('filters')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Ranked List Panel */}
        <div className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 w-[450px] shrink-0`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{t('ranked_by_priority')}</span>
            </div>
            <span className="text-xs text-gray-500">{t('top_critical')}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockCommunities.map((community, index) => (
              <div 
                key={community.id}
                onClick={() => setSelectedCommunity(community)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCommunity?.id === community.id 
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      index === 0 ? 'bg-red-600 text-white' : 
                      index === 1 ? 'bg-red-500 text-white' : 
                      'bg-orange-500 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight">{community.name}</h3>
                      <p className="text-xs text-gray-500">{community.district}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{community.priorityScore}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{t('score')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    {community.population}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldAlert className={`w-4 h-4 ${community.riskLevel === 'Critical' ? 'text-red-500' : 'text-orange-500'}`} />
                    <span className={community.riskLevel === 'Critical' ? 'text-red-600 font-medium' : 'text-orange-600 font-medium'}>
                      {community.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="w-4 h-4 text-gray-400" />
                    <span className="truncate">Shelter: {community.shelterAccess}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="truncate">Roads: {community.roadAccessibility}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {community.hazardExposure.map(hazard => (
                    <span key={hazard} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs border border-red-100">
                      {hazard}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map & Detail View */}
        <div className="flex-1 flex flex-col relative bg-blue-50/30">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Detailed Breakdown Overlay */}
          {selectedCommunity && (
            <div className="absolute right-6 top-6 w-96 bg-white/95 backdrop-blur rounded-xl shadow-2xl border border-gray-200 z-20 flex flex-col max-h-[calc(100%-48px)] animate-in slide-in-from-right-8">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-xl">
                <h3 className="font-semibold text-gray-900">{t('vulnerability_analysis')}</h3>
                <button onClick={() => setSelectedCommunity(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedCommunity.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedCommunity.district}</p>
                </div>

                <div className="space-y-6">
                  {/* Why is this high risk? */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      {t('risk_drivers')}
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-3">
                        <Layers className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-900">{t('topography_elevation')}</p>
                          <p className="text-xs text-red-700 mt-0.5">{selectedCommunity.breakdown.elevation}</p>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-start gap-3">
                        <Users className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-orange-900">{t('population_density')}</p>
                          <p className="text-xs text-orange-700 mt-0.5">{selectedCommunity.breakdown.density} {t('density_limits')}</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-start gap-3">
                        <Home className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">{t('shelter_accessibility')}</p>
                          <p className="text-xs text-yellow-700 mt-0.5">{selectedCommunity.breakdown.shelterDistance} {t('to_nearest_shelter')}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                        <Activity className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t('hazard_history')}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{selectedCommunity.breakdown.history}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Priority Action */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">{t('recommended_actions')}</h4>
                    <button className="w-full bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                      {t('initialize_evacuation')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full mt-2 bg-white text-gray-700 border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      {t('dispatch_advance_team')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Points */}
          <div className="absolute inset-0 z-10">
            {mockCommunities.map(community => {
              const isSelected = selectedCommunity?.id === community.id;
              
              return (
                <div
                  key={`map-${community.id}`}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-40'
                  }`}
                  style={{ left: `${community.coordinates.x}%`, top: `${community.coordinates.y}%` }}
                  onClick={() => setSelectedCommunity(community)}
                >
                  <div className={`absolute -inset-4 rounded-full animate-ping opacity-30 ${
                    community.riskLevel === 'Critical' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                    isSelected ? 'border-blue-900 ring-4 ring-blue-100' : 'border-white'
                  } ${
                    community.riskLevel === 'Critical' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  
                  {!isSelected && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {community.name}
                    </div>
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