import { Fragment, useEffect, useMemo, useState } from 'react';
import { Search, LocateFixed } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { divIcon } from 'leaflet';

type DivisionWeather = {
  division: string;
  divisionBn: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  next12SymbolCode: string;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  lat: number;
  lng: number;
};

type RiskPoint = {
  division: string;
  divisionBn: string;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  next12SymbolCode: string;
  lat: number;
  lng: number;
};

type LookupWeather = {
  label: string;
  lat: number;
  lng: number;
  temperature: number;
  rainfall: number;
  windSpeed: number;
  riskLevel: RiskPoint['riskLevel'];
};

const fallbackPoints: RiskPoint[] = [
  {
    division: 'Dhaka',
    divisionBn: 'ঢাকা',
    riskLevel: 'moderate',
    temperature: 32,
    humidity: 76,
    windSpeed: 28,
    windDirection: 145,
    next12SymbolCode: 'partlycloudy_day',
    lat: 23.8103,
    lng: 90.4125,
  },
  {
    division: 'Sylhet',
    divisionBn: 'সিলেট',
    riskLevel: 'high',
    temperature: 28,
    humidity: 84,
    windSpeed: 35,
    windDirection: 178,
    next12SymbolCode: 'rainshowers_day',
    lat: 24.8949,
    lng: 91.8687,
  },
];

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: true });
  return null;
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function WeatherMap() {
  const { t, d, bnenconvert } = useLanguage();
  const { token } = useAuth();
  const [points, setPoints] = useState<RiskPoint[]>(fallbackPoints);
  const [mapSearch, setMapSearch] = useState('');
  const [focusCenter, setFocusCenter] = useState<[number, number] | null>(null);
  const [selectedLookup, setSelectedLookup] = useState<LookupWeather | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await api.get<DivisionWeather[]>('/public/division-weather', token);
        const validPoints = rows
          .filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lng))
          .map((row) => ({
            division: row.division,
            divisionBn: row.divisionBn,
            riskLevel: row.riskLevel,
            temperature: Number(row.temperature ?? 0),
            humidity: Number(row.humidity ?? 0),
            windSpeed: Number(row.windSpeed ?? 0),
            windDirection: Number(row.windDirection ?? 0),
            next12SymbolCode: String(row.next12SymbolCode || 'fair_day'),
            lat: Number(row.lat),
            lng: Number(row.lng),
          }));

        setPoints(validPoints.length ? validPoints : fallbackPoints);
      } catch (error) {
        console.error('Failed to load weather map data', error);
        setPoints(fallbackPoints);
      }
    };

    void load();
  }, [token]);

  const center = useMemo<[number, number]>(() => {
    if (focusCenter) return focusCenter;
    if (!points.length) return [23.8103, 90.4125];
    const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
    const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
    return [lat, lng];
  }, [focusCenter, points]);

  const windDirectionToCardinal = (degrees: number) => {
    const normalized = ((degrees % 360) + 360) % 360;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(normalized / 45) % 8;
    return directions[index];
  };

  const weatherVisual = (symbolCode: string, temperature?: number) => {
    const code = (symbolCode || '').toLowerCase();

    if (code.includes('thunder')) return { icon: '⛈️', label: 'Thunder' };
    if (code.includes('heavyrain') || code.includes('rain')) return { icon: '🌧️', label: 'Rainy' };
    if (code.includes('snow') || code.includes('sleet')) return { icon: '🌨️', label: 'Snow/Sleet' };
    if (code.includes('cloudy') || code.includes('fog')) return { icon: '☁️', label: 'Cloudy' };
    if ((temperature ?? 0) >= 34) return { icon: '🌤️', label: 'Hot' };
    if (code.includes('clear') || code.includes('fair')) return { icon: '☀️', label: 'Fair' };
    return { icon: '🌥️', label: 'Mixed' };
  };

  const divisionMarkerIcon = (point: RiskPoint) => {
    const visual = weatherVisual(point.next12SymbolCode, point.temperature);
    return divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:#ffffff;box-shadow:0 6px 14px rgba(15,23,42,0.22);border:2px solid #1e3a8a;font-size:16px;">${visual.icon}</div>`,
      className: 'division-weather-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  const markerColor = (risk: RiskPoint['riskLevel']) => {
    if (risk === 'critical' || risk === 'high') return '#DC2626';
    if (risk === 'moderate') return '#F59E0B';
    return '#16A34A';
  };

  const riskLabel = (risk: RiskPoint['riskLevel']) => {
    if (risk === 'critical') return t('critical_high');
    if (risk === 'high') return t('high');
    if (risk === 'moderate') return t('moderate');
    return t('low');
  };

  const riskTextClass = (risk: RiskPoint['riskLevel']) => {
    if (risk === 'critical' || risk === 'high') return 'text-red-600';
    if (risk === 'moderate') return 'text-amber-600';
    return 'text-green-600';
  };

  const inferRisk = (rainfall: number, windSpeed: number): RiskPoint['riskLevel'] => {
    if (rainfall >= 80 || windSpeed >= 45) return 'high';
    if (rainfall >= 40 || windSpeed >= 28) return 'moderate';
    return 'low';
  };

  const lookupWeather = async (lat: number, lng: number, labelHint?: string) => {
    setIsLookupLoading(true);
    try {
      let label = labelHint || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      if (!labelHint) {
        try {
          const reverse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );
          const reverseData = (await reverse.json()) as { display_name?: string };
          if (reverseData.display_name) {
            label = reverseData.display_name;
          }
        } catch {
          // best-effort reverse geocode
        }
      }

      const forecast = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m&daily=precipitation_sum&forecast_days=1&timezone=auto`,
      );
      const data = (await forecast.json()) as {
        current?: { temperature_2m?: number; wind_speed_10m?: number };
        daily?: { precipitation_sum?: number[] };
      };

      const temperature = Number(data.current?.temperature_2m ?? 0);
      const windSpeed = Number(data.current?.wind_speed_10m ?? 0);
      const rainfall = Number(data.daily?.precipitation_sum?.[0] ?? 0);
      const riskLevel = inferRisk(rainfall, windSpeed);

      setSelectedLookup({
        label,
        lat,
        lng,
        temperature,
        rainfall,
        windSpeed,
        riskLevel,
      });
      setFocusCenter([lat, lng]);
    } catch (error) {
      console.error('Weather lookup failed', error);
      toast.error('Failed to fetch weather for selected location');
    } finally {
      setIsLookupLoading(false);
    }
  };

  const handleSearch = async () => {
    const query = mapSearch.trim();
    if (!query) {
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
      );
      const data = (await response.json()) as Array<{ lat: string; lon: string; display_name?: string }>;
      if (!data.length) {
        toast.error('Location not found');
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      await lookupWeather(lat, lng, data[0].display_name);
    } catch (error) {
      console.error('Location search failed', error);
      toast.error('Failed to search location');
    }
  };

  const handleGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void lookupWeather(position.coords.latitude, position.coords.longitude, 'Current location');
      },
      () => {
        toast.error('Unable to access your GPS location');
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-gray-900">{t('weather_conditions_risk_zones')}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white">
            <input
              type="text"
              value={mapSearch}
              onChange={(event) => setMapSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void handleSearch();
                }
              }}
              className="w-64 px-3 py-2 text-sm outline-none"
              placeholder={t('search_location')}
              title="Search location"
            />
            <button
              type="button"
              onClick={() => void handleSearch()}
              className="border-l border-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-50"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleGps}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
            title="Use GPS"
            aria-label="Use GPS"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedLookup && (
        <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
          <p className="font-medium text-gray-900">{bnenconvert(selectedLookup.label)}</p>
          <p className="text-xs text-gray-600 mt-1">
            {t('latitude')}: {bnenconvert(selectedLookup.lat.toFixed(4))}, {t('longitude')}: {bnenconvert(selectedLookup.lng.toFixed(4))}
          </p>
          <p className="text-xs text-gray-700 mt-1">
            {t('temperature')}: {bnenconvert(selectedLookup.temperature.toFixed(1))}°C, {t('rainfall_level')}: {bnenconvert(selectedLookup.rainfall.toFixed(1))}mm, {t('wind_speed')}: {bnenconvert(selectedLookup.windSpeed.toFixed(1))} km/h
          </p>
          <p className={`text-xs font-semibold mt-1 ${riskTextClass(selectedLookup.riskLevel)}`}>
            {riskLabel(selectedLookup.riskLevel)}
          </p>
        </div>
      )}

      {isLookupLoading && (
        <p className="mb-3 text-xs text-gray-500">Loading weather data for selected location...</p>
      )}

      <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer center={center} zoom={7} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToCenter center={center} />
          <MapClickHandler onPick={(lat, lng) => void lookupWeather(lat, lng)} />

          {points.map((point) => {
            const color = markerColor(point.riskLevel);
            return (
              <Fragment key={`${point.division}-${point.lat}-${point.lng}`}>
                <Marker
                  position={[point.lat, point.lng]}
                  icon={divisionMarkerIcon(point)}
                >
                  <Tooltip direction="top" offset={[0, -14]} opacity={1} className="!bg-transparent !border-none !shadow-none">
                    <div className="pointer-events-none w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-indigo-100 bg-gradient-to-br from-white/95 via-indigo-50/95 to-sky-50/95 px-4 py-3 text-sm shadow-lg backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-indigo-500">Division Weather</p>
                          <p className="font-semibold text-gray-900">{d(point.division, point.divisionBn)}</p>
                        </div>
                        <div className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-lg leading-none">
                          {weatherVisual(point.next12SymbolCode, point.temperature).icon}
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-700">
                        <p><span className="font-medium">{t('temperature')}:</span> {bnenconvert(point.temperature.toFixed(1))}°C</p>
                        <p><span className="font-medium">Humidity:</span> {bnenconvert(point.humidity.toFixed(0))}%</p>
                        <p><span className="font-medium">{t('wind_speed')}:</span> {bnenconvert(point.windSpeed.toFixed(1))} km/h</p>
                        <p><span className="font-medium">Wind Dir:</span> {bnenconvert(point.windDirection.toFixed(0))}° ({windDirectionToCardinal(point.windDirection)})</p>
                      </div>
                      <p className="mt-2 text-xs text-indigo-700">
                        <span className="font-medium">Next 12h:</span> {weatherVisual(point.next12SymbolCode, point.temperature).label} ({point.next12SymbolCode})
                      </p>
                    </div>
                  </Tooltip>
                </Marker>

                <CircleMarker
                  center={[point.lat, point.lng]}
                  radius={9}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.85 }}
                >
                  <Popup>
                    <div className="text-sm min-w-44">
                      <p className="font-semibold text-gray-900">{d(point.division, point.divisionBn)}</p>
                      <p className="text-xs text-gray-700 mt-1">{t('temperature')}: {bnenconvert(point.temperature)}°C</p>
                      <p className="text-xs text-gray-700">Humidity: {bnenconvert(point.humidity)}%</p>
                      <p className="text-xs text-gray-700">{t('wind_speed')}: {bnenconvert(point.windSpeed)} km/h</p>
                      <p className="text-xs text-gray-700">Wind Dir: {bnenconvert(point.windDirection)}° ({windDirectionToCardinal(point.windDirection)})</p>
                      <p className="text-xs text-gray-700">Next 12h: {point.next12SymbolCode}</p>
                      <p className={`text-xs font-semibold mt-2 ${riskTextClass(point.riskLevel)}`}>{riskLabel(point.riskLevel)}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </Fragment>
            );
          })}

          {selectedLookup && (
            <CircleMarker
              center={[selectedLookup.lat, selectedLookup.lng]}
              radius={7}
              pathOptions={{ color: '#1E3A8A', fillColor: '#1E3A8A', fillOpacity: 0.85 }}
            >
              <Popup>
                <div className="text-sm min-w-44">
                  <p className="font-semibold text-gray-900">Selected location</p>
                    <p className="text-xs text-gray-700 mt-1">{t('latitude')}: {bnenconvert(selectedLookup.lat.toFixed(4))}</p>
                    <p className="text-xs text-gray-700">{t('longitude')}: {bnenconvert(selectedLookup.lng.toFixed(4))}</p>
                    <p className="text-xs text-gray-700 mt-1">{t('temperature')}: {bnenconvert(selectedLookup.temperature.toFixed(1))}°C</p>
                    <p className="text-xs text-gray-700">{t('rainfall_level')}: {bnenconvert(selectedLookup.rainfall.toFixed(1))}mm</p>
                    <p className="text-xs text-gray-700">{t('wind_speed')}: {bnenconvert(selectedLookup.windSpeed.toFixed(1))} km/h</p>
                </div>
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[500]">
          <p className="text-xs text-gray-900 mb-2">{t('risk_levels')}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-xs text-gray-700">{t('critical_high')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-700">{t('moderate')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-xs text-gray-700">{t('low')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
