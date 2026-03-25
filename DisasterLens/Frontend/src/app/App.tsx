import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { LanguageProvider } from './i18n/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RoleProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </RoleProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
