import { useEffect, useState } from 'react';
import { api } from '../../api/client';

type LiveApiDataPanelProps = {
  title?: string;
  compact?: boolean;
  showActions?: boolean;
};

export function LiveApiDataPanel({
  title = 'Live API Data',
  compact = false,
  showActions = true,
}: LiveApiDataPanelProps) {
  const [healthStatus, setHealthStatus] = useState('checking');
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [processedItems, setProcessedItems] = useState<any[]>([]);
  const [impactSummary, setImpactSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadApiPreview = async () => {
    try {
      setLoading(true);
      setError('');
      const [healthRes, latestRes, processedRes, impactRes] = await Promise.all([
        api.health(),
        api.ingestion.latestNews(5),
        api.ingestion.latestProcessedNews(5),
        api.ingestion.latestImpactSummary(),
      ]);
      setHealthStatus(healthRes?.data?.status || 'unknown');
      setNewsItems(latestRes?.data || []);
      setProcessedItems(processedRes?.data || []);
      setImpactSummary(impactRes?.data || null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load API data');
    } finally {
      setLoading(false);
    }
  };

  const runNewsIngestion = async () => {
    try {
      setLoading(true);
      setError('');
      await api.ingestion.runNews();
      await loadApiPreview();
    } catch (err: any) {
      setError(err?.message || 'Failed to run news ingestion');
      setLoading(false);
    }
  };

  const runGeoImport = async () => {
    try {
      setLoading(true);
      setError('');
      await api.ingestion.runGeoImport();
      await loadApiPreview();
    } catch (err: any) {
      setError(err?.message || 'Failed to run geo import');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiPreview();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {showActions ? (
          <div className="flex gap-2">
            <button
              onClick={runGeoImport}
              disabled={loading}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
              Run Geo Import
            </button>
            <button
              onClick={runNewsIngestion}
              disabled={loading}
              className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Run News Ingestion
            </button>
            <button
              onClick={loadApiPreview}
              disabled={loading}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-gray-600 mb-2">
        API Health: <span className="font-medium">{healthStatus}</span>
      </p>
      {impactSummary?.executive_summary_bn || impactSummary?.executive_summary_en ? (
        <div className="mb-3 text-xs bg-blue-50 border border-blue-100 rounded-md p-2 text-blue-900">
          <p className="font-semibold mb-1">Latest Impact Summary</p>
          <p className="line-clamp-3">
            {impactSummary.executive_summary_bn || impactSummary.executive_summary_en}
          </p>
        </div>
      ) : null}
      {error ? <p className="text-xs text-red-600 mb-2">{error}</p> : null}

      <div className={compact ? 'space-y-1 max-h-32 overflow-auto' : 'space-y-2 max-h-44 overflow-auto'}>
        {(processedItems.length === 0 && newsItems.length === 0) ? (
          <p className="text-xs text-gray-500">No ingested news summaries yet.</p>
        ) : (
          <>
            {processedItems.map((item) => (
              <div key={item.id || item.raw_article_id || item.title} className="text-xs border border-gray-100 rounded-md p-2">
                <p className="font-semibold text-gray-800 line-clamp-2">{item.title || '(untitled)'}</p>
                <p className="text-gray-500">
                  {item.source_name || 'source'} | gemini
                </p>
                {(item.llm_summary_bn || item.llm_summary_en) ? (
                  <p className="text-gray-600 line-clamp-3 mt-1">{item.llm_summary_bn || item.llm_summary_en}</p>
                ) : null}
              </div>
            ))}
            {processedItems.length === 0 && newsItems.map((item) => (
              <div key={item.id || item.url} className="text-xs border border-gray-100 rounded-md p-2">
                <p className="font-semibold text-gray-800 line-clamp-2">{item.title || '(untitled)'}</p>
                <p className="text-gray-500">
                  {item.source} | {item.summary?.provider || 'no-summary'}
                </p>
                {item.summary?.text ? (
                  <p className="text-gray-600 line-clamp-2 mt-1">{item.summary.text}</p>
                ) : null}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
