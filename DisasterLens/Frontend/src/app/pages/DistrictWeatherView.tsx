import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type MetricValue = {
  value: number;
  unit: string;
};

type ExpandedData = Record<string, MetricValue | string | number>;

type DistrictWeather = {
  id: string;
  district: string;
  districtBn: string;
  division: string;
  divisionBn: string;
  lat: number;
  lng: number;
  requested_time_local: string;
  requested_time_utc: string;
  forecast_time_utc: string;
  forecast_time_local: string;
  forecast_timestamp: number;
  expanded_data: ExpandedData;
  riskLevel: 'high' | 'moderate' | 'low';
};

type DistrictIndexItem = {
  id: string;
  district: string;
  districtBn: string;
  division: string;
  divisionBn: string;
  lat: number;
  lng: number;
};

const fallbackDistricts: DistrictWeather[] = [
  {
    id: 'DW-1',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    division: 'Dhaka',
    divisionBn: 'ঢাকা',
    lat: 23.8103,
    lng: 90.4125,
    requested_time_local: '2026-03-29T13:00:00+06:00',
    requested_time_utc: '2026-03-29T07:00:00Z',
    forecast_time_utc: '2026-03-29T07:00:00Z',
    forecast_time_local: '2026-03-29T13:00:00+06:00',
    forecast_timestamp: 1774767600,
    expanded_data: {
      air_pressure_at_sea_level: { value: 1008.0, unit: 'hPa' },
      air_temperature: { value: 32.3, unit: 'celsius' },
      cloud_area_fraction: { value: 12.5, unit: '%' },
      relative_humidity: { value: 48.6, unit: '%' },
      wind_from_direction: { value: 166.9, unit: 'degrees' },
      wind_speed: { value: 2.9, unit: 'm/s' },
      next_1_hours_symbol_code: 'clearsky_day',
      next_1_hours_precipitation_amount: { value: 0.0, unit: 'mm' },
      next_6_hours_symbol_code: 'rainshowers_day',
      next_6_hours_precipitation_amount: { value: 4.3, unit: 'mm' },
      next_12_hours_symbol_code: 'lightrainshowers_day',
    },
    riskLevel: 'moderate',
  },
];

function asMetric(value: MetricValue | string | number | undefined): MetricValue | null {
  if (!value || typeof value !== 'object' || !('value' in value) || !('unit' in value)) {
    return null;
  }
  const numeric = Number((value as MetricValue).value);
  if (Number.isNaN(numeric)) {
    return null;
  }
  return { value: numeric, unit: String((value as MetricValue).unit) };
}

function formatMetric(value: MetricValue | string | number | undefined): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  const metric = asMetric(value);
  if (!metric) {
    return '-';
  }
  return `${metric.value} ${metric.unit}`;
}

export function DistrictWeatherView() {
  const { t, d } = useLanguage();
  const { token } = useAuth();
  const [districts, setDistricts] = useState<DistrictIndexItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictWeather | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingDistrict, setIsLoadingDistrict] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const indexPath = token ? '/authority/district-weather/index' : '/public/district-weather/index';
        const indexRows = await api.get<DistrictIndexItem[]>(indexPath, token);

        if (!indexRows.length) {
          setDistricts([]);
          setSelectedDistrict(null);
          return;
        }

        setDistricts(indexRows);

        const first = indexRows[0];
        const livePathBase = token ? '/authority/district-weather/live' : '/public/district-weather/live';
        const firstLive = await api.get<DistrictWeather>(
          `${livePathBase}?district=${encodeURIComponent(first.district)}`,
          token,
        );

        if (firstLive) {
          setSelectedDistrict(firstLive);
        }
      } catch (error) {
        console.error('Failed to load district weather', error);
        setDistricts(
          fallbackDistricts.map((row) => ({
            id: row.id,
            district: row.district,
            districtBn: row.districtBn,
            division: row.division,
            divisionBn: row.divisionBn,
            lat: row.lat,
            lng: row.lng,
          })),
        );
        setSelectedDistrict(fallbackDistricts[0]);
      }
    };

    void loadData();
  }, [token]);

  const expandedRows = useMemo(() => {
    if (!selectedDistrict) {
      return [] as Array<{ key: string; label: string }>;
    }
    return [
      { key: 'air_pressure_at_sea_level', label: 'Air Pressure At Sea Level' },
      { key: 'air_temperature', label: 'Air Temperature' },
      { key: 'cloud_area_fraction', label: 'Cloud Area Fraction' },
      { key: 'relative_humidity', label: 'Relative Humidity' },
      { key: 'wind_from_direction', label: 'Wind From Direction' },
      { key: 'wind_speed', label: 'Wind Speed' },
      { key: 'next_1_hours_symbol_code', label: 'Next 1 Hours Symbol Code' },
      { key: 'next_1_hours_precipitation_amount', label: 'Next 1 Hours Precipitation Amount' },
      { key: 'next_6_hours_symbol_code', label: 'Next 6 Hours Symbol Code' },
      { key: 'next_6_hours_precipitation_amount', label: 'Next 6 Hours Precipitation Amount' },
      { key: 'next_12_hours_symbol_code', label: 'Next 12 Hours Symbol Code' },
    ].filter((item) => selectedDistrict.expanded_data[item.key] !== undefined);
  }, [selectedDistrict]);

  const filteredDistricts = districts.filter((district) =>
    d(district.district, district.districtBn).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectDistrict = async (district: DistrictIndexItem) => {
    try {
      setIsLoadingDistrict(true);
      const livePathBase = token ? '/authority/district-weather/live' : '/public/district-weather/live';
      const live = await api.get<DistrictWeather>(
        `${livePathBase}?district=${encodeURIComponent(district.district)}`,
        token,
      );
      if (live) {
        setSelectedDistrict(live);
      }
      setSearchQuery('');
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to load live district weather', error);
    } finally {
      setIsLoadingDistrict(false);
    }
  };

  if (!selectedDistrict) {
    return <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]" />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('filter_by_district')}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search_select_district')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {showDropdown && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => void handleSelectDistrict(district)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{d(district.district, district.districtBn)}</p>
                        <p className="text-xs text-gray-500 mt-1">{d(district.division, district.divisionBn)} {t('division_suffix')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-600 font-medium">Live</p>
                        <p className="text-[11px] text-gray-500">MET API</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">{t('no_districts_found')}</div>
                )}
              </div>
            )}
          </div>

          {isLoadingDistrict && (
            <p className="mt-3 text-xs text-gray-500">Loading district weather from MET API...</p>
          )}

          {!searchQuery && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('selected_district')}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{d(selectedDistrict.district, selectedDistrict.districtBn)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d(selectedDistrict.division, selectedDistrict.divisionBn)} {t('division_suffix')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatMetric(selectedDistrict.expanded_data.air_temperature)}</p>
                    <p className="text-xs text-gray-500">{formatMetric(selectedDistrict.expanded_data.next_1_hours_precipitation_amount)}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedDistrict.riskLevel === 'high'
                        ? 'bg-red-100 text-red-700'
                        : selectedDistrict.riskLevel === 'moderate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {selectedDistrict.riskLevel === 'high'
                      ? t('high')
                      : selectedDistrict.riskLevel === 'moderate'
                        ? t('moderate')
                        : t('low')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{d(selectedDistrict.district, selectedDistrict.districtBn)} {t('district_suffix')}</h2>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                selectedDistrict.riskLevel === 'high'
                  ? 'bg-red-100 text-red-700'
                  : selectedDistrict.riskLevel === 'moderate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {selectedDistrict.riskLevel === 'high'
                ? t('high')
                : selectedDistrict.riskLevel === 'moderate'
                  ? t('moderate')
                  : t('low')} {t('warning_suffix')}
            </div>
          </div>
          <p className="text-gray-500 text-sm">{t('real_time_monitoring')}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expanded MET Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Field</th>
                  <th className="py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {expandedRows.map((row) => (
                  <tr key={row.key} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-2 pr-4 font-medium text-gray-700">{row.label}</td>
                    <td className="py-2 text-gray-900">{formatMetric(selectedDistrict.expanded_data[row.key])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
