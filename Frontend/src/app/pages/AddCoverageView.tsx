import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../i18n/LanguageContext';
import { MapPin, Radar, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { VolunteerCoverageMap, type CoveragePoint } from '../components/VolunteerCoverageMap';

export function AddCoverageView() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { token, user } = useAuth();
  const [location, setLocation] = useState(user?.assignedArea || 'Sylhet Sadar, Sector 4');
  const [radius, setRadius] = useState<number>(2);
  const [latitude, setLatitude] = useState<number>(23.8103);
  const [longitude, setLongitude] = useState<number>(90.4125);
  const [usedGps, setUsedGps] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const previewPoints = useMemo<CoveragePoint[]>(() => {
    return [
      {
        id: 'preview-point',
        teamName: user?.name || 'Volunteer Team',
        locationName: location,
        lat: latitude,
        lng: longitude,
        radiusKm: radius,
      },
    ];
  }, [location, latitude, longitude, radius, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    
    try {
      await api.post('/volunteer/coverage-updates', {
        team_code: 'TEAM-WEB',
        team_name: user?.name || 'Volunteer Team',
        location_name: location,
        radius_km: radius,
        latitude,
        longitude,
        used_gps: usedGps,
        status_note: 'Coverage updated from app',
        source: 'web',
      }, token);
      setStatus('success');
      setTimeout(() => navigate('/volunteer-coverage'), 1200);
    } catch (err) {
      console.error("Failed to save coverage:", err);
      setStatus('idle');
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
              <label htmlFor="coverage-location" className="block text-sm font-bold text-gray-900">{t('current_location')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="coverage-location"
                  type="text"
                  required
                  className="pl-10 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1E3A8A] focus:border-[#1E3A8A] block p-2.5"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sunamganj Sector 3"
                />
              </div>
            </div>

            {/* Radius Field */}
            <div className="space-y-3">
              <label htmlFor="coverage-radius" className="block text-sm font-bold text-gray-900">{t('operational_radius')}</label>
              <div className="flex items-center gap-4">
                <input
                  id="coverage-radius"
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  title={t('operational_radius')}
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
              <VolunteerCoverageMap
                points={previewPoints}
                selectedPoint={{ lat: latitude, lng: longitude, radiusKm: radius, label: location }}
                onSelectPoint={(point) => {
                  setLatitude(point.lat);
                  setLongitude(point.lng);
                  if (point.label) {
                    setLocation(point.label);
                  }
                  setUsedGps(point.label === 'Current Location');
                }}
                heightClassName="h-72"
              />
              <p className="text-xs text-gray-500">
                Lat: {latitude.toFixed(5)} , Lng: {longitude.toFixed(5)}
              </p>
            </div>

          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>{t('coverage_shared')}</span>
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