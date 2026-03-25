import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  Activity, 
  Car, 
  Home, 
  Zap, 
  Filter,
  Search,
  MapPin,
  Users,
  AlertTriangle,
  X,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Wifi
} from 'lucide-react';

type Infrastructure = {
  id: string;
  nameKey: string;
  typeKey: string;
  locationKey: string;
  hazardKey: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Operational' | 'Compromised' | 'Offline';
  population: string;
  coordinates: { x: number, y: number };
};

const mockInfrastructure: Infrastructure[] = [
  { id: '1', nameKey: 'cie_name_1', typeKey: 'hospital', locationKey: 'cie_loc_northern_province', hazardKey: 'flood', severity: 'High', status: 'Compromised', population: '120,000', coordinates: { x: 35, y: 25 } },
  { id: '2', nameKey: 'cie_name_2', typeKey: 'shelter', locationKey: 'cie_loc_eastern_coast', hazardKey: 'cyclone', severity: 'High', status: 'Operational', population: '5,000', coordinates: { x: 75, y: 40 } },
  { id: '3', nameKey: 'cie_name_3', typeKey: 'power_facility', locationKey: 'central_region', hazardKey: 'landslide', severity: 'Medium', status: 'Offline', population: '45,000', coordinates: { x: 50, y: 60 } },
  { id: '4', nameKey: 'cie_name_4', typeKey: 'cie_type_bridge', locationKey: 'cie_loc_northern_province', hazardKey: 'flood', severity: 'High', status: 'Compromised', population: 'N/A', coordinates: { x: 38, y: 30 } },
  { id: '5', nameKey: 'cie_name_5', typeKey: 'school', locationKey: 'cie_loc_southern_district', hazardKey: 'cie_hazard_storm', severity: 'Low', status: 'Operational', population: '800', coordinates: { x: 45, y: 80 } },
  { id: '6', nameKey: 'cie_name_6', typeKey: 'cie_type_road', locationKey: 'cie_loc_eastern_coast', hazardKey: 'cyclone', severity: 'Medium', status: 'Operational', population: 'N/A', coordinates: { x: 70, y: 45 } },
];

const typeIcons: Record<string, any> = {
  hospital: Activity,
  shelter: Home,
  power_facility: Zap,
  cie_type_bridge: Car,
  school: Building2,
  cie_type_road: Car
};

export default function CriticalInfrastructureExposureView() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<Infrastructure | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filteredData = mockInfrastructure.filter(item => {
    if (filterType !== 'all' && item.typeKey !== filterType) return false;
    if (filterSeverity !== 'All' && item.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('critical_infrastructure')}</h1>
            <p className="text-gray-500">{t('monitor_risk')}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('search_infrastructure')} 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              {t('more_filters')}
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[
              { labelKey: 'all', value: 'all' },
              { labelKey: 'hospital', value: 'hospital' },
              { labelKey: 'shelter', value: 'shelter' },
              { labelKey: 'power_facility', value: 'power_facility' },
              { labelKey: 'school', value: 'school' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filterType === type.value ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(type.labelKey)}
              </button>
            ))}
          </div>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <div className="flex gap-2">
            {['All', 'High', 'Medium', 'Low'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                  filterSeverity === sev 
                    ? sev === 'High' ? 'bg-red-100 border-red-200 text-red-700' 
                    : sev === 'Medium' ? 'bg-orange-100 border-orange-200 text-orange-700'
                    : sev === 'Low' ? 'bg-yellow-100 border-yellow-200 text-yellow-700'
                    : 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {sev === 'All' ? t('all') : sev === 'High' ? t('high') : sev === 'Medium' ? t('moderate') : t('low')} {t('risk_suffix')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List View */}
        <div className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${selectedItem ? 'w-[400px]' : 'w-1/2'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{filteredData.length} {t('assets_found')}</span>
            <span className="text-xs text-gray-500">{t('sorted_by_severity')}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredData.map(item => {
              const Icon = typeIcons[item.typeKey] || Building2;
              const isSelected = selectedItem?.id === item.id;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.severity === 'High' ? 'bg-red-100 text-red-600' :
                        item.severity === 'Medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">{t(item.nameKey)}</h3>
                        <p className="text-xs text-gray-500">{t(item.typeKey)} • {t(item.locationKey)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-gray-50 p-2 rounded flex flex-col justify-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t('exposure')}</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <AlertTriangle className={`w-3 h-3 ${
                          item.severity === 'High' ? 'text-red-500' :
                          item.severity === 'Medium' ? 'text-orange-500' : 'text-yellow-500'
                        }`} />
                        {t(item.hazardKey)}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex flex-col justify-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t('status')}</span>
                      <span className={`text-sm font-medium flex items-center gap-1 ${
                        item.status === 'Operational' ? 'text-green-600' :
                        item.status === 'Offline' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          item.status === 'Operational' ? 'bg-green-500' :
                          item.status === 'Offline' ? 'bg-red-500' : 'bg-orange-500'
                        }`}></span>
                        {item.status === 'Operational' ? t('operational') : item.status === 'Offline' ? t('offline') : t('compromised')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map / Detail View */}
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

          {/* Detail Panel overlay if selected */}
          {selectedItem ? (
            <div className="absolute right-6 top-6 bottom-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 flex flex-col overflow-hidden animate-in slide-in-from-right-8">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-900">{t('asset_details')}</h3>
                <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-xl ${
                    selectedItem.severity === 'High' ? 'bg-red-100 text-red-600' :
                    selectedItem.severity === 'Medium' ? 'bg-orange-100 text-orange-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {typeIcons[selectedItem.typeKey] ? 
                      (() => { const Icon = typeIcons[selectedItem.typeKey]; return <Icon className="w-8 h-8" /> })() 
                      : <Building2 className="w-8 h-8" />
                    }
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{t(selectedItem.nameKey)}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t(selectedItem.typeKey)} • {t(selectedItem.locationKey)}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('current_status')}</h4>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">{t('operational_capacity')}</span>
                      <span className={`text-sm font-bold ${
                        selectedItem.status === 'Operational' ? 'text-green-600' :
                        selectedItem.status === 'Offline' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {selectedItem.status === 'Operational' ? '100%' :
                         selectedItem.status === 'Offline' ? '0%' : '45%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        selectedItem.status === 'Operational' ? 'bg-green-500 w-full' :
                        selectedItem.status === 'Offline' ? 'bg-red-500 w-0' : 'bg-orange-500 w-[45%]'
                      }`}></div>
                    </div>
                  </div>

                  {/* Exposure Details */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('exposure_risk')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1 text-gray-500">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">{t('hazard_type')}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{t(selectedItem.hazardKey)}</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1 text-gray-500">
                          <ShieldAlert className="w-4 h-4" />
                          <span className="text-xs">{t('severity')}</span>
                        </div>
                        <span className={`font-bold ${
                          selectedItem.severity === 'High' ? 'text-red-600' :
                          selectedItem.severity === 'Medium' ? 'text-orange-600' : 'text-yellow-600'
                        }`}>{selectedItem.severity === 'High' ? t('high') : selectedItem.severity === 'Medium' ? t('moderate') : t('low')} {t('risk_suffix')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('impact_analysis')}</h4>
                    <div className="bg-blue-50 text-blue-900 rounded-lg p-4 flex items-start gap-3">
                      <Users className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{t('population_affected')}</p>
                        <p className="text-2xl font-bold mt-1">{selectedItem.population}</p>
                        <p className="text-xs text-blue-700 mt-1 opacity-80">{t('residents_service_area')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 bg-blue-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                      {t('dispatch_team')}
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      {t('view_logs')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur px-6 py-4 rounded-xl shadow-sm border border-gray-200 text-center">
                  <MapPin className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                  <h3 className="text-gray-900 font-medium">{t('select_infrastructure')}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t('click_item_details')}</p>
                </div>
             </div>
          )}

          {/* Map Points */}
          <div className="absolute inset-0 z-10">
            {filteredData.map(item => {
              const isSelected = selectedItem?.id === item.id;
              const Icon = typeIcons[item.typeKey] || Building2;
              
              return (
                <div
                  key={`map-${item.id}`}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-40'
                  }`}
                  style={{ left: `${item.coordinates.x}%`, top: `${item.coordinates.y}%` }}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Ping effect for High Risk */}
                  {item.severity === 'High' && (
                    <div className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                      isSelected ? 'bg-red-500' : 'bg-red-400'
                    }`}></div>
                  )}
                  
                  <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                    isSelected ? 'border-blue-900 ring-4 ring-blue-100' : 'border-white'
                  } ${
                    item.severity === 'High' ? 'bg-red-500 text-white' :
                    item.severity === 'Medium' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Tooltip on hover (only show if not selected) */}
                  {!isSelected && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {t(item.nameKey)}
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