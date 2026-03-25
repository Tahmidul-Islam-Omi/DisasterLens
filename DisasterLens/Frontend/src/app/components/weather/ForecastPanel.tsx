import { Cloud, CloudRain, Sun, CloudDrizzle, Cloudy } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const forecast = [
  { day: 'Mon', date: 'Mar 16', high: 28, low: 22, icon: Sun, condition: 'Sunny' },
  { day: 'Tue', date: 'Mar 17', high: 26, low: 21, icon: Cloudy, condition: 'Cloudy' },
  { day: 'Wed', date: 'Mar 18', high: 24, low: 20, icon: CloudDrizzle, condition: 'Light Rain' },
  { day: 'Thu', date: 'Mar 19', high: 23, low: 19, icon: CloudRain, condition: 'Rain' },
  { day: 'Fri', date: 'Mar 20', high: 25, low: 20, icon: Cloud, condition: 'Partly Cloudy' },
  { day: 'Sat', date: 'Mar 21', high: 27, low: 21, icon: Sun, condition: 'Sunny' },
  { day: 'Sun', date: 'Mar 22', high: 29, low: 23, icon: Sun, condition: 'Clear' },
];

export function ForecastPanel() {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-gray-900 mb-4">{t('weather.sevenDayForecast')}</h3>
      <div className="grid grid-cols-7 gap-3">
        {forecast.map((day, index) => {
          const Icon = day.icon;
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <p className="text-sm text-gray-900 mb-1">{day.day}</p>
              <p className="text-xs text-gray-500 mb-3">{day.date}</p>
              <div className="flex justify-center mb-3">
                <Icon className="w-8 h-8 text-sky-500" />
              </div>
              <p className="text-xs text-gray-600 mb-2">{day.condition}</p>
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
