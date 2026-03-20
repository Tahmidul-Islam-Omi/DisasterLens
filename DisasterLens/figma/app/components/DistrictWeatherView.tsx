import { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  CloudSun,
  ChevronDown
} from 'lucide-react';
import { WeatherCard } from './WeatherCard';
import { ForecastPanel } from './ForecastPanel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const districts = [
  // Dhaka Division
  { id: '1', name: 'Dhaka', division: 'Dhaka', status: 'Moderate', temp: '32°C', rainfall: '15mm', risk: 'Medium', color: '#F59E0B' },
  { id: '2', name: 'Gazipur', division: 'Dhaka', status: 'Stable', temp: '31°C', rainfall: '5mm', risk: 'Low', color: '#16A34A' },
  { id: '3', name: 'Narayanganj', division: 'Dhaka', status: 'Moderate', temp: '33°C', rainfall: '18mm', risk: 'Medium', color: '#F59E0B' },
  { id: '4', name: 'Tangail', division: 'Dhaka', status: 'Critical', temp: '30°C', rainfall: '95mm', risk: 'High', color: '#DC2626' },
  { id: '5', name: 'Manikganj', division: 'Dhaka', status: 'Stable', temp: '32°C', rainfall: '8mm', risk: 'Low', color: '#16A34A' },
  
  // Chittagong Division
  { id: '6', name: 'Chittagong', division: 'Chittagong', status: 'Critical', temp: '29°C', rainfall: '125mm', risk: 'High', color: '#DC2626' },
  { id: '7', name: 'Cox\'s Bazar', division: 'Chittagong', status: 'Critical', temp: '28°C', rainfall: '110mm', risk: 'High', color: '#DC2626' },
  { id: '8', name: 'Rangamati', division: 'Chittagong', status: 'Moderate', temp: '26°C', rainfall: '45mm', risk: 'Medium', color: '#F59E0B' },
  { id: '9', name: 'Bandarban', division: 'Chittagong', status: 'Moderate', temp: '25°C', rainfall: '55mm', risk: 'Medium', color: '#F59E0B' },
  { id: '10', name: 'Comilla', division: 'Chittagong', status: 'Stable', temp: '31°C', rainfall: '12mm', risk: 'Low', color: '#16A34A' },
  
  // Rajshahi Division
  { id: '11', name: 'Rajshahi', division: 'Rajshahi', status: 'Stable', temp: '34°C', rainfall: '3mm', risk: 'Low', color: '#16A34A' },
  { id: '12', name: 'Bogura', division: 'Rajshahi', status: 'Stable', temp: '33°C', rainfall: '6mm', risk: 'Low', color: '#16A34A' },
  { id: '13', name: 'Natore', division: 'Rajshahi', status: 'Moderate', temp: '32°C', rainfall: '22mm', risk: 'Medium', color: '#F59E0B' },
  { id: '14', name: 'Pabna', division: 'Rajshahi', status: 'Stable', temp: '33°C', rainfall: '8mm', risk: 'Low', color: '#16A34A' },
  
  // Khulna Division
  { id: '15', name: 'Khulna', division: 'Khulna', status: 'Moderate', temp: '30°C', rainfall: '28mm', risk: 'Medium', color: '#F59E0B' },
  { id: '16', name: 'Satkhira', division: 'Khulna', status: 'Critical', temp: '29°C', rainfall: '88mm', risk: 'High', color: '#DC2626' },
  { id: '17', name: 'Jessore', division: 'Khulna', status: 'Stable', temp: '31°C', rainfall: '10mm', risk: 'Low', color: '#16A34A' },
  { id: '18', name: 'Bagerhat', division: 'Khulna', status: 'Moderate', temp: '30°C', rainfall: '32mm', risk: 'Medium', color: '#F59E0B' },
  
  // Barishal Division
  { id: '19', name: 'Barishal', division: 'Barishal', status: 'Critical', temp: '30°C', rainfall: '105mm', risk: 'High', color: '#DC2626' },
  { id: '20', name: 'Patuakhali', division: 'Barishal', status: 'Critical', temp: '29°C', rainfall: '115mm', risk: 'High', color: '#DC2626' },
  { id: '21', name: 'Bhola', division: 'Barishal', status: 'Moderate', temp: '31°C', rainfall: '42mm', risk: 'Medium', color: '#F59E0B' },
  { id: '22', name: 'Barguna', division: 'Barishal', status: 'Critical', temp: '29°C', rainfall: '98mm', risk: 'High', color: '#DC2626' },
  
  // Sylhet Division
  { id: '23', name: 'Sylhet', division: 'Sylhet', status: 'Critical', temp: '27°C', rainfall: '135mm', risk: 'High', color: '#DC2626' },
  { id: '24', name: 'Moulvibazar', division: 'Sylhet', status: 'Critical', temp: '26°C', rainfall: '142mm', risk: 'High', color: '#DC2626' },
  { id: '25', name: 'Habiganj', division: 'Sylhet', status: 'Moderate', temp: '28°C', rainfall: '65mm', risk: 'Medium', color: '#F59E0B' },
  { id: '26', name: 'Sunamganj', division: 'Sylhet', status: 'Critical', temp: '27°C', rainfall: '128mm', risk: 'High', color: '#DC2626' },
  
  // Rangpur Division
  { id: '27', name: 'Rangpur', division: 'Rangpur', status: 'Stable', temp: '30°C', rainfall: '12mm', risk: 'Low', color: '#16A34A' },
  { id: '28', name: 'Dinajpur', division: 'Rangpur', status: 'Stable', temp: '31°C', rainfall: '8mm', risk: 'Low', color: '#16A34A' },
  { id: '29', name: 'Kurigram', division: 'Rangpur', status: 'Moderate', temp: '29°C', rainfall: '38mm', risk: 'Medium', color: '#F59E0B' },
  { id: '30', name: 'Lalmonirhat', division: 'Rangpur', status: 'Stable', temp: '30°C', rainfall: '15mm', risk: 'Low', color: '#16A34A' },
  
  // Mymensingh Division
  { id: '31', name: 'Mymensingh', division: 'Mymensingh', status: 'Moderate', temp: '30°C', rainfall: '48mm', risk: 'Medium', color: '#F59E0B' },
  { id: '32', name: 'Netrokona', division: 'Mymensingh', status: 'Critical', temp: '28°C', rainfall: '92mm', risk: 'High', color: '#DC2626' },
  { id: '33', name: 'Jamalpur', division: 'Mymensingh', status: 'Moderate', temp: '31°C', rainfall: '35mm', risk: 'Medium', color: '#F59E0B' },
  { id: '34', name: 'Sherpur', division: 'Mymensingh', status: 'Stable', temp: '29°C', rainfall: '18mm', risk: 'Low', color: '#16A34A' },
];

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
  const { t } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0]); // Dhaka as default
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDistrict = (district: typeof districts[0]) => {
    setSelectedDistrict(district);
    setSearchQuery('');
    setShowDropdown(false);
  };

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
                  filteredDistricts.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => handleSelectDistrict(district)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{district.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{district.division} Division</p>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: district.color }}></div>
                          <span className="text-xs text-gray-600">{district.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{district.temp}</p>
                        <p className="text-xs text-gray-500">{district.rainfall}</p>
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
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedDistrict.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedDistrict.division} Division</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{selectedDistrict.temp}</p>
                    <p className="text-xs text-gray-500">{selectedDistrict.rainfall}</p>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: selectedDistrict.color + '15', color: selectedDistrict.color }}
                  >
                    {selectedDistrict.status}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* District Information Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{selectedDistrict.name} District</h2>
            <div 
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: selectedDistrict.color + '15', color: selectedDistrict.color }}
            >
              {selectedDistrict.status} Warning
            </div>
          </div>
          <p className="text-gray-500 text-sm">{t('real_time_monitoring')}</p>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <WeatherCard
            title={t('temperature')}
            value={selectedDistrict.temp.replace('°C', '')}
            unit="°C"
            icon={Thermometer}
            trend={t('since_morning')}
            color="#0EA5E9"
          />
          <WeatherCard
            title={t('hourly_rainfall')}
            value={selectedDistrict.rainfall.replace('mm', '')}
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
            value={selectedDistrict.risk}
            unit=""
            icon={AlertTriangle}
            trend={t('flood_risk_high')}
            color={selectedDistrict.color}
          />
        </div>

        {/* Rain Fall Analysis Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('rainfall_analysis_24h')}</h3>
              <p className="text-sm text-gray-500">{t('intraday_precipitation')} {selectedDistrict.name}</p>
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
                  <linearGradient id={`colorRain-${selectedDistrict.id}`} x1="0" y1="0" x2="0" y2="1">
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
                  fill={`url(#colorRain-${selectedDistrict.id})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Specific Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('active_alerts_in')} {selectedDistrict.name}</h3>
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