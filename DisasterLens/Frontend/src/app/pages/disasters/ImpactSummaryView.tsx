import { HeartPulse, AlertCircle, Users, Home, DollarSign, MapPin, AlertTriangle, Activity, Clock, Newspaper } from 'lucide-react';
import { WeatherCard } from '../../components/weather/WeatherCard';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ImpactSummaryView() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t('impact.title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('impact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            { icon: HeartPulse, value: '42', label: t('impact.fatalities'), color: 'text-red-600', bg: 'bg-white' },
            { icon: AlertCircle, value: '128', label: t('impact.missing'), color: 'text-orange-500', bg: 'bg-white' },
            { icon: Users, value: '3,450', label: t('impact.rescued'), color: 'text-green-600', bg: 'bg-white' },
            { icon: Home, value: '12k+', label: t('impact.damages'), color: 'text-blue-600', bg: 'bg-white' },
            { icon: DollarSign, value: '$45M', label: t('impact.estLoss'), color: 'text-purple-600', bg: 'bg-white' },
            { icon: MapPin, value: '14', label: t('impact.affectedAreas'), color: 'text-indigo-600', bg: 'bg-white' },
            { icon: AlertTriangle, value: 'Level 4', label: t('impact.dangerLevel'), color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.bg} p-4 rounded-xl border border-gray-200 shadow-sm text-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${idx === 6 ? 'text-red-700' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-xs font-medium uppercase ${idx === 6 ? 'text-red-600' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-900" />
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-900" />
              <h3 className="text-lg font-semibold text-gray-900">{t('impact.aiSummary')}</h3>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium border border-blue-200">Updated 2 mins ago</span>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">
            <strong className="text-gray-900">{t('impact.situationOverview')}</strong> Severe flooding has impacted 14 districts across 4 divisions. Water levels in Surma and Kushiyara rivers remain above danger mark.<br /><br />
            <strong className="text-gray-900">{t('impact.criticalNeeds')}</strong> Emergency evacuation needed in 3 critical zones. Medical teams required in Sylhet Sadar and Sunamganj.<br /><br />
            <strong className="text-gray-900">{t('impact.resourceDeployment')}</strong> 12 rescue teams active, 6 helicopter sorties completed, 5,000 relief packages distributed.
          </p>
          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4">
            <div className="flex-1 bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-xs text-red-600 font-semibold uppercase mb-1">{t('impact.priorityActions')}</p>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                <li>Deploy 3 more rescue teams to Sylhet Sadar</li>
                <li>Activate emergency medical camps in Sunamganj</li>
                <li>Coordinate helicopter evacuations for isolated villages</li>
              </ul>
            </div>
            <div className="flex-1 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700 font-semibold uppercase mb-1">{t('impact.renovationNeeds')}</p>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>Emergency road repairs on National Highway 2</li>
                <li>Temporary bridge construction at Dhaka-Sylhet link</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                {t('impact.liveTimeline')}
              </h3>
              <div className="space-y-6">
                {[
                  { color: '#DC2626', title: 'Bridge Collapse on N2 Highway', time: '10:42 AM', desc: 'Critical bridge connecting Sylhet to Sunamganj collapsed due to flood pressure.' },
                  { color: '#1E3A8A', title: '18 Rescue Units Deployed', time: '09:15 AM', desc: '18 rescue teams have been dispatched to Sylhet and Sunamganj divisions.' },
                  { color: '#F59E0B', title: 'Power Grid Failure in Sylhet', time: '06:30 AM', desc: 'Sylhet district lost power. Generators deployed to hospitals and shelters.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1 p-4 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <time className="text-xs text-gray-500">{item.time}</time>
                      </div>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                {t('impact.keyAffectedAreas')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Sylhet Sadar', severity: 'Critical', people: '120k+', trend: 'Worsening' },
                  { name: 'Sunamganj', severity: 'Critical', people: '85k+', trend: 'Worsening' },
                  { name: 'Netrokona', severity: 'High', people: '45k+', trend: 'Stable' },
                  { name: 'Habiganj', severity: 'Moderate', people: '20k+', trend: 'Improving' },
                ].map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{area.name}</p>
                      <p className="text-xs text-gray-500">Pop: {area.people}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${area.severity === 'Critical' ? 'bg-red-100 text-red-700' : area.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                        {area.severity}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{area.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[700px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                {t('impact.liveIntelFeed')}
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t('impact.scraping')}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {[
                { source: 'The Daily Star', time: '10 mins ago', text: 'Thousands stranded in Sylhet as major rivers cross danger mark by 120cm.', tag: 'Flood', urgency: 'Critical', borderColor: '#DC2626' },
                { source: 'Prothom Alo (Translated)', time: '45 mins ago', text: 'Army deployed for rescue operations in remote upazilas of Sunamganj.', tag: 'Rescue', urgency: 'Military', borderColor: '#1E3A8A' },
                { source: 'Twitter / X (Verified)', time: '1 hr ago', text: 'Urgent need for drinking water at Shelter Camp 4 in Netrokona.', tag: 'Supplies', urgency: 'High Priority', borderColor: '#F59E0B' },
                { source: 'Local Radio', time: '2 hrs ago', text: 'Weather dept forecasts additional 150mm rainfall in next 24 hours.', tag: 'Forecast', urgency: '', borderColor: '#9CA3AF' },
              ].map((item, idx) => (
                <div key={idx} className="pl-3 py-1 border-l-2" style={{ borderColor: item.borderColor }}>
                  <p className="text-xs text-gray-400 font-medium mb-1 flex justify-between"><span>{item.source}</span><span>{item.time}</span></p>
                  <p className="text-sm text-gray-800 font-medium">{item.text}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.tag}</span>
                    {item.urgency && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">{item.urgency}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <WeatherCard title={t('impact.reliefPackages')} value="5,000" unit="" icon={Users} trend={t('impact.distributedToday')} color="#16A34A" />
          <WeatherCard title={t('impact.activeRescueTeams')} value="12" unit="" icon={HeartPulse} trend={t('impact.inField')} color="#DC2626" />
          <WeatherCard title={t('impact.shelterCapacity')} value="85%" unit="" icon={Home} trend={t('impact.atCapacity')} color="#F59E0B" />
          <WeatherCard title={t('impact.evacuated')} value="18,400" unit="" icon={MapPin} trend={t('impact.lastSixHours')} color="#1E3A8A" />
        </div>
      </div>
    </div>
  );
}
