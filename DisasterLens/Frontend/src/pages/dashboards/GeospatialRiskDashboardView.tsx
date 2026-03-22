import { useState } from 'react';
import { 
  AlertTriangle, 
  Building2, 
  Users, 
  Car, 
  Home, 
  ShieldAlert,
  MapPin,
  Layers,
  Thermometer,
  CloudLightning,
  Mountain,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import { WeatherCard } from '@/components/common/WeatherCard';
import { useTranslation } from 'react-i18next';

const priorityAreas = [
  { id: 1, name: 'Coastal District Alpha', issue: 'Cyclone Impact Zone', severity: 'Critical', exposed: '12,500' },
  { id: 2, name: 'Northern Valley', issue: 'Flash Flood Warning', severity: 'High', exposed: '8,200' },
  { id: 3, name: 'Eastern Slopes', issue: 'Landslide Risk', severity: 'High', exposed: '4,100' },
  { id: 4, name: 'Metro Sector 4', issue: 'Power Grid Failure', severity: 'Medium', exposed: '45,000' },
];

export default function GeospatialRiskDashboardView() {
  const { t } = useTranslation();
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    flood: true,
    cyclone: true,
    hospitals: true,
    shelters: true,
  });

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Summary Cards */}
      <div className="p-6 pb-2 shrink-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('geospatial_risk_dashboard')}</h1>
            <p className="text-gray-500">{t('live_disaster_intelligence')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-red-600">{t('live_updating')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <WeatherCard title={t('exposed_infra')} value="142" unit="" icon={Building2} color="#DC2626" />
          <WeatherCard title={t('high_risk_areas')} value="12" unit="" icon={AlertTriangle} color="#DC2626" />
          <WeatherCard title={t('affected_pop')} value="64.5" unit="k" icon={Users} color="#F59E0B" />
          <WeatherCard title={t('damaged_roads')} value="28" unit="km" icon={Car} color="#F59E0B" />
          <WeatherCard title={t('shelter_capacity')} value="45" unit="%" icon={Home} color="#10B981" />
          <WeatherCard title={t('danger_level')} value="Level 4" unit="" icon={ShieldAlert} color="#DC2626" />
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 p-6 pt-2 flex gap-6 min-h-[600px] overflow-hidden">
        {/* The Map */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-blue-50/50">
            {/* Map Grid Background */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5" strokeOpacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            
            {/* Mock Map Features */}
            {activeLayers.flood && (
              <div className="absolute top-[20%] left-[30%] w-[40%] h-[30%] bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            )}
            {activeLayers.cyclone && (
              <div className="absolute top-[50%] right-[20%] w-[30%] h-[40%] bg-red-500/20 rounded-full blur-3xl animate-pulse" />
            )}

            {/* Hotspots */}
            <div className="absolute top-[35%] left-[45%]">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg relative z-10" />
              <div className="absolute -inset-2 bg-red-500/30 rounded-full animate-ping" />
            </div>
            
            <div className="absolute top-[60%] right-[30%]">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg relative z-10" />
              <div className="absolute -inset-2 bg-orange-500/30 rounded-full animate-ping" />
            </div>
          </div>

          {/* Map Controls (Floating) */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-gray-100 p-2 flex flex-col gap-2 z-20">
            <button className="p-2 hover:bg-gray-100 rounded text-gray-700 transition-colors" title="Zoom In">
              <span className="text-xl font-medium leading-none">+</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded text-gray-700 transition-colors" title="Zoom Out">
              <span className="text-xl font-medium leading-none">-</span>
            </button>
            <div className="h-px bg-gray-200 w-full my-1"></div>
            <button className="p-2 hover:bg-gray-100 rounded text-gray-700 transition-colors" title="My Location">
              <MapPin className="w-5 h-5" />
            </button>
          </div>
          
          {/* Map Legend (Floating) */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-gray-100 p-4 z-20 w-48">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">{t('map_legend')}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">{t('critical_risk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-600">{t('high_risk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-600">{t('moderate_risk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500"></div>
                <span className="text-xs text-gray-600">{t('flood_zone')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Layers & Priority Areas */}
        <div className="w-80 flex flex-col gap-6 overflow-hidden">
          {/* Layers Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-blue-800" />
              <h3 className="font-semibold text-gray-900">{t('map_layers')}</h3>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[300px]">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('hazards')}</h4>
                <div className="space-y-2">
                  <LayerToggle icon={CloudLightning} label={t('cyclone_path')} active={activeLayers.cyclone} onClick={() => toggleLayer('cyclone')} />
                  <LayerToggle icon={Thermometer} label={t('flood_zones')} active={activeLayers.flood} onClick={() => toggleLayer('flood')} />
                  <LayerToggle icon={Mountain} label={t('landslide_risk')} active={activeLayers.landslide} onClick={() => toggleLayer('landslide')} />
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('infrastructure')}</h4>
                <div className="space-y-2">
                  <LayerToggle icon={Activity} label={t('hospitals')} active={activeLayers.hospitals} onClick={() => toggleLayer('hospitals')} />
                  <LayerToggle icon={Home} label={t('shelters')} active={activeLayers.shelters} onClick={() => toggleLayer('shelters')} />
                  <LayerToggle icon={Building2} label={t('schools')} active={activeLayers.schools} onClick={() => toggleLayer('schools')} />
                  <LayerToggle icon={Zap} label={t('power_facilities')} active={activeLayers.power} onClick={() => toggleLayer('power')} />
                  <LayerToggle icon={Car} label={t('roads_bridges')} active={activeLayers.roads} onClick={() => toggleLayer('roads')} />
                </div>
              </div>
            </div>
          </div>

          {/* Priority Areas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
            <div className="p-5 border-b border-gray-100 shrink-0">
              <h3 className="font-semibold text-gray-900">{t('priority_areas')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('immediate_attention')}</p>
            </div>
            <div className="overflow-y-auto p-3 space-y-2 flex-1">
              {priorityAreas.map(area => (
                <div key={area.id} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-800 transition-colors">{area.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      area.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      area.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {area.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{area.issue}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {area.exposed}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerToggle({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className={active ? 'font-medium' : ''}>{label}</span>
      </div>
      <div className={`w-8 h-4 rounded-full transition-colors relative ${active ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-4.5 right-0.5' : 'left-0.5'}`} style={{ left: active ? '18px' : '2px' }} />
      </div>
    </button>
  );
}