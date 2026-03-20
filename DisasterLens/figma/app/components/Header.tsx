import { Bell, User, ChevronDown, Globe } from 'lucide-react';
import { useLocation } from 'react-router';
import { useRole, Role } from '../contexts/RoleContext';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function Header() {
  const location = useLocation();
  const { role, setRole } = useRole();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return t('title_weather_dashboard');
      case '/district-weather': return t('title_district_weather');
      case '/create-alert': return t('title_create_alert');
      case '/view-alert': return t('title_alerts');
      case '/query': return t('title_query');
      case '/impact-summary': return t('title_impact_summary');
      case '/incident-logs': return t('title_incident_logs');
      case '/volunteer-coverage': return t('title_volunteer_coverage');
      case '/missing-persons': return t('title_missing_persons');
      case '/volunteer-dashboard': return t('title_volunteer_dashboard');
      case '/add-coverage': return t('title_add_coverage');
      case '/log-activity': return t('title_log_activity');
      case '/field-report': return t('title_field_report');
      case '/community-status': return t('title_community_status');
      case '/geospatial-risk': return t('title_geospatial_risk');
      case '/infrastructure-exposure': return t('title_infra_exposure');
      case '/vulnerable-communities': return t('title_vulnerable_comms');
      case '/risk-pipeline': return t('title_risk_scoring');
      case '/disaster-details': return t('title_disaster_details');
      case '/register-authority': return t('title_register_authority');
      default: return t('title_default');
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setShowRoleMenu(false);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 z-50 shrink-0 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900 font-bold text-xl">{getTitle()}</h1>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            title="Toggle Language (English / Bengali)"
          >
            <Globe className="w-4 h-4 text-[#1E3A8A]" />
            <span className="hidden sm:inline-block uppercase">{i18n.language}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors text-left"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-900 font-medium">{role === 'Volunteer' ? 'Ahmed Ali' : 'Dr. Sarah Johnson'}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: role === 'Volunteer' ? '#16A34A' : '#0EA5E9' }}>
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">{t('switch_role')}</p>
                </div>
                {(['Admin', 'Coordinator', 'Volunteer'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${role === r ? 'text-[#1E3A8A] font-medium bg-blue-50/50' : 'text-gray-700'}`}
                  >
                    {t(r.toLowerCase())}
                    {role === r && <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}