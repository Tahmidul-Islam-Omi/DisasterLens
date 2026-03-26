import { useEffect, useMemo, useState } from 'react';
import { Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { WeatherCard } from '../components/WeatherCard';
import { WeatherMap } from '../components/WeatherMap';
import { AlertsTable } from '../components/AlertsTable';
import { ForecastPanel } from '../components/ForecastPanel';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { DistrictWeather, WeatherAlert } from '../types';

export function DashboardView() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [districts, setDistricts] = useState<DistrictWeather[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[] | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [districtRes, alertsRes] = await Promise.allSettled([
          api.get<DistrictWeather[]>('/authority/district-weather', token),
          api.get<WeatherAlert[]>('/authority/weather-alerts', token),
        ]);

        if (districtRes.status === 'fulfilled') {
          setDistricts(districtRes.value);
        }
        if (alertsRes.status === 'fulfilled') {
          setAlerts(alertsRes.value);
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };

    void loadDashboardData();
  }, [token]);

  const metrics = useMemo(() => {
    if (!districts.length) {
      return {
        temperature: '32',
        rainfall: '45',
        windSpeed: '28',
        riskLabel: t('high'),
      };
    }

    const avgTemperature = Math.round(districts.reduce((sum, row) => sum + row.temperature, 0) / districts.length);
    const avgRainfall = Math.round(districts.reduce((sum, row) => sum + row.rainfall, 0) / districts.length);
    const avgWind = Math.round(districts.reduce((sum, row) => sum + row.windSpeed, 0) / districts.length);

    const rank: Record<string, number> = { low: 1, moderate: 2, high: 3, critical: 4 };
    const highestRisk = districts.reduce((best, row) => {
      const current = row.riskLevel || 'low';
      return rank[current] > rank[best] ? current : best;
    }, 'low');

    const riskLabel = highestRisk === 'critical'
      ? t('critical')
      : highestRisk === 'high'
      ? t('high')
      : highestRisk === 'moderate'
      ? t('moderate')
      : t('low');

    return {
      temperature: String(avgTemperature),
      rainfall: String(avgRainfall),
      windSpeed: String(avgWind),
      riskLabel,
    };
  }, [districts, t]);

  return (
    <div className="flex-1 p-8">
      {/* Weather Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <WeatherCard
          title={t('current_temperature')}
          value={metrics.temperature}
          unit="°C"
          icon={Thermometer}
          trend={t('from_yesterday')}
          color="#0EA5E9"
        />
        <WeatherCard
          title={t('rainfall_level')}
          value={metrics.rainfall}
          unit="mm"
          icon={Droplets}
          trend={t('heavy_rainfall_warning')}
          color="#1E3A8A"
        />
        <WeatherCard
          title={t('wind_speed')}
          value={metrics.windSpeed}
          unit="km/h"
          icon={Wind}
          trend={t('gusty_conditions')}
          color="#F59E0B"
        />
        <WeatherCard
          title={t('storm_risk_level')}
          value={metrics.riskLabel}
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
        <AlertsTable alerts={alerts} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ForecastPanel />
      </div>
    </div>
  );
}
