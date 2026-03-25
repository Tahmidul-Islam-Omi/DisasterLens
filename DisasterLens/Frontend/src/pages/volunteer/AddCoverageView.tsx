import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, Crosshair, MapPin, Radar, Save, Search } from 'lucide-react';
import { MapContainer, TileLayer, Circle, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { api } from '../../api/client';

type ClickSelectorProps = {
  onPick: (lat: number, lng: number) => void;
};

function MapClickSelector({ onPick }: ClickSelectorProps) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

type RecenterProps = {
  center: [number, number];
};

function RecenterMap({ center }: RecenterProps) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function AddCoverageView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [location, setLocation] = useState('Sylhet Sadar, Sector 4');
  const [radius, setRadius] = useState<number>(2);
  const [latitude, setLatitude] = useState<number>(24.8949);
  const [longitude, setLongitude] = useState<number>(91.8687);
  const [usedGps, setUsedGps] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [error, setError] = useState('');

  const center = useMemo<[number, number]>(() => [latitude, longitude], [latitude, longitude]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      const label = data?.display_name;
      if (label) setLocation(label);
    } catch {
      // Keep coordinate selection functional even if reverse lookup fails.
    }
  };

  const searchLocation = async () => {
    if (!location.trim()) {
      setError('Please enter a location to search.');
      return;
    }

    setSearchingLocation(true);
    setError('');

    try {
      const query = encodeURIComponent(`${location}, Bangladesh`);
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}&limit=1`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Location search failed.');
      }

      const results = await response.json();
      if (!Array.isArray(results) || results.length === 0) {
        throw new Error('No matching location found.');
      }

      const first = results[0];
      const lat = Number(first.lat);
      const lng = Number(first.lon);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        throw new Error('Invalid location coordinates from search result.');
      }

      setLatitude(lat);
      setLongitude(lng);
      setUsedGps(false);
    } catch (err: any) {
      setError(err?.message || 'Unable to search location right now.');
    } finally {
      setSearchingLocation(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    setDetectingGps(true);
    setError('');

    const onSuccess = async (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLatitude(lat);
      setLongitude(lng);
      setUsedGps(true);
      await reverseGeocode(lat, lng);
      setDetectingGps(false);
    };

    const onError = (geoError: GeolocationPositionError) => {
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setError('Location permission denied. Please allow browser location access and try again.');
      } else if (geoError.code === geoError.TIMEOUT) {
        setError('GPS timeout. Try again in open sky or enter/search location manually.');
      } else {
        setError('Unable to detect your location. You can still search location or click on map.');
      }
      setDetectingGps(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  };

  const handleMapPick = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setUsedGps(false);
    setError('');
    await reverseGeocode(lat, lng);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setError('');

    try {
      await api.volunteer.createCoverageUpdate({
        team_code: 'TEAM-ALPHA',
        team_name: t('team_alpha_you'),
        location_name: location,
        radius_km: radius,
        latitude,
        longitude,
        used_gps: usedGps,
        status_note: 'Coverage submitted from volunteer entry page',
        source: 'web',
      });

      setStatus('success');
      setTimeout(() => navigate('/volunteer-coverage'), 900);
    } catch (err: any) {
      setStatus('idle');
      setError(err?.message || 'Failed to save coverage update.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Radar className="w-6 h-6 text-[#1E3A8A]" />
            {t('update_coverage_area')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t('coverage_desc')}</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            
            {/* Location Field */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900">{t('current_location')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="pl-10 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1E3A8A] focus:border-[#1E3A8A] block p-2.5"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      searchLocation();
                    }
                  }}
                  placeholder="e.g. Sunamganj Sector 3"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={searchLocation}
                  disabled={searchingLocation}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60 inline-flex items-center gap-1"
                >
                  <Search className="w-3 h-3" /> {searchingLocation ? 'Searching...' : 'Search on map'}
                </button>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={detectingGps}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60 inline-flex items-center gap-1"
                >
                  <Crosshair className="w-3 h-3" /> {detectingGps ? 'Detecting GPS...' : t('use_gps')}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
              </p>
              <p className="text-xs text-gray-500">Tip: click anywhere on the map to select coordinates.</p>
            </div>

            {/* Radius Field */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900">{t('operational_radius')}</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  aria-label="Operational radius in kilometers"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E3A8A]"
                />
                <div className="w-20 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-center font-bold text-gray-900">
                  {radius} km
                </div>
              </div>
              <p className="text-xs text-gray-500">{t('radius_help')}</p>
            </div>

            {/* Map Preview */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Radar className="w-4 h-4 text-gray-400" /> {t('coverage_preview')}
              </label>
              <div className="h-48 bg-blue-50/50 rounded-lg border border-gray-200 relative overflow-hidden flex items-center justify-center">
                <MapContainer center={center} zoom={11} className="h-full w-full" scrollWheelZoom>
                  <RecenterMap center={center} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickSelector onPick={handleMapPick} />
                  <Circle center={center} radius={radius * 1000} pathOptions={{ color: '#16A34A', fillColor: '#22C55E', fillOpacity: 0.2 }} />
                  <CircleMarker center={center} radius={7} pathOptions={{ color: '#1D4ED8', fillColor: '#2563EB', fillOpacity: 0.95 }} />
                </MapContainer>
              </div>
            </div>

          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>{error || t('coverage_shared')}</span>
            </div>
            
            <button
              type="submit"
              disabled={status !== 'idle'}
              className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {status === 'idle' && <><Save className="w-4 h-4" /> {t('save_coverage')}</>}
              {status === 'saving' && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {status === 'success' && <><CheckCircle className="w-4 h-4" /> {t('saved_successfully')}</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}