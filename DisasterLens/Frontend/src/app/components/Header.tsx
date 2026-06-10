import { Bell, User, LogOut, Globe } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { useRole } from '../contexts/RoleContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { RoleBadge } from './RoleBadge';

export function Header() {
  const location = useLocation();
  const { role } = useRole();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, lang, toggleLanguage } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
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
      case '/notify-community': return t('create_alert');
      case '/view-alert': return t('title_alerts');
      case '/query': return t('title_query');
      case '/impact-summary': return t('title_impact_summary');
      case '/incident-logs': return t('title_incident_logs');
      case '/volunteer-coverage': return t('title_volunteer_coverage');
      case '/missing-persons': return t('title_missing_persons');
      case '/volunteer-dashboard': return t('title_volunteer_dashboard');
      case '/add-coverage': return t('title_add_coverage');
      case '/log-activity': return t('title_log_activity');
      case '/event-log': return t('title_event_log');
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

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="border-b border-blue-800 px-8 py-4 z-50 shrink-0 relative" style={{ backgroundColor: '#1E3A8A' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">{getTitle()}</h1>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            style={{ color: '#1E3A8A' }}
            title="Toggle Language (English / Bengali)"
          >
            <Globe className="w-4 h-4" style={{ color: '#1E3A8A' }} />
            <span className="uppercase">{lang === 'en' ? 'EN' : 'BN'}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile & Logout */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-white/10 p-1.5 rounded-lg transition-colors text-left"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm text-white font-medium">{user?.name || 'User'}</p>
                <div className="flex items-center justify-end gap-1.5">
                  <RoleBadge role={role} size="sm" />
                </div>
              </div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" 
                style={{ 
                  backgroundColor: role === 'Admin' ? '#DC2626' : role === 'LocalAuthority' ? '#7C3AED' : '#16A34A'
                }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  <div className="mt-2">
                    <RoleBadge role={role} size="sm" />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}