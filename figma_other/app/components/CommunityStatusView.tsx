import React from 'react';
import { HeartPulse, Activity, Zap, Droplet, Users, ShieldAlert, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CommunityStatusView() {
  const { t } = useTranslation();
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
                    <span className="text-xs font-bold text-blue-700">{t('moderate_level')}</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="40" className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">{t('local_danger_level')}</label>
                    <span className="text-xs font-bold text-orange-600">{t('level_3')}</span>
                  </div>
                  <input type="range" min="1" max="5" defaultValue="3" className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500" />
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
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="150" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('shelter_occupancy')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="85" />
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
                  <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-red-600">
                    <option value="down">{t('offline')}</option>
                    <option value="partial">{t('partial')}</option>
                    <option value="up">{t('online')}</option>
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
                  <select defaultValue="partial" className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-amber-600">
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
                  <select defaultValue="critical" className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-red-600">
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
                  <select defaultValue="partial" className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-amber-600">
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
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            {t('discard_changes')}
          </button>
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm">
            <Check className="w-4 h-4" />
            {t('update_status')}
          </button>
        </div>
      </div>
    </div>
  );
}
