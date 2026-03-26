import { useEffect, useMemo, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudDrizzle, Cloudy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type ForecastDay = {
  date: string;
  high: number;
  low: number;
  weatherCode: number;
};

interface ForecastPanelProps {
  latitude?: number;
  longitude?: number;
  locationLabel?: string;
}

const fallbackForecast: ForecastDay[] = [
  { date: '2026-03-23', high: 28, low: 22, weatherCode: 0 },
  { date: '2026-03-24', high: 26, low: 21, weatherCode: 3 },
  { date: '2026-03-25', high: 24, low: 20, weatherCode: 61 },
  { date: '2026-03-26', high: 23, low: 19, weatherCode: 63 },
  { date: '2026-03-27', high: 25, low: 20, weatherCode: 2 },
  { date: '2026-03-28', high: 27, low: 21, weatherCode: 1 },
  { date: '2026-03-29', high: 29, low: 23, weatherCode: 0 },
];

export function ForecastPanel({ latitude = 23.8103, longitude = 90.4125, locationLabel }: ForecastPanelProps) {
  const { t, bnenconvert } = useLanguage();
  const [forecast, setForecast] = useState<ForecastDay[]>(fallbackForecast);

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`,
        );
        const data = (await response.json()) as {
          daily?: {
            time?: string[];
            weather_code?: number[];
            temperature_2m_max?: number[];
            temperature_2m_min?: number[];
          };
        };

        const dates = data.daily?.time || [];
        const weatherCodes = data.daily?.weather_code || [];
        const highs = data.daily?.temperature_2m_max || [];
        const lows = data.daily?.temperature_2m_min || [];

        if (!dates.length || !highs.length || !lows.length) {
          setForecast(fallbackForecast);
          return;
        }

        const parsed: ForecastDay[] = dates.map((date, index) => ({
          date,
          high: Math.round(Number(highs[index] ?? 0)),
          low: Math.round(Number(lows[index] ?? 0)),
          weatherCode: Number(weatherCodes[index] ?? 0),
        }));

        setForecast(parsed);
      } catch (error) {
        console.error('Failed to load 7-day forecast', error);
        setForecast(fallbackForecast);
      }
    };

    void loadForecast();
  }, [latitude, longitude]);

  const dayKeyFromDate = (dateValue: string) => {
    const day = new Date(dateValue).getDay();
    const dayKeys = ['sun_day', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return dayKeys[day] || 'mon';
  };

  const dateLabel = (dateValue: string) => {
    const date = new Date(dateValue);
    return bnenconvert(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  };

  const iconForCode = (code: number) => {
    if ([0, 1].includes(code)) return Sun;
    if ([2].includes(code)) return Cloud;
    if ([3].includes(code)) return Cloudy;
    if ([51, 53, 55, 61, 80].includes(code)) return CloudDrizzle;
    return CloudRain;
  };

  const conditionKeyForCode = (code: number) => {
    if (code === 0) return 'clear_sky';
    if ([1].includes(code)) return 'sunny';
    if ([2].includes(code)) return 'partly_cloudy';
    if ([3].includes(code)) return 'cloudy';
    if ([51, 53, 55, 61, 80].includes(code)) return 'light_rain';
    return 'rainy';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-gray-900">{t('seven_day_forecast')}</h3>
        {locationLabel && <p className="text-xs text-gray-500 mt-1">{bnenconvert(locationLabel)}</p>}
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {forecast.map((day, index) => {
          const Icon = iconForCode(day.weatherCode);
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <p className="text-sm text-gray-900 mb-1">{t(dayKeyFromDate(day.date))}</p>
              <p className="text-xs text-gray-500 mb-3">{dateLabel(day.date)}</p>
              
              <div className="flex justify-center mb-3">
                <Icon className="w-8 h-8 text-sky-500" />
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{t(conditionKeyForCode(day.weatherCode))}</p>
              
              <div className="flex justify-center gap-2 text-sm">
                <span className="text-gray-900">{bnenconvert(`${day.high}°`)}</span>
                <span className="text-gray-400">{bnenconvert(`${day.low}°`)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
