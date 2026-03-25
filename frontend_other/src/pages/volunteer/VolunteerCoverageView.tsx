import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { 
  Users, MapPin, Box, CheckCircle, Activity
} from 'lucide-react';

interface Coverage {
  id: string;
  name: string;
  location: string;
  radius: number;
  x: number;
  y: number;
  timestamp: number;
}

export default function VolunteerCoverageView() {
  const { t } = useTranslation();
  const [dynamicCoverages, setDynamicCoverages] = useState<Coverage[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('volunteer_coverages') || '[]');
      setDynamicCoverages(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#1E3A8A]" />
              {t('volunteer_coverage_title')}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t('volunteer_coverage_desc')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-6 gap-6">
        
        {/* Analytics Side Panel */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto shrink-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('active_teams')}</p>
              <p className="text-2xl font-bold text-[#1E3A8A]">45</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('villages')}</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('coverage')}</p>
              <p className="text-2xl font-bold text-green-600">62%</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('relief_kits')}</p>
              <p className="text-2xl font-bold text-amber-600">8.5k</p>
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                {t('live_updates')}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dynamicCoverages.slice().reverse().map(cov => (
                <div key={`update-${cov.id}`} className="border-l-2 border-green-500 pl-3">
                  <p className="text-xs text-gray-500 mb-0.5">{cov.name} • {new Date(cov.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-sm text-gray-800 font-medium">{t('vc_dynamic_update', { location: cov.location, radius: cov.radius })}</p>
                </div>
              ))}
              <div className="border-l-2 border-green-500 pl-3">
                <p className="text-xs text-gray-500 mb-0.5">{t('vc_team_alpha')} • {t('just_now')}</p>
                <p className="text-sm text-gray-800 font-medium">{t('vc_update_1')}</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <p className="text-xs text-gray-500 mb-0.5">{t('vc_team_bravo')} • {t('vc_5_mins_ago')}</p>
                <p className="text-sm text-gray-800 font-medium">{t('vc_update_2')}</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                <p className="text-xs text-gray-500 mb-0.5">{t('vc_team_charlie')} • {t('vc_12_mins_ago')}</p>
                <p className="text-sm text-gray-800 font-medium">{t('vc_update_3')}</p>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <p className="text-xs text-gray-500 mb-0.5">{t('vc_team_delta')} • {t('vc_15_mins_ago')}</p>
                <p className="text-sm text-gray-800 font-medium">{t('vc_update_4')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 flex overflow-hidden">
              <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-r border-gray-200">{t('coverage_map')}</button>
              <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 text-gray-600">{t('relief_points')}</button>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-50"></div>
                <span className="text-xs font-medium text-gray-700">{t('covered_area')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-20"></div>
                <span className="text-xs font-medium text-gray-700">{t('uncovered_target')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">{t('volunteer_unit')}</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulated Map */}
          <div className="w-full h-full bg-[#E2E8F0] relative">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#CBD5E1" strokeWidth="1"/>
                </pattern>
                
                <radialGradient id="coverageGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1"/>
                </radialGradient>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
              
              {/* Regions/Villages boundaries (mock) */}
              <path d="M 100 100 Q 200 50 300 150 T 500 200 Q 600 300 400 400 T 200 300 Z" fill="#DC2626" fillOpacity="0.05" stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 400 100 Q 500 50 650 150 T 800 300 Q 700 400 600 350 T 400 250 Z" fill="#1E3A8A" fillOpacity="0.05" stroke="#1E3A8A" strokeWidth="2" strokeDasharray="5,5" />

              {/* Coverage areas based on updates */}
              <circle cx="250" cy="200" r="80" fill="url(#coverageGradient)" />
              <circle cx="550" cy="250" r="100" fill="url(#coverageGradient)" />
              <circle cx="350" cy="350" r="60" fill="url(#coverageGradient)" />
              
              {/* Dynamic coverage areas from localStorage */}
              {dynamicCoverages.map(cov => (
                <circle key={`circle-${cov.id}`} cx={cov.x} cy={cov.y} r={cov.radius * 15} fill="url(#coverageGradient)" />
              ))}
            </svg>

            {/* Dynamic Live Units from localStorage */}
            {dynamicCoverages.map(cov => (
              <div key={`marker-${cov.id}`} className="absolute group cursor-pointer" style={{ top: `${cov.y - 12}px`, left: `${cov.x - 12}px` }}>
                <div className="w-12 h-12 rounded-full bg-blue-500 opacity-20 absolute -top-3 -left-3 animate-ping"></div>
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {cov.name}<br/>{cov.location}
                </div>
              </div>
            ))}

            {/* Live Units */}
            <div className="absolute top-[180px] left-[230px] group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-500 opacity-20 absolute -top-3 -left-3 animate-ping"></div>
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                <Users className="w-3 h-3 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {t('vc_team_alpha')}<br/>{t('vc_active_distribution')}
              </div>
            </div>

            <div className="absolute top-[230px] left-[530px] group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-500 opacity-20 absolute -top-3 -left-3 animate-ping"></div>
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                <Users className="w-3 h-3 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {t('vc_team_bravo')}<br/>{t('vc_moving')}
              </div>
            </div>
            
            {/* Relief Point */}
            <div className="absolute top-[340px] left-[340px] group cursor-pointer">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white relative z-10 transform rotate-45">
                <Box className="w-4 h-4 text-white -rotate-45" />
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {t('vc_supply_hub')}<br/>{t('vc_sector_4')}
              </div>
            </div>

            {/* Household Visits */}
            <div className="absolute top-[170px] left-[200px]">
              <CheckCircle className="w-4 h-4 text-green-600 bg-white rounded-full" />
            </div>
            <div className="absolute top-[190px] left-[210px]">
              <CheckCircle className="w-4 h-4 text-green-600 bg-white rounded-full" />
            </div>
            <div className="absolute top-[210px] left-[260px]">
              <CheckCircle className="w-4 h-4 text-green-600 bg-white rounded-full" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}