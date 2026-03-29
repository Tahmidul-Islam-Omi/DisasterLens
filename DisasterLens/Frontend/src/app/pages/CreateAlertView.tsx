import { useState, useEffect } from 'react';
import { AlertTriangle, Info, AlertCircle, Clock, Send, Eye, CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type SeverityType = 'Information' | 'Warning' | 'Emergency';
const severityOptions: SeverityType[] = ['Information', 'Warning', 'Emergency'];

const severityConfig = {
  'Information': { color: '#16A34A', bgColor: '#F0FDF4', borderColor: '#BBF7D0', icon: Info },
  'Warning': { color: '#F59E0B', bgColor: '#FFFBEB', borderColor: '#FDE68A', icon: AlertCircle },
  'Emergency': { color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA', icon: AlertTriangle }
};

export function CreateAlertView() {
  const { t } = useLanguage();
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityType>('Information');
  const [category, setCategory] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const categoryOptions = [
    t('heavy_rainfall'), t('cyclone_warning'), t('flood_risk'),
    t('thunderstorm'), t('storm_surge'), t('heatwave'), t('general_weather_advisory')
  ];

  useEffect(() => {
    const now = new Date();
    setPublishTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  }, []);

  const handlePublish = () => {
    if (!headline.trim()) { alert(t('alert_headline')); return; }
    if (!description.trim()) { alert(t('alert_description')); return; }
    if (!category) { alert(t('category')); return; }
    console.log('Publishing alert:', { headline, description, severity, category, publishTime, validUntil });
    alert(t('publish_alert') + ' ✓');
    setHeadline(''); setDescription(''); setSeverity('Information'); setCategory(''); setValidUntil('');
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('create_weather_alert')}</h1>
          <p className="text-gray-600">{t('publish_new_alerts')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5" style={{ color: '#1E3A8A' }} />
                <h3 className="text-lg font-semibold text-gray-900">{t('alert_information')}</h3>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alert_headline')} <span className="text-red-500">*</span></label>
                <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder={t('headline_placeholder')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alert_description')} <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('description_placeholder')} rows={8} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                <p className="text-xs text-gray-500 mt-2">{t('description_help')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('severity_level')} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {severityOptions.map((option) => {
                    const optionConfig = severityConfig[option];
                    const label = option === 'Information' ? t('information') : option === 'Warning' ? t('warning') : t('emergency');
                    return (
                      <button key={option} onClick={() => setSeverity(option)}
                        className={`px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ${severity === option ? 'border-2' : 'border-gray-200 hover:border-gray-300'}`}
                        style={{ borderColor: severity === option ? optionConfig.color : undefined, backgroundColor: severity === option ? optionConfig.bgColor : 'white', color: severity === option ? optionConfig.color : '#374151' }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5" style={{ color: '#1E3A8A' }} />
                <h3 className="text-lg font-semibold text-gray-900">{t('alert_category')}</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('category')} <span className="text-red-500">*</span></label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">{t('select_alert_category')}</option>
                  {categoryOptions.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: '#1E3A8A' }} />
                <h3 className="text-lg font-semibold text-gray-900">{t('effective_time')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('publish_time')}</label>
                  <input type="time" value={publishTime} onChange={(e) => setPublishTime(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <p className="text-xs text-gray-500 mt-1">{t('current_time_auto')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('valid_until')} <span className="text-gray-400">({t('optional')})</span></label>
                  <input type="datetime-local" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <p className="text-xs text-gray-500 mt-1">{t('leave_blank')}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={handlePublish} className="px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ backgroundColor: '#1E3A8A' }}>
                <Send className="w-5 h-5" />
                {t('publish_alert')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5" style={{ color: '#1E3A8A' }} />
                  <h3 className="text-lg font-semibold text-gray-900">{t('alert_preview')}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">{t('preview_description')}</p>
                <div className="bg-white rounded-lg shadow-sm border-2 p-4" style={{ borderColor: config.borderColor }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.bgColor }}>
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-bold text-gray-900 mb-1 break-words">{headline || t('alert_headline_placeholder')}</h4>
                        <div className="px-2 py-1 rounded-full text-xs font-semibold ml-2 shrink-0" style={{ backgroundColor: config.bgColor, color: config.color, border: `1px solid ${config.borderColor}` }}>
                          {severity.toUpperCase()}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed mb-3 break-words">{description || t('alert_desc_placeholder')}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{t('published')}: {publishTime || '--:--'}</span></div>
                        {category && (<div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /><span>{category}</span></div>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">{t('review_before_publish')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
