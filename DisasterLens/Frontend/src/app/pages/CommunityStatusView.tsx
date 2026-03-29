import { useEffect, useState } from 'react';
import { HeartPulse, Activity, Zap, Droplet, Users, ShieldAlert, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function CommunityStatusView() {
  const { t } = useLanguage();
  const { token, user } = useAuth();

  const [sector, setSector] = useState(user?.assignedArea || '');
  const [sectorBn, setSectorBn] = useState(user?.assignedAreaBn || user?.assignedArea || '');
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<{
    floodLevel: number;
    dangerLevel: number;
    householdsAffected: number;
    shelterOccupancy: number;
    electricity: 'down' | 'partial' | 'up';
    communication: 'down' | 'partial' | 'up';
    cleanWater: 'critical' | 'low' | 'adequate';
    roadAccess: 'blocked' | 'partial' | 'clear';
    healthEmergency: boolean;
  } | null>(null);
  const [floodLevel, setFloodLevel] = useState(40);
  const [dangerLevel, setDangerLevel] = useState(3);
  const [householdsAffected, setHouseholdsAffected] = useState(150);
  const [shelterOccupancy, setShelterOccupancy] = useState(85);
  const [electricity, setElectricity] = useState<'down' | 'partial' | 'up'>('down');
  const [communication, setCommunication] = useState<'down' | 'partial' | 'up'>('partial');
  const [cleanWater, setCleanWater] = useState<'critical' | 'low' | 'adequate'>('critical');
  const [roadAccess, setRoadAccess] = useState<'blocked' | 'partial' | 'clear'>('partial');
  const [healthEmergency, setHealthEmergency] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

    const loadInitial = async () => {
      if (!token) {
        return;
      }

      try {
        setIsLoadingInitial(true);
        const [unionOptions, statusData] = await Promise.all([
          api.get<Array<{ id: string; name: string; bn_name: string }>>('/authority/unions', token),
          api.get<Record<string, unknown>>('/volunteer/community-status', token),
        ]);

        const assignedArea = user?.assignedArea?.trim() || '';
        const assignedAreaBn = user?.assignedAreaBn?.trim() || assignedArea;

        const matchedUnion = unionOptions.find((item) => {
          const target = [normalize(item.name), normalize(item.bn_name)];
          return target.includes(normalize(assignedArea)) || target.includes(normalize(assignedAreaBn));
        });

        const resolvedUnion = matchedUnion?.name || assignedArea || String(statusData.village || '');
        const resolvedUnionBn = matchedUnion?.bn_name || assignedAreaBn || String(statusData.villageBn || resolvedUnion);

        setSector(resolvedUnion);
        setSectorBn(resolvedUnionBn);

        const next = {
          floodLevel: Number(statusData.floodLevel ?? 40),
          dangerLevel: Number(statusData.dangerLevel ?? 3),
          householdsAffected: Number(statusData.householdsAffected ?? 150),
          shelterOccupancy: Number(statusData.shelterOccupancy ?? 85),
          electricity: String(statusData.electricity ?? 'down') as 'down' | 'partial' | 'up',
          communication: String(statusData.communication ?? 'partial') as 'down' | 'partial' | 'up',
          cleanWater: String(statusData.cleanWater ?? 'critical') as 'critical' | 'low' | 'adequate',
          roadAccess: String(statusData.roadAccess ?? 'partial') as 'blocked' | 'partial' | 'clear',
          healthEmergency: Boolean(statusData.healthEmergency ?? true),
        };

        setFloodLevel(next.floodLevel);
        setDangerLevel(next.dangerLevel);
        setHouseholdsAffected(next.householdsAffected);
        setShelterOccupancy(next.shelterOccupancy);
        setElectricity(next.electricity);
        setCommunication(next.communication);
        setCleanWater(next.cleanWater);
        setRoadAccess(next.roadAccess);
        setHealthEmergency(next.healthEmergency);
        setSavedSnapshot(next);
      } catch (error) {
        console.error('Failed to load assigned union community status', error);
        toast.error(t('community_status_load_failed'));
      } finally {
        setIsLoadingInitial(false);
      }
    };

    void loadInitial();
  }, [token, user?.assignedArea, user?.assignedAreaBn]);

  const handleDiscard = () => {
    if (!savedSnapshot) {
      return;
    }

    setFloodLevel(savedSnapshot.floodLevel);
    setDangerLevel(savedSnapshot.dangerLevel);
    setHouseholdsAffected(savedSnapshot.householdsAffected);
    setShelterOccupancy(savedSnapshot.shelterOccupancy);
    setElectricity(savedSnapshot.electricity);
    setCommunication(savedSnapshot.communication);
    setCleanWater(savedSnapshot.cleanWater);
    setRoadAccess(savedSnapshot.roadAccess);
    setHealthEmergency(savedSnapshot.healthEmergency);
  };

  const handleUpdate = async () => {
    if (!sector.trim()) {
      toast.error(t('assigned_union_missing'));
      return;
    }

    try {
      setIsSaving(true);
      await api.post(
        '/volunteer/community-status',
        {
          sector,
          sectorBn,
          floodLevel,
          dangerLevel,
          householdsAffected,
          shelterOccupancy,
          electricity,
          communication,
          cleanWater,
          roadAccess,
          healthEmergency,
        },
        token,
      );
      setSavedSnapshot({
        floodLevel,
        dangerLevel,
        householdsAffected,
        shelterOccupancy,
        electricity,
        communication,
        cleanWater,
        roadAccess,
        healthEmergency,
      });
      toast.success(t('community_status_updated'));
    } catch (error) {
      console.error('Failed to update community status', error);
      toast.error(t('community_status_update_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-[#1E3A8A]" />
              {t('community_status_update')}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t('sector_info')}</p>
            <input
              type="text"
              value={sector}
              readOnly
              placeholder={t('assigned_union_placeholder')}
              className="mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm w-72 bg-gray-50 text-gray-700"
            />
            {sectorBn && sectorBn !== sector ? <p className="text-xs text-gray-500 mt-1">{sectorBn}</p> : null}
          </div>
          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold border border-green-200 flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             {t('live_sync')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> {t('current_condition')}
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">{t('flood_water_level')}</label>
                    <span className="text-xs font-bold text-blue-700">{`${t('moderate')} (${(floodLevel / 25).toFixed(1)}m)`}</span>
                  </div>
                  <input type="range" min="0" max="100" value={floodLevel} onChange={(e) => setFloodLevel(Number(e.target.value))} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" title="Flood water level" aria-label="Flood water level" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">{t('local_danger_level')}</label>
                    <span className="text-xs font-bold text-orange-600">{t('danger_level_value', { level: dangerLevel })}</span>
                  </div>
                  <input type="range" min="1" max="5" value={dangerLevel} onChange={(e) => setDangerLevel(Number(e.target.value))} className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500" title="Local danger level" aria-label="Local danger level" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" /> {t('population_impact')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('households_affected')}</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={householdsAffected} onChange={(e) => setHouseholdsAffected(Number(e.target.value || 0))} title="Households affected" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('shelter_occupancy')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={shelterOccupancy} onChange={(e) => setShelterOccupancy(Number(e.target.value || 0))} title="Shelter occupancy" placeholder="0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-gray-600" /> {t('infrastructure_supply')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('electricity')}</p>
                      <p className="text-xs text-gray-500">{t('grid_status')}</p>
                    </div>
                  </div>
                  <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-red-600" value={electricity} onChange={(e) => setElectricity(e.target.value as 'down' | 'partial' | 'up')} title="Electricity status">
                    <option value="down">{t('grid_offline')}</option>
                    <option value="partial">{t('partial')}</option>
                    <option value="up">{t('grid_online')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('communication')}</p>
                      <p className="text-xs text-gray-500">{t('cellular_radio')}</p>
                    </div>
                  </div>
                  <select value={communication} onChange={(e) => setCommunication(e.target.value as 'down' | 'partial' | 'up')} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-amber-600" title="Communication status">
                    <option value="down">{t('offline')}</option>
                    <option value="partial">{t('spotty')}</option>
                    <option value="up">{t('good')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Droplet className="w-5 h-5 text-cyan-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('clean_water')}</p>
                      <p className="text-xs text-gray-500">{t('drinking_supply')}</p>
                    </div>
                  </div>
                  <select value={cleanWater} onChange={(e) => setCleanWater(e.target.value as 'critical' | 'low' | 'adequate')} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-red-600" title="Clean water status">
                    <option value="critical">{t('critical')}</option>
                    <option value="low">{t('low')}</option>
                    <option value="adequate">{t('adequate')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('road_access')}</p>
                      <p className="text-xs text-gray-500">{t('main_routes')}</p>
                    </div>
                  </div>
                  <select value={roadAccess} onChange={(e) => setRoadAccess(e.target.value as 'blocked' | 'partial' | 'clear')} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-amber-600" title="Road access status">
                    <option value="blocked">{t('blocked')}</option>
                    <option value="partial">{t('partial_access')}</option>
                    <option value="clear">{t('clear')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 border border-red-100 rounded-lg bg-red-50">
                   <div className="flex items-center gap-3">
                    <HeartPulse className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-900">{t('health_emergency')}</p>
                      <p className="text-xs text-red-700">{t('immediate_medical')}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={healthEmergency} onChange={(e) => setHealthEmergency(e.target.checked)} title="Health emergency" aria-label="Health emergency" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" onClick={handleDiscard}>
            {t('discard_changes')}
          </button>
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm disabled:opacity-60" onClick={() => void handleUpdate()} disabled={isSaving}>
            <Check className="w-4 h-4" />
            {isSaving || isLoadingInitial ? t('updating') : t('update_status')}
          </button>
        </div>
      </div>
    </div>
  );
}
