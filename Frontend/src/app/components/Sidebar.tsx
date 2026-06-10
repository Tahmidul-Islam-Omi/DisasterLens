import { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  CloudSun, 
  AlertTriangle, 
  MessageSquare, 
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
  Menu,
  ChevronLeft,
  UserPlus
} from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useLanguage } from '../i18n/LanguageContext';

export function Sidebar() {
  const { role } = useRole();
  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useLanguage();

  const getAdminMenu = () => [
    { name: t('weather_dashboard'), icon: CloudSun, path: '/' },
    { name: t('geospatial_risk'), icon: Map, path: '/geospatial-risk' },
    { name: t('infra_exposure'), icon: Building2, path: '/infrastructure-exposure' },
    { name: t('vulnerable_comms'), icon: MapPin, path: '/vulnerable-communities' },
    { name: t('risk_scoring'), icon: GitMerge, path: '/risk-pipeline' },
    { name: t('register_authority'), icon: UserPlus, path: '/register-authority' },
    { name: t('alerts'), icon: AlertTriangle, path: '/view-alert' },
    { name: t('query'), icon: MessageSquare, path: '/query' },
    { name: t('impact_summary'), icon: Activity, path: '/impact-summary' },
    { name: t('incident_logs'), icon: List, path: '/incident-logs' },
  ];

  const getLocalAuthorityMenu = () => [
    { name: t('weather_dashboard'), icon: CloudSun, path: '/' },
    { name: t('dashboard'), icon: LayoutDashboard, path: '/local-authority-dashboard' },
    { name: t('vulnerable_comms'), icon: MapPin, path: '/vulnerable-communities' },
    { name: t('volunteer_coverage'), icon: Users, path: '/volunteer-coverage' },
    { name: t('volunteer_management'), icon: UserPlus, path: '/volunteer-management' },
    { name: t('task_management'), icon: ClipboardList, path: '/task-management' },
    { name: t('member_list'), icon: List, path: '/member-list' },
    { name: t('event_log'), icon: Activity, path: '/event-log' },
    { name: t('alerts'), icon: AlertTriangle, path: '/view-alert' },
    { name: t('create_alert'), icon: AlertTriangle, path: '/notify-community' },
    { name: t('community_status'), icon: HeartPulse, path: '/community-responses' },
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
      case 'LocalAuthority': return getLocalAuthorityMenu();
      case 'Admin': return getAdminMenu();
      default: return getVolunteerMenu();
    }
  };

  const menuItems = getMenuItems();

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-20'} min-h-screen border-r border-blue-800 shrink-0 flex flex-col transition-all duration-300 relative`}
      style={{ backgroundColor: '#1E3A8A' }}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 border border-blue-800 rounded-full p-1 shadow-sm z-10 hidden md:flex text-white hover:text-blue-200"
        style={{ backgroundColor: '#1E3A8A' }}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      <div className={`p-6 ${isExpanded ? '' : 'px-4'}`}>
        <div className={`flex items-center gap-2 mb-8 ${isExpanded ? '' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shadow-sm shrink-0">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <h2 className="text-white font-bold leading-tight truncate">ResilienceAI</h2>
              <p className="text-[10px] font-medium text-blue-200 uppercase tracking-wider truncate">
                {role === 'Admin' && t('admin_view')}
                {role === 'LocalAuthority' && t('local_authority_view')}
                {role === 'Volunteer' && t('volunteer_view')}
              </p>
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
                    : 'text-blue-100 hover:bg-white/10'
                }`}
                style={({ isActive }) => isActive ? { backgroundColor: '#1E40AF' } : {}}
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