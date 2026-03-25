import { useState } from 'react';
import { Search, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { WeatherCard } from '../../components/weather/WeatherCard';
import { ForecastPanel } from '../../components/weather/ForecastPanel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../i18n/LanguageContext';

const districts = [
  { id: '1', name: 'Dhaka', division: 'Dhaka', status: 'Moderate', temp: '32', rainfall: '15', risk: 'Medium', color: '#F59E0B' },
  { id: '2', name: 'Gazipur', division: 'Dhaka', status: 'Stable', temp: '31', rainfall: '5', risk: 'Low', color: '#16A34A' },
  { id: '3', name: 'Narayanganj', division: 'Dhaka', status: 'Moderate', temp: '33', rainfall: '18', risk: 'Medium', color: '#F59E0B' },
  { id: '4', name: 'Tangail', division: 'Dhaka', status: 'Critical', temp: '30', rainfall: '95', risk: 'High', color: '#DC2626' },
  { id: '5', name: 'Manikganj', division: 'Dhaka', status: 'Stable', temp: '32', rainfall: '8', risk: 'Low', color: '#16A34A' },
  { id: '6', name: 'Chittagong', division: 'Chittagong', status: 'Critical', temp: '29', rainfall: '125', risk: 'High', color: '#DC2626' },
  { id: '7', name: "Cox's Bazar", division: 'Chittagong', status: 'Critical', temp: '28', rainfall: '110', risk: 'High', color: '#DC2626' },
  { id: '8', name: 'Rangamati', division: 'Chittagong', status: 'Moderate', temp: '26', rainfall: '45', risk: 'Medium', color: '#F59E0B' },
  { id: '9', name: 'Comilla', division: 'Chittagong', status: 'Stable', temp: '31', rainfall: '12', risk: 'Low', color: '#16A34A' },
  { id: '10', name: 'Rajshahi', division: 'Rajshahi', status: 'Stable', temp: '34', rainfall: '3', risk: 'Low', color: '#16A34A' },
  { id: '11', name: 'Bogura', division: 'Rajshahi', status: 'Stable', temp: '33', rainfall: '6', risk: 'Low', color: '#16A34A' },
  { id: '12', name: 'Khulna', division: 'Khulna', status: 'Moderate', temp: '30', rainfall: '28', risk: 'Medium', color: '#F59E0B' },
  { id: '13', name: 'Satkhira', division: 'Khulna', status: 'Critical', temp: '29', rainfall: '88', risk: 'High', color: '#DC2626' },
  { id: '14', name: 'Barishal', division: 'Barishal', status: 'Critical', temp: '30', rainfall: '105', risk: 'High', color: '#DC2626' },
  { id: '15', name: 'Patuakhali', division: 'Barishal', status: 'Critical', temp: '29', rainfall: '115', risk: 'High', color: '#DC2626' },
  { id: '16', name: 'Sylhet', division: 'Sylhet', status: 'Critical', temp: '27', rainfall: '135', risk: 'High', color: '#DC2626' },
  { id: '17', name: 'Moulvibazar', division: 'Sylhet', status: 'Critical', temp: '26', rainfall: '142', risk: 'High', color: '#DC2626' },
  { id: '18', name: 'Sunamganj', division: 'Sylhet', status: 'Critical', temp: '27', rainfall: '128', risk: 'High', color: '#DC2626' },
  { id: '19', name: 'Rangpur', division: 'Rangpur', status: 'Stable', temp: '30', rainfall: '12', risk: 'Low', color: '#16A34A' },
  { id: '20', name: 'Mymensingh', division: 'Mymensingh', status: 'Moderate', temp: '30', rainfall: '48', risk: 'Medium', color: '#F59E0B' },
  { id: '21', name: 'Netrokona', division: 'Mymensingh', status: 'Critical', temp: '28', rainfall: '92', risk: 'High', color: '#DC2626' },
];

const mockChartData = [
  { name: '00:00', value: 12 }, { name: '04:00', value: 18 }, { name: '08:00', value: 45 },
  { name: '12:00', value: 85 }, { name: '16:00', value: 65 }, { name: '20:00', value: 40 }, { name: '23:59', value: 35 },
];

export default function DistrictWeatherView() {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredDistricts = districts.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectDistrict = (district: typeof districts[0]) => {
    setSelectedDistrict(district);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('weather.filterByDistrict')}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('weather.searchSelectDistrict')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {showDropdown && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
                {filteredDistricts.length > 0 ? filteredDistricts.map((district) => (
                  <button key={district.id} onClick={() => handleSelectDistrict(district)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors">
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{district.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{district.division} Division</p>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: district.color }} />
                        <span className="text-xs text-gray-600">{district.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{district.temp}°C</p>
                      <p className="text-xs text-gray-500">{district.rainfall}mm</p>
                    </div>
                  </button>
                )) : <div className="p-4 text-center text-sm text-gray-500">{t('weather.noDistrictsFound')}</div>}
              </div>
            )}
          </div>
          {!searchQuery && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('weather.selectedDistrict')}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedDistrict.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedDistrict.division} Division</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{selectedDistrict.temp}°C</p>
                    <p className="text-xs text-gray-500">{selectedDistrict.rainfall}mm</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: selectedDistrict.color + '15', color: selectedDistrict.color }}>
                    {selectedDistrict.status}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{selectedDistrict.name} District</h2>
            <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: selectedDistrict.color + '15', color: selectedDistrict.color }}>
              {selectedDistrict.status}
            </div>
          </div>
          <p className="text-gray-500 text-sm">{t('weather.realTimeMonitoring')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <WeatherCard title={t('weather.temperature')} value={selectedDistrict.temp} unit="°C" icon={Thermometer} trend={t('weather.sinceMorning')} color="#0EA5E9" />
          <WeatherCard title={t('weather.hourlyRainfall')} value={selectedDistrict.rainfall} unit="mm" icon={Droplets} trend={t('weather.precipitationIncreasing')} color="#1E3A8A" />
          <WeatherCard title={t('weather.windSpeed')} value="34" unit="km/h" icon={Wind} trend={t('weather.gustyWinds')} color="#F59E0B" />
          <WeatherCard title={t('weather.riskAssessment')} value={selectedDistrict.risk} unit="" icon={AlertTriangle} trend={t('weather.floodRiskHigh')} color={selectedDistrict.color} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('weather.rainfallAnalysis24h')}: {selectedDistrict.name}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id={`colorRain-${selectedDistrict.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#1E3A8A" strokeWidth={2} fillOpacity={1} fill={`url(#colorRain-${selectedDistrict.id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8"><ForecastPanel /></div>
      </div>
    </div>
  );
}
