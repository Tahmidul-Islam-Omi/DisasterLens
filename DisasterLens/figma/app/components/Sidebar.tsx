import { useState } from 'react';
import { NavLink, useLocation, Navigate } from 'react-router';
import { 
  LayoutDashboard, 
  CloudSun, 
  AlertTriangle, 
  Database, 
  MessageSquare, 
  MapPinned,
  Activity,
  List,
  Users,
  UserCircle,
  ClipboardList,
  FileText,
  HeartPulse,
  Map,
  Building2,
  MapPin,
  GitMerge,
  Target,
  Menu,
  ChevronLeft,
  UserPlus
} from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { role } = useRole();
  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useTranslation();

  const getAdminMenu = () => [
    { name: t('weather_dashboard'), icon: LayoutDashboard, path: '/' },
    { name: t('geospatial_risk'), icon: Map, path: '/geospatial-risk' },
    { name: t('infra_exposure'), icon: Building2, path: '/infrastructure-exposure' },
    { name: t('vulnerable_comms'), icon: MapPin, path: '/vulnerable-communities' },
    { name: t('risk_scoring'), icon: GitMerge, path: '/risk-pipeline' },
    { name: t('disaster_details'), icon: Target, path: '/disaster-details' },
    { name: t('district_weather'), icon: MapPinned, path: '/district-weather' },
    { name: t('register_authority'), icon: UserPlus, path: '/register-authority' },
    { name: t('alerts'), icon: AlertTriangle, path: '/view-alert' },
    { name: t('query'), icon: MessageSquare, path: '/query' },
    { name: t('impact_summary'), icon: Activity, path: '/impact-summary' },
    { name: t('incident_logs'), icon: List, path: '/incident-logs' },
    { name: t('volunteer_coverage'), icon: Users, path: '/volunteer-coverage' },
    { name: t('missing_persons'), icon: UserCircle, path: '/missing-persons' },
  ];

  const getCoordinatorMenu = () => [
    { name: t('geospatial_risk'), icon: Map, path: '/geospatial-risk' },
    { name: t('infra_exposure'), icon: Building2, path: '/infrastructure-exposure' },
    { name: t('vulnerable_comms'), icon: MapPin, path: '/vulnerable-communities' },
    { name: t('disaster_details'), icon: Target, path: '/disaster-details' },
    { name: t('impact_summary'), icon: Activity, path: '/impact-summary' },
    { name: t('incident_logs'), icon: List, path: '/incident-logs' },
    { name: t('volunteer_coverage'), icon: Users, path: '/volunteer-coverage' },
    { name: t('missing_persons'), icon: UserCircle, path: '/missing-persons' },
    { name: t('alerts'), icon: AlertTriangle, path: '/view-alert' },
  ];

  const getVolunteerMenu = () => [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/volunteer-dashboard' },
    { name: t('log_activity'), icon: ClipboardList, path: '/log-activity' },
    { name: t('field_report'), icon: FileText, path: '/field-report' },
    { name: t('community_status'), icon: HeartPulse, path: '/community-status' },
    { name: t('missing_persons'), icon: UserCircle, path: '/missing-persons' },
  ];

  const getMenuItems = () => {
    switch(role) {
      case 'Volunteer': return getVolunteerMenu();
      case 'Coordinator': return getCoordinatorMenu();
      default: return getAdminMenu();
    }
  };

  const menuItems = getMenuItems();

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-20'} min-h-screen bg-white border-r border-gray-200 shrink-0 flex flex-col transition-all duration-300 relative`}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-500 hover:text-gray-900 z-10 hidden md:flex"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      <div className={`p-6 ${isExpanded ? '' : 'px-4'}`}>
        <div className={`flex items-center gap-2 mb-8 ${isExpanded ? '' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: '#1E3A8A' }}>
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <h2 className="text-gray-900 font-bold leading-tight truncate">ResilienceAI</h2>
              <p className="text-[10px] font-medium text-[#1E3A8A] uppercase tracking-wider truncate">{t(`${role.toLowerCase()}_view`)}</p>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={!isExpanded ? item.name : undefined}
                className={({ isActive }) => `w-full flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={({ isActive }) => isActive ? { backgroundColor: '#1E3A8A' } : {}}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isExpanded && <span className="text-sm font-medium truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}