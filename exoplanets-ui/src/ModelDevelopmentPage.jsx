import React, { useState } from 'react';

function ModelDevelopmentPage() {
    const [activeTab, setActiveTab] = useState('architecture');

    const tabs = [
        { id: 'architecture', label: 'Ensemble Architecture' },
        { id: 'models', label: 'Specialist Models' },
        { id: 'training', label: 'Training Strategy' }
    ];

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        5-Model Ensemble Architecture
                    </h1>
                    <p className="text-xl text-gray-300">Advanced ensemble learning for exoplanet discovery</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-4 justify-center">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 font-medium rounded-lg transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 shadow'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'architecture' && <EnsembleArchitecture />}
                {activeTab === 'models' && <SpecialistModels />}
                {activeTab === 'training' && <TrainingStrategy />}
            </div>
        </div>
    );
}

const EnsembleArchitecture = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Ensemble Architecture</h3>
                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                        <div>
                            <div className="font-semibold text-white">Mission Specialist Models</div>
                            <div className="text-sm text-gray-400">Kepler, TESS, K2 specialists + Universal + Fake Detector</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                        <div>
                            <div className="font-semibold text-white">Feature Engineering</div>
                            <div className="text-sm text-gray-400">Mission-specific feature sets with optimal preprocessing</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                        <div>
                            <div className="font-semibold text-white">Meta-Learning</div>
                            <div className="text-sm text-gray-400">Logistic Regression combining all specialist predictions</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">4</div>
                        <div>
                            <div className="font-semibold text-white">Dynamic Routing</div>
                            <div className="text-sm text-gray-400">Automatic mission detection and specialist model selection</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Technical Specifications</h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Ensemble Type</span>
                        <span className="text-white font-semibold">Stacking Ensemble</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Base Models</span>
                        <span className="text-white font-semibold">5 Specialist Models</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Meta-Model</span>
                        <span className="text-white font-semibold">Logistic Regression</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Total Features</span>
                        <span className="text-white font-semibold">34 across all models</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Training Data</span>
                        <span className="text-white font-semibold">Kepler + TESS + K2</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-400">Optimal Threshold</span>
                        <span className="text-cyan-400 font-semibold">0.35 (Discovery Focused)</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Ensemble Workflow</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div className="p-4 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                    <div className="text-2xl mb-2">🔭</div>
                    <div className="font-semibold text-white">Input Data</div>
                    <div className="text-xs text-gray-400 mt-1">Mission-specific features</div>
                </div>
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="font-semibold text-white">Feature Mapping</div>
                    <div className="text-xs text-gray-400 mt-1">Auto-detect mission</div>
                </div>
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-2xl mb-2">🤖</div>
                    <div className="font-semibold text-white">Specialist Models</div>
                    <div className="text-xs text-gray-400 mt-1">5 parallel predictions</div>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="font-semibold text-white">Meta-Model</div>
                    <div className="text-xs text-gray-400 mt-1">Combine predictions</div>
                </div>
                <div className="p-4 bg-amber-500/20 rounded-lg border border-amber-500/30">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-semibold text-white">Final Prediction</div>
                    <div className="text-xs text-gray-400 mt-1">Ensemble confidence</div>
                </div>
            </div>
        </div>
    </div>
);

const SpecialistModels = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-2xl border border-indigo-500/30 p-6">
                <h4 className="text-lg font-bold text-indigo-300 mb-3">Kepler Specialist</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                        <span><strong>11 Features:</strong> KOI scores + flags</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                        <span><strong>Optimized for:</strong> Kepler data patterns</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                        <span><strong>Algorithm:</strong> Gradient Boosting</span>
                    </li>
                </ul>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-green-500/30 p-6">
                <h4 className="text-lg font-bold text-green-300 mb-3">TESS Specialist</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span><strong>9 Features:</strong> TESS-specific params</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span><strong>Includes:</strong> TESS magnitude</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span><strong>Algorithm:</strong> Gradient Boosting</span>
                    </li>
                </ul>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-blue-500/30 p-6">
                <h4 className="text-lg font-bold text-blue-300 mb-3">K2 Specialist</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span><strong>8 Features:</strong> K2 observation data</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span><strong>Optimized for:</strong> K2 mission constraints</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span><strong>Algorithm:</strong> Gradient Boosting</span>
                    </li>
                </ul>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-cyan-500/30 p-6">
                <h4 className="text-lg font-bold text-cyan-300 mb-3">Universal Finder</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                        <span><strong>6 Core Features:</strong> Universal params</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                        <span><strong>Optimized for:</strong> Recall (discovery)</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                        <span><strong>Algorithm:</strong> Gradient Boosting</span>
                    </li>
                </ul>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-amber-500/30 p-6">
                <h4 className="text-lg font-bold text-amber-300 mb-3">Fake Detector</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span><strong>6 Core Features:</strong> Same as Universal</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span><strong>Optimized for:</strong> Precision (false positives)</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span><strong>Algorithm:</strong> XGBoost</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

const TrainingStrategy = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h4 className="text-lg font-semibold text-indigo-300 mb-3">Hyperparameter Tuning</h4>
                <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>Grid Search with 3-fold CV for each specialist</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>Mission-specific optimization objectives</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>300 estimators for complex pattern detection</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>Generalization focus across missions</span>
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-emerald-300 mb-3">Data Pipeline</h4>
                <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Median imputation for missing values</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>StandardScaler for feature normalization</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Stratified train-test split (70-30)</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Mission-specific feature engineering</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-cyan-300 mb-4">Ensemble Training Process</h4>
            <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                    <div>
                        <div className="font-semibold text-white">Individual Model Training</div>
                        <div className="text-sm text-gray-400">Each specialist model trained on its mission data with optimal hyperparameters</div>
                    </div>
                </div>
                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                    <div>
                        <div className="font-semibold text-white">Prediction Generation</div>
                        <div className="text-sm text-gray-400">All models generate predictions on training data for meta-model</div>
                    </div>
                </div>
                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                    <div>
                        <div className="font-semibold text-white">Meta-Model Training</div>
                        <div className="text-sm text-gray-400">Logistic Regression learns to combine specialist predictions optimally</div>
                    </div>
                </div>
                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">4</div>
                    <div>
                        <div className="font-semibold text-white">Validation & Testing</div>
                        <div className="text-sm text-gray-400">Ensemble evaluated on holdout test set from all missions</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ModelDevelopmentPage;