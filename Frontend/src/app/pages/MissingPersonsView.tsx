import React, { useEffect, useMemo, useState } from 'react';
import { 
  Upload, Search, UserCircle, MapPin, Calendar, Clock, 
  Phone, AlertTriangle, CheckCircle, ChevronRight, Map,
  LocateFixed, Users, Maximize
} from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { VolunteerCoverageMap } from '../components/VolunteerCoverageMap';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

type MissingMapPoint = MissingPerson & {
  lat: number;
  lng: number;
};

function FlyToPosition({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom, { animate: true });
  return null;
}

type MissingPerson = {
  id: string;
  name: string;
  nameBn: string;
  age: number;
  lastSeen: string;
  lastSeenBn: string;
  date: string;
  dateBn: string;
  status: string;
  statusBn: string;
  score: number;
  phone: string;
  img: string;
  lat?: number;
  lng?: number;
};

export function MissingPersonsView() {
  const { t, d } = useLanguage();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'map' | 'report' | 'search'>('map');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<MissingPerson[]>([]);
  const [mapPoints, setMapPoints] = useState<MissingMapPoint[]>([]);
  const [mapSearch, setMapSearch] = useState('');
  const [mapTableSearch, setMapTableSearch] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]);
  const [mapZoom, setMapZoom] = useState(8);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportAddress, setReportAddress] = useState('');
  const [reportLatitude, setReportLatitude] = useState('');
  const [reportLongitude, setReportLongitude] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        return;
      }
      try {
        const data = await api.get<MissingPerson[]>('/authority/missing-persons', token);
        setResults(data);
      } catch (error) {
        console.error('Failed to load missing persons', error);
      }
    };
    void loadData();
  }, [token]);

  useEffect(() => {
    const geocodeResults = async () => {
      const cacheKey = 'missing_person_geo_cache_v1';
      const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}') as Record<string, { lat: number; lng: number }>;

      const points = await Promise.all(
        results.map(async (person) => {
          if (typeof person.lat === 'number' && typeof person.lng === 'number') {
            return {
              ...person,
              lat: person.lat,
              lng: person.lng,
            } as MissingMapPoint;
          }

          const query = `${person.lastSeen}, Bangladesh`;
          if (!cache[query]) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
              );
              const data = (await response.json()) as Array<{ lat: string; lon: string }>;
              if (data.length > 0) {
                cache[query] = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
              }
            } catch (error) {
              console.error('Failed geocoding missing person location', error);
            }
          }

          if (!cache[query]) {
            return null;
          }

          return {
            ...person,
            lat: cache[query].lat,
            lng: cache[query].lng,
          } as MissingMapPoint;
        }),
      );

      localStorage.setItem(cacheKey, JSON.stringify(cache));
      const validPoints = points.filter((point): point is MissingMapPoint => Boolean(point));
      setMapPoints(validPoints);
      if (validPoints.length > 0) {
        setMapCenter([validPoints[0].lat, validPoints[0].lng]);
        setMapZoom(10);
      }
    };

    if (results.length > 0) {
      void geocodeResults();
    }
  }, [results]);

  const handleMapSearch = async () => {
    const query = mapSearch.trim();
    if (!query) {
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
      );
      const data = (await response.json()) as Array<{ lat: string; lon: string }>;
      if (data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setMapZoom(13);
      }
    } catch (error) {
      console.error('Map search failed', error);
    }
  };

  const handleMapGps = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
        setMapZoom(14);
      },
      (error) => {
        console.error('GPS locate failed', error);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handleRecenterAllPoints = () => {
    if (mapPoints.length === 0) {
      toast.error('No missing points available to center');
      return;
    }

    const lats = mapPoints.map((point) => point.lat);
    const lngs = mapPoints.map((point) => point.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const span = Math.max(maxLat - minLat, maxLng - minLng);

    let zoom = 8;
    if (span < 0.02) zoom = 14;
    else if (span < 0.05) zoom = 13;
    else if (span < 0.1) zoom = 12;
    else if (span < 0.2) zoom = 11;
    else if (span < 0.5) zoom = 10;
    else if (span < 1) zoom = 9;

    setMapCenter([centerLat, centerLng]);
    setMapZoom(zoom);
  };

  const markerColor = (status: string) => {
    if (status === 'Rescued / Safe') {
      return '#16A34A';
    }
    if (status === 'Possible Match') {
      return '#2563EB';
    }
    return '#DC2626';
  };

  const handleReportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('fullName') || '').trim();
    const ageValue = Number(formData.get('age') || 0);
    const dateSeen = String(formData.get('dateLastSeen') || '').trim();
    const timeSeen = String(formData.get('timeLastSeen') || '').trim();
    const phone = String(formData.get('contactPhone') || '').trim();

    if (!name) {
      toast.error('Full name is required');
      return;
    }
    if (!reportAddress || !reportLatitude || !reportLongitude) {
      toast.error('Please pick location from map');
      return;
    }

    const lat = Number(reportLatitude);
    const lng = Number(reportLongitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      toast.error('Invalid selected coordinates');
      return;
    }

    const record: MissingPerson = {
      id: '',
      name,
      nameBn: name,
      age: ageValue || 0,
      lastSeen: reportAddress,
      lastSeenBn: reportAddress,
      date: `${dateSeen || 'N/A'} ${timeSeen || ''}`.trim(),
      dateBn: `${dateSeen || 'N/A'} ${timeSeen || ''}`.trim(),
      status: 'Reported Missing',
      statusBn: 'নিখোঁজ রিপোর্ট',
      score: 0,
      phone: phone || 'N/A',
      img: 'https://images.unsplash.com/photo-1579924711789-872f06ecf220?w=500&q=80',
      lat,
      lng,
    };

    setIsSubmittingReport(true);
    try {
      const saved = await api.post<MissingPerson>(
        '/authority/missing-persons',
        {
          name: record.name,
          nameBn: record.nameBn,
          age: record.age,
          gender: String(formData.get('gender') || '').trim(),
          lastSeen: record.lastSeen,
          lastSeenBn: record.lastSeenBn,
          date: dateSeen,
          time: timeSeen,
          status: record.status,
          statusBn: record.statusBn,
          score: record.score,
          phone: record.phone,
          img: record.img,
          clothingDescription: String(formData.get('clothingDescription') || '').trim(),
          additionalNotes: String(formData.get('additionalNotes') || '').trim(),
          lat,
          lng,
        },
        token,
      );

      setResults((prev) => [saved, ...prev]);
      setMapPoints((prev) => [
        {
          ...saved,
          lat: saved.lat ?? lat,
          lng: saved.lng ?? lng,
        },
        ...prev,
      ]);
      setMapCenter([lat, lng]);
      setMapZoom(13);
      setActiveTab('map');
      form.reset();
      setReportAddress('');
      setReportLatitude('');
      setReportLongitude('');
      toast.success('Missing person report submitted');
    } catch (error) {
      console.error('Failed to submit report', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const markerTextClass = (status: string) => {
    if (status === 'Rescued / Safe') {
      return 'text-green-700';
    }
    if (status === 'Possible Match') {
      return 'text-blue-700';
    }
    return 'text-red-700';
  };

  const filteredMissingPersons = useMemo(() => {
    const query = mapTableSearch.trim().toLowerCase();
    if (!query) {
      return results;
    }

    return results.filter((person) => {
      const searchable = [
        person.id,
        person.name,
        person.nameBn,
        String(person.age),
        person.lastSeen,
        person.lastSeenBn,
        person.date,
        person.dateBn,
        person.status,
        person.statusBn,
        person.phone,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [mapTableSearch, results]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-[#1E3A8A]" />
              {t('missing_persons_title')}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t('missing_persons_desc')}</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('missing_person_map')}
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'search' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('search_by_image')}
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'report' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('report_missing_person')}
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {activeTab === 'map' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-175">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#1E3A8A]" /> 
                    {t('area_distribution_map')}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Live missing person points from backend records</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                    <input
                      type="text"
                      value={mapSearch}
                      onChange={(e) => setMapSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          void handleMapSearch();
                        }
                      }}
                      className="w-64 px-3 py-2 text-sm outline-none"
                      placeholder="Search location"
                      title="Search location"
                    />
                    <button
                      type="button"
                      onClick={() => void handleMapSearch()}
                      className="border-l border-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-50"
                      title="Search"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleMapGps}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
                    title="Use GPS"
                    aria-label="Use GPS"
                  >
                    <LocateFixed className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRecenterAllPoints}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
                    title="Recenter all missing points"
                    aria-label="Recenter all missing points"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FlyToPosition center={mapCenter} zoom={mapZoom} />

                  {mapPoints.map((person) => (
                    <CircleMarker
                      key={person.id}
                      center={[person.lat, person.lng]}
                      radius={8}
                      pathOptions={{
                        color: markerColor(person.status),
                        fillColor: markerColor(person.status),
                        fillOpacity: 0.9,
                      }}
                    >
                      <Popup>
                        <div className="max-w-56 text-sm">
                          <p className="font-semibold text-gray-900">{d(person.name, person.nameBn)}</p>
                          <p className="text-xs text-gray-600 mt-1">{d(person.lastSeen, person.lastSeenBn)}</p>
                          <p className="text-xs text-gray-600">{d(person.date, person.dateBn)}</p>
                          <p className={`text-xs font-medium mt-2 ${markerTextClass(person.status)}`}>
                            {d(person.status, person.statusBn)}
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>

              {/* Map Legend & Summary */}
              <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-3 gap-4 shrink-0">
                <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{t('total_missing_active')}</p>
                    <p className="text-lg font-bold text-gray-900">{mapPoints.length}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-around">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full shadow-sm"></div>
                    <span className="text-xs text-gray-600 font-medium">{t('high_density')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                    <span className="text-xs text-gray-600 font-medium">{t('medium_density')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                    <span className="text-xs text-gray-600 font-medium">{t('low_density')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
                <h4 className="text-base font-semibold text-gray-900">Missing Persons List</h4>
                <div className="flex items-center rounded-lg border border-gray-200 bg-white w-full max-w-md">
                  <Search className="w-4 h-4 text-gray-500 ml-3" />
                  <input
                    type="text"
                    value={mapTableSearch}
                    onChange={(e) => setMapTableSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm outline-none"
                    placeholder="Search by ID, name, phone, status, date, or location"
                    title="Search missing person details"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Age</th>
                      <th className="px-4 py-3 text-left font-semibold">Last Seen</th>
                      <th className="px-4 py-3 text-left font-semibold">Date</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMissingPersons.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                          No missing person found for your search.
                        </td>
                      </tr>
                    ) : (
                      filteredMissingPersons.map((person) => (
                        <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700 font-medium">{person.id}</td>
                          <td className="px-4 py-3 text-gray-900">{d(person.name, person.nameBn)}</td>
                          <td className="px-4 py-3 text-gray-700">{person.age}</td>
                          <td className="px-4 py-3 text-gray-700">{d(person.lastSeen, person.lastSeenBn)}</td>
                          <td className="px-4 py-3 text-gray-700">{d(person.date, person.dateBn)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              person.status === 'Rescued / Safe'
                                ? 'bg-green-100 text-green-700'
                                : person.status === 'Possible Match'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {d(person.status, person.statusBn)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{person.phone}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'search' ? (
          <div className="space-y-8">
            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('facial_recognition_search')}</h3>
                  <p className="text-sm text-gray-500 mb-6">{t('upload_photo_desc')}</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50/50 relative">
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#1E3A8A] animate-spin mb-4"></div>
                        <p className="text-sm font-medium text-[#1E3A8A]">{t('analyzing_features')}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('cross_referencing')}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm font-medium text-gray-900">{t('click_upload')}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('file_types')}</p>
                      </>
                    )}
                  </div>
                  
                  {!isSearching && !showResults && (
                    <button 
                      onClick={handleSearch}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      {t('run_ai_search')}
                    </button>
                  )}
                </div>
                
                {/* Info / Map Placeholder */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-[#1E3A8A]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('high_trust_database')}</h4>
                  <p className="text-sm text-gray-600 max-w-sm">{t('high_trust_desc')}</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {showResults && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{t('top_potential_matches')}</h3>
                  <button className="text-sm font-medium text-[#1E3A8A] hover:text-blue-800">{t('export_report')}</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((result) => (
                    <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                        <ImageWithFallback src={result.img} alt={d(result.name, result.nameBn)} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-[#1E3A8A] shadow-sm">
                          {result.score}% {t('match')}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-bold text-gray-900 truncate">{d(result.name, result.nameBn)}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                              result.status === 'Rescued / Safe' ? 'bg-green-100 text-green-700' :
                              result.status === 'Possible Match' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {d(result.status, result.statusBn)}
                            </span>
                          </div>
                          <div className="space-y-1 mt-2">
                            <p className="text-xs text-gray-600 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {d(result.lastSeen, result.lastSeenBn)}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {d(result.date, result.dateBn)}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {result.phone}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button className="text-xs font-medium text-[#1E3A8A] flex items-center hover:underline">
                            {t('view_full_details')} <ChevronRight className="w-3 h-3 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Map className="w-5 h-5 text-gray-500" />
                    {t('last_seen_locations')}
                  </h4>
                  <div className="h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
                    {/* Map placeholder */}
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#mapGrid)" />
                      </svg>
                    </div>
                    {/* Match Pins */}
                    <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                    <div className="absolute top-[60%] left-[50%] w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="absolute top-[30%] left-[60%] w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="absolute top-[50%] left-[70%] w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="absolute top-[45%] left-[80%] w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{t('report_missing_title')}</h3>
              <p className="text-sm text-gray-500">{t('report_missing_desc')}</p>
            </div>
            
            <div className="p-6">
              <form className="space-y-6" onSubmit={handleReportSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name')}</label>
                      <input name="fullName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="e.g. John Doe" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
                        <input name="age" type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="e.g. 35" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
                        <select name="gender" title={t('gender')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                          <option>{t('select')}</option>
                          <option>{t('male')}</option>
                          <option>{t('female')}</option>
                          <option>{t('other')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">{t('last_seen_location')} (Pick from map)</label>
                      <VolunteerCoverageMap
                        points={[]}
                        selectedPoint={
                          reportLatitude && reportLongitude
                            ? {
                                lat: Number(reportLatitude),
                                lng: Number(reportLongitude),
                                label: reportAddress || 'Selected location',
                              }
                            : null
                        }
                        onSelectPoint={(point) => {
                          setReportLatitude(point.lat.toFixed(6));
                          setReportLongitude(point.lng.toFixed(6));
                          if (point.label) {
                            setReportAddress(point.label);
                          }
                        }}
                        heightClassName="h-64"
                      />
                      <textarea
                        value={reportAddress}
                        readOnly
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        placeholder="Use map search, GPS, or click map to capture full address"
                        title="Selected full address"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={reportLatitude}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          placeholder="Latitude"
                          title="Selected latitude"
                        />
                        <input
                          type="text"
                          value={reportLongitude}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          placeholder="Longitude"
                          title="Selected longitude"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('date_last_seen')}</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input name="dateLastSeen" title={t('date_last_seen')} type="date" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('time_last_seen')}</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input name="timeLastSeen" title={t('time_last_seen')} type="time" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('photo_recommended')}</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-xs font-medium text-gray-900">{t('upload_photo')}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{t('clear_face_photo')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('clothing_description')}</label>
                       <input name="clothingDescription" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('clothing_placeholder')} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('your_contact_info')}</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="contactPhone" type="tel" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('phone_number')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('additional_notes')}</label>
                   <textarea name="additionalNotes" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none" placeholder={t('additional_notes_placeholder')}></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    {t('cancel')}
                  </button>
                  <button type="submit" disabled={isSubmittingReport} className="px-5 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-sm disabled:opacity-60">
                    <CheckCircle className="w-4 h-4" />
                    {isSubmittingReport ? 'Submitting...' : t('submit_report')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}