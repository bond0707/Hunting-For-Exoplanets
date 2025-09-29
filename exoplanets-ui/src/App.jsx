import { useState } from 'react';
import SingleAnalysisPage from './SingleAnalysisPage';
import BatchAnalysisPage from './BatchAnalysisPage';
import AboutModelPage from './AboutModelPage';

export default function App() {
  const [page, setPage] = useState('single');

  const NavButton = ({ targetPage, children }) => (
    <button onClick={() => setPage(targetPage)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${page === targetPage ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] font-sans">
      <nav className="bg-gray-900/50 border-b border-gray-800 p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 mr-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>          <h1 className="text-xl font-bold text-white">SekAI - A World Away</h1>
        </div>
        <NavButton targetPage="single">Single Analysis</NavButton>
        <NavButton targetPage="batch">Batch Analysis</NavButton>
        <NavButton targetPage="about">About the Model</NavButton>
      </nav>
      <main>
        {page === 'single' && <SingleAnalysisPage />}
        {page === 'batch' && <BatchAnalysisPage />}
        {page === 'about' && <AboutModelPage />}
      </main>
    </div>
  );
}