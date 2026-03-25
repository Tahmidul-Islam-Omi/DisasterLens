import { useState, useEffect } from 'react';
import { AlertTriangle, Info, AlertCircle, Clock, Send, Eye, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

type SeverityType = 'Information' | 'Warning' | 'Emergency';
const severityOptions: SeverityType[] = ['Information', 'Warning', 'Emergency'];

const severityConfig = {
  Information: { color: '#16A34A', bgColor: '#F0FDF4', borderColor: '#BBF7D0', icon: Info },
  Warning: { color: '#F59E0B', bgColor: '#FFFBEB', borderColor: '#FDE68A', icon: AlertCircle },
  Emergency: { color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA', icon: AlertTriangle },
};

const categoryOptions = ['Heavy Rainfall', 'Cyclone Warning', 'Flood Risk', 'Thunderstorm', 'Storm Surge', 'Heatwave', 'General Weather Advisory'];

export default function CreateAlertView() {
  const { t } = useLanguage();
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityType>('Information');
  const [category, setCategory] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    const now = new Date();
    setPublishTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  }, []);

  const handlePublish = () => {
    if (!headline.trim()) { alert(t('weather.alertHeadlineRequired')); return; }
    if (!description.trim()) { alert(t('weather.alertDescRequired')); return; }
    if (!category) { alert(t('weather.categoryRequired')); return; }
    alert(t('weather.publishSuccess'));
    setHeadline(''); setDescription(''); setSeverity('Information'); setCategory(''); setValidUntil('');
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('weather.createAlertTitle')}</h1>
          <p className="text-gray-600">{t('weather.createAlertSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-blue-900" />
                <h3 className="text-lg font-semibold text-gray-900">{t('weather.alertInformation')}</h3>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('weather.alertHeadline')} <span className="text-red-500">*</span></label>
                <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder={t('weather.headlinePlaceholder')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('weather.alertDescription')} <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('weather.descriptionPlaceholder')} rows={8} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('weather.severityLevel')} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {severityOptions.map((option) => {
                    const optionConfig = severityConfig[option];
                    return (
                      <button key={option} onClick={() => setSeverity(option)}
                        className="px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{ borderColor: severity === option ? optionConfig.color : '#E5E7EB', backgroundColor: severity === option ? optionConfig.bgColor : 'white', color: severity === option ? optionConfig.color : '#374151' }}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('weather.alertCategory')}</h3>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">{t('weather.selectCategory')}</option>
                {categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-900" />
                <h3 className="text-lg font-semibold text-gray-900">{t('weather.effectiveTime')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('weather.publishTime')}</label>
                  <input type="time" value={publishTime} onChange={(e) => setPublishTime(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('weather.validUntil')} <span className="text-gray-400">({t('common.optional')})</span></label>
                  <input type="datetime-local" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handlePublish} className="px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 bg-blue-900 hover:bg-blue-800 transition-colors">
                <Send className="w-5 h-5" />
                {t('weather.publishAlert')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-900" />
                <h3 className="text-lg font-semibold text-gray-900">{t('weather.alertPreview')}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">{t('weather.previewDescription')}</p>
              <div className="bg-white rounded-lg shadow-sm border-2 p-4" style={{ borderColor: config.borderColor }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.bgColor }}>
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-900 break-words">{headline || t('weather.headlinePlaceholder')}</h4>
                      <div className="px-2 py-1 rounded-full text-xs font-semibold ml-2 shrink-0" style={{ backgroundColor: config.bgColor, color: config.color, border: `1px solid ${config.borderColor}` }}>
                        {severity.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-3 break-words">{description || t('weather.descriptionPlaceholder')}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{t('common.published')}: {publishTime || '--:--'}</span></div>
                      {category && <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /><span>{category}</span></div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">{t('weather.reviewBeforePublish')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
