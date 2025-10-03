import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getFeatureDetails, COLORS } from '../assets/featureDetails';
import CustomSelect from './CustomSelect';

const modelOptions = ['Kepler', 'TESS', 'K2', 'Universal'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const feature = payload[0].payload;
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                <p className="text-gray-200 capitalize">{feature.feature.replace(/_/g, ' ')}</p>
                <p className="text-indigo-400">Importance: {((feature.importance || 0) * 100).toFixed(2)}%</p>
            </div>
        );
    }
    return null;
};

const FeatureDetailsCard = ({ selectedFeature }) => {
    const featureDetails = getFeatureDetails(selectedFeature);
    if (!featureDetails) return null;

    return (
        <motion.div
            key={selectedFeature.feature}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gray-800/50 rounded-2xl border border-indigo-500/30 p-6 backdrop-blur-sm"
        >
            <h3 className="text-xl font-bold text-white mb-2">{featureDetails.title}</h3>
            <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-4">
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">{(selectedFeature.importance * 100).toFixed(2)}% Importance</span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">{featureDetails.unit}</span>
            </div>
            <div className="space-y-3">
                <div><h4 className="text-white font-semibold text-sm mb-1">Description</h4><p className="text-gray-400 text-sm leading-relaxed">{featureDetails.description}</p></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><h4 className="text-white font-semibold text-sm mb-1">Typical Range</h4><p className="text-gray-400 text-sm">{featureDetails.range}</p></div>
                    <div><h4 className="text-white font-semibold text-sm mb-1">Significance</h4><p className="text-gray-400 text-sm">{featureDetails.significance}</p></div>
                </div>
                <div><h4 className="text-white font-semibold text-sm mb-1">Model Impact</h4><p className="text-gray-400 text-sm">{featureDetails.impact}</p></div>
            </div>
        </motion.div>
    );
};

const FeatureImportanceTab = ({ initialFeatureImportance }) => {
    const [selectedModel, setSelectedModel] = useState('Kepler');
    const [featureImportance, setFeatureImportance] = useState(initialFeatureImportance || []);
    const [selectedFeature, setSelectedFeature] = useState(initialFeatureImportance ? initialFeatureImportance[0] : null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFeatureImportance(initialFeatureImportance || []);
        if (initialFeatureImportance?.length > 0) {
            setSelectedFeature(initialFeatureImportance[0]);
        }
    }, [initialFeatureImportance]);

    useEffect(() => {
        const fetchSpecialistData = async () => {
            if (selectedModel === 'Kepler' && initialFeatureImportance.length > 0) return;
            setLoading(true);
            try {
                const url = `http://localhost:8000/model/analytics?model=${selectedModel.toLowerCase()}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setFeatureImportance(data.feature_importance || []);
                if (data.feature_importance?.length > 0) {
                    setSelectedFeature(data.feature_importance[0]);
                } else {
                    setSelectedFeature(null);
                }
            } catch (error) {
                console.error("Failed to fetch specialist feature importance:", error);
                setFeatureImportance([]);
                setSelectedFeature(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialistData();
    }, [selectedModel]);

    const displayData = [...featureImportance].sort((a, b) => b.importance - a.importance);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8 w-full md:w-64">
                <label className="text-sm font-medium text-gray-300">Select Specialist Model</label>
                <CustomSelect options={modelOptions} value={selectedModel} onChange={setSelectedModel} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-6">Feature Importance: {selectedModel}</h2>
                    <div className="h-96 [&_.recharts-wrapper]:outline-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayData} layout="vertical" margin={{ top: 20, right: 30, left: -35, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} stroke="#9CA3AF" />
                                <YAxis type="category" dataKey="feature" tick={{ fontSize: 12, fill: '#9CA3AF' }} width={140} stroke="#9CA3AF" tickFormatter={(v) => v.replace(/_/g, ' ')} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                                <Bar dataKey="importance" name="Feature Importance" radius={[0, 4, 4, 0]}>
                                    {displayData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="cursor-pointer"
                                            onClick={() => setSelectedFeature(entry)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-gray-400 text-sm mt-4 text-center">Click on any bar to see detailed feature information</p>
                </div>
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedFeature ? (
                            <FeatureDetailsCard selectedFeature={selectedFeature} />
                        ) : (
                            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-32 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-600 rounded-2xl">
                                Select a feature to view details
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Model Insights</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start"><div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div><span><strong className="text-white">Planetary characteristics</strong> (like radius and period) are the strongest predictors.</span></li>
                            <li className="flex items-start"><div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div><span><strong className="text-white">Stellar parameters</strong> provide crucial context for validating planets.</span></li>
                            <li className="flex items-start"><div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div><span><strong className="text-white">Kepler KOI flags</strong> are highly effective at filtering out common false positives.</span></li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureImportanceTab;