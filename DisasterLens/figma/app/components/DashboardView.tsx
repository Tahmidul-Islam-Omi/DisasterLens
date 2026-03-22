import { Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { WeatherCard } from './WeatherCard';
import { WeatherMap } from './WeatherMap';
import { AlertsTable } from './AlertsTable';
import { ForecastPanel } from './ForecastPanel';
import { useTranslation } from 'react-i18next';

export function DashboardView() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 p-8">
      {/* Weather Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <WeatherCard
          title={t('current_temperature')}
          value="32"
          unit="°C"
          icon={Thermometer}
          trend={t('from_yesterday')}
          color="#0EA5E9"
        />
        <WeatherCard
          title={t('rainfall_level')}
          value="45"
          unit="mm"
          icon={Droplets}
          trend={t('heavy_rainfall_warning')}
          color="#1E3A8A"
        />
        <WeatherCard
          title={t('wind_speed')}
          value="28"
          unit="km/h"
          icon={Wind}
          trend={t('gusty_conditions')}
          color="#F59E0B"
        />
        <WeatherCard
          title={t('storm_risk_level')}
          value={t('high')}
          unit=""
          icon={AlertTriangle}
          trend={t('cyclone_approaching')}
          color="#DC2626"
        />
      </div>

      {/* Weather Map */}
      <div className="mb-6">
        <WeatherMap />
      </div>

      {/* Recent Alerts and Forecast */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <AlertsTable />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ForecastPanel />
      </div>
    </div>
  );
}
