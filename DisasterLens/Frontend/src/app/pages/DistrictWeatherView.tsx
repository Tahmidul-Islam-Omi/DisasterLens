import { useEffect, useState } from 'react';
import { 
  Search, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle
} from 'lucide-react';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastPanel } from '../components/ForecastPanel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type DistrictWeather = {
  id: string;
  district: string;
  districtBn: string;
  division: string;
  divisionBn: string;
  temperature: number;
  rainfall: number;
  windSpeed: number;
  riskLevel: 'high' | 'moderate' | 'low';
};

const mockChartData = [
  { name: '00:00', value: 12 },
  { name: '04:00', value: 18 },
  { name: '08:00', value: 45 },
  { name: '12:00', value: 85 },
  { name: '16:00', value: 65 },
  { name: '20:00', value: 40 },
  { name: '23:59', value: 35 },
];

export function DistrictWeatherView() {
  const { t, d } = useLanguage();
  const { token } = useAuth();
  const [districts, setDistricts] = useState<DistrictWeather[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictWeather | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.get<DistrictWeather[]>('/authority/district-weather', token);
        setDistricts(data);
        setSelectedDistrict(data[0] || null);
      } catch (error) {
        console.error('Failed to load district weather', error);
      }
    };
    void loadData();
  }, []);

  const filteredDistricts = districts.filter(district => 
    d(district.district, district.districtBn).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDistrict = (district: DistrictWeather) => {
    setSelectedDistrict(district);
    setSearchQuery('');
    setShowDropdown(false);
  };

  if (!selectedDistrict) {
    return <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]" />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* District Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('filter_by_district')}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search_select_district')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Dropdown Results */}
            {showDropdown && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map((district, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectDistrict(district)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{d(district.district, district.districtBn)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{d(district.division, district.divisionBn)} {t('division_suffix')}</p>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            district.riskLevel === 'high' ? 'bg-red-500' : 
                            district.riskLevel === 'moderate' ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}></div>
                          <span className="text-xs text-gray-600">
                            {district.riskLevel === 'high' ? t('high') : 
                             district.riskLevel === 'moderate' ? t('moderate') : t('low')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{district.temperature}°C</p>
                        <p className="text-xs text-gray-500">{district.rainfall}mm</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {t('no_districts_found')}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Selected District Display */}
          {!searchQuery && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('selected_district')}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{d(selectedDistrict.district, selectedDistrict.districtBn)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d(selectedDistrict.division, selectedDistrict.divisionBn)} {t('division_suffix')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{selectedDistrict.temperature}°C</p>
                    <p className="text-xs text-gray-500">{selectedDistrict.rainfall}mm</p>
                  </div>
                  <div 
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedDistrict.riskLevel === 'high' ? 'bg-red-100 text-red-700' : 
                      selectedDistrict.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}
                  >
                    {selectedDistrict.riskLevel === 'high' ? t('high') : 
                     selectedDistrict.riskLevel === 'moderate' ? t('moderate') : t('low')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* District Information Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{d(selectedDistrict.district, selectedDistrict.districtBn)} {t('district_suffix')}</h2>
            <div 
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                selectedDistrict.riskLevel === 'high' ? 'bg-red-100 text-red-700' : 
                selectedDistrict.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-green-100 text-green-700'
              }`}
            >
              {selectedDistrict.riskLevel === 'high' ? t('high') : 
               selectedDistrict.riskLevel === 'moderate' ? t('moderate') : t('low')} {t('warning_suffix')}
            </div>
          </div>
          <p className="text-gray-500 text-sm">{t('real_time_monitoring')}</p>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <WeatherCard
            title={t('temperature')}
            value={selectedDistrict.temperature.toString()}
            unit="°C"
            icon={Thermometer}
            trend={t('since_morning')}
            color="#0EA5E9"
          />
          <WeatherCard
            title={t('hourly_rainfall')}
            value={selectedDistrict.rainfall.toString()}
            unit="mm"
            icon={Droplets}
            trend={t('precipitation_increasing')}
            color="#1E3A8A"
          />
          <WeatherCard
            title={t('wind_speed')}
            value="34"
            unit="km/h"
            icon={Wind}
            trend={t('gusty_winds_detected')}
            color="#F59E0B"
          />
          <WeatherCard
            title={t('risk_assessment')}
            value={selectedDistrict.riskLevel === 'high' ? t('high') : selectedDistrict.riskLevel === 'moderate' ? t('moderate') : t('low')}
            unit=""
            icon={AlertTriangle}
            trend={t('flood_risk_high')}
            color={selectedDistrict.riskLevel === 'high' ? '#DC2626' : selectedDistrict.riskLevel === 'moderate' ? '#F59E0B' : '#10B981'}
          />
        </div>

        {/* Rain Fall Analysis Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('rainfall_analysis_24h')}</h3>
              <p className="text-sm text-gray-500">{t('intraday_precipitation')} {d(selectedDistrict.district, selectedDistrict.districtBn)}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">{t('rainfall_mm')}</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs key="defs">
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop key="stop1" offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                    <stop key="stop2" offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  key="xaxis"
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B' }}
                />
                <YAxis 
                  key="yaxis"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B' }}
                />
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  key="area"
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1E3A8A" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRain)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Specific Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('active_alerts')} {d(selectedDistrict.district, selectedDistrict.districtBn)} {t('district_suffix')}</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-900 uppercase">{t('flash_flood_warning_title')}</p>
                <p className="text-sm text-red-700 mt-1">{t('flash_flood_warning_msg')}</p>
                <p className="text-xs text-red-500 mt-2 font-medium">{t('issued_15_mins')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Wind className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 uppercase">{t('high_wind_advisory')}</p>
                <p className="text-sm text-amber-700 mt-1">{t('high_wind_msg')}</p>
                <p className="text-xs text-amber-500 mt-2 font-medium">{t('issued_2_hours')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast for District */}
        <div className="mt-8">
          <ForecastPanel />
        </div>
      </div>
    </div>
  );
}