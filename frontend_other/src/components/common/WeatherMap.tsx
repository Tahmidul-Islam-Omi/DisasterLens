import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const riskZones = [
  { name: 'Northern Province', type: 'Flood Risk', severity: 'high', x: 35, y: 20, color: '#DC2626' },
  { name: 'Eastern Coast', type: 'Cyclone Warning', severity: 'critical', x: 70, y: 35, color: '#DC2626' },
  { name: 'Central Region', type: 'Heavy Rainfall', severity: 'moderate', x: 50, y: 50, color: '#F59E0B' },
  { name: 'Southern District', type: 'Storm Watch', severity: 'low', x: 40, y: 75, color: '#16A34A' },
];

export function WeatherMap() {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-gray-900 mb-4">{t('weather_conditions_risk_zones')}</h3>
      
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Risk Zone Markers */}
        {riskZones.map((zone, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
          >
            <div 
              className="absolute w-16 h-16 rounded-full opacity-30 animate-ping"
              style={{ backgroundColor: zone.color, left: '-24px', top: '-24px' }}
            ></div>
            
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              style={{ backgroundColor: zone.color }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>

            <div className="absolute left-10 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              <p className="text-xs">{zone.name}</p>
              <p className="text-xs text-gray-300">{zone.type}</p>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <p className="text-xs text-gray-900 mb-2">{t('risk_levels')}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }}></div>
              <span className="text-xs text-gray-700">{t('critical_high')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }}></div>
              <span className="text-xs text-gray-700">{t('moderate')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#16A34A' }}></div>
              <span className="text-xs text-gray-700">{t('low')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
