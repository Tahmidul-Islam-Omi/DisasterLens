import { useEffect, useMemo, useState } from 'react';
import { Users, Search, MapPin, X, Plus } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';

type Community = {
  id: string;
  name: string;
  district: string;
  population: string;
  riskLevel: 'Critical' | 'High' | 'Moderate' | string;
  priorityScore: number;
  shelterAccess: string;
  roadAccessibility: string;
  hazardExposure: string[];
  lat: number;
  lng: number;
  notes?: string;
};

type CreateCommunityPayload = {
  name: string;
  district: string;
  population: string;
  riskLevel: string;
  priorityScore: number;
  shelterAccess: string;
  roadAccessibility: string;
  hazardExposure: string[];
  lat: number;
  lng: number;
  notes: string;
};

const fallbackCommunities: Community[] = [
  {
    id: 'VC-DEMO-1',
    name: 'Riverbed Settlement Alpha',
    district: 'Sylhet',
    population: '4200',
    riskLevel: 'Critical',
    priorityScore: 94,
    shelterAccess: 'Poor',
    roadAccessibility: 'Compromised',
    hazardExposure: ['Flash Flood', 'Landslide'],
    lat: 24.8949,
    lng: 91.8687,
  },
  {
    id: 'VC-DEMO-2',
    name: 'Coastal Village B',
    district: 'Chattogram',
    population: '2800',
    riskLevel: 'High',
    priorityScore: 88,
    shelterAccess: 'Moderate',
    roadAccessibility: 'At Risk',
    hazardExposure: ['Cyclone', 'Storm Surge'],
    lat: 22.3569,
    lng: 91.7832,
  },
];

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: true });
  return null;
}

export function VulnerableCommunitiesView() {
  const { t, d, bnenconvert } = useLanguage();
  const { token } = useAuth();
  const { role } = useRole();
  const isLocalAuthority = role === 'LocalAuthority';

  const [communities, setCommunities] = useState<Community[]>(fallbackCommunities);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CreateCommunityPayload>({
    name: '',
    district: '',
    population: '',
    riskLevel: 'High',
    priorityScore: 70,
    shelterAccess: 'Moderate',
    roadAccessibility: 'At Risk',
    hazardExposure: [],
    lat: 23.8103,
    lng: 90.4125,
    notes: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await api.get<Community[]>('/authority/vulnerable-communities', token);
        if (rows.length) {
          setCommunities(rows);
        }
      } catch (error) {
        console.error('Failed to load vulnerable communities', error);
      }
    };

    void load();
  }, [token]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorted = [...communities].sort((a, b) => b.priorityScore - a.priorityScore);
    if (!query) return sorted;
    return sorted.filter((row) => `${row.name} ${row.district} ${row.riskLevel}`.toLowerCase().includes(query));
  }, [communities, search]);

  const center = useMemo<[number, number]>(() => {
    if (!filtered.length) return [23.8103, 90.4125];
    const lat = filtered.reduce((sum, row) => sum + row.lat, 0) / filtered.length;
    const lng = filtered.reduce((sum, row) => sum + row.lng, 0) / filtered.length;
    return [lat, lng];
  }, [filtered]);

  const markerColor = (risk: string) => {
    const value = risk.toLowerCase();
    if (value === 'critical') return '#DC2626';
    if (value === 'high') return '#F97316';
    return '#F59E0B';
  };

  const markerTextClass = (risk: string) => {
    const value = risk.toLowerCase();
    if (value === 'critical') return 'text-red-600';
    if (value === 'high') return 'text-orange-500';
    return 'text-amber-500';
  };

  const riskLabel = (risk: string) => {
    const value = risk.toLowerCase();
    if (value === 'critical') return t('critical');
    if (value === 'high') return t('high');
    return t('moderate');
  };

  const submitCommunity = async () => {
    if (!isLocalAuthority || isSubmitting) return;
    if (!form.name.trim() || !form.district.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.post<Community>('/authority/vulnerable-communities', form, token);
      setCommunities((prev) => [created, ...prev]);
      setSelectedCommunity(created);
      setForm({
        name: '',
        district: '',
        population: '',
        riskLevel: 'High',
        priorityScore: 70,
        shelterAccess: 'Moderate',
        roadAccessibility: 'At Risk',
        hazardExposure: [],
        lat: 23.8103,
        lng: 90.4125,
        notes: '',
      });
    } catch (error) {
      console.error('Failed to create vulnerable community', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 pb-4 shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('vulnerable_communities')}</h1>
            <p className="text-gray-500">{t('spatial_analysis')}</p>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('search_communities')}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {isLocalAuthority && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-9 gap-2">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder={d('Community name', 'কমিউনিটির নাম')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={form.district}
              onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
              placeholder={d('District', 'জেলা')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={form.population}
              onChange={(event) => setForm((prev) => ({ ...prev, population: event.target.value }))}
              placeholder={d('Population', 'জনসংখ্যা')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <select
              value={form.riskLevel}
              onChange={(event) => setForm((prev) => ({ ...prev, riskLevel: event.target.value }))}
              title={d('Risk level', 'ঝুঁকির মাত্রা')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="Critical">{t('critical')}</option>
              <option value="High">{t('high')}</option>
              <option value="Moderate">{t('moderate')}</option>
            </select>
            <input
              type="number"
              value={form.priorityScore}
              onChange={(event) => setForm((prev) => ({ ...prev, priorityScore: Number(event.target.value) || 0 }))}
              placeholder={d('Priority', 'অগ্রাধিকার')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="number"
              step="0.0001"
              value={form.lat}
              onChange={(event) => setForm((prev) => ({ ...prev, lat: Number(event.target.value) || 0 }))}
              placeholder={d('Lat', 'অক্ষাংশ')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="number"
              step="0.0001"
              value={form.lng}
              onChange={(event) => setForm((prev) => ({ ...prev, lng: Number(event.target.value) || 0 }))}
              placeholder={d('Lng', 'দ্রাঘিমাংশ')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={form.hazardExposure.join(', ')}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  hazardExposure: event.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
              placeholder={d('Hazards (comma separated)', 'ঝুঁকির ধরন (কমা দিয়ে আলাদা করুন)')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <button
              type="button"
              onClick={() => void submitCommunity()}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? d('Saving...', 'সংরক্ষণ হচ্ছে...') : d('Add Community', 'কমিউনিটি যোগ করুন')}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[420px] border-r border-gray-200 bg-white overflow-y-auto p-4 space-y-3">
          {filtered.map((community, index) => (
            <button
              key={community.id}
              type="button"
              onClick={() => setSelectedCommunity(community)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selectedCommunity?.id === community.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{community.name}</p>
                  <p className="text-xs text-gray-500">{community.district}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">#{bnenconvert(index + 1)}</p>
                  <p className="text-xs text-gray-500">{bnenconvert(community.priorityScore)}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {bnenconvert(community.population || '0')}
              </div>
              <div className={`mt-1 text-xs font-medium ${markerTextClass(community.riskLevel)}`}>
                {riskLabel(community.riskLevel)}
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 relative bg-blue-50/20">
          <div className="h-full relative z-0">
            <MapContainer center={center} zoom={7} className="h-full w-full z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToCenter center={center} />
              {filtered.map((community) => {
                const color = markerColor(community.riskLevel);
                return (
                  <CircleMarker
                    key={community.id}
                    center={[community.lat, community.lng]}
                    radius={9}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
                  >
                    <Popup>
                      <p className="font-semibold">{community.name}</p>
                      <p className="text-xs">{community.district}</p>
                      <p className="text-xs">{d('Risk', 'ঝুঁকি')}: {riskLabel(community.riskLevel)}</p>
                      <p className="text-xs">{d('Population', 'জনসংখ্যা')}: {bnenconvert(community.population || '0')}</p>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {selectedCommunity && (
            <div className="absolute right-4 top-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-[1000] overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{t('vulnerability_analysis')}</h3>
                <button
                  type="button"
                  title={t('close')}
                  aria-label={t('close')}
                  onClick={() => setSelectedCommunity(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <p className="text-lg font-bold text-gray-900">{selectedCommunity.name}</p>
                <p className="text-gray-600">{selectedCommunity.district}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">{d('Risk', 'ঝুঁকি')}</p>
                    <p className={`font-semibold ${markerTextClass(selectedCommunity.riskLevel)}`}>{riskLabel(selectedCommunity.riskLevel)}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">{d('Priority', 'অগ্রাধিকার')}</p>
                    <p className="font-semibold text-gray-900">{bnenconvert(selectedCommunity.priorityScore)}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3 col-span-2">
                    <p className="text-xs text-gray-500">{d('Population', 'জনসংখ্যা')}</p>
                    <p className="font-semibold text-gray-900">{bnenconvert(selectedCommunity.population || '0')}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {bnenconvert(selectedCommunity.lat.toFixed(4))}, {bnenconvert(selectedCommunity.lng.toFixed(4))}
                </div>
                {selectedCommunity.hazardExposure?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedCommunity.hazardExposure.map((hazard) => (
                      <span key={hazard} className="px-2 py-0.5 rounded text-xs bg-red-50 text-red-700 border border-red-100">
                        {hazard}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}