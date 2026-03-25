import { Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { WeatherCard } from '../../components/weather/WeatherCard';
import { WeatherMap } from '../../components/weather/WeatherMap';
import { AlertsTable } from '../../components/weather/AlertsTable';
import { ForecastPanel } from '../../components/weather/ForecastPanel';
import { useLanguage } from '../../i18n/LanguageContext';

export default function WeatherDashboardView() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <WeatherCard title={t('weather.currentTemperature')} value="32" unit="°C" icon={Thermometer} trend={t('weather.fromYesterday')} color="#0EA5E9" />
        <WeatherCard title={t('weather.rainfallLevel')} value="45" unit="mm" icon={Droplets} trend={t('weather.heavyRainfallWarning')} color="#1E3A8A" />
        <WeatherCard title={t('weather.windSpeed')} value="28" unit="km/h" icon={Wind} trend={t('weather.gustyConditions')} color="#F59E0B" />
        <WeatherCard title={t('weather.stormRiskLevel')} value={t('priority.high')} unit="" icon={AlertTriangle} trend={t('weather.cycloneApproaching')} color="#DC2626" />
      </div>
      <div className="mb-6"><WeatherMap /></div>
      <div className="grid grid-cols-1 gap-6 mb-6"><AlertsTable /></div>
      <div className="grid grid-cols-1 gap-6"><ForecastPanel /></div>
    </div>
  );
}
