import React, { useState } from 'react';

function ModelDevelopmentPage() {
    const [activeTab, setActiveTab] = useState('architecture');

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        Model Development
                    </h1>
                    <p className="text-xl text-gray-300">Model architecture and implementation</p>
                </div>
                {activeTab === 'architecture' && <ArchitectureTab />}
            </div>
        </div>
    );
}

const ArchitectureTab = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Model Architecture</h3>
                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-indigo-500/10 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                        <div>
                            <div className="font-semibold text-white">Data Collection</div>
                            <div className="text-sm text-gray-400">Q1-Q8 datasets with observations</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-emerald-500/10 rounded-lg">
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                        <div>
                            <div className="font-semibold text-white">Feature Engineering</div>
                            <div className="text-sm text-gray-400">Insolation flux, period ratios, features</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-cyan-500/10 rounded-lg">
                        <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                        <div>
                            <div className="font-semibold text-white">Model Training</div>
                            <div className="text-sm text-gray-400">Gradient Boosting with recall optimization</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-amber-500/10 rounded-lg">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">4</div>
                        <div>
                            <div className="font-semibold text-white">Validation</div>
                            <div className="text-sm text-gray-400">Testing on holdout data</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Technical Specifications</h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Algorithm</span>
                        <span className="text-white font-semibold">Gradient Boosting</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Features</span>
                        <span className="text-white font-semibold">12 parameters</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Optimization</span>
                        <span className="text-white font-semibold">Recall-focused grid search</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Class Balance</span>
                        <span className="text-white font-semibold">SMOTE oversampling</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Training Data</span>
                        <span className="text-white font-semibold">Combined Dataset</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-400">Threshold</span>
                        <span className="text-cyan-400 font-semibold">0.35 (Discovery)</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Training Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold text-indigo-300 mb-3">Hyperparameter Tuning</h4>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span>Grid Search with 5-fold CV</span>
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span>Recall-optimized scoring for discovery</span>
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span>300 estimators for complex patterns</span>
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span>Generalization focus</span>
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
                            <span>Stratified train-test split</span>
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span>Feature engineering</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default ModelDevelopmentPage;