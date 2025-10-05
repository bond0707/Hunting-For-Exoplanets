import { motion, AnimatePresence } from 'framer-motion';
import { HabitabilityIndicator, CategoryVisualizer, TransitVisualizer } from './ResultVisuals';

function ResultDisplay({
    isLoading,
    selectedMission,
    error,
    result,
    sampleInfo,
    submittedData,
    onErrorDismiss
}) {
    return (
        <div className="flex items-center justify-center rounded-xl bg-gray-800/30 border border-gray-700 min-h-[500px]">
            <div className="text-center w-full p-6">
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="animate-spin h-12 w-12 rounded-full border-4 border-t-indigo-400 border-gray-600 mx-auto"></div>
                            <p className="text-gray-400 text-lg">Running {selectedMission} Model Analysis...</p>
                            <p className="text-gray-500 text-sm">Processing with specialized {selectedMission} model</p>
                        </motion.div>
                    )}

                    {error && !isLoading && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-red-400 space-y-3"
                        >
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-bold">Analysis Failed</h3>
                            <p className="text-red-300">{error}</p>
                            <button
                                onClick={onErrorDismiss}
                                className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full space-y-6"
                        >
                            <div className={`p-4 rounded-lg ${result.is_exoplanet ? 'bg-green-500/20 border border-green-500/30' : 'bg-amber-500/20 border border-amber-500/30'}`}>
                                <h3 className={`text-2xl font-bold ${result.is_exoplanet ? 'text-green-400' : 'text-amber-400'}`}>
                                    {result.is_exoplanet ? '🪐 Exoplanet' : '⭐ Not an exoplanet'}
                                </h3>
                                <p className="text-5xl font-bold my-4 text-white">
                                    {((result.confidence || 0) * 100).toFixed(1)}%
                                    <span className="text-xl text-gray-400 block">Confidence Level</span>
                                </p>
                                <p className="text-gray-300 text-lg">{result.details || 'Analysis complete'}</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Analyzed with: {result.model_type || 'Specialized Model'}
                                </p>
                            </div>

                            {result.is_exoplanet && submittedData && (
                                <div className="space-y-4 text-left bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                                    <HabitabilityIndicator
                                        eqTemp={submittedData.koi_teq || submittedData.pl_eqt || submittedData.planet_temp}
                                    />
                                    <CategoryVisualizer
                                        planetRadius={submittedData.koi_prad || submittedData.pl_rade || submittedData.planet_radius}
                                    />
                                    <TransitVisualizer
                                        transitDepth={submittedData.koi_depth || submittedData.pl_trandep}
                                        transitDuration={submittedData.koi_duration || submittedData.pl_trandurh || submittedData.pl_trandur}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}

                    {sampleInfo && !result && !isLoading && !error && (
                        <motion.div
                            key="sample-info"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4"
                        >
                            <div className="p-4 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                                <p className="font-semibold text-lg text-white">Sample Loaded: {sampleInfo.name}</p>
                                <p className="text-sm text-indigo-300 mt-2">
                                    Click "Analyze {selectedMission} Candidate" to see what our specialized model predicts!
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {!isLoading && !result && !error && !sampleInfo && (
                        <motion.div
                            key="waiting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 px-6"
                        >
                            <motion.div
                                className="text-6xl mb-6 mt-4"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                {selectedMission === 'Kepler' && '🔭'}
                                {selectedMission === 'TESS' && '🛰️'}
                                {selectedMission === 'K2' && '🌟'}
                                {selectedMission === 'Other' && '🪐'}
                            </motion.div>
                            <h3 className="text-2xl font-semibold text-white">Awaiting {selectedMission} Data</h3>
                            <p className="text-gray-400 max-w-xs mx-auto">
                                Enter {selectedMission}-specific parameters or load a sample to begin analysis with our specialized model.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default ResultDisplay;