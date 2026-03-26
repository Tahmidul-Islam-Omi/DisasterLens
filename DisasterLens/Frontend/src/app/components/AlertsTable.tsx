import { useLanguage } from '../i18n/LanguageContext';
import type { WeatherAlert } from '../types';

const alerts = [
  { id: 1, typeKey: 'cyclone_warning', region: 'Eastern Coast', severityKey: 'critical', hoursAgo: 2, status: 'Active', severityColor: '#DC2626' },
  { id: 2, typeKey: 'flood_alert', region: 'Northern Province', severityKey: 'high', hoursAgo: 4, status: 'Active', severityColor: '#DC2626' },
  { id: 3, typeKey: 'heavy_rainfall', region: 'Central Region', severityKey: 'moderate', hoursAgo: 6, status: 'Monitoring', severityColor: '#F59E0B' },
  { id: 4, typeKey: 'storm_watch', region: 'Southern District', severityKey: 'low', hoursAgo: 8, status: 'Resolved', severityColor: '#16A34A' },
  { id: 5, typeKey: 'wind_advisory', region: 'Western Region', severityKey: 'moderate', hoursAgo: 12, status: 'Active', severityColor: '#F59E0B' },
];

interface AlertsTableProps {
  alerts?: WeatherAlert[] | null;
}

export function AlertsTable({ alerts: apiAlerts }: AlertsTableProps) {
  const { t, d } = useLanguage();
  const rows = apiAlerts && apiAlerts.length > 0
    ? apiAlerts.map((alert) => {
        return {
          id: alert.id,
          type: d(alert.headline, alert.headlineBn),
          region: d(alert.region, alert.regionBn),
          severity: alert.severity,
          issuedAt: d(alert.timeIssued, alert.timeIssuedBn),
          status: alert.status,
          severityClass:
            alert.severity === 'emergency'
              ? 'bg-red-600'
              : alert.severity === 'warning'
              ? 'bg-amber-500'
              : 'bg-green-600',
        };
      })
    : alerts.map((alert) => ({
        id: alert.id,
        type: t(alert.typeKey),
        region: alert.region,
        severity: alert.severityKey,
        issuedAt: `${alert.hoursAgo} ${t('hours_ago')}`,
        status: alert.status,
        severityClass:
          alert.severityKey === 'critical'
            ? 'bg-red-600'
            : alert.severityKey === 'high' || alert.severityKey === 'moderate'
            ? 'bg-amber-500'
            : 'bg-green-600',
      }));

  const toStatusClass = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'active') return 'bg-green-100 text-green-700';
    if (normalized === 'monitoring') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const statusLabel = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'active') return t('active');
    if (normalized === 'monitoring') return t('monitoring');
    if (normalized === 'resolved') return t('resolved');
    return status;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">{t('recent_weather_alerts')}</h3>
        <button className="text-sm text-blue-900 hover:underline">
          {t('view_all')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('alert_type')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('affected_region')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('severity')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('time_issued')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-900">{alert.type}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{alert.region}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs text-white ${alert.severityClass}`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{alert.issuedAt}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${toStatusClass(alert.status)}`}>
                    {statusLabel(alert.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
