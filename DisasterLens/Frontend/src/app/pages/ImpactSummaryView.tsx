import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  HeartPulse, 
  AlertCircle, 
  Users, 
  Home, 
  DollarSign, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Newspaper,
  RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type ImpactSnapshot = {
  fatalities: number;
  missing: number;
  rescued: number;
  damages_count: number;
  estimated_loss_bdt: number;
  affected_areas_count: number;
  danger_level: 'info' | 'warning' | 'high' | 'critical';
  executive_summary_en: string;
  executive_summary_bn: string;
  priority_actions: string[];
  priority_actions_bn: string[];
  recovery_needs: string[];
  recovery_needs_bn: string[];
  snapshot_at?: string;
};

type IntelItem = {
  id?: string;
  source_name?: string;
  title?: string;
  llm_summary_en?: string | null;
  llm_summary_bn?: string | null;
  hazard_tags?: string[];
  processed_at?: string;
};

const fallbackSnapshot: ImpactSnapshot = {
  fatalities: 42,
  missing: 128,
  rescued: 3450,
  damages_count: 12000,
  estimated_loss_bdt: 45000000,
  affected_areas_count: 14,
  danger_level: 'high',
  executive_summary_en:
    'Flood pressure remains high across low-lying districts with continuing displacement and urgent water and shelter needs.',
  executive_summary_bn:
    'নিম্নাঞ্চলীয় জেলাগুলিতে বন্যার চাপ উচ্চ রয়েছে এবং বাস্তুচ্যুতি, নিরাপদ পানি ও আশ্রয়ের জরুরি প্রয়োজন অব্যাহত আছে।',
  priority_actions: ['Deploy rescue boats to high-risk unions', 'Restore emergency shelters and clean water points', 'Prioritize power restoration for hospitals'],
  priority_actions_bn: ['উচ্চ ঝুঁকির ইউনিয়নগুলোতে উদ্ধার নৌকা মোতায়েন', 'জরুরি আশ্রয়কেন্দ্র ও বিশুদ্ধ পানির পয়েন্ট সচল করা', 'হাসপাতালের জন্য বিদ্যুৎ পুনঃসংযোগকে অগ্রাধিকার'],
  recovery_needs: ['Clean water and sanitation kits', 'Emergency medicine and trauma support'],
  recovery_needs_bn: ['বিশুদ্ধ পানি ও স্যানিটেশন কিট', 'জরুরি ওষুধ ও ট্রমা সহায়তা'],
};

const fallbackIntel: IntelItem[] = [
  {
    source_name: 'The Daily Star',
    title: 'Thousands stranded in Sylhet as major rivers cross danger mark by 120cm.',
    llm_summary_en: 'Rescue teams are requesting additional boats and dry food in multiple shelter points.',
    llm_summary_bn: 'একাধিক আশ্রয়কেন্দ্রে অতিরিক্ত নৌকা ও শুকনো খাবারের প্রয়োজন দেখা দিয়েছে।',
    hazard_tags: ['flood', 'critical'],
    processed_at: new Date().toISOString(),
  },
  {
    source_name: 'Prothom Alo',
    title: 'Army deployed for rescue operations in remote upazilas of Sunamganj.',
    llm_summary_en: 'Access roads remain waterlogged and response is being coordinated with local volunteers.',
    llm_summary_bn: 'সড়ক প্লাবিত থাকায় স্থানীয় স্বেচ্ছাসেবকদের সাথে সমন্বয় করে উদ্ধার কাজ চলছে।',
    hazard_tags: ['rescue', 'operations'],
    processed_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

const areaBnMap: Record<string, string> = {
  Sylhet: 'সিলেট',
  Sunamganj: 'সুনামগঞ্জ',
  Netrokona: 'নেত্রকোনা',
  Habiganj: 'হবিগঞ্জ',
  Dhaka: 'ঢাকা',
  Chittagong: 'চট্টগ্রাম',
  Moulvibazar: 'মৌলভীবাজার',
};

export function ImpactSummaryView() {
  const { t, d, bnenconvert } = useLanguage();
  const { token } = useAuth();
  const [snapshot, setSnapshot] = useState<ImpactSnapshot>(fallbackSnapshot);
  const [intelFeed, setIntelFeed] = useState<IntelItem[]>(fallbackIntel);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mergeSnapshot = (incoming: ImpactSnapshot): ImpactSnapshot => ({
    ...fallbackSnapshot,
    ...incoming,
    executive_summary_en: (incoming.executive_summary_en || '').trim() || fallbackSnapshot.executive_summary_en,
    executive_summary_bn: (incoming.executive_summary_bn || '').trim() || fallbackSnapshot.executive_summary_bn,
    priority_actions:
      (incoming.priority_actions || []).filter((item) => String(item).trim().length > 0).length > 0
        ? (incoming.priority_actions || []).filter((item) => String(item).trim().length > 0)
        : fallbackSnapshot.priority_actions,
    priority_actions_bn:
      (incoming.priority_actions_bn || []).filter((item) => String(item).trim().length > 0).length > 0
        ? (incoming.priority_actions_bn || []).filter((item) => String(item).trim().length > 0)
        : fallbackSnapshot.priority_actions_bn,
    recovery_needs:
      (incoming.recovery_needs || []).filter((item) => String(item).trim().length > 0).length > 0
        ? (incoming.recovery_needs || []).filter((item) => String(item).trim().length > 0)
        : fallbackSnapshot.recovery_needs,
    recovery_needs_bn:
      (incoming.recovery_needs_bn || []).filter((item) => String(item).trim().length > 0).length > 0
        ? (incoming.recovery_needs_bn || []).filter((item) => String(item).trim().length > 0)
        : fallbackSnapshot.recovery_needs_bn,
  });

  const loadSummaryAndIntel = async () => {
    try {
      const [impactRes, intelRes] = await Promise.allSettled([
        api.get<ImpactSnapshot | null>('/ingestion/impact/latest', token),
        api.get<IntelItem[]>('/ingestion/news/processed/latest?limit=20', token),
      ]);

      if (impactRes.status === 'fulfilled' && impactRes.value) {
        setSnapshot(mergeSnapshot(impactRes.value));
      }

      if (intelRes.status === 'fulfilled' && intelRes.value.length > 0) {
        setIntelFeed(intelRes.value);
      }
    } catch (error) {
      console.error('Failed to load impact summary and intel feed', error);
    }
  };

  useEffect(() => {
    void loadSummaryAndIntel();
  }, [token]);

  const handleRefreshAnalysis = async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    try {
      await api.post('/ingestion/impact/run?include_ingestion=false', undefined, token);
      await loadSummaryAndIntel();
    } catch (error) {
      console.error('Failed to refresh AI analysis', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toDangerLabel = (level: ImpactSnapshot['danger_level']) => {
    if (level === 'critical') return 'Level 5';
    if (level === 'high') return 'Level 4';
    if (level === 'warning') return 'Level 3';
    return 'Level 2';
  };

  const toDangerClass = (level: ImpactSnapshot['danger_level']) => {
    if (level === 'critical' || level === 'high') return 'text-red-700';
    if (level === 'warning') return 'text-amber-700';
    return 'text-blue-700';
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return t('updated_2_mins');
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    if (mins < 60) return `${bnenconvert(mins)} mins ago`;
    const hours = Math.floor(mins / 60);
    return `${bnenconvert(hours)} hrs ago`;
  };

  const timelineItems = useMemo(() => intelFeed.slice(0, 3), [intelFeed]);

  const effectiveExecutiveSummary = useMemo(
    () => d(snapshot.executive_summary_en || fallbackSnapshot.executive_summary_en, snapshot.executive_summary_bn || fallbackSnapshot.executive_summary_bn),
    [d, snapshot.executive_summary_bn, snapshot.executive_summary_en],
  );

  const effectivePriorityActions = useMemo(
    () => (d(snapshot.priority_actions.join('||'), snapshot.priority_actions_bn.join('||')).split('||').filter(Boolean).slice(0, 3)),
    [d, snapshot.priority_actions, snapshot.priority_actions_bn],
  );

  const effectiveRecoveryNeeds = useMemo(
    () => (d(snapshot.recovery_needs.join('||'), snapshot.recovery_needs_bn.join('||')).split('||').filter(Boolean).slice(0, 3)),
    [d, snapshot.recovery_needs, snapshot.recovery_needs_bn],
  );

  const affectedAreas = useMemo(() => {
    const knownAreas = ['Sylhet', 'Sunamganj', 'Netrokona', 'Habiganj', 'Dhaka', 'Chittagong', 'Moulvibazar'];
    const scores: Record<string, number> = {};

    intelFeed.forEach((item) => {
      const corpus = `${item.title || ''} ${item.llm_summary_en || ''} ${item.llm_summary_bn || ''}`;
      knownAreas.forEach((area) => {
        if (corpus.toLowerCase().includes(area.toLowerCase())) {
          scores[area] = (scores[area] || 0) + 1;
        }
      });
    });

    const top = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count], index) => ({
        name,
        nameBn: areaBnMap[name] || name,
        severityKey: index < 2 ? 'critical' : index === 2 ? 'high' : 'moderate',
        people: `${bnenconvert(count * 20)}k+`,
        trendKey: index < 2 ? 'worsening' : index === 2 ? 'stable' : 'improving',
      }));

    if (top.length > 0) return top;

    return [
      { name: 'Sylhet', nameBn: 'সিলেট', severityKey: 'critical', people: `${bnenconvert(120)}k+`, trendKey: 'worsening' },
      { name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', severityKey: 'critical', people: `${bnenconvert(85)}k+`, trendKey: 'worsening' },
      { name: 'Netrokona', nameBn: 'নেত্রকোনা', severityKey: 'high', people: `${bnenconvert(45)}k+`, trendKey: 'stable' },
      { name: 'Habiganj', nameBn: 'হবিগঞ্জ', severityKey: 'moderate', people: `${bnenconvert(20)}k+`, trendKey: 'improving' },
    ];
  }, [bnenconvert, intelFeed]);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('ai_impact_summary')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('ai_impact_desc')}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleRefreshAnalysis()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh AI Analysis'}
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <HeartPulse className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bnenconvert(snapshot.fatalities)}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('fatalities')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <AlertCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bnenconvert(snapshot.missing)}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('missing')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bnenconvert(snapshot.rescued)}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('rescued')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bnenconvert(snapshot.damages_count)}+</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('damages')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">৳{bnenconvert(Math.round(snapshot.estimated_loss_bdt).toLocaleString('en-US'))}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('est_loss')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <MapPin className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bnenconvert(snapshot.affected_areas_count)}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">{t('affected_areas')}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm text-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className={`text-2xl font-bold ${toDangerClass(snapshot.danger_level)}`}>{bnenconvert(toDangerLabel(snapshot.danger_level))}</p>
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
              {timeAgo(snapshot.snapshot_at)}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">
            {effectiveExecutiveSummary}
          </p>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4">
            <div className="flex-1 bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-xs text-red-600 font-semibold uppercase mb-1">{t('priority_actions')}</p>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                {effectivePriorityActions.map((item, index) => (
                  <li key={`action-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700 font-semibold uppercase mb-1">{t('renovation_needs')}</p>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                {effectiveRecoveryNeeds.map((item, index) => (
                  <li key={`recovery-${index}`}>{item}</li>
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
                
                {timelineItems.map((item, index) => (
                  <div key={item.id || `${item.title}-${index}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border border-white text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${
                      index === 0 ? 'bg-[#DC2626]' : index === 1 ? 'bg-[#1E3A8A]' : 'bg-amber-500'
                    }`}></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-semibold text-gray-900 text-sm">{item.title || 'Intel update'}</div>
                        <time className="font-mono text-xs text-gray-500 font-medium">{timeAgo(item.processed_at)}</time>
                      </div>
                      <div className="text-gray-500 text-xs">{d(item.llm_summary_en || '', item.llm_summary_bn || '') || t('live_synthesis')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                {t('key_affected_areas')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {affectedAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{d(area.name, area.nameBn)}</p>
                      <p className="text-xs text-gray-500">{t('pop')}: {area.people}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        area.severityKey === 'critical' ? 'bg-red-100 text-red-700' :
                        area.severityKey === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {t(area.severityKey)}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{t(area.trendKey)}</p>
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
              {intelFeed.map((item, index) => {
                const tags = item.hazard_tags || [];
                const primary = (tags[0] || '').toLowerCase();
                const borderClass = primary.includes('flood') || primary.includes('critical')
                  ? 'border-[#DC2626]'
                  : primary.includes('rescue')
                  ? 'border-[#1E3A8A]'
                  : primary.includes('rain')
                  ? 'border-orange-400'
                  : 'border-gray-300';

                return (
                  <div key={item.id || `${item.title}-${index}`} className={`border-l-2 ${borderClass} pl-3 py-1`}>
                    <p className="text-xs text-gray-400 font-medium mb-1 flex justify-between">
                      <span>{`Source: ${item.source_name || 'Intel Source'}`}</span>
                      <span>{timeAgo(item.processed_at)}</span>
                    </p>
                    <p className="text-sm text-gray-800 font-medium">{item.title || 'Latest situational intelligence update'}</p>
                    <p className="text-xs text-gray-600 mt-1">{d(item.llm_summary_en || '', item.llm_summary_bn || '')}</p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={`${item.id || index}-${tag}`} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
