import { Cloud, CloudRain, Sun, CloudDrizzle, Cloudy, CloudSnow, Wind } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const forecast = [
  { dayKey: 'mon', date: 'Mar 16', high: 28, low: 22, icon: Sun, conditionKey: 'sunny' },
  { dayKey: 'tue', date: 'Mar 17', high: 26, low: 21, icon: Cloudy, conditionKey: 'cloudy' },
  { dayKey: 'wed', date: 'Mar 18', high: 24, low: 20, icon: CloudDrizzle, conditionKey: 'light_rain' },
  { dayKey: 'thu', date: 'Mar 19', high: 23, low: 19, icon: CloudRain, conditionKey: 'rainy' },
  { dayKey: 'fri', date: 'Mar 20', high: 25, low: 20, icon: Cloud, conditionKey: 'partly_cloudy' },
  { dayKey: 'sat', date: 'Mar 21', high: 27, low: 21, icon: Sun, conditionKey: 'sunny' },
  { dayKey: 'sun_day', date: 'Mar 22', high: 29, low: 23, icon: Sun, conditionKey: 'clear_sky' },
];

export function ForecastPanel() {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-gray-900 mb-4">{t('seven_day_forecast')}</h3>
      
      <div className="grid grid-cols-7 gap-3">
        {forecast.map((day, index) => {
          const Icon = day.icon;
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <p className="text-sm text-gray-900 mb-1">{t(day.dayKey)}</p>
              <p className="text-xs text-gray-500 mb-3">{day.date}</p>
              
              <div className="flex justify-center mb-3">
                <Icon className="w-8 h-8" style={{ color: '#0EA5E9' }} />
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{t(day.conditionKey)}</p>
              
              <div className="flex justify-center gap-2 text-sm">
                <span className="text-gray-900">{day.high}°</span>
                <span className="text-gray-400">{day.low}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
