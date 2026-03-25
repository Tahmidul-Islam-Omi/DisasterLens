import { Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PublicLayout } from './PublicLayout';

/**
 * ConditionalLayout Component
 * 
 * Shows different layouts based on authentication status:
 * - Not authenticated: PublicLayout (horizontal navbar)
 * - Authenticated: ProtectedLayout (sidebar + header)
 * 
 * Used for routes that are accessible both publicly and when authenticated
 * (e.g., Weather Dashboard, District Weather, Disaster Details, Alerts)
 */
export function ConditionalLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Show protected layout with sidebar
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto flex flex-col relative">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Show public layout with horizontal navbar
  return <PublicLayout />;
}
