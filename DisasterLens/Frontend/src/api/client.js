export const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = async (endpoint, options = {}) => {
  const { method = 'GET', body, ...customOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customOptions.headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || errorBody.message || 'API request failed');
  }

  return response.json();
};

export const api = {
  health: () => apiClient('/health'),
  test: {
    list: () => apiClient('/test/testing'),
    create: (data) => apiClient('/test/testing', { method: 'POST', body: data }),
  },
  ingestion: {
    runGeoImport: () => apiClient('/ingestion/geo/import', { method: 'POST' }),
    runNews: () => apiClient('/ingestion/news/run', { method: 'POST' }),
    runImpactAnalysis: (includeIngestion = true) => apiClient(`/ingestion/impact/run?include_ingestion=${includeIngestion}`, { method: 'POST' }),
    latestNews: (limit = 5) => apiClient(`/ingestion/news/latest?limit=${limit}`),
    latestProcessedNews: (limit = 5) => apiClient(`/ingestion/news/processed/latest?limit=${limit}`),
    latestImpactSummary: () => apiClient('/ingestion/impact/latest'),
  },
  volunteer: {
    createCoverageUpdate: (data) => apiClient('/volunteer/coverage-updates', { method: 'POST', body: data }),
    latestCoverageUpdates: (limit = 100) => apiClient(`/volunteer/coverage-updates/latest?limit=${limit}`),
  },
};
