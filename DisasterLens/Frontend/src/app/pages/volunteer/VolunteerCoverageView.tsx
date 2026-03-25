import { useState, useEffect } from 'react';
import { Users, MapPin, Box, CheckCircle, Activity } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Coverage {
  id: string;
  name: string;
  location: string;
  radius: number;
  x: number;
  y: number;
  timestamp: number;
}

const staticUpdates = [
  { team: 'Team Alpha', time: 'just now', border: 'border-green-500', msg: 'Coverage updated to 5km radius around Sylhet Sadar. Active distribution ongoing.' },
  { team: 'Team Bravo', time: '5 mins ago', border: 'border-blue-500', msg: 'Moving toward Sunamganj East. ETA 20 minutes.' },
  { team: 'Team Charlie', time: '12 mins ago', border: 'border-amber-500', msg: 'Low supplies. Returning to Supply Hub Sector 4 for restock.' },
  { team: 'Team Delta', time: '15 mins ago', border: 'border-green-500', msg: '35 households visited, 120 relief kits distributed in Zone B.' },
];

export default function VolunteerCoverageView() {
  const { t } = useLanguage();
  const [dynamicCoverages, setDynamicCoverages] = useState<Coverage[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('volunteer_coverages') || '[]');
      setDynamicCoverages(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="w-6 h-6 text-blue-900" />{t('volunteer.coverageTitle')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('volunteer.coverageMapDesc')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-6 gap-6">
        <div className="w-80 flex flex-col gap-6 overflow-y-auto shrink-0">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t('volunteer.activeTeams'), value: '45', color: 'text-blue-900' },
              { label: t('volunteer.villages'), value: '128', color: 'text-gray-900' },
              { label: t('volunteer.coverage'), value: '62%', color: 'text-green-600' },
              { label: t('volunteer.reliefKits'), value: '8.5k', color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" />{t('volunteer.liveUpdates')}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dynamicCoverages.slice().reverse().map(cov => (
                <div key={cov.id} className="border-l-2 border-green-500 pl-3">
                  <p className="text-xs text-gray-500 mb-0.5">{cov.name} • {new Date(cov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-sm text-gray-800 font-medium">Coverage updated: {cov.location} ({cov.radius}km radius)</p>
                </div>
              ))}
              {staticUpdates.map((u, i) => (
                <div key={i} className={`border-l-2 ${u.border} pl-3`}>
                  <p className="text-xs text-gray-500 mb-0.5">{u.team} • {u.time}</p>
                  <p className="text-sm text-gray-800 font-medium">{u.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 flex overflow-hidden">
              <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-r border-gray-200">{t('volunteer.coverageMap')}</button>
              <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 text-gray-600">{t('volunteer.reliefPoints')}</button>
            </div>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 space-y-2">
              {[
                { color: 'bg-green-500', label: t('volunteer.coveredArea') },
                { color: 'bg-red-500', label: t('volunteer.uncoveredTarget') },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${l.color} opacity-50`} /><span className="text-xs font-medium text-gray-700">{l.label}</span></div>
              ))}
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-blue-600" /><span className="text-xs font-medium text-gray-700">{t('volunteer.volunteerUnit')}</span></div>
            </div>
          </div>
          <div className="w-full h-full bg-slate-200 relative">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#CBD5E1" strokeWidth="1"/></pattern>
                <radialGradient id="covGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#22C55E" stopOpacity="0.6"/><stop offset="100%" stopColor="#22C55E" stopOpacity="0.1"/></radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
              <path d="M 100 100 Q 200 50 300 150 T 500 200 Q 600 300 400 400 T 200 300 Z" fill="#DC2626" fillOpacity="0.05" stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 400 100 Q 500 50 650 150 T 800 300 Q 700 400 600 350 T 400 250 Z" fill="#1E3A8A" fillOpacity="0.05" stroke="#1E3A8A" strokeWidth="2" strokeDasharray="5,5" />
              <circle cx="250" cy="200" r="80" fill="url(#covGrad)" />
              <circle cx="550" cy="250" r="100" fill="url(#covGrad)" />
              <circle cx="350" cy="350" r="60" fill="url(#covGrad)" />
              {dynamicCoverages.map(c => <circle key={`c-${c.id}`} cx={c.x} cy={c.y} r={c.radius * 15} fill="url(#covGrad)" />)}
            </svg>
            {dynamicCoverages.map(c => (
              <div key={`m-${c.id}`} className="absolute group cursor-pointer" style={{ top: `${c.y - 12}px`, left: `${c.x - 12}px` }}>
                <div className="w-12 h-12 rounded-full bg-blue-500 opacity-20 absolute -top-3 -left-3 animate-ping" />
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white relative z-10"><Users className="w-3 h-3 text-white" /></div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 z-20">{c.name}<br />{c.location}</div>
              </div>
            ))}
            {[{ top: 180, left: 230, label: 'Team Alpha — Active distribution' }, { top: 230, left: 530, label: 'Team Bravo — Moving' }].map((p, i) => (
              <div key={i} className="absolute group cursor-pointer" style={{ top: `${p.top}px`, left: `${p.left}px` }}>
                <div className="w-12 h-12 rounded-full bg-blue-500 opacity-20 absolute -top-3 -left-3 animate-ping" />
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white relative z-10"><Users className="w-3 h-3 text-white" /></div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 z-20">{p.label}</div>
              </div>
            ))}
            <div className="absolute top-[340px] left-[340px] group cursor-pointer">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white relative z-10 transform rotate-45"><Box className="w-4 h-4 text-white -rotate-45" /></div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 z-20">Supply Hub — Sector 4</div>
            </div>
            {[[170, 200], [190, 210], [210, 260]].map(([top, left], i) => (
              <div key={i} className="absolute" style={{ top: `${top}px`, left: `${left}px` }}><CheckCircle className="w-4 h-4 text-green-600 bg-white rounded-full" /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
