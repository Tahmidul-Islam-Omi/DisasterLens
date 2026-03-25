import { useState } from 'react';
import { AlertTriangle, Info, AlertCircle, Clock, MapPin, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../i18n/LanguageContext';

type SeverityType = 'Information' | 'Warning' | 'Emergency';

interface WeatherAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: SeverityType;
  location?: string;
  day: number;
}

const mockWeatherAlerts: WeatherAlert[] = [
  { id: '1', title: 'Heavy Monsoon Warning', message: 'Extremely heavy rainfall expected across northern Bangladesh. Rivers may overflow danger level.', timestamp: '10:30 AM', severity: 'Warning', location: 'Northern Bangladesh', day: 0 },
  { id: '2', title: 'Cyclone Alert - Category 2', message: 'A strong cyclonic storm is intensifying in the Bay of Bengal and is expected to make landfall within 48 hours.', timestamp: '08:15 AM', severity: 'Emergency', location: 'Coastal Regions', day: 0 },
  { id: '3', title: 'Temperature Drop Advisory', message: 'A moderate cold wave is expected to sweep through western regions in the next 24 hours.', timestamp: '06:45 AM', severity: 'Information', location: 'Western Regions', day: 0 },
  { id: '4', title: 'Fog & Visibility Alert', message: 'Dense fog expected during morning hours reducing visibility significantly.', timestamp: '05:20 PM', severity: 'Information', location: 'Central Districts', day: 1 },
  { id: '5', title: 'Flash Flood Emergency', message: 'Sudden flash flooding due to excessive riverflow in Sylhet division. Immediate evacuation required.', timestamp: '02:15 PM', severity: 'Emergency', location: 'Sylhet Division', day: 1 },
  { id: '6', title: 'Thunderstorm Warning', message: 'Severe thunderstorms with lightning and gusty winds expected.', timestamp: '07:00 AM', severity: 'Warning', location: 'Dhaka Surrounding', day: 2 },
  { id: '7', title: 'Coastal Surge Advisory', message: 'Storm surge of 2-3 meters is possible along the Chittagong coast.', timestamp: '11:45 AM', severity: 'Warning', location: 'Chittagong Coast', day: 2 },
  { id: '8', title: 'River Water Level Information', message: 'Water levels in major rivers of Barishal are above normal but below danger level.', timestamp: '03:30 PM', severity: 'Information', location: 'Barishal Division', day: 3 },
  { id: '9', title: 'Drought Watch', message: 'Below-average rainfall in northern districts may lead to drought conditions.', timestamp: '09:00 AM', severity: 'Warning', location: 'Northern Districts', day: 4 },
  { id: '10', title: 'Agricultural Weather Advisory', message: 'Favorable weather for crop cultivation in Mymensingh division this week.', timestamp: '04:15 PM', severity: 'Information', location: 'Mymensingh Division', day: 5 },
];

const severityConfig = {
  Information: { color: '#16A34A', bgColor: '#F0FDF4', borderColor: '#BBF7D0', icon: Info },
  Warning: { color: '#F59E0B', bgColor: '#FFFBEB', borderColor: '#FDE68A', icon: AlertCircle },
  Emergency: { color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA', icon: AlertTriangle },
};

export default function WeatherAlertsView() {
  const [selectedDay, setSelectedDay] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const filteredAlerts = mockWeatherAlerts.filter(alert => alert.day === selectedDay);
  const stats = {
    total: filteredAlerts.length,
    emergency: filteredAlerts.filter(a => a.severity === 'Emergency').length,
    warning: filteredAlerts.filter(a => a.severity === 'Warning').length,
    information: filteredAlerts.filter(a => a.severity === 'Information').length,
  };

  const dayFilters = [
    { label: t('common.today'), value: 0 },
    { label: t('common.yesterday'), value: 1 },
    { label: `2 ${t('common.daysAgo')}`, value: 2 },
    { label: `3 ${t('common.daysAgo')}`, value: 3 },
    { label: `4 ${t('common.daysAgo')}`, value: 4 },
    { label: `5 ${t('common.daysAgo')}`, value: 5 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('weather.alertsTitle')}</h1>
            <p className="text-gray-600">{t('weather.alertsSubtitle')}</p>
          </div>
          <button onClick={() => navigate('/create-alert')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm shrink-0">
            <Plus className="w-5 h-5" />
            {t('alert.title')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200"><p className="text-sm text-gray-600 mb-1">{t('weather.totalAlerts')}</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200"><p className="text-sm text-red-700 mb-1">{t('weather.emergency')}</p><p className="text-2xl font-bold text-red-600">{stats.emergency}</p></div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200"><p className="text-sm text-amber-700 mb-1">{t('weather.warning')}</p><p className="text-2xl font-bold text-amber-600">{stats.warning}</p></div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200"><p className="text-sm text-green-700 mb-1">{t('weather.information')}</p><p className="text-2xl font-bold text-green-600">{stats.information}</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('weather.filterByDate')}</h3>
          <div className="flex flex-wrap gap-2">
            {dayFilters.map((filter) => (
              <button key={filter.value} onClick={() => setSelectedDay(filter.value)} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedDay === filter.value ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.length > 0 ? filteredAlerts.map((alert, index) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            const isHighlighted = index === 0 && selectedDay === 0;
            return (
              <div key={alert.id} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${isHighlighted ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`} style={{ borderColor: config.borderColor }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.bgColor }}>
                    <Icon className="w-6 h-6" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {isHighlighted && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2 bg-blue-900 text-white">
                            <TrendingUp className="w-3 h-3" />{t('weather.latestAlert')}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{alert.title}</h3>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-semibold ml-4 shrink-0" style={{ backgroundColor: config.bgColor, color: config.color, border: `1px solid ${config.borderColor}` }}>
                        {alert.severity}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{alert.message}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{t('common.published')}: {alert.timestamp}</span></div>
                      {alert.location && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{alert.location}</span></div>}
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('weather.noAlertsFound')}</h3>
              <p className="text-gray-500">{t('weather.noAlertsForDate')}</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">{t('weather.stayInformed')}</p>
              <p className="text-sm text-blue-700">{t('weather.stayInformedMsg')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
