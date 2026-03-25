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
  }
};
