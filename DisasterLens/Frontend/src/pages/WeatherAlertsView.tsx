import { useState } from 'react';
import { 
  AlertTriangle, 
  Info, 
  AlertCircle,
  Clock,
  MapPin,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

type SeverityType = 'Information' | 'Warning' | 'Emergency';

interface Alert {
  id: string;
  titleKey: string;
  messageKey: string;
  timestamp: string;
  severity: SeverityType;
  locationKey?: string;
  day: number;
}

const mockAlerts: Alert[] = [
  { id: '1', titleKey: 'wa_alert_1_title', messageKey: 'wa_alert_1_message', timestamp: '10:30 AM', severity: 'Warning', locationKey: 'wa_loc_northern_bangladesh', day: 0 },
  { id: '2', titleKey: 'wa_alert_2_title', messageKey: 'wa_alert_2_message', timestamp: '08:15 AM', severity: 'Emergency', locationKey: 'wa_loc_coastal_regions', day: 0 },
  { id: '3', titleKey: 'wa_alert_3_title', messageKey: 'wa_alert_3_message', timestamp: '06:45 AM', severity: 'Information', locationKey: 'wa_loc_western_regions', day: 0 },
  { id: '4', titleKey: 'wa_alert_4_title', messageKey: 'wa_alert_4_message', timestamp: '05:20 PM', severity: 'Information', locationKey: 'wa_loc_central_districts', day: 1 },
  { id: '5', titleKey: 'wa_alert_5_title', messageKey: 'wa_alert_5_message', timestamp: '02:15 PM', severity: 'Emergency', locationKey: 'wa_loc_sylhet_division', day: 1 },
  { id: '6', titleKey: 'wa_alert_6_title', messageKey: 'wa_alert_6_message', timestamp: '07:00 AM', severity: 'Warning', locationKey: 'wa_loc_dhaka_surrounding', day: 2 },
  { id: '7', titleKey: 'wa_alert_7_title', messageKey: 'wa_alert_7_message', timestamp: '11:45 AM', severity: 'Warning', locationKey: 'wa_loc_chittagong_coast', day: 2 },
  { id: '8', titleKey: 'wa_alert_8_title', messageKey: 'wa_alert_8_message', timestamp: '03:30 PM', severity: 'Information', locationKey: 'wa_loc_barishal_division', day: 3 },
  { id: '9', titleKey: 'wa_alert_9_title', messageKey: 'wa_alert_9_message', timestamp: '09:00 AM', severity: 'Warning', locationKey: 'wa_loc_northern_districts', day: 4 },
  { id: '10', titleKey: 'wa_alert_10_title', messageKey: 'wa_alert_10_message', timestamp: '04:15 PM', severity: 'Information', locationKey: 'wa_loc_mymensingh_division', day: 5 },
];

const severityConfig = {
  'Information': { color: '#16A34A', bgColor: '#F0FDF4', borderColor: '#BBF7D0', icon: Info },
  'Warning': { color: '#F59E0B', bgColor: '#FFFBEB', borderColor: '#FDE68A', icon: AlertCircle },
  'Emergency': { color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA', icon: AlertTriangle }
};

export default function WeatherAlertsView() {
  const [selectedDay, setSelectedDay] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const severityLabelMap: Record<SeverityType, string> = {
    Information: t('information'),
    Warning: t('warning'),
    Emergency: t('emergency'),
  };

  const filteredAlerts = mockAlerts.filter(alert => alert.day === selectedDay);

  const dayFilters = [
    { label: t('today'), value: 0 },
    { label: t('yesterday'), value: 1 },
    { label: `2 ${t('days_ago')}`, value: 2 },
    { label: `3 ${t('days_ago')}`, value: 3 },
    { label: `4 ${t('days_ago')}`, value: 4 },
    { label: `5 ${t('days_ago')}`, value: 5 },
    { label: `6 ${t('days_ago')}`, value: 6 },
    { label: `7 ${t('days_ago')}`, value: 7 },
  ];

  const getSeverityStats = () => {
    return {
      total: filteredAlerts.length,
      emergency: filteredAlerts.filter(a => a.severity === 'Emergency').length,
      warning: filteredAlerts.filter(a => a.severity === 'Warning').length,
      information: filteredAlerts.filter(a => a.severity === 'Information').length,
    };
  };

  const stats = getSeverityStats();

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('weather_alerts_bangladesh')}</h1>
            <p className="text-gray-600">{t('official_weather_alerts')}</p>
          </div>
          <button 
            onClick={() => navigate('/create-alert')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            {t('create_alert')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{t('total_alerts')}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 mb-1">{t('emergency')}</p>
            <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-700 mb-1">{t('warning')}</p>
            <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 mb-1">{t('information')}</p>
            <p className="text-2xl font-bold text-green-600">{stats.information}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('filter_by_date')}</h3>
          <div className="flex flex-wrap gap-2">
            {dayFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedDay(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedDay === filter.value ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedDay === filter.value ? { backgroundColor: '#1E3A8A' } : {}}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              const isHighlighted = index === 0 && selectedDay === 0;

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${isHighlighted ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                  style={{ borderColor: config.borderColor }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.bgColor }}>
                      <Icon className="w-6 h-6" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {isHighlighted && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                              <TrendingUp className="w-3 h-3" />
                              {t('latest_alert')}
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{t(alert.titleKey)}</h3>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-semibold ml-4 shrink-0" style={{ backgroundColor: config.bgColor, color: config.color, border: `1px solid ${config.borderColor}` }}>
                          {severityLabelMap[alert.severity]}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{t(alert.messageKey)}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{t('published')}: {alert.timestamp}</span>
                        </div>
                        {alert.locationKey && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{t(alert.locationKey)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('no_alerts_found')}</h3>
              <p className="text-gray-500">{t('no_alerts_for_date')}</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">{t('stay_informed')}</p>
              <p className="text-sm text-blue-700">{t('stay_informed_msg')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
