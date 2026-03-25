import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, CheckCircle, Crosshair, MapPin, Radar, Save } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AddCoverageView() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [location, setLocation] = useState('Sylhet Sadar, Sector 4');
  const [radius, setRadius] = useState<number>(2);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const existing = JSON.parse(localStorage.getItem('volunteer_coverages') || '[]');
      const newCoverage = {
        id: 'v-' + Date.now(),
        name: 'Team Alpha (You)',
        location,
        radius,
        x: Math.floor(Math.random() * 500) + 150,
        y: Math.floor(Math.random() * 250) + 100,
        timestamp: Date.now(),
      };
      localStorage.setItem('volunteer_coverages', JSON.stringify([...existing, newCoverage]));
    } catch (err) {
      console.error('Failed to save coverage:', err);
    }
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => navigate('/volunteer-dashboard'), 1500);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Radar className="w-6 h-6 text-blue-900" />
            {t('volunteer.updateCoverageArea')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t('volunteer.coverageDesc')}</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900">{t('volunteer.currentLocation')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input type="text" required className="pl-10 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block p-2.5"
                  value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sunamganj Sector 3" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 text-xs font-semibold">
                  <Crosshair className="w-4 h-4 mr-1" />{t('volunteer.useGPS')}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900">{t('volunteer.operationalRadius')}</label>
              <div className="flex items-center gap-4">
                <input type="range" min="0.5" max="10" step="0.5" value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                <div className="w-20 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-center font-bold text-gray-900">{radius} km</div>
              </div>
              <p className="text-xs text-gray-500">{t('volunteer.radiusHelp')}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-900 flex items-center gap-2"><Radar className="w-4 h-4 text-gray-400" />{t('volunteer.coveragePreview')}</label>
              <div className="h-48 bg-blue-50/50 rounded-lg border border-gray-200 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id="cGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#cGrid)" />
                  </svg>
                </div>
                <div className="absolute bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center transition-all duration-300" style={{ width: `${Math.max(40, radius * 20)}px`, height: `${Math.max(40, radius * 20)}px` }}>
                  <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm absolute" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="w-4 h-4" /><span>{t('volunteer.coverageShared')}</span>
            </div>
            <button type="submit" disabled={status !== 'idle'} className="px-6 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-bold hover:bg-blue-900/90 transition-colors flex items-center gap-2 disabled:opacity-70">
              {status === 'idle' && <><Save className="w-4 h-4" />{t('volunteer.saveCoverage')}</>}
              {status === 'saving' && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {status === 'success' && <><CheckCircle className="w-4 h-4" />{t('volunteer.savedSuccessfully')}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
