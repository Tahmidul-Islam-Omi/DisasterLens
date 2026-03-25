import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getDefaultRouteForRole } from '../config/permissions';
import { RoleBadge } from '../components/RoleBadge';

/**
 * ForbiddenView Component
 * 
 * Displays when authenticated users try to access unauthorized routes
 * Shows user's current role and provides navigation options
 */
export function ForbiddenView() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (user?.role) {
      const defaultRoute = getDefaultRouteForRole(user.role);
      navigate(defaultRoute);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('unauthorized_access')}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {t('unauthorized_message')}
          </p>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">{t('logged_in_as')}</p>
              <p className="font-medium text-gray-900 mb-2">{user.name}</p>
              <RoleBadge role={user.role} size="sm" />
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: '#1E3A8A' }}
            >
              <Home className="w-5 h-5" />
              {t('go_to_dashboard')}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
