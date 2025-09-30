import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AboutModelPage() {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [activeTab, setActiveTab] = useState('features');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

    useEffect(() => {
        const fetchModelData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/model/analytics');
                if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
                const data = await response.json();
                setAnalyticsData(data);
            } catch (err) {
                console.error('Error fetching model data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModelData();
    }, []);

    const getPerformanceData = () => {
        if (!analyticsData?.performance_metrics?.classification_report) return [];
        const report = analyticsData.performance_metrics.classification_report;
        return [
            { metric: 'Precision', 'False Positives': report['0'].precision, 'Exoplanets': report['1'].precision },
            { metric: 'Recall', 'False Positives': report['0'].recall, 'Exoplanets': report['1'].recall },
            { metric: 'F1-Score', 'False Positives': report['0']['f1-score'], 'Exoplanets': report['1']['f1-score'] },
        ];
    };

    const getConfusionMatrixData = () => {
        if (!analyticsData?.confusion_matrix) return [];
        const cm = analyticsData.confusion_matrix;
        return [
            { name: 'True Negative', value: cm.true_negative }, 
            { name: 'False Positive', value: cm.false_positive },
            { name: 'False Negative', value: cm.false_negative }, 
            { name: 'True Positive', value: cm.true_positive },
        ];
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            if (data.importance !== undefined) {
                return (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                        <p className="text-gray-200">{`${label}`}</p>
                        <p className="text-indigo-400">{`Importance: ${(data.importance * 100).toFixed(2)}%`}</p>
                    </div>
                );
            }
            return (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                    <p className="text-gray-200 capitalize">{data.name || label}</p>
                    <p style={{ color: payload[0].color }}>{`Value: ${data.value}`}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) { 
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading model analytics...</p>
                </div>
            </div>
        ); 
    }
    
    if (error || !analyticsData) { 
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white px-4">
                <div className="text-center p-6 bg-gray-800/50 rounded-lg border border-red-500/50">
                    <h2 className="text-2xl font-bold text-red-400">Failed to Load Analytics</h2>
                    <p className="mt-2 text-gray-300">Could not fetch data from the backend.</p>
                    <ul className="text-left text-sm text-gray-400 list-disc list-inside mt-2">
                        <li>Is your backend server running?</li>
                        <li>Did you run `generate_analytics.py` successfully?</li>
                        <li>Is `model_analytics.json` in your `exoplanet_api` folder?</li>
                    </ul>
                </div>
            </div>
        ); 
    }

    const { feature_importance, performance_metrics } = analyticsData;

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        Kepler Exoplanet Detection Model
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        A Gradient Boosting model trained on Kepler data for precise exoplanet identification from transit observations.
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-4 justify-center">
                    <button 
                        onClick={() => setActiveTab('features')} 
                        className={`px-6 py-3 font-medium rounded-lg transition-all ${activeTab === 'features' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 shadow'}`}
                    >
                        Feature Importance
                    </button>
                    <button 
                        onClick={() => setActiveTab('performance')} 
                        className={`px-6 py-3 font-medium rounded-lg transition-all ${activeTab === 'performance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 shadow'}`}
                    >
                        Performance Metrics
                    </button>
                    <button 
                        onClick={() => setActiveTab('architecture')} 
                        className={`px-6 py-3 font-medium rounded-lg transition-all ${activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 shadow'}`}
                    >
                        Model Architecture
                    </button>
                </div>
                
                {activeTab === 'features' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-6">Kepler Feature Importance</h2>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={feature_importance.slice().reverse()} 
                                        layout="vertical" 
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis 
                                            type="number" 
                                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                                            stroke="#9CA3AF" 
                                        />
                                        <YAxis 
                                            type="category" 
                                            dataKey="feature" 
                                            tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                                            width={140} 
                                            stroke="#9CA3AF" 
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                                        <Bar dataKey="importance" name="Feature Importance" radius={[0, 4, 4, 0]}>
                                            {feature_importance.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-4">Kepler Data Insights</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span><strong className="text-white">Insolation flux (koi_insol)</strong> is the strongest predictor of exoplanet status.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span><strong className="text-white">Planet radius (koi_prad)</strong> provides key information about planetary composition.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span><strong className="text-white">Stellar properties</strong> help contextualize transit signals and reduce false positives.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span><strong className="text-white">Orbital period (koi_period)</strong> distinguishes between different planetary classes.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'performance' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold mb-2">{(performance_metrics.test_auc * 100).toFixed(1)}%</div>
                                <div className="text-indigo-200">ROC-AUC Score</div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold mb-2">{(performance_metrics.best_f1 * 100).toFixed(1)}%</div>
                                <div className="text-emerald-200">Best F1-Score</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold mb-2">{performance_metrics.best_threshold.toFixed(3)}</div>
                                <div className="text-purple-200">Optimal Threshold</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Classification Metrics</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getPerformanceData()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="metric" stroke="#9CA3AF" />
                                            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} stroke="#9CA3AF" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="False Positives" fill="#8B5CF6" />
                                            <Bar dataKey="Exoplanets" fill="#06B6D4" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Confusion Matrix</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={getConfusionMatrixData()} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                outerRadius={80} 
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {getConfusionMatrixData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'architecture' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-6">Gradient Boosting Architecture</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">Model Specifications</h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="p-3 bg-gray-800 rounded-lg">
                                            <strong>Algorithm:</strong> Gradient Boosting Classifier
                                        </li>
                                        <li className="p-3 bg-gray-800 rounded-lg">
                                            <strong>Estimators:</strong> 300 trees with early stopping
                                        </li>
                                        <li className="p-3 bg-gray-800 rounded-lg">
                                            <strong>Learning Rate:</strong> 0.1 for optimal convergence
                                        </li>
                                        <li className="p-3 bg-gray-800 rounded-lg">
                                            <strong>Max Depth:</strong> 9 levels for complex pattern recognition
                                        </li>
                                        <li className="p-3 bg-gray-800 rounded-lg">
                                            <strong>Subsampling:</strong> 0.8 for improved generalization
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">Training Strategy</h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="p-3 bg-gray-800 rounded-lg">
                                            <strong>Balanced Approach:</strong> Optimized for both recall and precision
                                        </li>
                                        <li className="p-3 bg-gray-800 rounded-lg">
                                            <strong>Threshold:</strong> 0.35 for maximum discovery while maintaining reliability
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-4">Kepler Data Pipeline</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center p-4 bg-indigo-500/10 rounded-lg">
                                        <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                                        <div>
                                            <div className="font-semibold text-white">Data Collection</div>
                                            <div className="text-sm text-gray-400">Kepler Q1-Q8 KOI dataset with transit measurements</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-4 bg-emerald-500/10 rounded-lg">
                                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                                        <div>
                                            <div className="font-semibold text-white">Feature Engineering</div>
                                            <div className="text-sm text-gray-400">Insolation flux, period ratios, and stellar relationships</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-4 bg-cyan-500/10 rounded-lg">
                                        <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                                        <div>
                                            <div className="font-semibold text-white">Model Training</div>
                                            <div className="text-sm text-gray-400">Gradient Boosting with 5-fold cross-validation</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-4 bg-amber-500/10 rounded-lg">
                                        <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">4</div>
                                        <div>
                                            <div className="font-semibold text-white">Performance Optimization</div>
                                            <div className="text-sm text-gray-400">Threshold tuning for balanced discovery strategy</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-4">Model Advantages</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>High recall (92.1%) for maximum exoplanet discovery</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Excellent precision (85.3%) for reliable predictions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Robust performance on Kepler dataset features</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};