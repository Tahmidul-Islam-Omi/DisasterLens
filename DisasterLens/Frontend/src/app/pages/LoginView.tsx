import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Role } from '../types';
import { CloudSun } from 'lucide-react';

type TabType = 'login' | 'signup';

export function LoginView() {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { login, signup } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<Role>('Volunteer');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupNameBn, setSignupNameBn] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('Volunteer');
  const [signupArea, setSignupArea] = useState('');
  const [signupAreaBn, setSignupAreaBn] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email: loginEmail, password: loginPassword, role: loginRole });
      
      // Redirect to role-specific dashboard
      const defaultRoute = loginRole === 'Admin' ? '/' : 
                          loginRole === 'LocalAuthority' ? '/volunteer-coverage' : 
                          '/volunteer-dashboard';
      navigate(defaultRoute);
    } catch (err) {
      setError(t('invalid_credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!signupName) {
      setError(t('name_required'));
      return;
    }
    if (!signupEmail) {
      setError(t('email_required'));
      return;
    }
    if (!signupPassword) {
      setError(t('password_required'));
      return;
    }
    if (signupPassword.length < 8) {
      setError(t('password_min_length'));
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError(t('passwords_must_match'));
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name: signupName,
        nameBn: signupNameBn || signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
        role: signupRole,
        assignedArea: signupArea,
        assignedAreaBn: signupAreaBn || signupArea,
      });
      
      // Redirect to role-specific dashboard
      const defaultRoute = signupRole === 'Admin' ? '/' : 
                          signupRole === 'LocalAuthority' ? '/volunteer-coverage' : 
                          '/volunteer-dashboard';
      navigate(defaultRoute);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error_occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-md p-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#1E3A8A' }}>
            <CloudSun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('resilience_ai')}</h1>
          <p className="text-sm text-gray-600 mt-1">{t('app_title')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setError('');
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'signup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('signup')}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={t('enter_email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder={t('enter_password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('select_role')}
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Volunteer">{t('role_volunteer')}</option>
                  <option value="LocalAuthority">{t('role_local_authority')}</option>
                  <option value="Admin">{t('role_admin')}</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {loginRole === 'Admin' && t('role_admin_desc')}
                  {loginRole === 'LocalAuthority' && t('role_local_authority_desc')}
                  {loginRole === 'Volunteer' && t('role_volunteer_desc')}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1E3A8A' }}
              >
                {isLoading ? t('logging_in') : t('sign_in')}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('full_name')} {lang === 'en' ? '(English)' : '(ইংরেজি)'}
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder={t('enter_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {lang === 'bn' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('full_name')} (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={signupNameBn}
                    onChange={(e) => setSignupNameBn(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <input
                  type="text"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder={t('enter_email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone_number')} ({t('optional')})
                </label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder={t('enter_phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('select_role')}
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Volunteer">{t('role_volunteer')}</option>
                  <option value="LocalAuthority">{t('role_local_authority')}</option>
                  <option value="Admin">{t('role_admin')}</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {signupRole === 'Admin' && t('role_admin_desc')}
                  {signupRole === 'LocalAuthority' && t('role_local_authority_desc')}
                  {signupRole === 'Volunteer' && t('role_volunteer_desc')}
                </p>
              </div>

              {(signupRole === 'Volunteer' || signupRole === 'LocalAuthority') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('select_assigned_area')}
                  </label>
                  <input
                    type="text"
                    value={signupArea}
                    onChange={(e) => setSignupArea(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. Sylhet Sadar' : 'যেমন সিলেট সদর'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder={t('enter_password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('confirm_password')}
                </label>
                <input
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder={t('confirm_password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1E3A8A' }}
              >
                {isLoading ? t('creating_account') : t('create_account')}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {t('app_title')} © 2024
        </p>
      </div>
    </div>
  );
}
