import { useState } from 'react';
import BatchAnalysisPage from './BatchAnalysisPage';
import SingleAnalysisPage from './SingleAnalysisPage';
import ModelAnalyticsPage from './ModelAnalyticsPage';
import ModelDevelopmentPage from './ModelDevelopmentPage';

export default function App() {
  const [activePage, setActivePage] = useState('single');

  const pages = [
    { id: 'single', label: 'Single Candidate' },
    { id: 'batch', label: 'Batch Analysis' },
    { id: 'analytics', label: 'Model Analytics' },
    { id: 'development', label: 'Model Development' }
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'single': return <SingleAnalysisPage />;
      case 'batch': return <BatchAnalysisPage />;
      case 'analytics': return <ModelAnalyticsPage />;
      case 'development': return <ModelDevelopmentPage />;
      default: return <SingleAnalysisPage />;
    }
  };

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
            stroke="#818CF8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h1 className="text-xl font-bold text-white">Seek.AI - Exoplanet Detector</h1>
        </div>

        {/* Navigation Buttons */}
        {pages.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activePage === id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
              }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main>
        {renderPage()}
      </main>
    </div>
  );
}