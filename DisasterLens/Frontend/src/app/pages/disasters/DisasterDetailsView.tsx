import { useState } from 'react';
import { MapPin, Users, AlertTriangle, Home, Activity, Clock, ShieldAlert, Zap, Building2, TrendingUp, Search, Filter, Newspaper, Radio, Globe2, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const newsFeed = [
  { source: 'Reuters', time: '10 mins ago', title: 'Flash floods isolate 400k residents in Sylhet division', snippet: 'Water levels in the Surma River have exceeded danger marks by 1.5 metres, leaving hundreds of thousands stranded.' },
  { source: 'BBC News', time: '1 hr ago', title: 'Emergency shelters overwhelmed as evacuees flood in', snippet: 'Official capacity across 140 shelters has been exceeded by 40%. Aid workers call for urgent government intervention.' },
  { source: 'Local Dispatch', time: '3 hrs ago', title: 'Military units deployed at Riverbed Alpha sector', snippet: 'Bangladesh Army\'s 19th Infantry Division has begun aerial rescue sortie operations in the most affected zones.' },
  { source: 'NatGov Alerts', time: '5 hrs ago', title: 'Official advisory: Avoid N2 Highway entirely', snippet: 'The N2 National Highway is completely submerged between Sylhet and Sunamganj. All vehicles advised to use northern bypass.' },
];

const disasters = [
  { id: 1, name: 'Sylhet Flash Floods', type: 'Flood', date: 'Active — Started Oct 14', status: 'Critical', region: 'Northeast Region' },
  { id: 2, name: 'Cyclone Amphan Remnants', type: 'Storm', date: 'Past (May 2024)', status: 'Resolved', region: 'Coastal Belt' },
  { id: 3, name: 'Chittagong Landslides', type: 'Landslide', date: 'Past (Aug 2024)', status: 'Monitoring', region: 'Southeast Hills' },
];

function StatBox({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50', red: 'text-red-600 bg-red-50', orange: 'text-orange-600 bg-orange-50',
    green: 'text-green-600 bg-green-50', amber: 'text-amber-600 bg-amber-50', purple: 'text-purple-600 bg-purple-50',
  };
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={`p-1 rounded ${colorClasses[color]}`}><Icon className="w-3 h-3" /></div>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">{label}</span>
      </div>
      <div className="text-lg font-black text-gray-900 leading-none">{value}</div>
    </div>
  );
}

export default function DisasterDetailsView() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState(1);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      <div className="bg-blue-900 text-white p-6 shrink-0 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid-ai" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid-ai)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-300" />
            <h2 className="text-lg font-bold text-white tracking-wide">{t('disaster.aiIntelligence')}</h2>
            <span className="bg-blue-800/50 border border-blue-700 text-blue-200 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ml-2">
              <Radio className="w-3 h-3" />{t('disaster.liveSynthesis')}
            </span>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-4xl">
            The Sylhet region is experiencing unprecedented water level rises exceeding critical danger marks by 1.2m. Over 400,000 individuals remain stranded across Sunamganj and Habiganj districts. Major highway arteries including N2 and N208 are heavily submerged. Rescue operations are being mobilized but face high resistance from ongoing severe squalls.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-blue-300 font-medium">{t('disaster.synthesizedFrom')}</span>
            <div className="flex gap-2">
              {[{ icon: Globe2, label: 'BBC News' }, { icon: Newspaper, label: 'Reuters' }, { icon: ShieldAlert, label: 'NatGov' }].map(s => (
                <span key={s.label} className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1"><s.icon className="w-3 h-3" />{s.label}</span>
              ))}
            </div>
            <span className="text-[10px] text-blue-400 ml-auto flex items-center gap-1"><Clock className="w-3 h-3" />Updated 4 mins ago</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 mb-3">{t('disaster.eventRegistry')}</h3>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input type="text" placeholder={t('disaster.searchDisasters')} className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-gray-50"><Filter className="w-3 h-3" />{t('disaster.current')}</button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-gray-50"><Clock className="w-3 h-3" />{t('disaster.past')}</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {disasters.map(d => (
              <div key={d.id} onClick={() => setSelectedId(d.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedId === d.id ? 'border-blue-900 bg-blue-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`text-sm font-bold ${selectedId === d.id ? 'text-blue-900' : 'text-gray-900'}`}>{d.name}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${d.status === 'Critical' ? 'bg-red-100 text-red-700' : d.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{d.status}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{d.region}</div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{d.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Sylhet Flash Floods</h1>
                <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Critical Danger Level</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <StatBox label="Affected Pop" value="420k" icon={Users} color="blue" />
                <StatBox label="Fatalities" value="12" icon={Activity} color="red" />
                <StatBox label="Missing" value="48" icon={Search} color="orange" />
                <StatBox label="Rescued" value="3,150" icon={Home} color="green" />
                <StatBox label="Damages" value="$14.2M" icon={TrendingUp} color="amber" />
                <StatBox label="Exposed Infra" value="124" icon={Building2} color="purple" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" />{t('disaster.impactZoneMap')}</h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-medium bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">{t('disaster.hotspots')}</span>
                      <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{t('disaster.evacuationRoutes')}</span>
                    </div>
                  </div>
                  <div className="h-[320px] bg-blue-50/30 relative w-full">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-20 pointer-events-none">
                      <defs><pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/></pattern></defs>
                      <rect width="100%" height="100%" fill="url(#grid-map)" />
                    </svg>
                    <div className="absolute top-[20%] left-[30%] w-[40%] h-[50%] bg-blue-600/20 rounded-[40%] blur-xl animate-pulse" />
                    <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-red-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute top-[45%] left-[55%] group">
                      <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer" />
                      <div className="absolute -inset-2 bg-red-500/30 rounded-full animate-ping pointer-events-none" />
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Riverbed Alpha (Critical)</div>
                    </div>
                    <div className="absolute top-[25%] left-[65%] group">
                      <div className="w-5 h-5 bg-green-500 rounded border-2 border-white shadow-lg relative z-10 cursor-pointer flex items-center justify-center"><Home className="w-3 h-3 text-white" /></div>
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Shelter Beta (Operational)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500" />{t('disaster.hotspotDrilldown')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Riverbed Settlement Alpha', priority: 'Priority 1', color: 'red', desc: 'Imminent inundation. 4,200 vulnerable population.', warnings: [{ icon: Activity, text: 'Alpha District Hospital — Compromised' }, { icon: Zap, text: 'Substation Grid B — Offline' }] },
                      { name: 'Northern Highway Pass', priority: 'Priority 2', color: 'orange', desc: 'Supply line severed. Logistics rerouting required.', warnings: [{ icon: AlertTriangle, text: 'Route N2 — Impassable' }, { icon: AlertTriangle, text: 'Bridge 4 — Structural Weakness' }] },
                    ].map(h => (
                      <div key={h.name} className={`bg-white p-4 rounded-xl border border-${h.color}-200 shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 text-sm">{h.name}</h4>
                          <span className={`text-[10px] font-bold bg-${h.color}-100 text-${h.color}-700 px-1.5 py-0.5 rounded`}>{h.priority}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{h.desc}</p>
                        <div className="space-y-2">
                          {h.warnings.map((w, i) => <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 p-1.5 rounded border border-gray-100"><w.icon className={`w-3.5 h-3.5 text-${h.color}-500`} />{w.text}</div>)}
                        </div>
                        <button className="w-full mt-3 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded transition-colors flex items-center justify-center gap-1">{t('disaster.viewSectorDetails')}<ChevronRight className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Radio className="w-4 h-4 text-blue-600" />{t('disaster.verifiedNewsFeed')}</h3>
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" /></span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {newsFeed.map((item, idx) => (
                    <div key={idx} className="border-l-2 border-blue-200 pl-3 relative group">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-400" />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded">{item.source}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-blue-900 cursor-pointer">{item.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{item.snippet}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">{t('disaster.readFullSource')}<ExternalLink className="w-3 h-3" /></div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 bg-gray-50 text-center shrink-0">
                  <button className="text-xs font-bold text-blue-900 hover:underline flex items-center justify-center gap-1 w-full">{t('disaster.loadMore')}<ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
