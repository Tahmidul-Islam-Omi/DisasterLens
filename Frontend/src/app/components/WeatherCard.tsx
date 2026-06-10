import { LucideIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface WeatherCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

const colorClassMap: Record<string, { bg: string; icon: string }> = {
  '#0EA5E9': { bg: 'bg-sky-100', icon: 'text-sky-500' },
  '#1E3A8A': { bg: 'bg-blue-100', icon: 'text-blue-800' },
  '#F59E0B': { bg: 'bg-amber-100', icon: 'text-amber-500' },
  '#DC2626': { bg: 'bg-red-100', icon: 'text-red-600' },
  '#10B981': { bg: 'bg-emerald-100', icon: 'text-emerald-600' },
};

export function WeatherCard({ title, value, unit, icon: Icon, trend, color }: WeatherCardProps) {
  const { bnenconvert } = useLanguage();
  const classes = colorClassMap[color] || { bg: 'bg-gray-100', icon: 'text-gray-600' };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-gray-900">{bnenconvert(value)}</span>
            <span className="text-gray-600">{bnenconvert(unit)}</span>
          </div>
          {trend && (
            <p className="text-xs text-gray-500 mt-2">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${classes.bg}`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
      </div>
    </div>
  );
}
