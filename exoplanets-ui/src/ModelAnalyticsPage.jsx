import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DatasetTab from './components/DatasetTab';
import PerformanceTab from './components/PerformanceTab';
import FeatureImportanceTab from './components/FeatureImportanceTab';
import { getFallbackData } from './assets/modelInfo';

function ModelAnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [activeTab, setActiveTab] = useState('features');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This effect now runs only once to get the static ensemble data
        const fetchEnsembleData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/model/analytics');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setAnalyticsData(data);
            } catch (err) {
                setError(err.message);
                setAnalyticsData(getFallbackData());
            } finally {
                setLoading(false);
            }
        };
        fetchEnsembleData();
    }, []); // Empty dependency array means it only runs once on mount

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-center">
                <div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading Model Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        Model Analytics
                    </h1>
                    <p className="text-xl text-gray-300">Performance insights for the 5-Model Ensemble and its specialists</p>
                    {error && <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg"><p className="text-amber-300">⚠️ {error}</p></div>}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-4 justify-center">
                    {['features', 'performance', 'dataset'].map(tab => (
                        <motion.button key={tab} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 shadow'}`}>
                            {tab === 'features' && 'Feature Importance'}
                            {tab === 'performance' && 'Ensemble Performance'}
                            {tab === 'dataset' && 'Multi-Mission Dataset'}
                        </motion.button>
                    ))}
                </div>

                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {activeTab === 'features' && (
                        // Pass the initial (Kepler) feature list as a prop
                        <FeatureImportanceTab initialFeatureImportance={analyticsData?.feature_importance || []} />
                    )}
                    {activeTab === 'performance' && (
                        <PerformanceTab performanceMetrics={analyticsData?.performance_metrics} confusionMatrix={analyticsData?.confusion_matrix} modelInfo={analyticsData?.model_info} />
                    )}
                    {activeTab === 'dataset' && (
                        <DatasetTab />
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default ModelAnalyticsPage;