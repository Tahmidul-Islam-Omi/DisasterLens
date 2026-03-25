import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { 
  Users, MapPin, Activity, Search
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { api } from '../../api/client';

interface CoverageUpdate {
  id: string;
  coverage_update_code: string;
  location_name: string;
  radius_km: number;
  submitted_at: string;
  status_note?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  meta?: {
    team_code?: string;
    team_name?: string;
  };
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function VolunteerCoverageView() {
  const { t } = useTranslation();
  const [coverageUpdates, setCoverageUpdates] = useState<CoverageUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [manualCenter, setManualCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    const loadCoverage = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.volunteer.latestCoverageUpdates(200);
        setCoverageUpdates(res?.data || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load volunteer coverage updates.');
      } finally {
        setLoading(false);
      }
    };

    loadCoverage();
  }, []);

  const validPoints = coverageUpdates.filter(
    (item) => item.location?.coordinates?.length === 2
  );

  const latestPoint = validPoints[0]?.location?.coordinates;
  const fallbackCenter: [number, number] = latestPoint
    ? [latestPoint[1], latestPoint[0]]
    : [24.8949, 91.8687];
  const center: [number, number] = manualCenter || fallbackCenter;

  const uniqueTeams = new Set(validPoints.map((item) => item.meta?.team_code || item.meta?.team_name || 'unknown'));
  const uniqueLocations = new Set(validPoints.map((item) => item.location_name));
  const avgRadius = validPoints.length
    ? (validPoints.reduce((acc, item) => acc + Number(item.radius_km || 0), 0) / validPoints.length).toFixed(1)
    : '0.0';

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a location to search.');
      return;
    }

    try {
      setSearching(true);
      setError('');
      const query = encodeURIComponent(`${searchQuery}, Bangladesh`);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}&limit=1`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError('No matching location found.');
        return;
      }

      const lat = Number(data[0].lat);
      const lng = Number(data[0].lon);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        setError('Invalid location result.');
        return;
      }

      setManualCenter([lat, lng]);
    } catch {
      setError('Unable to search location right now.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#1E3A8A]" />
              {t('volunteer_coverage_title')}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t('volunteer_coverage_desc')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-6 gap-6">
        
        {/* Analytics Side Panel */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto shrink-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('active_teams')}</p>
              <p className="text-2xl font-bold text-[#1E3A8A]">{uniqueTeams.size}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('villages')}</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueLocations.size}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('coverage')}</p>
              <p className="text-2xl font-bold text-green-600">{avgRadius} km</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('relief_kits')}</p>
              <p className="text-2xl font-bold text-amber-600">{validPoints.length}</p>
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                {t('live_updates')}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? <p className="text-sm text-gray-500">Loading updates...</p> : null}
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {!loading && !error && validPoints.length === 0 ? (
                <p className="text-sm text-gray-500">No coverage updates found yet.</p>
              ) : null}
              {validPoints.map((cov) => (
                <div key={`update-${cov.id}`} className="border-l-2 border-green-500 pl-3">
                  <p className="text-xs text-gray-500 mb-0.5">
                    {cov.meta?.team_name || cov.meta?.team_code || 'Volunteer Team'} • {new Date(cov.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {cov.location_name} ({cov.radius_km} km radius)
                  </p>
                  {cov.status_note ? <p className="text-xs text-gray-500 mt-0.5">{cov.status_note}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-1000 pointer-events-auto flex flex-col gap-2 w-105 max-w-[calc(100%-2rem)]">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 flex overflow-hidden">
              <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-r border-gray-200">{t('coverage_map')}</button>
              <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 text-gray-600">{t('relief_points')}</button>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchLocation();
                  }
                }}
                className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                placeholder="Search location (e.g. Shahbag, Dhaka)"
              />
              <button
                type="button"
                onClick={handleSearchLocation}
                disabled={searching}
                className="px-3 py-2 text-sm rounded-md bg-[#1E3A8A] text-white hover:bg-blue-900 disabled:opacity-60 inline-flex items-center gap-1"
              >
                <Search className="w-4 h-4" /> {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-1000 pointer-events-auto">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-50"></div>
                <span className="text-xs font-medium text-gray-700">{t('covered_area')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-20"></div>
                <span className="text-xs font-medium text-gray-700">{t('uncovered_target')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">{t('volunteer_unit')}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-full">
            <MapContainer center={center} zoom={10} className="h-full w-full" scrollWheelZoom>
              <RecenterMap center={center} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {validPoints.map((cov) => {
                const coords = cov.location!.coordinates;
                const lat = coords[1];
                const lng = coords[0];
                return (
                  <React.Fragment key={`map-${cov.id}`}>
                    <Circle
                      center={[lat, lng]}
                      radius={Number(cov.radius_km || 0) * 1000}
                      pathOptions={{ color: '#22C55E', fillColor: '#22C55E', fillOpacity: 0.18 }}
                    />
                    <CircleMarker
                      center={[lat, lng]}
                      radius={7}
                      pathOptions={{ color: '#1D4ED8', fillColor: '#2563EB', fillOpacity: 0.95 }}
                    >
                      <Popup>
                        <div className="text-xs">
                          <p><strong>{cov.meta?.team_name || cov.meta?.team_code || 'Volunteer Team'}</strong></p>
                          <p>{cov.location_name}</p>
                          <p>Radius: {cov.radius_km} km</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>
        </div>

      </div>
    </div>
  );
}