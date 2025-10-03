import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { datasetInfo } from '../assets/datasetInfo';
import CustomSelect from './CustomSelect';

const featureMissionOptions = ['Universal', 'Kepler', 'TESS', 'K2'];

const DatasetTab = () => {
    const [selectedFeatureMission, setSelectedFeatureMission] = useState('Universal');

    const featuresToDisplay = datasetInfo.keyFeatures[selectedFeatureMission.toLowerCase()] || [];

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
                        <p className="text-gray-300">Multi-mission dataset combining Kepler, TESS, and K2 observations for robust ensemble training.</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
                            NASA Multi-Mission
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">{datasetInfo.size}</div>
                        <div className="text-gray-400 text-sm">Total Observations</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">3</div>
                        <div className="text-gray-400 text-sm">Space Missions</div>
                    </div>
                    {/* UPDATED: The feature count is now accurate for our specific model. */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">20</div>
                        <div className="text-gray-400 text-sm">Unique Features Used</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-xl font-bold text-white mb-1">6,000+</div>
                        <div className="text-gray-400 text-sm">Confirmed Exoplanets</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Mission Distribution</h3>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"><div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">🔭</div><div><div className="font-semibold text-white">Kepler Mission</div><div className="text-sm text-gray-400">4-year primary mission, 100,000+ stars monitored</div></div></div>
                        <div className="flex items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20"><div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">🛰️</div><div><div className="font-semibold text-white">TESS Mission</div><div className="text-sm text-gray-400">All-sky survey, 85% of sky coverage</div></div></div>
                        <div className="flex items-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20"><div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">🌟</div><div><div className="font-semibold text-white">K2 Mission</div><div className="text-sm text-gray-400">Kepler's second life, 20 campaigns</div></div></div>
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Dataset Composition</h3>
                    <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={datasetInfo.dispositionStats} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percentage }) => `${name}: ${percentage}%`}>{datasetInfo.dispositionStats.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-bold text-white mb-4 md:mb-0">Key Data Features</h3>
                    <div className="w-full md:w-64">
                        <CustomSelect
                            options={featureMissionOptions}
                            value={selectedFeatureMission}
                            onChange={setSelectedFeatureMission}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuresToDisplay.map((feature, index) => (
                        <motion.div
                            key={`${selectedFeatureMission}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-gray-800/30 rounded-lg p-4 border border-gray-600 hover:border-indigo-500/50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="font-semibold text-white text-sm">{feature.name}</div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                    feature.category === 'Kepler' ? 'bg-blue-500/20 text-blue-300' :
                                    feature.category === 'TESS' ? 'bg-green-500/20 text-green-300' :
                                    feature.category === 'K2' ? 'bg-purple-500/20 text-purple-300' :
                                    feature.category === 'Universal' ? 'bg-cyan-500/20 text-cyan-300' :
                                    'bg-gray-500/20 text-gray-300'
                                }`}>
                                    {feature.category}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default DatasetTab;