import { useLanguage } from '../i18n/LanguageContext';

const alerts = [
  { id: 1, typeKey: 'cyclone_warning', region: 'Eastern Coast', severityKey: 'critical', hoursAgo: 2, status: 'Active', severityColor: '#DC2626' },
  { id: 2, typeKey: 'flood_alert', region: 'Northern Province', severityKey: 'high', hoursAgo: 4, status: 'Active', severityColor: '#DC2626' },
  { id: 3, typeKey: 'heavy_rainfall', region: 'Central Region', severityKey: 'moderate', hoursAgo: 6, status: 'Monitoring', severityColor: '#F59E0B' },
  { id: 4, typeKey: 'storm_watch', region: 'Southern District', severityKey: 'low', hoursAgo: 8, status: 'Resolved', severityColor: '#16A34A' },
  { id: 5, typeKey: 'wind_advisory', region: 'Western Region', severityKey: 'moderate', hoursAgo: 12, status: 'Active', severityColor: '#F59E0B' },
];

export function AlertsTable() {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">{t('recent_weather_alerts')}</h3>
        <button className="text-sm hover:underline" style={{ color: '#1E3A8A' }}>
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
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-900">{t(alert.typeKey)}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{alert.region}</td>
                <td className="py-3 px-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs text-white"
                    style={{ backgroundColor: alert.severityColor }}
                  >
                    {t(alert.severityKey)}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{alert.hoursAgo} {t('hours_ago')}</td>
                <td className="py-3 px-4">
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-xs ${
                      alert.status === 'Active' ? 'bg-green-100 text-green-700' :
                      alert.status === 'Monitoring' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {alert.status === 'Active' ? t('active') : alert.status === 'Monitoring' ? t('monitoring') : t('resolved')}
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
