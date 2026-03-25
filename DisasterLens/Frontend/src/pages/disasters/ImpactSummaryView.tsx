import { useEffect, useState } from 'react';
import { HeartPulse, AlertCircle, Users, Home, DollarSign, MapPin, AlertTriangle, Activity, Clock, Newspaper } from 'lucide-react';
import { api } from '../../api/client';
import { useTranslation } from 'react-i18next';

export default function ImpactSummaryView() {
  const { t } = useTranslation();
  const [impactSnapshot, setImpactSnapshot] = useState<any | null>(null);
  const [processedFeed, setProcessedFeed] = useState<any[]>([]);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const formatCount = (value: number | null | undefined) => {
    const safeValue = Number.isFinite(value) ? Number(value) : 0;
    return safeValue.toLocaleString();
  };

  const formatCurrencyBdt = (value: number | null | undefined) => {
    const safeValue = Number.isFinite(value) ? Number(value) : 0;
    if (safeValue >= 1000000000) {
      return `৳${(safeValue / 1000000000).toFixed(1)}B`;
    }
    if (safeValue >= 1000000) {
      return `৳${(safeValue / 1000000).toFixed(1)}M`;
    }
    return `৳${safeValue.toLocaleString()}`;
  };

  const loadImpactData = async () => {
    try {
      const [impactRes, processedRes] = await Promise.all([
        api.ingestion.latestImpactSummary(),
        api.ingestion.latestProcessedNews(6),
      ]);
      setImpactSnapshot(impactRes?.data || null);
      setProcessedFeed(processedRes?.data || []);
    } catch (error) {
      console.error('[ImpactSummaryView] Failed to load impact summaries:', error);
    }
  };

  useEffect(() => {
    loadImpactData();
  }, []);

  const handleRunAiAnalysis = async () => {
    if (isRunningAnalysis) return;
    try {
      setIsRunningAnalysis(true);
      await api.ingestion.runImpactAnalysis(true);
      await loadImpactData();
    } catch (error) {
      console.error('[ImpactSummaryView] Failed to run AI impact analysis:', error);
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const topStats = {
    fatalities: formatCount(impactSnapshot?.fatalities),
    missing: formatCount(impactSnapshot?.missing),
    rescued: formatCount(impactSnapshot?.rescued),
    damages: formatCount(impactSnapshot?.damages_count),
    estimatedLoss: formatCurrencyBdt(impactSnapshot?.estimated_loss_bdt),
    affectedAreas: formatCount(impactSnapshot?.affected_areas_count),
    dangerLevel: (() => {
      const raw = String(impactSnapshot?.danger_level || 'warning').toLowerCase();
      const map: Record<string, string> = {
        info: 'Level 1',
        warning: 'Level 2',
        high: 'Level 3',
        critical: 'Level 4',
      };
      return map[raw] || 'Level 2';
    })(),
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('ai_impact_summary')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('ai_impact_desc')}</p>
          </div>
          <button
            type="button"
            onClick={handleRunAiAnalysis}
            disabled={isRunningAnalysis}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Activity className="w-4 h-4" />
            {isRunningAnalysis ? 'Running analysis...' : 'Run AI Analysis'}
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <HeartPulse className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{topStats.fatalities}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('fatalities')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <AlertCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{topStats.missing}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('missing')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{topStats.rescued}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('rescued')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{topStats.damages}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('damages')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{topStats.estimatedLoss}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('est_loss')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <MapPin className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{topStats.affectedAreas}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('affected_areas')}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm text-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-700">{topStats.dangerLevel}</p>
            <p className="text-xs text-red-600 font-medium uppercase">{t('danger_level')}</p>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1E3A8A]"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="text-lg font-semibold text-gray-900">{t('executive_ai_summary')}</h3>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium border border-blue-200">
              Updated {impactSnapshot?.snapshot_at ? new Date(impactSnapshot.snapshot_at).toLocaleString() : 'N/A'}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">
            {impactSnapshot?.executive_summary_bn || impactSnapshot?.executive_summary_en ? (
              impactSnapshot.executive_summary_bn || impactSnapshot.executive_summary_en
            ) : (
              <>
                <strong className="text-gray-900">{t('situation_overview')}</strong> {t('situation_overview_text')} <br/><br/>
                <strong className="text-gray-900">{t('critical_needs')}</strong> {t('critical_needs_text')}<br/><br/>
                <strong className="text-gray-900">{t('resource_deployment')}</strong> {t('resource_deployment_text')}
              </>
            )}
          </p>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4">
            <div className="flex-1 bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-xs text-red-600 font-semibold uppercase mb-1">{t('priority_actions')}</p>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                {(impactSnapshot?.priority_actions?.length ? impactSnapshot.priority_actions : [t('action_1'), t('action_2'), t('action_3')]).map((action: string, idx: number) => (
                  <li key={`priority-action-${idx}`}>{action}</li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700 font-semibold uppercase mb-1">{t('renovation_needs')}</p>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                {(impactSnapshot?.recovery_needs?.length ? impactSnapshot.recovery_needs : [t('renovation_1'), t('renovation_2')]).map((need: string, idx: number) => (
                  <li key={`recovery-need-${idx}`}>{need}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Split Section: News Feed vs AI Summary & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline & Affected Areas (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                {t('live_incident_timeline')}
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                
                {/* Timeline Item 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#DC2626] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-semibold text-gray-900 text-sm">{t('bridge_collapse')}</div>
                      <time className="font-mono text-xs text-red-500 font-medium">10:42 AM</time>
                    </div>
                    <div className="text-gray-500 text-xs">{t('bridge_collapse_desc')}</div>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#1E3A8A] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-semibold text-gray-900 text-sm">{t('rescue_units_deployed')}</div>
                      <time className="font-mono text-xs text-gray-500 font-medium">09:15 AM</time>
                    </div>
                    <div className="text-gray-500 text-xs">{t('rescue_units_desc')}</div>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-amber-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-semibold text-gray-900 text-sm">{t('power_outage')}</div>
                      <time className="font-mono text-xs text-gray-500 font-medium">06:30 AM</time>
                    </div>
                    <div className="text-gray-500 text-xs">{t('power_outage_desc')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Affected Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                {t('key_affected_areas')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Sylhet Sadar', severity: 'Critical', people: '120k+', trend: 'Worsening' },
                  { name: 'Sunamganj', severity: 'Critical', people: '85k+', trend: 'Worsening' },
                  { name: 'Netrokona', severity: 'High', people: '45k+', trend: 'Stable' },
                  { name: 'Habiganj', severity: 'Moderate', people: '20k+', trend: 'Improving' },
                ].map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{area.name}</p>
                      <p className="text-xs text-gray-500">Pop: {area.people}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        area.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        area.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {area.severity}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{area.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scraped News Feed (Right column) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[700px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                {t('live_intel_feed')}
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {t('scraping')}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {processedFeed.length === 0 ? (
                <p className="text-sm text-gray-500">No processed summaries yet. Run ingestion to populate.</p>
              ) : (
                processedFeed.map((item, idx) => {
                  const summary = item.llm_summary_bn || item.llm_summary_en || item.article_text;
                  const tags = item.hazard_tags || [];
                  return (
                    <div key={item.id || `feed-item-${idx}`} className="border-l-2 border-[#1E3A8A] pl-3 py-1">
                      <p className="text-xs text-gray-400 font-medium mb-1 flex justify-between">
                        <span>Source: {item.source_name || 'Unknown'}</span>
                        <span>{item.processed_at ? new Date(item.processed_at).toLocaleTimeString() : 'recent'}</span>
                      </p>
                      <p className="text-sm text-gray-800 font-medium line-clamp-2">{item.title || 'Untitled report'}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-3">{summary}</p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {tags.length ? tags.map((tag: string) => (
                          <span key={`${item.id}-${tag}`} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{tag}</span>
                        )) : <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">intel</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}