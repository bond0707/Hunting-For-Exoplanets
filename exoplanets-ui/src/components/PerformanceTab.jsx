import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot, Label } from 'recharts';
import { motion } from 'framer-motion';
import { rocData } from '../assets/modelInfo';

const RocTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
                <p className="text-white font-semibold">Threshold: {data.threshold}</p>
                <p className="text-blue-400">True Positive Rate: {(data.tpr * 100).toFixed(1)}%</p>
                <p className="text-red-400">False Positive Rate: {(data.fpr * 100).toFixed(1)}%</p>
            </div>
        );
    }
    return null;
};

const PerformanceTab = ({ performanceMetrics, confusionMatrix, modelInfo }) => {
    if (!performanceMetrics || !confusionMatrix || !modelInfo) {
        return <div className="text-center text-gray-400">Loading performance data...</div>;
    }

    const totalPredictions = confusionMatrix.true_positive + confusionMatrix.true_negative +
        confusionMatrix.false_positive + confusionMatrix.false_negative;
    const accuracy = totalPredictions > 0 ?
        ((confusionMatrix.true_positive + confusionMatrix.true_negative) / totalPredictions * 100).toFixed(1) : '0.0';

    const optimalThreshold = performanceMetrics?.best_threshold || 0.35;
    const thresholdPoint = rocData.reduce((prev, curr) => 
        Math.abs(curr.threshold - optimalThreshold) < Math.abs(prev.threshold - optimalThreshold) ? curr : prev
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Model Information</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-800 rounded-lg flex flex-col items-center justify-center"><div className="text-xl font-bold text-indigo-400">{modelInfo.features_used}</div><div className="text-gray-400 text-sm mt-1">Unique Features</div></div>
                            <div className="text-center p-3 bg-gray-800 rounded-lg flex flex-col items-center justify-center"><div className="text-xl font-bold text-emerald-400">{modelInfo.dataset_size?.toLocaleString()}</div><div className="text-gray-400 text-sm mt-1">Training Samples</div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-800 rounded-lg flex flex-col items-center justify-center"><div className="text-xl font-bold text-cyan-400">{modelInfo.test_set_size?.toLocaleString()}</div><div className="text-gray-400 text-sm mt-1">Test Samples</div></div>
                            <div className="text-center p-3 bg-gray-800 rounded-lg flex flex-col items-center justify-center"><div className="text-xl font-bold text-amber-400">{modelInfo.model_type}</div><div className="text-gray-400 text-sm mt-1">Algorithm</div></div>
                        </div>
                        {modelInfo.missions && (<div className="text-center p-3 bg-indigo-500/20 rounded-lg border border-indigo-500/30 flex flex-col items-center justify-center"><div className="text-lg font-bold text-purple-400">{modelInfo.missions}</div><div className="text-gray-400 text-sm mt-1">Trained Missions</div></div>)}
                        <div className="p-3 bg-gray-800 rounded-lg flex flex-col items-center justify-center"><div className="text-sm text-gray-400">Optimal Threshold</div><div className="text-white font-semibold mt-1">{performanceMetrics.best_threshold}</div><div className="text-gray-500 text-xs mt-1">Probability threshold for classification</div></div>
                    </div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">ROC-AUC Curve</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={rocData}
                                // UPDATED: Increased top and left margins to prevent label clipping
                                margin={{ top: 40, right: 30, left: 30, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="fpr"
                                    label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#9CA3AF', fontSize: 12 }}
                                    stroke="#9CA3AF"
                                    tickFormatter={(value) => value.toFixed(1)}
                                    domain={[0, 1]}
                                />
                                <YAxis
                                    dataKey="tpr"
                                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }}
                                    stroke="#9CA3AF"
                                    tickFormatter={(value) => value.toFixed(1)}
                                    domain={[0, 1]}
                                />
                                <Tooltip content={<RocTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="tpr"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                                {thresholdPoint && (
                                    <ReferenceDot x={thresholdPoint.fpr} y={thresholdPoint.tpr} r={8} fill="#F59E0B" stroke="white" strokeWidth={2}>
                                        <Label value={`Optimal Threshold (${optimalThreshold})`} position="top" fill="#F59E0B" fontSize={12} dy={-15} />
                                    </ReferenceDot>
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                        <div className="text-2xl font-bold text-indigo-400">
                            AUC: {(performanceMetrics.test_auc * 100).toFixed(1)}%
                        </div>
                        <div className="text-gray-400 text-sm mt-1">Area Under ROC Curve</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Classification Report</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-gray-800 rounded-lg flex items-center justify-center"><div><div className="text-sm text-gray-400">Class</div><div className="font-bold text-white mt-1">Metrics</div></div></div>
                            <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30 flex items-center justify-center"><div><div className="text-sm text-red-400">False Positive</div><div className="text-white mt-1">Non-Exoplanet</div></div></div>
                            <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 flex items-center justify-center"><div><div className="text-sm text-green-400">Exoplanet</div><div className="text-white mt-1">Confirmed</div></div></div>
                        </div>
                        {['precision', 'recall', 'f1_score'].map(metric => (
                            <div key={metric} className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-gray-800 rounded-lg flex items-center justify-center"><div className="text-sm text-gray-400 capitalize">{metric.replace('_', ' ')}</div></div>
                                <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-center"><div className="text-xl font-bold text-white">{(performanceMetrics.classification_report.false_positive[metric] * 100).toFixed(1)}%</div></div>
                                <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-center"><div className="text-xl font-bold text-white">{(performanceMetrics.classification_report.exoplanet[metric] * 100).toFixed(1)}%</div></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Confusion Matrix</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center"><div></div><div className="text-sm text-red-400 font-semibold">Predicted: False</div><div className="text-sm text-green-400 font-semibold">Predicted: Exoplanet</div></div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="text-sm text-red-400 font-semibold flex items-center justify-end pr-2">Actual: False</div>
                            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30"><div className="text-2xl font-bold text-green-400">{confusionMatrix.true_negative}</div><div className="text-xs text-green-300 mt-1">True Negative</div></div>
                            <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30"><div className="text-2xl font-bold text-red-400">{confusionMatrix.false_positive}</div><div className="text-xs text-red-300 mt-1">False Positive</div></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="text-sm text-green-400 font-semibold flex items-center justify-end pr-2">Actual: Exoplanet</div>
                            <div className="p-4 bg-amber-500/20 rounded-lg border border-amber-500/30"><div className="text-2xl font-bold text-amber-400">{confusionMatrix.false_negative}</div><div className="text-xs text-amber-300 mt-1">False Negative</div></div>
                            <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30"><div className="text-2xl font-bold text-blue-400">{confusionMatrix.true_positive}</div><div className="text-xs text-blue-300 mt-1">True Positive</div></div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700"><div className="grid grid-cols-2 gap-4 text-center">
                            <div className="flex flex-col items-center justify-center"><div className="text-gray-400 text-sm">Accuracy</div><div className="text-white font-semibold text-lg">{accuracy}%</div></div>
                            <div className="flex flex-col items-center justify-center"><div className="text-gray-400 text-sm">Misclassification</div><div className="text-white font-semibold text-lg">{((confusionMatrix.false_positive + confusionMatrix.false_negative) / totalPredictions * 100).toFixed(1)}%</div></div>
                        </div></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PerformanceTab;