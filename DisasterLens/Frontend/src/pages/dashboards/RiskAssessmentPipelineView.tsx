import { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  Building2, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  Database,
  CloudRain,
  Layers,
  Map,
  Thermometer,
  Waves
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Mock data for the risk table
const riskData = [
  {
    id: 'rv-01',
    name: 'Northern Valley',
    exposure: 94,
    vulnerability: 88,
    priority: 'Critical',
    drivers: ['River Proximity', 'Poor Drainage', 'High Density'],
    action: 'Evacuate Zone A',
    exposedAssets: [
      { type: 'Hospital', count: 1, name: 'Valley General' },
      { type: 'Power Substation', count: 2, name: 'North Grid' },
      { type: 'School', count: 3, name: 'Public Schools' }
    ],
    population: '14,500',
    coordinates: '34.0522° N, 118.2437° W'
  },
  {
    id: 'ec-02',
    name: 'Eastern Coast',
    exposure: 85,
    vulnerability: 76,
    priority: 'High',
    drivers: ['Coastal Surge', 'Aging Seawall'],
    action: 'Standby Evacuation',
    exposedAssets: [
      { type: 'Port Facility', count: 1, name: 'East Harbor' },
      { type: 'Water Treatment', count: 1, name: 'Coastal Plant' }
    ],
    population: '8,200',
    coordinates: '34.0195° N, 118.4912° W'
  },
  {
    id: 'si-03',
    name: 'Southern Industrial',
    exposure: 78,
    vulnerability: 65,
    priority: 'Medium',
    drivers: ['Chemical Plants', 'Floodplain'],
    action: 'Secure Hazmat',
    exposedAssets: [
      { type: 'Industrial Park', count: 4, name: 'South Manufacturing' },
      { type: 'Highway', count: 1, name: 'Route 101 Junction' }
    ],
    population: '3,100',
    coordinates: '33.9416° N, 118.2201° W'
  },
  {
    id: 'wh-04',
    name: 'Western Highlands',
    exposure: 45,
    vulnerability: 50,
    priority: 'Low',
    drivers: ['Landslide Risk', 'Steep Terrain'],
    action: 'Monitor Slopes',
    exposedAssets: [
      { type: 'Telecom Tower', count: 2, name: 'Highland Comms' },
      { type: 'Residential', count: 150, name: 'Hillside Homes' }
    ],
    population: '1,200',
    coordinates: '34.1425° N, 118.2551° W'
  },
  {
    id: 'cd-05',
    name: 'Central District',
    exposure: 30,
    vulnerability: 20,
    priority: 'Low',
    drivers: ['Urban Flash Flood'],
    action: 'Clear Drains',
    exposedAssets: [
      { type: 'Subway Station', count: 3, name: 'Metro Line Red' },
      { type: 'Commercial Center', count: 5, name: 'Downtown Core' }
    ],
    population: '45,000',
    coordinates: '34.0489° N, 118.2531° W'
  }
];

export default function RiskAssessmentPipelineView() {
  const { t } = useTranslation();
  const [selectedAreaId, setSelectedAreaId] = useState<string>(riskData[0].id);

  const selectedArea = riskData.find(a => a.id === selectedAreaId) || riskData[0];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('risk_scoring_title')}</h1>
            <p className="text-gray-500">{t('risk_scoring_desc')}</p>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
              <div className="text-sm">
                <span className="text-gray-500">{t('model_status')}: </span>
                <span className="font-bold text-blue-700">{t('live_scoring')}</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="text-sm text-gray-500">
              {t('updated_just_now')}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Data Inputs Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 col-span-1 lg:col-span-2 flex flex-col justify-center">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('active_data_inputs')}</h3>
             <div className="flex items-center justify-between gap-2">
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Waves className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('river_flood')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <CloudRain className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('weather')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Layers className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('spatial')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Building2 className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('infra')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Users className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('population')}</span>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('exposed_pop')}</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">1.2M</div>
            <p className="text-xs text-orange-600 font-medium mt-1">{t('since_last_update')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('exposed_infra')}</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">142</div>
            <p className="text-xs text-red-600 font-medium mt-1">{t('critical_assets')}</p>
          </div>

          <div className="bg-[#1E3A8A] rounded-xl shadow-sm border border-blue-800 p-4 flex flex-col justify-center text-white">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-blue-200" />
              <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider">{t('priority_areas_label')}</h3>
            </div>
            <div className="text-2xl font-bold text-white">{t('zones')}</div>
            <p className="text-xs text-blue-200 font-medium mt-1">{t('require_immediate')}</p>
          </div>

        </div>

        {/* Main Split View */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Ranked Risk Table */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-gray-700" />
                <h2 className="text-base font-bold text-gray-900">{t('prioritized_risk_queue')}</h2>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">{t('export_report')}</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">{t('area_name')}</th>
                    <th className="p-4">{t('priority')}</th>
                    <th className="p-4">{t('exposure')}</th>
                    <th className="p-4">{t('vulnerability')}</th>
                    <th className="p-4">{t('key_drivers')}</th>
                    <th className="p-4 pr-6">{t('recommended_action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {riskData.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedAreaId(row.id)}
                      className={`cursor-pointer transition-colors ${selectedAreaId === row.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedAreaId === row.id ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                          <span className={`font-bold ${selectedAreaId === row.id ? 'text-blue-900' : 'text-gray-900'}`}>{row.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityColor(row.priority)}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${getScoreColor(row.exposure)}`}>{row.exposure}</span>
                        <span className="text-gray-400 text-xs">/100</span>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${getScoreColor(row.vulnerability)}`}>{row.vulnerability}</span>
                        <span className="text-gray-400 text-xs">/100</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {row.drivers.slice(0, 2).map(d => (
                            <span key={d} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {d}
                            </span>
                          ))}
                          {row.drivers.length > 2 && <span className="text-gray-400 text-[10px] font-bold">+{row.drivers.length - 2}</span>}
                        </div>
                      </td>
                      <td className="p-4 pr-6">
                        <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                          {row.action} <ArrowRight className="w-3 h-3 text-gray-400" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Area Detail Panel */}
          <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col shrink-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">{t('area_detail')}</h2>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedArea.name}</h3>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityColor(selectedArea.priority)}`}>
                    {selectedArea.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium font-mono">{selectedArea.coordinates}</p>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-40 bg-slate-100 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231E3A8A\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="bg-white/90 p-2 rounded-lg shadow-sm border border-gray-200 z-10 flex items-center gap-2 backdrop-blur-sm">
                  <MapPin className={`w-4 h-4 ${selectedArea.priority === 'Critical' ? 'text-red-500' : 'text-blue-500'}`} />
                  <span className="text-xs font-bold text-gray-700 uppercase">{t('map_view_active')}</span>
                </div>
              </div>

              {/* Drivers & Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block mb-1">{t('exposure')}</span>
                  <span className="text-2xl font-bold text-red-900">{selectedArea.exposure}</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block mb-1">{t('vulnerability')}</span>
                  <span className="text-2xl font-bold text-orange-900">{selectedArea.vulnerability}</span>
                </div>
              </div>

              {/* Risk Drivers */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('key_risk_drivers')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArea.drivers.map((driver, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                      {driver}
                    </div>
                  ))}
                </div>
              </div>

              {/* Exposed Infrastructure */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('exposed_assets')}</h4>
                <div className="space-y-2">
                  {selectedArea.exposedAssets.map((asset, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{asset.name}</p>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase">{asset.type}</p>
                        </div>
                      </div>
                      <div className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold text-xs">
                        {asset.count}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t('est_population')}</p>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">{t('residential_zones')}</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {selectedArea.population}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <button className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  selectedArea.priority === 'Critical' ? 'bg-[#DC2626] hover:bg-red-700 text-white' : 
                  selectedArea.priority === 'High' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                  'bg-[#1E3A8A] hover:bg-blue-900 text-white'
                }`}>
                  {selectedArea.action} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}