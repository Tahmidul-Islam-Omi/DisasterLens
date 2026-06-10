import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Users,
  Car,
  Home,
  ShieldAlert,
  MapPin,
  Layers,
  Thermometer,
  CloudLightning,
  Mountain,
  Zap,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { WeatherCard } from '../components/WeatherCard';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type RiskPoint = {
  id: string;
  name: string;
  type: string;
  hazard: string;
  severity: 'High' | 'Medium' | 'Low' | string;
  status: string;
  population: string;
  lat: number;
  lng: number;
  impactScore?: number | null;
  river?: string | null;
  basin?: string | null;
  dangerLevel?: number | null;
  rhwl?: number | null;
  pmdl?: number | null;
  division?: string | null;
  district?: string | null;
  upazilla?: string | null;
  union?: string | null;
  dateOfRhwl?: string | null;
};

type RiskResponse = {
  metrics: {
    exposedInfra: number;
    highRiskAreas: number;
    affectedPopulation: number;
    damagedRoads: number;
    shelterCapacity: number;
    dangerLevel: string;
  };
  points: RiskPoint[];
  priorityAreas: RiskPoint[];
};

const fallbackData: RiskResponse = {
  metrics: {
    exposedInfra: 0,
    highRiskAreas: 0,
    affectedPopulation: 0,
    damagedRoads: 0,
    shelterCapacity: 0,
    dangerLevel: 'warning',
  },
  points: [],
  priorityAreas: [],
};

export function GeospatialRiskDashboardView() {
  const { t, bnenconvert } = useLanguage();
  const { token } = useAuth();
  const [data, setData] = useState<RiskResponse>(fallbackData);
  const [hoveredPoint, setHoveredPoint] = useState<RiskPoint | null>(null);
  const infoPanelRef = useRef<HTMLDivElement | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    flood: true,
    cyclone: true,
    landslide: true,
    stationHeatmap: true,
    stationMarkers: true,
    hospitals: true,
    shelters: true,
    schools: true,
    power: true,
    roads: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.get<RiskResponse>('/authority/geospatial-risk', token);
        setData(result);
      } catch (error) {
        console.error('Failed to load geospatial risk data', error);
      }
    };

    void load();
  }, [token]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!hoveredPoint) return;

      const panel = infoPanelRef.current;
      const target = event.target as Node | null;
      if (!panel || !target) return;

      if (!panel.contains(target)) {
        setHoveredPoint(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [hoveredPoint]);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const shouldShowByHazard = (hazard: string) => {
    const normalized = hazard.toLowerCase();
    if (normalized.includes('flood')) return activeLayers.flood;
    if (normalized.includes('cyclone') || normalized.includes('storm')) return activeLayers.cyclone;
    if (normalized.includes('landslide')) return activeLayers.landslide;
    return true;
  };

  const shouldShowByType = (type: string) => {
    const normalized = type.toLowerCase();
    if (normalized.includes('hospital') || normalized.includes('clinic')) return activeLayers.hospitals;
    if (normalized.includes('shelter')) return activeLayers.shelters;
    if (normalized.includes('school')) return activeLayers.schools;
    if (normalized.includes('power') || normalized.includes('grid') || normalized.includes('electric')) return activeLayers.power;
    if (normalized.includes('road') || normalized.includes('bridge')) return activeLayers.roads;
    return true;
  };

  const visiblePoints = useMemo(() => {
    return data.points.filter((point) => shouldShowByHazard(point.hazard) && shouldShowByType(point.type));
  }, [data.points, activeLayers]);

  const stationPoints = useMemo(() => {
    return visiblePoints.filter((point) => String(point.type).toLowerCase().includes('station'));
  }, [visiblePoints]);

  const center = useMemo<[number, number]>(() => {
    if (!visiblePoints.length) return [23.8103, 90.4125];
    const lat = visiblePoints.reduce((sum, row) => sum + row.lat, 0) / visiblePoints.length;
    const lng = visiblePoints.reduce((sum, row) => sum + row.lng, 0) / visiblePoints.length;
    return [lat, lng];
  }, [visiblePoints]);

  const markerColor = (severity: string) => {
    const value = severity.toLowerCase();
    if (value === 'high') return '#DC2626';
    if (value === 'medium') return '#F59E0B';
    return '#EAB308';
  };

  const heatPointColor = (point: RiskPoint) => {
    const bySeverity = markerColor(point.severity);
    const score = typeof point.impactScore === 'number' ? point.impactScore : null;
    if (score === null) return bySeverity;
    if (score >= 0.67) return '#DC2626';
    if (score >= 0.34) return '#F59E0B';
    return '#EAB308';
  };

  const heatRadius = (point: RiskPoint) => {
    const score = typeof point.impactScore === 'number' ? point.impactScore : 0.2;
    return 18 + Math.round(score * 22);
  };

  const dangerLabel = String(data.metrics.dangerLevel || 'warning').toUpperCase();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="p-6 pb-2 shrink-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('geospatial_risk_dashboard')}</h1>
            <p className="text-gray-500">{t('live_disaster_intelligence')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-red-600">{t('live_updating')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <WeatherCard title={t('exposed_infra')} value={String(data.metrics.exposedInfra)} unit="" icon={Building2} color="#DC2626" />
          <WeatherCard title={t('high_risk_areas')} value={String(data.metrics.highRiskAreas)} unit="" icon={AlertTriangle} color="#DC2626" />
          <WeatherCard title={t('affected_pop')} value={String(data.metrics.affectedPopulation)} unit="" icon={Users} color="#F59E0B" />
          <WeatherCard title={t('damaged_roads')} value={String(data.metrics.damagedRoads)} unit="" icon={Car} color="#F59E0B" />
          <WeatherCard title={t('shelter_capacity')} value={String(data.metrics.shelterCapacity)} unit="%" icon={Home} color="#10B981" />
          <WeatherCard title={t('danger_level')} value={dangerLabel} unit="" icon={ShieldAlert} color="#DC2626" />
        </div>
      </div>

      <div className="flex-1 p-6 pt-2 flex gap-6 min-h-[600px] overflow-hidden">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">
          <div className="h-full w-full">
            <MapContainer center={center} zoom={7} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {activeLayers.stationHeatmap && stationPoints.map((point) => {
                const color = heatPointColor(point);
                return (
                  <CircleMarker
                    key={`heat-${point.id}`}
                    center={[point.lat, point.lng]}
                    radius={heatRadius(point)}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.22,
                      opacity: 0.18,
                      weight: 1,
                    }}
                  />
                );
              })}

              {(activeLayers.stationMarkers ? visiblePoints : visiblePoints.filter((point) => !String(point.type).toLowerCase().includes('station'))).map((point) => {
                const color = markerColor(point.severity);
                const isStation = String(point.type).toLowerCase().includes('station');
                return (
                  <CircleMarker
                    key={point.id}
                    center={[point.lat, point.lng]}
                    radius={isStation ? 6 : 8}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
                    eventHandlers={{
                      mouseover: () => setHoveredPoint(point),
                      click: () => setHoveredPoint(point),
                    }}
                  />
                );
              })}
            </MapContainer>
          </div>

          <div ref={infoPanelRef} className="absolute top-4 right-4 z-[1200] w-[22rem] max-w-[calc(100%-2rem)] rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white/95 via-slate-50/95 to-blue-50/90 p-4 shadow-xl backdrop-blur-md">
            {!hoveredPoint ? (
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Station Insight</p>
                <h4 className="mt-1 text-sm font-semibold text-slate-900">Hover a map point</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Move your cursor over any station or hotspot to see live risk details.
                </p>
              </div>
            ) : (
              <HoverInfoCard point={hoveredPoint} />
            )}
          </div>

          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-gray-100 p-4 z-20 w-48">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">{t('map_legend')}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">{t('critical_risk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-600">{t('high_risk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-600">{t('moderate_risk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500"></div>
                <span className="text-xs text-gray-600">Station heatmap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500"></div>
                <span className="text-xs text-gray-600">{t('flood_zone')}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-white/95 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700">
            <span className="font-semibold">{t('high_risk_areas')}:</span> {bnenconvert(visiblePoints.length)}
          </div>
        </div>

        <div className="w-80 flex flex-col gap-6 overflow-hidden">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-blue-800" />
              <h3 className="font-semibold text-gray-900">{t('map_layers')}</h3>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[300px]">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('hazards')}</h4>
                <div className="space-y-2">
                  <LayerToggle icon={CloudLightning} label={t('cyclone_path')} active={activeLayers.cyclone} onClick={() => toggleLayer('cyclone')} />
                  <LayerToggle icon={Thermometer} label={t('flood_zones')} active={activeLayers.flood} onClick={() => toggleLayer('flood')} />
                  <LayerToggle icon={Mountain} label={t('landslide_risk')} active={activeLayers.landslide} onClick={() => toggleLayer('landslide')} />
                  <LayerToggle icon={Layers} label="Station Heatmap" active={activeLayers.stationHeatmap} onClick={() => toggleLayer('stationHeatmap')} />
                  <LayerToggle icon={MapPin} label="Station Markers" active={activeLayers.stationMarkers} onClick={() => toggleLayer('stationMarkers')} />
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('infrastructure')}</h4>
                <div className="space-y-2">
                  <LayerToggle icon={Activity} label={t('hospitals')} active={activeLayers.hospitals} onClick={() => toggleLayer('hospitals')} />
                  <LayerToggle icon={Home} label={t('shelters')} active={activeLayers.shelters} onClick={() => toggleLayer('shelters')} />
                  <LayerToggle icon={Building2} label={t('schools')} active={activeLayers.schools} onClick={() => toggleLayer('schools')} />
                  <LayerToggle icon={Zap} label={t('power_facilities')} active={activeLayers.power} onClick={() => toggleLayer('power')} />
                  <LayerToggle icon={Car} label={t('roads_bridges')} active={activeLayers.roads} onClick={() => toggleLayer('roads')} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
            <div className="p-5 border-b border-gray-100 shrink-0">
              <h3 className="font-semibold text-gray-900">{t('priority_areas')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('immediate_attention')}</p>
            </div>
            <div className="overflow-y-auto p-3 space-y-2 flex-1">
              {(data.priorityAreas.length ? data.priorityAreas : visiblePoints.slice(0, 8)).map((area) => (
                <div key={area.id} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-800 transition-colors">{area.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      String(area.severity).toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                      String(area.severity).toLowerCase() === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {area.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{area.hazard} • {area.type}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {bnenconvert(area.population || 'N/A')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HoverInfoCard({ point }: { point: RiskPoint }) {
  const isStation = String(point.type).toLowerCase().includes('station');
  const level = String(point.severity).toLowerCase();
  const badgeClass =
    level === 'high' || level === 'critical'
      ? 'bg-red-100 text-red-700 border-red-200'
      : level === 'medium'
        ? 'bg-orange-100 text-orange-700 border-orange-200'
        : 'bg-yellow-100 text-yellow-700 border-yellow-200';

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{point.type}</p>
          <h4 className="mt-0.5 text-sm font-semibold text-slate-900">{point.name}</h4>
          <p className="text-xs text-slate-600">{point.hazard} • {point.status}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase ${badgeClass}`}>
          {point.severity}
        </span>
      </div>

      {isStation ? (
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-slate-700">
          <DataRow label="River" value={point.river} />
          <DataRow label="Basin" value={point.basin} />
          <DataRow label="Danger" value={point.dangerLevel} />
          <DataRow label="RHWL" value={point.rhwl} />
          <DataRow label="PMDL" value={point.pmdl} />
          <DataRow label="Division" value={point.division} />
          <DataRow label="District" value={point.district} />
          <DataRow label="Upazilla" value={point.upazilla} />
          <DataRow label="Union" value={point.union} />
          <DataRow label="Date RHWL" value={point.dateOfRhwl} />
        </div>
      ) : (
        <div className="mt-3 text-xs text-slate-700">
          <span className="font-medium">Affected population:</span> {point.population || 'N/A'}
        </div>
      )}

      <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-[11px] text-slate-700">
        <span className="font-medium">Impact score:</span>{' '}
        {typeof point.impactScore === 'number' ? point.impactScore.toFixed(3) : 'N/A'}
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="truncate text-[11px] font-medium text-slate-800">{value === null || value === undefined || value === '' ? 'N/A' : String(value)}</p>
    </div>
  );
}

function LayerToggle({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className={active ? 'font-medium' : ''}>{label}</span>
      </div>
      <div className={`w-8 h-4 rounded-full transition-colors relative ${active ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-[18px]' : 'left-[2px]'}`} />
      </div>
    </button>
  );
}