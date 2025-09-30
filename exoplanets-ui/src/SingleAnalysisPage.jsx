import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from './CustomSelect';
import { HabitabilityIndicator, CategoryVisualizer, TransitVisualizer } from './ResultVisuals';

const missionOptions = ['TESS', 'Kepler', 'K2'];

// Real KOI dataset samples
const koiSamples = [
    {
        name: "Confirmed Exoplanet - Small Rocky World",
        isExoplanet: true,
        data: {
            orbital_period: 0.893,
            transit_depth: 738,
            planet_radius: 1.47,
            transit_duration: 1.19,
            stellar_radius: 0.496,
            stellar_teff: 3834,
            eq_temp: 973,
            mission: "Kepler"
        }
    },
    {
        name: "Confirmed Exoplanet - Hot Jupiter", 
        isExoplanet: true,
        data: {
            orbital_period: 3.579,
            transit_depth: 11445,
            planet_radius: 10.93,
            transit_duration: 2.90,
            stellar_radius: 1.039,
            stellar_teff: 5731,
            eq_temp: 1189,
            mission: "Kepler"
        }
    },
    {
        name: "False Positive - Instrument Noise",
        isExoplanet: false,
        data: {
            orbital_period: 15.2,
            transit_depth: 85,
            planet_radius: 0.8,
            transit_duration: 0.5,
            stellar_radius: 0.75,
            stellar_teff: 4200,
            eq_temp: 650,
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
        orbital_period: '', transit_depth: '', planet_radius: '', transit_duration: '',
        stellar_radius: '', stellar_teff: '', eq_temp: '', mission: 'TESS',
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sampleInfo, setSampleInfo] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value ? Number(value) : '' }));
    };

    // Convert frontend names to KOI dataset column names for backend
    const convertToKOIFeatures = (data) => {
        const {
            orbital_period,
            planet_radius,
            transit_depth,
            transit_duration,
            stellar_radius,
            stellar_teff,
            eq_temp,
            mission
        } = data;

        // Avoid division by zero
        const safeStellarRadius = stellar_radius || 1;
        const safeEqTemp = eq_temp || 1;
        const safeTransitDuration = transit_duration || 1;

        return {
            // Map to KOI column names that your model was trained on
            koi_period: orbital_period || 0,
            koi_prad: planet_radius || 0,
            koi_depth: transit_depth || 0,
            koi_duration: transit_duration || 0,
            koi_teq: eq_temp || 0,
            koi_steff: stellar_teff || 0,
            koi_srad: stellar_radius || 0,
            
            // Engineered features
            radius_ratio: (planet_radius || 0) / (safeStellarRadius + 1e-9),
            depth_norm: (transit_depth || 0) / ((safeStellarRadius + 1e-9) ** 2),
            period_temp_ratio: (orbital_period || 0) / (safeEqTemp + 1),
            habitability_index: (eq_temp || 0) / (((planet_radius || 0) ** 2) + 1e-9),
            transit_snr: (transit_depth || 0) / (safeTransitDuration + 1e-9),
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
            // Convert to KOI dataset column names
            const koiData = convertToKOIFeatures(formData);
            const response = await axios.post('http://127.0.0.1:8000/analyze', koiData);
            setResult(response.data);
        } catch (err) {
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
                        <p className="text-gray-400 mt-2">Enter data or load a sample to begin the analysis.</p>
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
                        label="Orbital Period (days)"
                        name="orbital_period"
                        placeholder="e.g., 0.893"
                        value={formData.orbital_period}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Transit Depth (ppm)"
                        name="transit_depth"
                        placeholder="e.g., 738"
                        value={formData.transit_depth}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Planet Radius (Earth radii)"
                        name="planet_radius"
                        placeholder="e.g., 1.47"
                        value={formData.planet_radius}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Transit Duration (hours)"
                        name="transit_duration"
                        placeholder="e.g., 1.19"
                        value={formData.transit_duration}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Host Star Radius (Solar radii)"
                        name="stellar_radius"
                        placeholder="e.g., 0.496"
                        value={formData.stellar_radius}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Host Star Temperature (Kelvin)"
                        name="stellar_teff"
                        placeholder="e.g., 3834"
                        value={formData.stellar_teff}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Equilibrium Temperature (Kelvin)"
                        name="eq_temp"
                        placeholder="e.g., 973"
                        value={formData.eq_temp}
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
                                Analyzing...
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
                                <p className="text-gray-400 text-lg">Running analysis...</p>
                                <p className="text-gray-500 text-sm">Processing astronomical data</p>
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
                                </div>

                                {result.is_exoplanet && (
                                    <div className="space-y-4 text-left bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                                        <HabitabilityIndicator eqTemp={formData.eq_temp} />
                                        <CategoryVisualizer planetRadius={formData.planet_radius} />
                                        <TransitVisualizer transitDepth={formData.transit_depth} transitDuration={formData.transit_duration} />
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
                                        Click "Analyze Candidate" to see what our model predicts!
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
                                <h3 className="text-2xl font-semibold text-white">Awaiting Data</h3>
                                <p className="text-gray-400 max-w-xs mx-auto">
                                    Enter candidate parameters or load a sample to begin exoplanet analysis.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}