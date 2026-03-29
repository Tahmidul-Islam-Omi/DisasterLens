import React from 'react';
import { useEffect, useState } from 'react';
import { 
  ClipboardList, Home, HeartPulse, Box, AlertTriangle, ChevronRight, CheckCircle2, Clock, Radar
} from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { Task } from '../types';

type DashboardPayload = {
  stats: {
    householdsVisited: number;
    householdsTarget: number;
    peopleRescued: number;
    reliefDelivered: number;
    activeAlerts: number;
  };
  tasks: Task[];
};

export function VolunteerDashboardView() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [payload, setPayload] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<DashboardPayload>('/volunteer/dashboard', token);
        setPayload(data);
      } catch (error) {
        console.error('Failed to load volunteer dashboard', error);
      }
    };
    void load();
  }, []);

  const tasks = payload?.tasks ?? [];
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('volunteer_hub')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('shift_info')}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Clock className="w-4 h-4" /> {t('shift_checkin')}
            </button>
            <Link to="/log-activity" className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-medium hover:bg-blue-800 flex items-center gap-2 shadow-sm">
              <ClipboardList className="w-4 h-4" /> {t('quick_log')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <Home className="w-6 h-6 text-blue-600 mb-3" />
            <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('households_visited')}</p>
            <p className="text-2xl font-bold text-gray-900">{payload?.stats.householdsVisited ?? 0}<span className="text-sm font-normal text-gray-500 ml-1">/ {payload?.stats.householdsTarget ?? 0}</span></p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <HeartPulse className="w-6 h-6 text-green-600 mb-3" />
            <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('people_rescued')}</p>
            <p className="text-2xl font-bold text-gray-900">{payload?.stats.peopleRescued ?? 0}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <Box className="w-6 h-6 text-amber-600 mb-3" />
            <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t('relief_delivered')}</p>
            <p className="text-2xl font-bold text-gray-900">{payload?.stats.reliefDelivered ?? 0}<span className="text-sm font-normal text-gray-500 ml-1">{t('kits_unit')}</span></p>
          </div>
          <div className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-red-600 mb-3" />
            <p className="text-xs text-red-800 font-medium uppercase mb-1">{t('active_alerts')}</p>
            <p className="text-2xl font-bold text-red-700">{payload?.stats.activeAlerts ?? 0}<span className="text-sm font-normal text-red-600 ml-1">{t('in_your_zone')}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('todays_tasks')}</h3>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mr-3" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mr-3 ${task.status === 'in-progress' || task.status === 'assigned' ? 'border-[#1E3A8A] flex items-center justify-center' : 'border-gray-300'}`}>
                        {(task.status === 'in-progress' || task.status === 'assigned') && <div className="w-2.5 h-2.5 bg-[#1E3A8A] rounded-full" />}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</p>
                      <p className="text-xs text-gray-500">{task.deadline || `Task ${index + 1}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <Link to="/field-report" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#1E3A8A] transition-colors group">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <ClipboardList className="w-5 h-5 text-[#1E3A8A]" />
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-[#1E3A8A]">{t('submit_field_report')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('report_incidents_desc')}</p>
              </Link>
              
              <Link to="/community-status" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#1E3A8A] transition-colors group">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                  <HeartPulse className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">{t('update_community_status')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('log_flood_levels')}</p>
              </Link>

              <Link to="/add-coverage" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#1E3A8A] transition-colors group">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                  <Radar className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-green-600">{t('update_coverage')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('share_live_location')}</p>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {t('area_alerts')}
              </h3>
              <div className="space-y-3">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-red-700 uppercase mb-1">{t('flash_flood_warning')}</p>
                  <p className="text-sm text-red-900">{t('flash_flood_msg')}</p>
                  <p className="text-[10px] text-red-600 mt-2">15 {t('mins_ago')}</p>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-amber-700 uppercase mb-1">{t('road_blockage')}</p>
                  <p className="text-sm text-amber-900">{t('road_blockage_msg')}</p>
                  <p className="text-[10px] text-amber-600 mt-2">1 {t('hr_ago')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-40 bg-gray-100 relative">
                 <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="mapGridS" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#mapGridS)" />
                    </svg>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{t('assigned_area')}</p>
                <p className="text-xs text-gray-500 mt-1">{t('last_sync')}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
