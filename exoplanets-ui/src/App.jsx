import { useState } from 'react';
import SingleAnalysisPage from './SingleAnalysisPage';
import BatchAnalysisPage from './BatchAnalysisPage';
import ModelAnalyticsPage from './ModelAnalyticsPage';
import ModelDevelopmentPage from './ModelDevelopmentPage';

export default function App() {
  const [page, setPage] = useState('single');

  const NavButton = ({ targetPage, children }) => (
    <button 
      onClick={() => setPage(targetPage)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        page === targetPage ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] font-sans">
      <nav className="bg-gray-900/50 border-b border-gray-800 p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 mr-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="35" 
            height="35" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#8B5CF6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
            <path d="m15 9-6 6"/>
            <path d="m9 9 6 6"/>
          </svg>
          <h1 className="text-xl font-bold text-white">SekAI - Universal Exoplanet Detector</h1>
        </div>
        <NavButton targetPage="single">Single Candidate</NavButton>
        <NavButton targetPage="batch">Batch Analysis</NavButton>
        <NavButton targetPage="analytics">Model Analytics</NavButton>
        <NavButton targetPage="development">Model Development</NavButton>
      </nav>
      <main>
        {page === 'single' && <SingleAnalysisPage />}
        {page === 'batch' && <BatchAnalysisPage />}
        {page === 'analytics' && <ModelAnalyticsPage />}
        {page === 'development' && <ModelDevelopmentPage />}
      </main>
    </div>
  );
}