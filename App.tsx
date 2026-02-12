
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen text-slate-50 relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        
        {/* Simple Footer */}
        <footer className="w-full py-8 text-center text-slate-600 text-xs border-t border-slate-900 mt-auto">
          &copy; 2024 EpiWatch AI Outbreak Intelligence Platform. Built with Google GenAI.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
