import { ClipboardList, Home, HeartPulse, Box, AlertTriangle, ChevronRight, CheckCircle2, Clock, Radar } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../../i18n/LanguageContext';

const tasks = [
  { id: 1, title: 'Distribute Water Kits in Sector 4', time: 'By 12:00 PM', status: 'completed' },
  { id: 2, title: 'Household survey: Sub-district B', time: '13:00 - 16:00', status: 'active' },
  { id: 3, title: 'Medical supply drop at Camp Alpha', time: 'By 18:00', status: 'pending' },
];

export default function VolunteerDashboardView() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('volunteer.hub')}</h2>
            <p className="text-gray-500 text-sm mt-1">Shift started 2h ago — Sector 4, Sylhet Sadar</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"><Clock className="w-4 h-4" />Shift Check-in</button>
            <Link to="/log-activity" className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 flex items-center gap-2 shadow-sm"><ClipboardList className="w-4 h-4" />Quick Log</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><Home className="w-6 h-6 text-blue-600 mb-3" /><p className="text-xs text-gray-500 font-medium uppercase mb-1">Households Visited</p><p className="text-2xl font-bold text-gray-900">42<span className="text-sm font-normal text-gray-500 ml-1">/ 100</span></p></div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><HeartPulse className="w-6 h-6 text-green-600 mb-3" /><p className="text-xs text-gray-500 font-medium uppercase mb-1">People Rescued</p><p className="text-2xl font-bold text-gray-900">14</p></div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><Box className="w-6 h-6 text-amber-600 mb-3" /><p className="text-xs text-gray-500 font-medium uppercase mb-1">Relief Delivered</p><p className="text-2xl font-bold text-gray-900">85<span className="text-sm font-normal text-gray-500 ml-1">kits</span></p></div>
          <div className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm"><AlertTriangle className="w-6 h-6 text-red-600 mb-3" /><p className="text-xs text-red-800 font-medium uppercase mb-1">Active Alerts</p><p className="text-2xl font-bold text-red-700">2<span className="text-sm font-normal text-red-600 ml-1">in your zone</span></p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Tasks</h3>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mr-3" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mr-3 ${task.status === 'active' ? 'border-blue-900 flex items-center justify-center' : 'border-gray-300'}`}>
                        {task.status === 'active' && <div className="w-2.5 h-2.5 bg-blue-900 rounded-full" />}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</p>
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { to: '/field-report', icon: ClipboardList, color: 'bg-blue-50 text-blue-900 group-hover:text-blue-900', title: 'Submit Field Report', desc: 'Report incidents and observations' },
                { to: '/community-status-update', icon: HeartPulse, color: 'bg-indigo-50 text-indigo-600 group-hover:text-indigo-600', title: 'Community Status', desc: 'Log flood levels and conditions' },
                { to: '/add-coverage', icon: Radar, color: 'bg-green-50 text-green-600 group-hover:text-green-600', title: 'Update Coverage', desc: 'Share your live location zone' },
              ].map(card => (
                <Link key={card.to} to={card.to} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-900 transition-colors group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color.split(' ')[0]}`}><card.icon className={`w-5 h-5 ${card.color.split(' ')[1]}`} /></div>
                  <h4 className={`font-semibold text-gray-900 ${card.color.split(' ')[2]}`}>{card.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" />Area Alerts</h3>
              <div className="space-y-3">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-red-700 uppercase mb-1">Flash Flood Warning</p>
                  <p className="text-sm text-red-900">Water level rising rapidly in Zone A — avoid low-lying roads</p>
                  <p className="text-[10px] text-red-600 mt-2">15 mins ago</p>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-amber-700 uppercase mb-1">Road Blockage</p>
                  <p className="text-sm text-amber-900">N208 highway blocked 3km north — use eastern bypass</p>
                  <p className="text-[10px] text-amber-600 mt-2">1 hr ago</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-40 bg-gray-100 relative">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id="vdGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#vdGrid)" />
                  </svg>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg" />
              </div>
              <div className="p-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Assigned Area: Sector 4</p>
                <p className="text-xs text-gray-500 mt-1">Last synced: 2 mins ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
