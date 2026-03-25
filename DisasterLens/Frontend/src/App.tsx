import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { api } from './api/client';
import { RoleProvider } from './context/RoleContext';
import { router } from './routes';

let backendDebugLogged = false;

export default function App() {
  useEffect(() => {
    // In React StrictMode dev, effects run twice. Keep logs and network calls one-time.
    if (backendDebugLogged) return;
    backendDebugLogged = true;

    const logBackendData = async () => {
      try {
        const [health, latest] = await Promise.all([
          api.health(),
          api.ingestion.latestNews(5),
        ]);

        console.log('[DisasterLens] Backend health:', health);
        console.log('[DisasterLens] Backend latest news response:', latest);

        if (!latest?.data?.length) {
          console.log('[DisasterLens] No ingested items found. Running ingestion now...');
          const ingestionRun = await api.ingestion.runNews();
          const refreshed = await api.ingestion.latestNews(5);
          console.log('[DisasterLens] Ingestion run response:', ingestionRun);
          console.log('[DisasterLens] Refreshed latest news:', refreshed);
        }
      } catch (error) {
        console.error('[DisasterLens] Failed to fetch backend data:', error);
      }
    };

    logBackendData();
  }, []);

  return (
    <RoleProvider>
      <RouterProvider router={router} />
    </RoleProvider>
  );
}
