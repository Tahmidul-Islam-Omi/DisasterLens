import { LucideIcon } from 'lucide-react';

interface WeatherCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

export function WeatherCard({ title, value, unit, icon: Icon, trend, color }: WeatherCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-gray-900">{value}</span>
            <span className="text-gray-600">{unit}</span>
          </div>
          {trend && (
            <p className="text-xs text-gray-500 mt-2">{trend}</p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
