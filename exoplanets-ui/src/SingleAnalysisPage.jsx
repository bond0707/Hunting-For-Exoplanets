import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from './CustomSelect';
import { HabitabilityIndicator, CategoryVisualizer, TransitVisualizer } from './ResultVisuals';

const missionOptions = ['TESS', 'Kepler', 'K2'];

// Updated KOI samples with correct feature names for universal model
const koiSamples = [
    {
        name: "Confirmed Exoplanet - Small Rocky World",
        isExoplanet: true,
        data: {
            koi_period: 0.893,
            koi_depth: 738,
            koi_prad: 1.47,
            koi_duration: 1.19,
            koi_srad: 0.496,
            koi_steff: 3834,
            koi_teq: 973,
            koi_slogg: 4.7,
            mission: "Kepler"
        }
    },
    {
        name: "Confirmed Exoplanet - Hot Jupiter", 
        isExoplanet: true,
        data: {
            koi_period: 3.579,
            koi_depth: 11445,
            koi_prad: 10.93,
            koi_duration: 2.90,
            koi_srad: 1.039,
            koi_steff: 5731,
            koi_teq: 1189,
            koi_slogg: 4.4,
            mission: "Kepler"
        }
    },
    {
        name: "False Positive - Instrument Noise",
        isExoplanet: false,
        data: {
            koi_period: 15.2,
            koi_depth: 85,
            koi_prad: 0.8,
            koi_duration: 0.5,
            koi_srad: 0.75,
            koi_steff: 4200,
            koi_teq: 650,
            koi_slogg: 4.5,
            mission: "Kepler"
        }
    }
];

function InputField({ label, name, placeholder, value, onChange, type = "number" }) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                step="any"
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                required
            />
        </div>
    );
}

export default function SingleAnalysisPage() {
    const [formData, setFormData] = useState({
        koi_period: '', koi_depth: '', koi_prad: '', koi_duration: '',
        koi_srad: '', koi_steff: '', koi_teq: '', koi_slogg: '', mission: 'TESS',
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sampleInfo, setSampleInfo] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value ? Number(value) : '' }));
    };

    // Convert to model-expected format with engineered features (EXACTLY like training)
    const prepareModelInput = (data) => {
        const {
            koi_period, koi_prad, koi_teq, koi_srad, koi_slogg, 
            koi_steff, koi_depth, koi_duration, mission
        } = data;

        // Calculate engineered features (EXACTLY as in training)
        const koi_insol = koi_steff ? Math.pow(koi_steff, 4) / Math.pow(koi_period || 1, 2) : 0;
        const period_insol_ratio = koi_period && koi_insol ? koi_period / koi_insol : 0;
        const radius_temp_ratio = koi_prad && koi_teq ? koi_prad / koi_teq : 0;
        const log_period = koi_period ? Math.log10(koi_period) : 0;
        const log_depth = koi_depth ? Math.log10(koi_depth) : 0;

        return {
            // Core features (same as training)
            koi_period: koi_period || 0,
            koi_prad: koi_prad || 0,
            koi_teq: koi_teq || 0,
            koi_srad: koi_srad || 0,
            koi_slogg: koi_slogg || 0,
            koi_steff: koi_steff || 0,
            koi_depth: koi_depth || 0,
            koi_duration: koi_duration || 0,
            
            // Engineered features (EXACTLY as in training)
            koi_insol,
            period_insol_ratio,
            radius_temp_ratio,
            log_period,
            log_depth,
            mission: mission || 'TESS'
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSampleInfo(null);
        setIsLoading(true);
        setError('');
        setResult(null);
        
        try {
            // Prepare data in model-expected format
            const modelData = prepareModelInput(formData);
            console.log('Sending to backend:', modelData);
            
            const response = await axios.post('http://127.0.0.1:8000/analyze', modelData);
            setResult(response.data);
        } catch (err) {
            console.error('API Error:', err);
            setError(err.response?.data?.detail || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadSample = () => {
        const randomSample = koiSamples[Math.floor(Math.random() * koiSamples.length)];
        setFormData(randomSample.data);
        setSampleInfo(randomSample);
        setResult(null);
        setError('');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left Column - Form */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-indigo-400">Candidate Parameters</h2>
                        <p className="text-gray-400 mt-2">Enter KOI data or load a sample for universal model analysis.</p>
                    </div>
                    <button
                        onClick={handleLoadSample}
                        className="text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-4 py-2 font-semibold transition-colors text-white"
                    >
                        Load Sample
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4 bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                    <InputField
                        label="Orbital Period - koi_period (days)"
                        name="koi_period"
                        placeholder="e.g., 0.893"
                        value={formData.koi_period}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Transit Depth - koi_depth (ppm)"
                        name="koi_depth"
                        placeholder="e.g., 738"
                        value={formData.koi_depth}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Planet Radius - koi_prad (Earth radii)"
                        name="koi_prad"
                        placeholder="e.g., 1.47"
                        value={formData.koi_prad}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Transit Duration - koi_duration (hours)"
                        name="koi_duration"
                        placeholder="e.g., 1.19"
                        value={formData.koi_duration}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Stellar Radius - koi_srad (Solar radii)"
                        name="koi_srad"
                        placeholder="e.g., 0.496"
                        value={formData.koi_srad}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Stellar Temperature - koi_steff (Kelvin)"
                        name="koi_steff"
                        placeholder="e.g., 3834"
                        value={formData.koi_steff}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Equilibrium Temp - koi_teq (Kelvin)"
                        name="koi_teq"
                        placeholder="e.g., 973"
                        value={formData.koi_teq}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Stellar Surface Gravity - koi_slogg (log cm/s²)"
                        name="koi_slogg"
                        placeholder="e.g., 4.7"
                        value={formData.koi_slogg}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="text-sm font-medium text-gray-300">Discovery Mission</label>
                        <CustomSelect
                            options={missionOptions}
                            value={formData.mission}
                            onChange={(selectedValue) => setFormData({ ...formData, mission: selectedValue })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors mt-6"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Analyzing with Universal Model...
                            </span>
                        ) : (
                            'Analyze Candidate'
                        )}
                    </button>
                </form>
            </div>

            {/* Right Column - Results */}
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
                                <p className="text-gray-400 text-lg">Running Universal Model Analysis...</p>
                                <p className="text-gray-500 text-sm">Processing with Kepler + TESS trained model</p>
                            </motion.div>
                        )}

                        {error && (
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
                                        {result.is_exoplanet ? '🪐 Genuine Exoplanet' : '⭐ Not an Exoplanet'}
                                    </h3>
                                    <p className="text-5xl font-bold my-4 text-white">
                                        {(result.confidence * 100).toFixed(1)}%
                                        <span className="text-xl text-gray-400 block">Confidence Level</span>
                                    </p>
                                    <p className="text-gray-300 text-lg">{result.details}</p>
                                    <p className="text-sm text-indigo-300 mt-2">
                                        Model: Universal Exoplanet Detector (Kepler + TESS)
                                    </p>
                                </div>

                                {result.is_exoplanet && (
                                    <div className="space-y-4 text-left bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                                        <HabitabilityIndicator eqTemp={formData.koi_teq} />
                                        <CategoryVisualizer planetRadius={formData.koi_prad} />
                                        <TransitVisualizer transitDepth={formData.koi_depth} transitDuration={formData.koi_duration} />
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
                                        Ground Truth: {sampleInfo.isExoplanet ? "Confirmed Exoplanet" : "Not an Exoplanet"}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Click "Analyze Candidate" to see what our universal model predicts!
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
                                <span className="text-6xl">🔭</span>
                                <h3 className="text-2xl font-semibold text-white">Universal Exoplanet Detector</h3>
                                <p className="text-gray-400 max-w-xs mx-auto">
                                    Enter KOI parameters or load a sample to begin analysis with our Kepler + TESS trained model.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}