import { useLanguage } from '../i18n/LanguageContext';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Users, Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { VolunteerCoverageMap, type CoveragePoint } from '../components/VolunteerCoverageMap';

type CoverageApiRow = {
  id: string;
  location_name: string;
  radius_km: number;
  submitted_at: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  meta?: {
    team_name?: string;
  };
};

export function VolunteerCoverageView() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [coverages, setCoverages] = useState<CoverageApiRow[]>([]);
  const [query, setQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [recenterSignal, setRecenterSignal] = useState(0);

  useEffect(() => {
    const loadCoverage = async () => {
      try {
        const data = await api.get<CoverageApiRow[]>('/volunteer/coverage-updates/latest?limit=200', token);
        setCoverages(data);
      } catch (error) {
        console.error('Failed to load volunteer coverage updates', error);
      }
    };
    void loadCoverage();
  }, []);

  const points = useMemo<CoveragePoint[]>(() => {
    return coverages
      .filter((row) => row.location?.coordinates?.length === 2)
      .map((row) => ({
        id: row.id,
        teamName: row.meta?.team_name || 'Volunteer Team',
        locationName: row.location_name,
        lng: row.location!.coordinates[0],
        lat: row.location!.coordinates[1],
        radiusKm: row.radius_km,
        submittedAt: row.submitted_at,
      }));
  }, [coverages]);

  const teamOptions = useMemo(() => {
    const teams = Array.from(new Set(points.map((point) => point.teamName))).sort();
    return teams;
  }, [points]);

  const filteredPoints = useMemo(() => {
    const term = query.trim().toLowerCase();
    return points.filter((point) => {
      const byTeam = teamFilter === 'all' || point.teamName === teamFilter;
      const byQuery =
        term.length === 0 ||
        point.teamName.toLowerCase().includes(term) ||
        point.locationName.toLowerCase().includes(term);
      return byTeam && byQuery;
    });
  }, [points, query, teamFilter]);

  const uniqueLocations = new Set(filteredPoints.map((point) => point.locationName)).size;
  const avgRadius = filteredPoints.length
    ? (filteredPoints.reduce((sum, point) => sum + point.radiusKm, 0) / filteredPoints.length).toFixed(1)
    : '0';

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
              <p className="text-2xl font-bold text-[#1E3A8A]">{filteredPoints.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('villages')}</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueLocations}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('coverage')}</p>
              <p className="text-2xl font-bold text-green-600">{avgRadius}km</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('relief_kits')}</p>
              <p className="text-2xl font-bold text-amber-600">{filteredPoints.length}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase text-gray-500">Filters</p>
            <div className="space-y-3">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search team or location"
                title="Search team or location"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
              />
              <select
                value={teamFilter}
                onChange={(event) => setTeamFilter(event.target.value)}
                title="Filter by team"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
              >
                <option value="all">All teams</option>
                {teamOptions.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              <button
                type="button"
                className="w-full rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                onClick={() => setRecenterSignal((value) => value + 1)}
              >
                Recenter to visible coverage
              </button>
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
              {filteredPoints.slice(0, 12).map((cov) => (
                <div key={`update-${cov.id}`} className="border-l-2 border-green-500 pl-3">
                  <p className="text-xs text-gray-500 mb-0.5">
                    {cov.teamName} • {cov.submittedAt ? new Date(cov.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('just_now')}
                  </p>
                  <p className="text-sm text-gray-800 font-medium">{t('coverage_radius_msg', { location: cov.locationName, radius: cov.radiusKm })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1">
          <VolunteerCoverageMap points={filteredPoints} recenterSignal={recenterSignal} />
        </div>

      </div>
    </div>
  );
}