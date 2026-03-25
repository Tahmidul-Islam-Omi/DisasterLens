import { HeartPulse, Activity, Zap, Droplet, Users, ShieldAlert, Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function CommunityStatusView() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-blue-900" />
              {t('volunteer.communityStatusTitle')}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t('volunteer.communityStatusSubtitle')}</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold border border-green-200 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{t('volunteer.liveSync')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" />{t('volunteer.currentCondition')}</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">{t('volunteer.floodWaterLevel')}</label>
                    <span className="text-xs font-bold text-blue-700">Moderate</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="40" className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">{t('volunteer.localDangerLevel')}</label>
                    <span className="text-xs font-bold text-orange-600">Level 3</span>
                  </div>
                  <input type="range" min="1" max="5" defaultValue="3" className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-purple-600" />{t('volunteer.populationImpact')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('volunteer.householdsAffected')}</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="150" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('volunteer.shelterOccupancy')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="85" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-gray-600" />{t('volunteer.infrastructureSupply')}</h3>
            <div className="space-y-4">
              {[
                { icon: Zap, color: 'text-amber-500', label: 'Electricity', sub: 'Grid Status', defaultVal: 'down', options: [['down', 'Offline'], ['partial', 'Partial'], ['up', 'Online']], valColor: 'text-red-600' },
                { icon: Activity, color: 'text-blue-500', label: 'Communication', sub: 'Cellular / Radio', defaultVal: 'partial', options: [['down', 'Offline'], ['partial', 'Spotty'], ['up', 'Good']], valColor: 'text-amber-600' },
                { icon: Droplet, color: 'text-cyan-500', label: 'Clean Water', sub: 'Drinking Supply', defaultVal: 'critical', options: [['critical', 'Critical'], ['low', 'Low'], ['adequate', 'Adequate']], valColor: 'text-red-600' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <div><p className="text-sm font-medium text-gray-900">{item.label}</p><p className="text-xs text-gray-500">{item.sub}</p></div>
                  </div>
                  <select defaultValue={item.defaultVal} className={`px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium ${item.valColor}`}>
                    {item.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}

              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <div><p className="text-sm font-medium text-gray-900">Road Access</p><p className="text-xs text-gray-500">Main Routes</p></div>
                </div>
                <select defaultValue="partial" className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-amber-600">
                  {[['blocked', 'Blocked'], ['partial', 'Partial Access'], ['clear', 'Clear']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 border border-red-100 rounded-lg bg-red-50">
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-red-600" />
                  <div><p className="text-sm font-medium text-red-900">Health Emergency</p><p className="text-xs text-red-700">Immediate medical assistance needed</p></div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('common.discardChanges')}</button>
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm"><Check className="w-4 h-4" />{t('volunteer.updateStatus')}</button>
        </div>
      </div>
    </div>
  );
}
