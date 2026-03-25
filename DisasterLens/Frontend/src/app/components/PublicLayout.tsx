import { Outlet, NavLink, useNavigate } from 'react-router';
import { CloudSun, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * PublicLayout Component
 * 
 * Layout for public pages (no authentication required)
 * Features:
 * - Horizontal navigation bar
 * - Public page links (Weather Dashboard, District Weather, Disaster Details, Alerts)
 * - Language toggle
 * - Login button (or user info if authenticated)
 */
export function PublicLayout() {
  const { t, lang, toggleLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      // Redirect to role-appropriate dashboard
      if (user?.role === 'Volunteer') {
        navigate('/volunteer-dashboard');
      } else if (user?.role === 'LocalAuthority') {
        navigate('/volunteer-coverage');
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: '#1E3A8A' }}
                onClick={handleDashboardClick}
              >
                <CloudSun className="w-6 h-6 text-white" />
              </div>
              <span 
                className="text-lg font-bold text-gray-900 cursor-pointer hidden sm:block"
                onClick={handleDashboardClick}
              >
                {t('resilience_ai')}
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {t('weather_dashboard')}
              </NavLink>
              <NavLink
                to="/district-weather"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {t('district_weather')}
              </NavLink>
              <NavLink
                to="/disaster-details"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {t('disaster_details')}
              </NavLink>
              <NavLink
                to="/view-alert"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {t('alerts')}
              </NavLink>
            </div>

            {/* Right Side: Language Toggle + Login/Logout */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                title={lang === 'en' ? 'Switch to Bengali' : 'Switch to English'}
              >
                <Globe className="w-5 h-5" />
                <span className="ml-1 text-sm font-medium">
                  {lang === 'en' ? 'বাং' : 'EN'}
                </span>
              </button>

              {/* Login/Logout Button */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDashboardClick}
                    className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: '#1E3A8A' }}
                  >
                    {t('go_to_dashboard')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                    title={t('logout')}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#1E3A8A' }}
                >
                  {t('login')}
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="md:hidden border-t border-gray-200 px-4 py-2">
          <div className="flex flex-wrap gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {t('weather_dashboard')}
            </NavLink>
            <NavLink
              to="/district-weather"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {t('district_weather')}
            </NavLink>
            <NavLink
              to="/disaster-details"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {t('disaster_details')}
            </NavLink>
            <NavLink
              to="/view-alert"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {t('alerts')}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            {t('app_title')} © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
