import { useState } from 'react';
import {
  Upload, Search, UserCircle, MapPin, Calendar, Clock,
  Phone, AlertTriangle, CheckCircle, ChevronRight, Map,
  ZoomIn, ZoomOut, Users, Info
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const mockResults = [
  { id: 1, name: 'Ayesha Begum', age: 34, lastSeen: 'Sylhet Sadar, Zone A', date: '2023-10-24 14:30', status: 'Possible Match', score: 94, phone: '+880 1711-000000', img: 'https://images.unsplash.com/photo-1705940372495-ab4ed45d3102?w=500&q=80' },
  { id: 2, name: 'Unknown Sighting', age: 30, lastSeen: 'Netrokona Camp 2', date: '2023-10-25 09:15', status: 'Unverified Sighting', score: 88, phone: 'Camp Admin: +880 1812-111111', img: 'https://images.unsplash.com/photo-1748200100199-fed2be4c31eb?w=500&q=80' },
  { id: 3, name: 'Fatima', age: 36, lastSeen: 'Sunamganj Sector 3', date: '2023-10-23 18:00', status: 'Reported Missing', score: 82, phone: '+880 1913-222222', img: 'https://images.unsplash.com/photo-1647980188230-acfc89a718bb?w=500&q=80' },
  { id: 4, name: 'Unidentified Female', age: 35, lastSeen: 'Habiganj Center', date: '2023-10-25 11:45', status: 'Rescued / Safe', score: 76, phone: 'Hospital Desk: +880 1614-333333', img: 'https://images.unsplash.com/flagged/photo-1579924711789-872f06ecf220?w=500&q=80' },
  { id: 5, name: 'Rina Akhtar', age: 32, lastSeen: 'Moulvibazar Route', date: '2023-10-22 16:20', status: 'Possible Match', score: 71, phone: '+880 1715-444444', img: 'https://images.unsplash.com/photo-1561165804-4ec46664a4cb?w=500&q=80' },
];

export default function MissingPersonsView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'map' | 'report' | 'search'>('map');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapZoom, setMapZoom] = useState<'zoomed-out' | 'zoomed-in'>('zoomed-out');

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => { setIsSearching(false); setShowResults(true); }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><UserCircle className="w-6 h-6 text-blue-900" />{t('volunteer.missingPersonsTitle')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('volunteer.missingPersonsDesc')}</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[{ key: 'map', label: 'Area Map' }, { key: 'search', label: 'Search by Image' }, { key: 'report', label: 'Report Missing' }].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {activeTab === 'map' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-900" />Area Distribution Map</h3>
                <p className="text-xs text-gray-500 mt-0.5">Click cluster to zoom in on individual reports</p>
              </div>
              <div className="flex gap-2">
                {[{ icon: ZoomOut, key: 'zoomed-out' as const }, { icon: ZoomIn, key: 'zoomed-in' as const }].map(b => (
                  <button key={b.key} onClick={() => setMapZoom(b.key)} className={`p-2 rounded border ${mapZoom === b.key ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}><b.icon className="w-4 h-4" /></button>
                ))}
              </div>
            </div>

            <div className="flex-1 relative bg-blue-50/30 overflow-hidden group">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-10 pointer-events-none transition-transform duration-700 ease-in-out" style={{ transform: mapZoom === 'zoomed-in' ? 'scale(2.5) translate(-10%, -10%)' : 'scale(1)' }}>
                <defs><pattern id="mpGrid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E3A8A" strokeWidth="1"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#mpGrid)" />
              </svg>

              {mapZoom === 'zoomed-out' ? (
                <div className="absolute inset-0">
                  {[
                    { top: '30%', left: '25%', count: 14, label: 'Sylhet Sadar', sub: 'Critical Zone', color: 'bg-red-600', bg: 'bg-red-500/20', pulse: true },
                    { top: '50%', left: '60%', count: 5, label: 'Sunamganj', sub: 'River Belt', color: 'bg-amber-500', bg: 'bg-amber-500/20', pulse: false },
                    { top: '20%', left: '70%', count: 2, label: 'Netrokona', sub: '', color: 'bg-blue-600', bg: 'bg-blue-500/20', pulse: false },
                  ].map(c => (
                    <div key={c.label} className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" style={{ top: c.top, left: c.left }} onClick={() => setMapZoom('zoomed-in')}>
                      <div className={`${c.bg} rounded-full flex items-center justify-center ${c.pulse ? 'animate-pulse' : ''}`} style={{ width: `${40 + c.count * 2}px`, height: `${40 + c.count * 2}px` }}>
                        <div className={`${c.color} rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg text-sm`} style={{ width: `${24 + c.count}px`, height: `${24 + c.count}px` }}>{c.count}</div>
                      </div>
                      <span className="mt-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900 border border-gray-200 shadow-sm text-center">{c.label}{c.sub && <><br /><span className="text-[10px] text-gray-500 font-medium">{c.sub}</span></>}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0">
                  {[
                    { top: '25%', left: '20%', name: 'Ayesha Begum, 34', time: '2 hours ago', img: mockResults[0].img, color: 'bg-red-600' },
                    { top: '32%', left: '28%', name: 'Unknown Male, ~40', time: '5 hours ago', img: null, color: 'bg-red-600' },
                    { top: '28%', left: '32%', name: 'Fatima, 36', time: '1 day ago', img: mockResults[2].img, color: 'bg-red-600' },
                    { top: '48%', left: '58%', name: 'Rina Akhtar, 32', time: '3 days ago', img: mockResults[4].img, color: 'bg-amber-500' },
                  ].map((p, i) => (
                    <div key={i} className="absolute group" style={{ top: p.top, left: p.left }}>
                      <div className={`w-4 h-4 ${p.color} rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer hover:scale-125 transition-transform`} />
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <div className="flex gap-2">
                          {p.img ? <img src={p.img} alt={p.name} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400"><UserCircle className="w-6 h-6" /></div>}
                          <div><p className="text-xs font-bold text-gray-900">{p.name}</p><p className="text-[10px] text-gray-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{p.time}</p></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-900" />Hover pins for details
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-3 gap-4 shrink-0">
              <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"><Users className="w-5 h-5 text-red-600" /></div>
                <div><p className="text-xs text-gray-500 font-medium">Total Missing (Active)</p><p className="text-lg font-bold text-gray-900">21</p></div>
              </div>
              <div className="col-span-2 flex items-center justify-around">
                {[['bg-red-600', 'High Density'], ['bg-amber-500', 'Medium Density'], ['bg-blue-600', 'Low Density']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-2"><div className={`w-3 h-3 ${c} rounded-full shadow-sm`} /><span className="text-xs text-gray-600 font-medium">{l}</span></div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'search' ? (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Facial Recognition Search</h3>
                  <p className="text-sm text-gray-500 mb-6">Upload a photo to search our database of missing persons and sightings.</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50/50">
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-900 animate-spin mb-4" />
                        <p className="text-sm font-medium text-blue-900">Analyzing facial features...</p>
                        <p className="text-xs text-gray-500 mt-1">Cross-referencing 2,400+ records</p>
                      </div>
                    ) : (
                      <><Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" /><p className="text-sm font-medium text-gray-900">Click to upload or drag & drop</p><p className="text-xs text-gray-500 mt-1">JPG, PNG — clear face required</p></>
                    )}
                  </div>
                  {!isSearching && !showResults && <button onClick={handleSearch} className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800"><Search className="w-4 h-4" />Run AI Search</button>}
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="w-8 h-8 text-blue-900" /></div>
                  <h4 className="font-semibold text-gray-900 mb-2">High-Trust Database</h4>
                  <p className="text-sm text-gray-600 max-w-sm">Matched against verified sightings, shelters, and medical facilities across active disaster zones.</p>
                </div>
              </div>
            </div>

            {showResults && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Top Potential Matches</h3>
                  <button className="text-sm font-medium text-blue-900 hover:text-blue-800">Export Report</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockResults.map(r => (
                    <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                        <img src={r.img} alt={r.name} className="w-full h-full object-cover" onError={e => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect fill="%23f3f4f6"/></svg>'; }} />
                        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-blue-900 shadow-sm">{r.score}% match</div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-bold text-gray-900 truncate">{r.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${r.status === 'Rescued / Safe' ? 'bg-green-100 text-green-700' : r.status === 'Possible Match' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                          </div>
                          <div className="space-y-1 mt-2">
                            <p className="text-xs text-gray-600 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" />{r.lastSeen}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5"><Clock className="w-3 h-3 text-gray-400" />{r.date}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" />{r.phone}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end"><button className="text-xs font-medium text-blue-900 flex items-center hover:underline">View Full Details<ChevronRight className="w-3 h-3 ml-0.5" /></button></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Map className="w-5 h-5 text-gray-500" />Last Seen Locations</h4>
                  <div className="h-48 bg-gray-100 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20"><svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="rsGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#rsGrid)" /></svg></div>
                    {[['40%', '30%', 'bg-blue-600 animate-pulse'], ['60%', '50%', 'bg-amber-500'], ['30%', '60%', 'bg-green-500'], ['70%', '50%', 'bg-amber-500'], ['80%', '45%', 'bg-blue-600']].map(([top, left, cls], i) => (
                      <div key={i} className={`absolute w-3 h-3 ${cls} rounded-full border-2 border-white shadow-md`} style={{ top, left }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Report a Missing Person</h3>
              <p className="text-sm text-gray-500">File an official missing person report for disaster-affected individuals</p>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" className={inputCls} placeholder="e.g. John Doe" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Age</label><input type="number" className={inputCls} placeholder="e.g. 35" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><select className={inputCls + ' bg-white'}><option>Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Seen Location</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" className={inputCls + ' pl-9'} placeholder="Area, village or landmark" /></div></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Date Last Seen</label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" className={inputCls + ' pl-9'} /></div></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Time Last Seen</label><div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="time" className={inputCls + ' pl-9'} /></div></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Photo (recommended)</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer bg-white"><Upload className="w-6 h-6 text-gray-400 mb-2" /><p className="text-xs font-medium text-gray-900">Upload photo</p><p className="text-[10px] text-gray-500 mt-1">Clear face photo preferred</p></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Clothing Description</label><input type="text" className={inputCls} placeholder="Color, style, notable items..." /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Your Contact</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="tel" className={inputCls + ' pl-9'} placeholder="Phone number" /></div></div>
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label><textarea rows={3} className={inputCls + ' resize-none'} placeholder="Any additional details, circumstances, or other known sightings..." /></div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="button" className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-sm"><CheckCircle className="w-4 h-4" />Submit Report</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm';
