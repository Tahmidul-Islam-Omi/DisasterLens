import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  AlertTriangle, 
  Home, 
  Activity, 
  Clock, 
  ShieldAlert,
  Zap,
  Building2,
  TrendingUp,
  Search,
  Filter,
  Newspaper,
  Radio,
  Globe2,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DisasterDetailsView() {
  const { t } = useTranslation();
  const [selectedDisaster, setSelectedDisaster] = useState(1);

  const disasters = [
    {
      id: 1,
      name: 'Sylhet Flash Floods',
      type: 'Flood',
      date: 'Active (Started Oct 12)',
      status: 'Critical',
      region: 'Northeast Region',
    },
    {
      id: 2,
      name: 'Cyclone Amphan Remnants',
      type: 'Storm',
      date: 'Past (May 2024)',
      status: 'Resolved',
      region: 'Coastal Belt',
    },
    {
      id: 3,
      name: 'Chittagong Landslides',
      type: 'Landslide',
      date: 'Past (Aug 2024)',
      status: 'Monitoring',
      region: 'Southeast Hills',
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      
      {/* Premium AI Summary Section */}
      <div className="bg-[#1E3A8A] text-white p-6 shrink-0 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-ai" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-ai)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-300" />
            <h2 className="text-lg font-bold text-white tracking-wide">{t('ai_situation_intelligence')}</h2>
            <span className="bg-blue-800/50 border border-blue-700 text-blue-200 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ml-2">
              <Radio className="w-3 h-3" /> {t('live_synthesis')}
            </span>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-4xl">
            The Sylhet region is experiencing unprecedented water level rises exceeding critical danger marks by 1.2m. Over 400,000 individuals remain stranded across Sunamganj and Habiganj districts. Major highway arteries including N2 and N208 are heavily submerged. Local administration has opened 42 additional shelters, though medical infrastructure in low-lying zones is severely compromised. Rescue operations are being mobilized but face high resistance from ongoing severe squalls.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-blue-300 font-medium">{t('synthesized_from')}</span>
            <div className="flex gap-2">
              <span className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1">
                <Globe2 className="w-3 h-3" /> BBC News
              </span>
              <span className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1">
                <Newspaper className="w-3 h-3" /> Reuters
              </span>
              <span className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> NatGov Alerts
              </span>
            </div>
            <span className="text-[10px] text-blue-400 ml-auto flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated 4 mins ago
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Disaster Selector Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 mb-3">{t('event_registry')}</h3>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder={t('search_disasters')} 
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-gray-50">
                <Filter className="w-3 h-3" /> {t('current')}
              </button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-gray-50">
                <Clock className="w-3 h-3" /> {t('past')}
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {disasters.map(d => (
              <div 
                key={d.id}
                onClick={() => setSelectedDisaster(d.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedDisaster === d.id 
                    ? 'border-[#1E3A8A] bg-blue-50/50 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`text-sm font-bold ${selectedDisaster === d.id ? 'text-[#1E3A8A]' : 'text-gray-900'}`}>
                    {d.name}
                  </h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    d.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                    d.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{d.region}</div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {d.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Disaster Details */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            
            {/* Header / Stats */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Sylhet Flash Floods</h1>
                <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Critical Danger Level
                </span>
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
              
              {/* Main Content Area (Map & Areas) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Map View */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" /> {t('impact_zone_map')}
                    </h3>
                    <div className="flex gap-2">
                       <span className="text-[10px] font-medium bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">{t('hotspots')}</span>
                       <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{t('evacuation_routes')}</span>
                    </div>
                  </div>
                  <div className="h-[320px] bg-blue-50/30 relative w-full">
                    {/* Map Mock Grid */}
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-20 pointer-events-none">
                      <defs>
                        <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-map)" />
                    </svg>

                    {/* Hazard Overlays */}
                    <div className="absolute top-[20%] left-[30%] w-[40%] h-[50%] bg-blue-600/20 rounded-[40%] blur-xl animate-pulse"></div>
                    <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                    
                    {/* Map Pins */}
                    <div className="absolute top-[45%] left-[55%] group">
                      <div className="w-4 h-4 bg-[#DC2626] rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer"></div>
                      <div className="absolute -inset-2 bg-red-500/30 rounded-full animate-ping pointer-events-none"></div>
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        Riverbed Alpha (Critical)
                      </div>
                    </div>
                    
                    <div className="absolute top-[35%] left-[40%] group">
                      <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer"></div>
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        Hwy N2 Submerged
                      </div>
                    </div>

                    <div className="absolute top-[25%] left-[65%] group">
                      <div className="w-5 h-5 bg-green-500 rounded border-2 border-white shadow-lg relative z-10 cursor-pointer flex items-center justify-center">
                        <Home className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        Shelter Beta (Operational)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotspot & Area Drill-down */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> {t('hotspot_drilldown')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">Riverbed Settlement Alpha</h4>
                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Priority 1</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">Imminent inundation expected. 4,200 vulnerable population.</p>
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 p-1.5 rounded border border-gray-100">
                           <Activity className="w-3.5 h-3.5 text-red-500" /> Alpha District Hospital - Compromised
                         </div>
                         <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 p-1.5 rounded border border-gray-100">
                           <Zap className="w-3.5 h-3.5 text-red-500" /> Substation Grid B - Offline
                         </div>
                      </div>
                      <button className="w-full mt-3 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                        {t('view_sector_details')} <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">Northern Highway Pass</h4>
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Priority 2</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">Supply line severed. Logistics rerouting required.</p>
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 p-1.5 rounded border border-gray-100">
                           <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Route N2 - Impassable
                         </div>
                         <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 p-1.5 rounded border border-gray-100">
                           <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Bridge 4 - Structural Weakness
                         </div>
                      </div>
                      <button className="w-full mt-3 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                        {t('view_sector_details')} <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Scraped News Feed */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-600" /> {t('verified_news_feed')}
                  </h3>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <NewsCard 
                    source="Reuters" 
                    time="10 mins ago" 
                    title="Flash floods isolate 400,000 in Northeast as rivers breach banks"
                    snippet="Continuous rainfall over the past 72 hours has led to severe flooding, cutting off major transport routes and leaving hundreds of thousands stranded without power."
                  />
                  <NewsCard 
                    source="BBC News" 
                    time="1 hr ago" 
                    title="Emergency shelters overwhelmed as water levels continue to rise"
                    snippet="Local authorities are struggling to accommodate evacuees as primary shelters in Sunamganj hit 150% capacity. Medical supplies are running dangerously low."
                  />
                  <NewsCard 
                    source="Local Dispatch" 
                    time="3 hrs ago" 
                    title="Military deployed for rescue ops in Riverbed Settlement Alpha"
                    snippet="Three military contingents with inflatable vessels have been dispatched to the most critical zones following reports of inundated ground-floor residences."
                  />
                  <NewsCard 
                    source="NatGov Alerts" 
                    time="5 hrs ago" 
                    title="Official Advisory: Avoid N2 Highway"
                    snippet="The ministry of transport has officially closed the N2 highway due to multi-point submergence. All logistics rerouted through Eastern Ridge."
                  />
                </div>
                
                <div className="p-3 border-t border-gray-100 bg-gray-50 text-center shrink-0">
                  <button className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center justify-center gap-1 w-full">
                    {t('load_more')} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    red: 'text-red-600 bg-red-50 border-red-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={`p-1 rounded ${colorClasses[color]}`}>
          <Icon className="w-3 h-3" />
        </div>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">{label}</span>
      </div>
      <div className="text-lg font-black text-gray-900 leading-none">{value}</div>
    </div>
  );
}

function NewsCard({ source, time, title, snippet }: { source: string, time: string, title: string, snippet: string }) {
  return (
    <div className="border-l-2 border-blue-200 pl-3 relative group">
      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-400"></div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-[#1E3A8A] bg-blue-50 px-1.5 py-0.5 rounded">{source}</span>
        <span className="text-[10px] text-gray-400 font-medium">{time}</span>
      </div>
      <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-[#1E3A8A] cursor-pointer">
        {title}
      </h4>
      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{snippet}</p>
      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        Read Full Source <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}