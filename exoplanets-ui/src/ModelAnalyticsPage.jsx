import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DatasetTab from './components/DatasetTab';
import { getFallbackData } from './assets/modelInfo';
import PerformanceTab from './components/PerformanceTab';
import FeatureImportanceTab from './components/FeatureImportanceTab';

function ModelAnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [activeTab, setActiveTab] = useState('features');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);

    useEffect(() => {
        const fetchModelData = async () => {
            try {
                setLoading(true);
                console.log('🔄 Fetching model analytics from backend...');

                const response = await fetch('http://localhost:8000/model/analytics');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('✅ Analytics data received:', data);

                let processedData = data;

                if (data.analytics) {
                    processedData = data.analytics;
                }
                else if (data.feature_importance && data.performance_metrics) {
                    processedData = data;
                }

                setAnalyticsData(processedData);

                if (processedData.feature_importance && processedData.feature_importance.length > 0) {
                    setSelectedFeature(processedData.feature_importance[0]);
                }

            } catch (err) {
                console.error('❌ Error fetching model data:', err);
                setError(err.message);
                setAnalyticsData(getFallbackData());
            } finally {
                setLoading(false);
            }
        };

        fetchModelData();
    }, []);

    const getPerformanceMetrics = () => {
        const metrics = analyticsData?.performance_metrics || getFallbackData().performance_metrics;

        let classReport = metrics.classification_report;
        if (classReport && classReport['0'] && classReport['1']) {
            return {
                ...metrics,
                classification_report: {
                    false_positive: classReport['0'],
                    exoplanet: classReport['1']
                }
            };
        }

        return metrics;
    };

    const getConfusionMatrix = () => {
        return analyticsData?.confusion_matrix || getFallbackData().confusion_matrix;
    };

    const getFeatureImportance = () => {
        return analyticsData?.feature_importance || getFallbackData().feature_importance;
    };

    const getModelInfo = () => {
        return analyticsData?.model_info || getFallbackData().model_info;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading model analytics...</p>
                    {error && (
                        <p className="mt-2 text-sm text-amber-400">Using fallback data due to: {error}</p>
                    )}
                </div>
            </div>
        );
    }

    const performanceMetrics = getPerformanceMetrics();
    const confusionMatrix = getConfusionMatrix();
    const featureImportance = getFeatureImportance();
    const modelInfo = getModelInfo();

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        Model Analytics
                    </h1>
                    <p className="text-xl text-gray-300">Kepler + TESS trained model performance and insights</p>
                    {error && (
                        <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                            <p className="text-amber-300">⚠️ Using fallback data: {error}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-4 justify-center">
                    {['features', 'performance', 'dataset'].map(tab => (
                        <motion.button
                            key={tab}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 shadow'
                                }`}
                        >
                            {tab === 'features' && 'Feature Importance'}
                            {tab === 'performance' && 'Performance Metrics'}
                            {tab === 'dataset' && 'Dataset Information'}
                        </motion.button>
                    ))}
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {activeTab === 'features' && (
                        <FeatureImportanceTab
                            featureImportance={featureImportance}
                            selectedFeature={selectedFeature}
                            setSelectedFeature={setSelectedFeature}
                        />
                    )}

                    {activeTab === 'performance' && (
                        <PerformanceTab
                            performanceMetrics={performanceMetrics}
                            confusionMatrix={confusionMatrix}
                            modelInfo={modelInfo}
                        />
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