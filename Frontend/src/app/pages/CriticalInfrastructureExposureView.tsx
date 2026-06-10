import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  X,
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type InfraExposure = {
  id: string;
  name: string;
  type: string;
  location: string;
  hazard: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Operational' | 'Compromised' | 'Offline';
  population: string;
  lat: number;
  lng: number;
  notes?: string;
  created_at?: string;
};

const fallbackInfra: InfraExposure[] = [
  {
    id: 'IER-local-1',
    name: 'Central District Hospital',
    type: 'Hospital',
    location: 'Sylhet',
    hazard: 'Flood',
    severity: 'High',
    status: 'Compromised',
    population: '120000',
    lat: 24.8949,
    lng: 91.8687,
  },
  {
    id: 'IER-local-2',
    name: 'Evacuation Shelter Alpha',
    type: 'Shelter',
    location: 'Sunamganj',
    hazard: 'Flood',
    severity: 'Medium',
    status: 'Operational',
    population: '5000',
    lat: 25.0658,
    lng: 91.395,
  },
];

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: true });
  return null;
}

export function CriticalInfrastructureExposureView() {
  const { t, bnenconvert } = useLanguage();
  const { token } = useAuth();

  const [items, setItems] = useState<InfraExposure[]>(fallbackInfra);
  const [selectedItem, setSelectedItem] = useState<InfraExposure | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await api.get<InfraExposure[]>('/authority/infra-exposures', token);
        if (rows.length) {
          setItems(rows);
        }
      } catch (error) {
        console.error('Failed to load infrastructure exposure logs', error);
      }
    };

    void load();
  }, [token]);

  const types = useMemo(() => {
    const set = new Set(items.map((item) => item.type));
    return ['All', ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filterType !== 'All' && item.type !== filterType) return false;
      if (filterSeverity !== 'All' && item.severity !== filterSeverity) return false;
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;
      const text = `${item.name} ${item.type} ${item.location} ${item.hazard} ${item.status}`.toLowerCase();
      return text.includes(query);
    });
  }, [items, filterType, filterSeverity, searchTerm]);

  const center = useMemo<[number, number]>(() => {
    if (!filtered.length) return [23.8103, 90.4125];
    const lat = filtered.reduce((sum, row) => sum + row.lat, 0) / filtered.length;
    const lng = filtered.reduce((sum, row) => sum + row.lng, 0) / filtered.length;
    return [lat, lng];
  }, [filtered]);

  const markerColor = (severity: InfraExposure['severity']) => {
    if (severity === 'High') return '#DC2626';
    if (severity === 'Medium') return '#F59E0B';
    return '#16A34A';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 pb-4 shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('critical_infrastructure')}</h1>
            <p className="text-gray-500">{t('monitor_risk')}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('search_infrastructure')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              {t('more_filters')}
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterType === type ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type === 'All' ? t('all') : type}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex gap-2">
            {['All', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                  filterSeverity === sev
                    ? sev === 'High'
                      ? 'bg-red-100 border-red-200 text-red-700'
                      : sev === 'Medium'
                      ? 'bg-orange-100 border-orange-200 text-orange-700'
                      : sev === 'Low'
                      ? 'bg-yellow-100 border-yellow-200 text-yellow-700'
                      : 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {sev === 'All' ? t('all') : `${sev} ${t('risk_suffix')}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${selectedItem ? 'w-[420px]' : 'w-[40%]'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{bnenconvert(filtered.length)} {t('assets_found')}</span>
            <span className="text-xs text-gray-500">{t('sorted_by_severity')}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.type} • {item.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.severity === 'High' ? 'bg-red-100 text-red-700' : item.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{item.severity}</span>
                </div>
                <div className="text-xs text-gray-600">{item.hazard} • {item.status}</div>
                <div className="text-xs text-gray-500 mt-1">{t('pop')}: {bnenconvert(item.population || 'N/A')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative bg-blue-50/30">
          <div className="h-full relative z-0">
            <MapContainer center={center} zoom={7} className="h-full w-full z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToCenter center={center} />

              {filtered.map((item) => {
                const color = markerColor(item.severity);
                return (
                  <CircleMarker
                    key={`pt-${item.id}`}
                    center={[item.lat, item.lng]}
                    radius={8}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.85 }}
                  >
                    <Popup>
                      <div className="text-sm min-w-48">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-700 mt-1">{item.type} • {item.location}</p>
                        <p className="text-xs text-gray-700">{item.hazard} • {item.status}</p>
                        <p className="text-xs text-gray-700">{t('pop')}: {bnenconvert(item.population || 'N/A')}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {selectedItem && (
            <div className="absolute right-4 top-4 w-88 bg-white rounded-xl shadow-2xl border border-gray-200 z-[1000] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-900">{t('asset_details')}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  title={t('close')}
                  aria-label={t('close')}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedItem.name}</h2>
                  <p className="text-sm text-gray-500">{selectedItem.type} • {selectedItem.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">{t('exposure')}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedItem.hazard}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">{t('status')}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedItem.status}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">{t('severity')}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedItem.severity}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">{t('pop')}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{bnenconvert(selectedItem.population || 'N/A')}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {bnenconvert(selectedItem.lat.toFixed(4))}, {bnenconvert(selectedItem.lng.toFixed(4))}
                </div>
              </div>
            </div>
          )}

          {!selectedItem && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[900]">
              <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <Building2 className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <h3 className="text-gray-900 font-medium">{t('select_infrastructure')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('click_item_details')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
