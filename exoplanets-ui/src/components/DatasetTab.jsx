import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { datasetInfo } from '../assets/datasetInfo';

const DatasetTab = () => {
    const handleDownload = () => {
        const csvContent = "koi_period,koi_prad,koi_teq,koi_disposition,mission\n129.9,1.17,188,CONFIRMED,Kepler\n0.73,1.88,2000,FALSE POSITIVE,TESS\n15.2,2.34,320,CANDIDATE,Kepler";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_dataset.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{datasetInfo.name}</h2>
                        <p className="text-gray-300">{datasetInfo.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
                            NASA Verified
                        </div>
                        <motion.button
                            onClick={handleDownload}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Sample Dataset
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">{datasetInfo.size}</div>
                        <div className="text-gray-400 text-sm">Total Observations</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">12</div>
                        <div className="text-gray-400 text-sm">Key Features</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">2009-2024</div>
                        <div className="text-gray-400 text-sm">Observation Period</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">6,000+</div>
                        <div className="text-gray-400 text-sm">Confirmed Exoplanets</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Mission Training</h3>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">🌌</div>
                            <div>
                                <div className="font-semibold text-white">Mission Goal</div>
                                <div className="text-sm text-gray-400">{datasetInfo.missionInfo.goal}</div>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">🪐</div>
                            <div>
                                <div className="font-semibold text-white">Discoveries</div>
                                <div className="text-sm text-gray-400">{datasetInfo.missionInfo.discoveries}</div>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">🔭</div>
                            <div>
                                <div className="font-semibold text-white">Detection Method</div>
                                <div className="text-sm text-gray-400">{datasetInfo.missionInfo.method}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Dataset Composition</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={datasetInfo.dispositionStats}
                                    dataKey="count"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                >
                                    {datasetInfo.dispositionStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Features Used</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {datasetInfo.keyFeatures.map((feature, index) => (
                        <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-600 hover:border-indigo-500/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div className="font-semibold text-white text-sm">{feature.name}</div>
                                <span className={`text-xs px-2 py-1 rounded ${feature.category === 'Orbital' ? 'bg-blue-500/20 text-blue-300' :
                                        feature.category === 'Planetary' ? 'bg-green-500/20 text-green-300' :
                                            feature.category === 'Environmental' ? 'bg-orange-500/20 text-orange-300' :
                                                feature.category === 'Stellar' ? 'bg-purple-500/20 text-purple-300' :
                                                    'bg-gray-500/20 text-gray-300'
                                    }`}>
                                    {feature.category}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default DatasetTab;