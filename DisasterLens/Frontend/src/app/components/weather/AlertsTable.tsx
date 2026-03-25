import { useLanguage } from '../../i18n/LanguageContext';

const weatherAlerts = [
  { id: 1, type: 'Cyclone Warning', region: 'Eastern Coast', severity: 'Critical', time: '2 hours ago', status: 'Active', severityColor: '#DC2626' },
  { id: 2, type: 'Flood Alert', region: 'Northern Province', severity: 'High', time: '4 hours ago', status: 'Active', severityColor: '#DC2626' },
  { id: 3, type: 'Heavy Rainfall', region: 'Central Region', severity: 'Moderate', time: '6 hours ago', status: 'Monitoring', severityColor: '#F59E0B' },
  { id: 4, type: 'Storm Watch', region: 'Southern District', severity: 'Low', time: '8 hours ago', status: 'Resolved', severityColor: '#16A34A' },
  { id: 5, type: 'Wind Advisory', region: 'Western Region', severity: 'Moderate', time: '12 hours ago', status: 'Active', severityColor: '#F59E0B' },
];

export function AlertsTable() {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">{t('weather.recentAlerts')}</h3>
        <button className="text-sm text-blue-900 hover:underline">{t('common.viewAll')}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('weather.alertType')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('weather.affectedRegion')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('common.severity')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('weather.timeIssued')}</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">{t('common.status')}</th>
            </tr>
          </thead>
          <tbody>
            {weatherAlerts.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-900">{alert.type}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{alert.region}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: alert.severityColor }}>
                    {alert.severity}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{alert.time}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                    alert.status === 'Active' ? 'bg-green-100 text-green-700' :
                    alert.status === 'Monitoring' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {alert.status === 'Active' ? t('status.active') : alert.status === 'Monitoring' ? t('weather.monitoring') : t('weather.resolved')}
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
