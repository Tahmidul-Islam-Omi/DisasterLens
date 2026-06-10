import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  Building2, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  CloudRain,
  Layers,
  Waves
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type RiskPoint = {
  id: string;
  name?: string | null;
  type?: string | null;
  hazard?: string | null;
  severity?: string | null;
  status?: string | null;
  population?: string | null;
  lat?: number | null;
  lng?: number | null;
  impactScore?: number | null;
  river?: string | null;
  basin?: string | null;
  dangerLevel?: number | null;
  rhwl?: number | null;
  pmdl?: number | null;
  division?: string | null;
  district?: string | null;
  upazilla?: string | null;
  union?: string | null;
  dateOfRhwl?: string | null;
};

type RiskResponse = {
  metrics: {
    exposedInfra: number;
    highRiskAreas: number;
    affectedPopulation: number;
    damagedRoads: number;
    shelterCapacity: number;
    dangerLevel: string;
  };
  points: RiskPoint[];
};

const fallbackData: RiskResponse = {
  metrics: {
    exposedInfra: 0,
    highRiskAreas: 0,
    affectedPopulation: 0,
    damagedRoads: 0,
    shelterCapacity: 0,
    dangerLevel: 'warning',
  },
  points: [],
};

const cleanText = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  return text;
};

const formatNumeric = (value: unknown, fractionDigits = 2): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  return value.toFixed(fractionDigits);
};

const isRecentWithinFiveYears = (dateText?: string | null): boolean => {
  if (!dateText) return false;
  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) return false;
  const fiveYearsMs = 5 * 365 * 24 * 60 * 60 * 1000;
  return Date.now() - parsed.getTime() <= fiveYearsMs;
};

export function RiskAssessmentPipelineView() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [data, setData] = useState<RiskResponse>(fallbackData);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.get<RiskResponse>('/authority/geospatial-risk', token);
        setData(result || fallbackData);
      } catch (error) {
        console.error('Failed to load risk assessment data', error);
      }
    };

    void load();
  }, [token]);

  const riskRows = useMemo(() => {
    return [...data.points].sort((a, b) => {
      const aScore = typeof a.impactScore === 'number' ? a.impactScore : -1;
      const bScore = typeof b.impactScore === 'number' ? b.impactScore : -1;
      return bScore - aScore;
    });
  }, [data.points]);

  const filteredRiskRows = useMemo(() => {
    const query = activeSearch.trim().toLowerCase();
    if (!query) {
      return riskRows;
    }

    return riskRows.filter((row) => {
      const searchable = [
        cleanText(row.name),
        cleanText(row.river),
        cleanText(row.basin),
        cleanText(row.district),
        cleanText(row.upazilla),
        cleanText(row.union),
        cleanText(row.division),
        cleanText(row.severity),
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [activeSearch, riskRows]);

  useEffect(() => {
    if (!filteredRiskRows.length) {
      setSelectedAreaId('');
      return;
    }

    const exists = filteredRiskRows.some((row) => row.id === selectedAreaId);
    if (!exists) {
      setSelectedAreaId(filteredRiskRows[0].id);
    }
  }, [filteredRiskRows, selectedAreaId]);

  const selectedArea = useMemo(() => {
    if (!filteredRiskRows.length) return null;
    return filteredRiskRows.find((row) => row.id === selectedAreaId) || filteredRiskRows[0];
  }, [filteredRiskRows, selectedAreaId]);

  const exposedInfraCount = useMemo(
    () =>
      filteredRiskRows.filter((row) => {
        const severity = cleanText(row.severity).toLowerCase();
        return severity === 'high' || severity === 'critical';
      }).length,
    [filteredRiskRows],
  );

  const areaName = (row: RiskPoint) => [cleanText(row.name), cleanText(row.upazilla), cleanText(row.district)].filter(Boolean).join(', ');
  const riverBasin = (row: RiskPoint) => [cleanText(row.river), cleanText(row.basin)].filter(Boolean).join(' / ');

  const impactReasons = useMemo(() => {
    if (!selectedArea) return [] as string[];

    const reasons: string[] = [];
    const danger = selectedArea.dangerLevel;
    const rhwl = selectedArea.rhwl;
    const pmdl = selectedArea.pmdl;
    const impactScore = selectedArea.impactScore;

    if (typeof danger === 'number' && typeof rhwl === 'number' && Math.abs(danger - rhwl) < 1) {
      reasons.push('Danger level and RHWL are closely aligned.');
    }

    if (typeof pmdl === 'number' && pmdl > 0 && typeof rhwl === 'number' && Math.abs(pmdl - rhwl) <= 1) {
      reasons.push('PMDL is close to RHWL, indicating reduced water-level safety margin.');
    }

    if (typeof impactScore === 'number' && impactScore >= 0.8) {
      reasons.push('Very high computed impact score from combined hydrological signals.');
    }

    if (isRecentWithinFiveYears(selectedArea.dateOfRhwl)) {
      reasons.push('Recent RHWL record increases current risk relevance.');
    }

    if (!reasons.length) {
      reasons.push('Composite impact generated from danger level, RHWL, PMDL, and recency signals.');
    }

    return reasons;
  }, [selectedArea]);

  const getPriorityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number | null | undefined) => {
    if (typeof score !== 'number') return 'text-gray-500';
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSearch = () => {
    setActiveSearch(searchInput.trim());
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const escapeCsv = (value: unknown): string => {
    const raw = cleanText(value);
    const escaped = raw.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const handleExportCsv = () => {
    const rows = filteredRiskRows;
    const headers = [
      'Area Name',
      'River/Basin',
      'Danger Level',
      'RHWL',
      'PMDL',
      'Impact Level',
      'Impact Score',
      'Division',
      'District',
      'Upazilla',
      'Union',
      'Date Of RHWL',
    ];

    const csvRows = rows.map((row) => {
      const area = [cleanText(row.name), cleanText(row.upazilla), cleanText(row.district)].filter(Boolean).join(', ');
      const river = [cleanText(row.river), cleanText(row.basin)].filter(Boolean).join(' / ');
      return [
        escapeCsv(area),
        escapeCsv(river),
        escapeCsv(formatNumeric(row.dangerLevel)),
        escapeCsv(formatNumeric(row.rhwl)),
        escapeCsv(formatNumeric(row.pmdl)),
        escapeCsv(cleanText(row.severity)),
        escapeCsv(typeof row.impactScore === 'number' ? row.impactScore.toFixed(3) : '-'),
        escapeCsv(cleanText(row.division)),
        escapeCsv(cleanText(row.district)),
        escapeCsv(cleanText(row.upazilla)),
        escapeCsv(cleanText(row.union)),
        escapeCsv(cleanText(row.dateOfRhwl)),
      ].join(',');
    });

    const csvContent = [headers.map(escapeCsv).join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `risk-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('risk_scoring_title')}</h1>
            <p className="text-gray-500">{t('risk_scoring_desc')}</p>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
              <div className="text-sm">
                <span className="text-gray-500">{t('model_status')}: </span>
                <span className="font-bold text-blue-700">{t('live_scoring')}</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="text-sm text-gray-500">
              {t('updated_just_now')}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Data Inputs Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 col-span-1 lg:col-span-2 flex flex-col justify-center">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('active_data_inputs')}</h3>
             <div className="flex items-center justify-between gap-2">
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Waves className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('river_flood')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <CloudRain className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('weather')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Layers className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('spatial')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Building2 className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('infra')}</span>
               </div>
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 flex-1">
                 <Users className="w-5 h-5 text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-900 text-center leading-tight">{t('population')}</span>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('exposed_pop')}</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">1.2M</div>
            <p className="text-xs text-orange-600 font-medium mt-1">{t('since_last_update')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('exposed_infra')}</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">{exposedInfraCount}</div>
            <p className="text-xs text-red-600 font-medium mt-1">High-impact locations</p>
          </div>

          <div className="bg-[#1E3A8A] rounded-xl shadow-sm border border-blue-800 p-4 flex flex-col justify-center text-white">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-blue-200" />
              <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider">{t('priority_areas_label')}</h3>
            </div>
            <div className="text-2xl font-bold text-white">{riskRows.length}</div>
            <p className="text-xs text-blue-200 font-medium mt-1">{t('require_immediate')}</p>
          </div>

        </div>

        {/* Main Split View */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Ranked Risk Table */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-gray-700" />
                <h2 className="text-base font-bold text-gray-900">{t('prioritized_risk_queue')}</h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search area, river, district..."
                  className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="h-9 rounded-md bg-[#1E3A8A] px-3 text-sm font-semibold text-white hover:bg-blue-900"
                >
                  Search
                </button>
                <button
                  onClick={handleExportCsv}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  {t('export_report')} (CSV)
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Area Name</th>
                    <th className="p-4">River / Basin</th>
                    <th className="p-4">Danger Level</th>
                    <th className="p-4">RHWL</th>
                    <th className="p-4">PMDL</th>
                    <th className="p-4">Impact (Critical Impact)</th>
                    <th className="p-4 pr-6">Impact / Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRiskRows.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedAreaId(row.id)}
                      className={`cursor-pointer transition-colors ${selectedAreaId === row.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedAreaId === row.id ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                          <span className={`font-bold ${selectedAreaId === row.id ? 'text-blue-900' : 'text-gray-900'}`}>{areaName(row)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {riverBasin(row)}
                      </td>
                      <td className="p-4">
                        {formatNumeric(row.dangerLevel)}
                      </td>
                      <td className="p-4">
                        {formatNumeric(row.rhwl)}
                      </td>
                      <td className="p-4">
                        {formatNumeric(row.pmdl)}
                      </td>
                      <td className="p-4 pr-6">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityColor(cleanText(row.severity) || 'unknown')}`}>
                          {cleanText(row.severity) || ''}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <span className={`font-bold ${getScoreColor(row.impactScore)}`}>
                          {typeof row.impactScore === 'number' ? row.impactScore.toFixed(3) : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredRiskRows.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-sm text-gray-500" colSpan={7}>
                        No matching rows found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Area Detail Panel */}
          <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col shrink-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">{t('area_detail')}</h2>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedArea ? areaName(selectedArea) : ''}</h3>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityColor(cleanText(selectedArea?.severity) || 'unknown')}`}>
                    {cleanText(selectedArea?.severity)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium font-mono">
                  {selectedArea && typeof selectedArea.lat === 'number' && typeof selectedArea.lng === 'number'
                    ? `${selectedArea.lat.toFixed(4)}° N, ${selectedArea.lng.toFixed(4)}° E`
                    : ''}
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(30,58,138,0.15)_0_2px,transparent_3px),radial-gradient(circle_at_80%_70%,rgba(30,58,138,0.15)_0_2px,transparent_3px)]"></div>
                <div className="bg-white/90 p-2 rounded-lg shadow-sm border border-gray-200 z-10 flex items-center gap-2 backdrop-blur-sm">
                  <MapPin className={`w-4 h-4 ${cleanText(selectedArea?.severity).toLowerCase() === 'critical' ? 'text-red-500' : 'text-blue-500'}`} />
                  <span className="text-xs font-bold text-gray-700 uppercase">{t('map_view_active')}</span>
                </div>
              </div>

              {/* Drivers & Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block mb-1">Danger level</span>
                  <span className="text-2xl font-bold text-red-900">{formatNumeric(selectedArea?.dangerLevel)}</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block mb-1">Impact score</span>
                  <span className="text-2xl font-bold text-orange-900">
                    {selectedArea && typeof selectedArea.impactScore === 'number' ? selectedArea.impactScore.toFixed(3) : '-'}
                  </span>
                </div>
              </div>

              {/* Impact Reasons */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Impact reasons</h4>
                <div className="flex flex-wrap gap-2">
                  {impactReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Area Details */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Full details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">River / Basin</p>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">Hydrology</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {selectedArea ? riverBasin(selectedArea) : ''}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Division / District / Upazilla</p>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">Administrative</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 text-right">
                      {[cleanText(selectedArea?.division), cleanText(selectedArea?.district), cleanText(selectedArea?.upazilla)].filter(Boolean).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Union / RHWL Date</p>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">Context</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 text-right">
                      {[cleanText(selectedArea?.union), cleanText(selectedArea?.dateOfRhwl)].filter(Boolean).join(' | ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <button className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  cleanText(selectedArea?.severity).toLowerCase() === 'critical' ? 'bg-[#DC2626] hover:bg-red-700 text-white' : 
                  cleanText(selectedArea?.severity).toLowerCase() === 'high' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                  'bg-[#1E3A8A] hover:bg-blue-900 text-white'
                }`}>
                  Open area response action <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}