import { useEffect, useState } from 'react';
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
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasRoutePermission } from '../config/permissions';
import { api } from '../lib/api';

type SeverityType = 'emergency' | 'warning' | 'information';

const severityConfig = {
  'information': { color: '#16A34A', bgColor: '#F0FDF4', borderColor: '#BBF7D0', icon: Info },
  'warning': { color: '#F59E0B', bgColor: '#FFFBEB', borderColor: '#FDE68A', icon: AlertCircle },
  'emergency': { color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA', icon: AlertTriangle }
};

export function WeatherAlertsView() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<'all' | string>('all');
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    headline: string;
    headlineBn: string;
    description: string;
    descriptionBn: string;
    severity: SeverityType;
    region: string;
    regionBn: string;
    timeIssued: string;
    timeIssuedBn: string;
    publishedDate: string;
  }>>([]);
  const navigate = useNavigate();
  const { t, d } = useLanguage();
  const { user, token } = useAuth();

  // Check if user can create alerts
  const canCreateAlert = user && hasRoutePermission('/create-alert', user.role);

  useEffect(() => {
    const loadData = async () => {
      try {
        const path = token ? '/authority/weather-alerts' : '/public/weather-alerts';
        const data = await api.get<typeof alerts>(path, token);
        setAlerts(data);
      } catch (error) {
        console.error('Failed to load weather alerts', error);
      }
    };
    void loadData();
  }, [token]);

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedDate === 'all') {
      return true;
    }
    return alert.publishedDate === selectedDate;
  });

  const getSeverityStats = () => {
    return {
      total: filteredAlerts.length,
      emergency: filteredAlerts.filter(a => a.severity === 'emergency').length,
      warning: filteredAlerts.filter(a => a.severity === 'warning').length,
      information: filteredAlerts.filter(a => a.severity === 'information').length,
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
          {canCreateAlert && (
            <button 
              onClick={() => navigate('/create-alert')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-5 h-5" />
              {t('create_alert')}
            </button>
          )}
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
            <button
              onClick={() => setSelectedDate('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedDate === 'all' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedDate === 'all' ? { backgroundColor: '#1E3A8A' } : {}}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDate(todayIso)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedDate === todayIso ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedDate === todayIso ? { backgroundColor: '#1E3A8A' } : {}}
            >
              {t('today')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              const isHighlighted = index === 0;

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
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{d(alert.headline, alert.headlineBn)}</h3>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-semibold ml-4 shrink-0" style={{ backgroundColor: config.bgColor, color: config.color, border: `1px solid ${config.borderColor}` }}>
                          {alert.severity.toUpperCase()}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{d(alert.description, alert.descriptionBn)}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{t('published')}: {d(alert.timeIssued, alert.timeIssuedBn)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{d(alert.region, alert.regionBn)}</span>
                        </div>
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
      </div>
    </div>
  );
}
