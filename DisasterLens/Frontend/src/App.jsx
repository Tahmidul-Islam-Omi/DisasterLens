import React from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Navbar />
        <main>
          <Dashboard />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
