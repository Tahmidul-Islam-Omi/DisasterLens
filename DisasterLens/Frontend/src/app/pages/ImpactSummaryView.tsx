import { useLanguage } from '../i18n/LanguageContext';
import { 
  HeartPulse, 
  AlertCircle, 
  Users, 
  Home, 
  DollarSign, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Newspaper 
} from 'lucide-react';

export function ImpactSummaryView() {
  const { t, d } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t('ai_impact_summary')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('ai_impact_desc')}</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <HeartPulse className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">42</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('fatalities')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <AlertCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">128</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('missing')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">3,450</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('rescued')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">12k+</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('damages')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">$45M</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('est_loss')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <MapPin className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">14</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('affected_areas')}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm text-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-700">Level 4</p>
            <p className="text-xs text-red-600 font-medium uppercase">{t('danger_level')}</p>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1E3A8A]"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="text-lg font-semibold text-gray-900">{t('executive_ai_summary')}</h3>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium border border-blue-200">
              {t('updated_2_mins')}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">
            <strong className="text-gray-900">{t('situation_overview')}</strong> {t('situation_overview_text')} <br/><br/>
            <strong className="text-gray-900">{t('critical_needs')}</strong> {t('critical_needs_text')}<br/><br/>
            <strong className="text-gray-900">{t('resource_deployment')}</strong> {t('resource_deployment_text')}
          </p>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4">
            <div className="flex-1 bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-xs text-red-600 font-semibold uppercase mb-1">{t('priority_actions')}</p>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                <li>{t('action_1')}</li>
                <li>{t('action_2')}</li>
                <li>{t('action_3')}</li>
              </ul>
            </div>
            <div className="flex-1 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700 font-semibold uppercase mb-1">{t('renovation_needs')}</p>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>{t('renovation_1')}</li>
                <li>{t('renovation_2')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Split Section: News Feed vs AI Summary & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline & Affected Areas (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                {t('live_incident_timeline')}
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                
                {/* Timeline Item 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#DC2626] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-semibold text-gray-900 text-sm">{t('bridge_collapse')}</div>
                      <time className="font-mono text-xs text-red-500 font-medium">10:42 AM</time>
                    </div>
                    <div className="text-gray-500 text-xs">{t('bridge_collapse_desc')}</div>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#1E3A8A] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-semibold text-gray-900 text-sm">{t('rescue_units_deployed')}</div>
                      <time className="font-mono text-xs text-gray-500 font-medium">09:15 AM</time>
                    </div>
                    <div className="text-gray-500 text-xs">{t('rescue_units_desc')}</div>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-amber-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-semibold text-gray-900 text-sm">{t('power_outage')}</div>
                      <time className="font-mono text-xs text-gray-500 font-medium">06:30 AM</time>
                    </div>
                    <div className="text-gray-500 text-xs">{t('power_outage_desc')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Affected Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                {t('key_affected_areas')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Sylhet Sadar', nameBn: 'সিলেট সদর', severityKey: 'critical', people: '120k+', trendKey: 'worsening' },
                  { name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', severityKey: 'critical', people: '85k+', trendKey: 'worsening' },
                  { name: 'Netrokona', nameBn: 'নেত্রকোনা', severityKey: 'high', people: '45k+', trendKey: 'stable' },
                  { name: 'Habiganj', nameBn: 'হবিগঞ্জ', severityKey: 'moderate', people: '20k+', trendKey: 'improving' },
                ].map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{d(area.name, area.nameBn)}</p>
                      <p className="text-xs text-gray-500">{t('pop')}: {area.people}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        area.severityKey === 'critical' ? 'bg-red-100 text-red-700' :
                        area.severityKey === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {t(area.severityKey)}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{t(area.trendKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scraped News Feed (Right column) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[700px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                {t('live_intel_feed')}
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {t('scraping')}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {/* Feed Item */}
              <div className="border-l-2 border-[#DC2626] pl-3 py-1">
                <p className="text-xs text-gray-400 font-medium mb-1 flex justify-between">
                  <span>Source: The Daily Star</span>
                  <span>10 mins ago</span>
                </p>
                <p className="text-sm text-gray-800 font-medium">Thousands stranded in Sylhet as major rivers cross danger mark by 120cm.</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Flood</span>
                  <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">Critical</span>
                </div>
              </div>

              {/* Feed Item */}
              <div className="border-l-2 border-[#1E3A8A] pl-3 py-1">
                <p className="text-xs text-gray-400 font-medium mb-1 flex justify-between">
                  <span>Source: Prothom Alo (Translated)</span>
                  <span>45 mins ago</span>
                </p>
                <p className="text-sm text-gray-800 font-medium">Army deployed for rescue operations in remote upazilas of Sunamganj.</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Rescue</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Military</span>
                </div>
              </div>

              {/* Feed Item */}
              <div className="border-l-2 border-orange-400 pl-3 py-1">
                <p className="text-xs text-gray-400 font-medium mb-1 flex justify-between">
                  <span>Source: Twitter / X (Verified)</span>
                  <span>1 hr ago</span>
                </p>
                <p className="text-sm text-gray-800 font-medium">Urgent need for drinking water at Shelter Camp 4 in Netrokona. Supplies running out.</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Supplies</span>
                  <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100">High Priority</span>
                </div>
              </div>

               {/* Feed Item */}
               <div className="border-l-2 border-gray-300 pl-3 py-1">
                <p className="text-xs text-gray-400 font-medium mb-1 flex justify-between">
                  <span>Source: Local Radio</span>
                  <span>2 hrs ago</span>
                </p>
                <p className="text-sm text-gray-800 font-medium">Weather department forecasts additional 150mm rainfall in the next 24 hours.</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Forecast</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
