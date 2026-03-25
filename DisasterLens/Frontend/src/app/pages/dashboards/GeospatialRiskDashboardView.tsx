import { useState } from 'react';
import { AlertTriangle, Building2, Users, Car, Home, ShieldAlert, MapPin, Layers, Thermometer, CloudLightning, Mountain, Zap, Activity, ChevronRight } from 'lucide-react';
import { WeatherCard } from '../../components/weather/WeatherCard';
import { useLanguage } from '../../i18n/LanguageContext';

const priorityAreas = [
  { id: 1, name: 'Coastal District Alpha', issue: 'Cyclone Impact Zone', severity: 'Critical', exposed: '12,500' },
  { id: 2, name: 'Northern Valley', issue: 'Flash Flood Warning', severity: 'High', exposed: '8,200' },
  { id: 3, name: 'Eastern Slopes', issue: 'Landslide Risk', severity: 'High', exposed: '4,100' },
  { id: 4, name: 'Metro Sector 4', issue: 'Power Grid Failure', severity: 'Medium', exposed: '45,000' },
];

function LayerToggle({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${active ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-600'}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className={active ? 'font-medium' : ''}>{label}</span>
      </div>
      <div className={`w-8 h-4 rounded-full transition-colors relative ${active ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" style={{ left: active ? '18px' : '2px' }} />
      </div>
    </button>
  );
}

export default function GeospatialRiskDashboardView() {
  const { t } = useLanguage();
  const [layers, setLayers] = useState({ flood: true, cyclone: true, landslide: false, hospitals: true, shelters: true, schools: false, power: false, roads: false });

  const toggle = (k: keyof typeof layers) => setLayers(prev => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="p-6 pb-2 shrink-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('geo.title')}</h1>
            <p className="text-gray-500">{t('geo.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" /></span>
            <span className="text-sm font-medium text-red-600">Live Updating</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <WeatherCard title="Exposed Infra" value="142" unit="" icon={Building2} color="#DC2626" />
          <WeatherCard title="High Risk Areas" value="12" unit="" icon={AlertTriangle} color="#DC2626" />
          <WeatherCard title="Affected Pop." value="64.5" unit="k" icon={Users} color="#F59E0B" />
          <WeatherCard title="Damaged Roads" value="28" unit="km" icon={Car} color="#F59E0B" />
          <WeatherCard title="Shelter Capacity" value="45" unit="%" icon={Home} color="#10B981" />
          <WeatherCard title="Danger Level" value="Level 4" unit="" icon={ShieldAlert} color="#DC2626" />
        </div>
      </div>

      <div className="flex-1 p-6 pt-2 flex gap-6 min-h-[600px] overflow-hidden">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-blue-50/50">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="geoGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5" strokeOpacity="0.2"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#geoGrid)" />
            </svg>
            {layers.flood && <div className="absolute top-[20%] left-[30%] w-[40%] h-[30%] bg-blue-500/20 rounded-full blur-2xl animate-pulse" />}
            {layers.cyclone && <div className="absolute top-[50%] right-[20%] w-[30%] h-[40%] bg-red-500/20 rounded-full blur-3xl animate-pulse" />}
            <div className="absolute top-[35%] left-[45%]">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg relative z-10" />
              <div className="absolute -inset-2 bg-red-500/30 rounded-full animate-ping" />
            </div>
            <div className="absolute top-[60%] right-[30%]">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg relative z-10" />
              <div className="absolute -inset-2 bg-orange-500/30 rounded-full animate-ping" />
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-gray-100 p-2 flex flex-col gap-2 z-20">
            {['+', '-'].map(s => <button key={s} className="p-2 hover:bg-gray-100 rounded text-gray-700 text-xl font-medium leading-none">{s}</button>)}
            <div className="h-px bg-gray-200 w-full my-1" />
            <button className="p-2 hover:bg-gray-100 rounded text-gray-700"><MapPin className="w-5 h-5" /></button>
          </div>
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-gray-100 p-4 z-20 w-48">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Map Legend</h4>
            <div className="space-y-2">
              {[['bg-red-500', 'Critical Risk'], ['bg-orange-500', 'High Risk'], ['bg-yellow-500', 'Moderate Risk']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${c}`} /><span className="text-xs text-gray-600">{l}</span></div>
              ))}
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500" /><span className="text-xs text-gray-600">Flood Zone</span></div>
            </div>
          </div>
        </div>

        <div className="w-80 flex flex-col gap-6 overflow-hidden">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-4"><Layers className="w-5 h-5 text-blue-800" /><h3 className="font-semibold text-gray-900">Map Layers</h3></div>
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[300px]">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hazards</h4>
                <div className="space-y-2">
                  <LayerToggle icon={CloudLightning} label="Cyclone Path" active={layers.cyclone} onClick={() => toggle('cyclone')} />
                  <LayerToggle icon={Thermometer} label="Flood Zones" active={layers.flood} onClick={() => toggle('flood')} />
                  <LayerToggle icon={Mountain} label="Landslide Risk" active={layers.landslide} onClick={() => toggle('landslide')} />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Infrastructure</h4>
                <div className="space-y-2">
                  <LayerToggle icon={Activity} label="Hospitals" active={layers.hospitals} onClick={() => toggle('hospitals')} />
                  <LayerToggle icon={Home} label="Shelters" active={layers.shelters} onClick={() => toggle('shelters')} />
                  <LayerToggle icon={Building2} label="Schools" active={layers.schools} onClick={() => toggle('schools')} />
                  <LayerToggle icon={Zap} label="Power Facilities" active={layers.power} onClick={() => toggle('power')} />
                  <LayerToggle icon={Car} label="Roads & Bridges" active={layers.roads} onClick={() => toggle('roads')} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
            <div className="p-5 border-b border-gray-100 shrink-0">
              <h3 className="font-semibold text-gray-900">Priority Areas</h3>
              <p className="text-xs text-gray-500 mt-1">Requiring immediate attention</p>
            </div>
            <div className="overflow-y-auto p-3 space-y-2 flex-1">
              {priorityAreas.map(area => (
                <div key={area.id} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-800">{area.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${area.severity === 'Critical' ? 'bg-red-100 text-red-700' : area.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{area.severity}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{area.issue}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{area.exposed}</span>
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
