import axios from 'axios';
import { useState } from 'react';
import CustomSelect from './components/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitabilityIndicator, CategoryVisualizer, TransitVisualizer } from './components/ResultVisuals';

const missionOptions = ['Kepler', 'TESS', 'K2', 'Other'];

// Enhanced mission configurations with better validation
const missionConfigs = {
  Kepler: {
    backendName: 'kepler',
    features: [
      { 
        name: 'koi_score', 
        label: 'KOI Score', 
        placeholder: '0.0-1.0', 
        type: 'number',
        min: 0,
        max: 1,
        step: 0.01,
        validation: (value) => value >= 0 && value <= 1,
        errorMessage: 'Must be between 0 and 1'
      },
      { 
        name: 'koi_fpflag_nt', 
        label: 'Not Transit-Like Flag', 
        placeholder: '0 or 1', 
        type: 'select',
        options: [
          { value: 0, label: '0 - Transit-like' },
          { value: 1, label: '1 - Not transit-like' }
        ],
        validation: (value) => [0, 1].includes(Number(value)),
        errorMessage: 'Must be 0 or 1'
      },
      { 
        name: 'koi_fpflag_ss', 
        label: 'Stellar Eclipse Flag', 
        placeholder: '0 or 1', 
        type: 'select',
        options: [
          { value: 0, label: '0 - No stellar eclipse' },
          { value: 1, label: '1 - Stellar eclipse detected' }
        ],
        validation: (value) => [0, 1].includes(Number(value)),
        errorMessage: 'Must be 0 or 1'
      },
      { 
        name: 'koi_fpflag_co', 
        label: 'Centroid Offset Flag', 
        placeholder: '0 or 1', 
        type: 'select',
        options: [
          { value: 0, label: '0 - No centroid offset' },
          { value: 1, label: '1 - Centroid offset detected' }
        ],
        validation: (value) => [0, 1].includes(Number(value)),
        errorMessage: 'Must be 0 or 1'
      },
      { 
        name: 'koi_fpflag_ec', 
        label: 'Ephemeris Match Flag', 
        placeholder: '0 or 1', 
        type: 'select',
        options: [
          { value: 0, label: '0 - No ephemeris match' },
          { value: 1, label: '1 - Ephemeris match detected' }
        ],
        validation: (value) => [0, 1].includes(Number(value)),
        errorMessage: 'Must be 0 or 1'
      },
      { 
        name: 'koi_period', 
        label: 'Orbital Period (days)', 
        placeholder: 'e.g., 129.9', 
        type: 'number',
        min: 0.1,
        max: 1000,
        step: 0.1,
        validation: (value) => value > 0 && value <= 1000,
        errorMessage: 'Must be between 0.1 and 1000 days'
      },
      { 
        name: 'koi_prad', 
        label: 'Planet Radius (R⊕)', 
        placeholder: 'e.g., 1.17', 
        type: 'number',
        min: 0.1,
        max: 50,
        step: 0.01,
        validation: (value) => value > 0 && value <= 50,
        errorMessage: 'Must be between 0.1 and 50 Earth radii'
      },
      { 
        name: 'koi_teq', 
        label: 'Planet Temperature (K)', 
        placeholder: 'e.g., 188', 
        type: 'number',
        min: 50,
        max: 5000,
        step: 1,
        validation: (value) => value >= 50 && value <= 5000,
        errorMessage: 'Must be between 50K and 5000K'
      },
      { 
        name: 'koi_depth', 
        label: 'Transit Depth (ppm)', 
        placeholder: 'e.g., 430', 
        type: 'number',
        min: 1,
        max: 100000,
        step: 1,
        validation: (value) => value > 0 && value <= 100000,
        errorMessage: 'Must be between 1 and 100,000 ppm'
      },
      { 
        name: 'koi_duration', 
        label: 'Transit Duration (hours)', 
        placeholder: 'e.g., 5.3', 
        type: 'number',
        min: 0.1,
        max: 48,
        step: 0.1,
        validation: (value) => value > 0 && value <= 48,
        errorMessage: 'Must be between 0.1 and 48 hours'
      },
      { 
        name: 'koi_impact', 
        label: 'Impact Parameter', 
        placeholder: 'e.g., 0.5', 
        type: 'number',
        min: 0,
        max: 1,
        step: 0.01,
        validation: (value) => value >= 0 && value <= 1,
        errorMessage: 'Must be between 0 and 1'
      }
    ]
  },
  TESS: {
    backendName: 'tess',
    features: [
      { 
        name: 'pl_orbper', 
        label: 'Orbital Period (days)', 
        placeholder: 'e.g., 0.73', 
        type: 'number',
        min: 0.1,
        max: 500,
        step: 0.01,
        validation: (value) => value > 0 && value <= 500,
        errorMessage: 'Must be between 0.1 and 500 days'
      },
      { 
        name: 'pl_rade', 
        label: 'Planet Radius (R⊕)', 
        placeholder: 'e.g., 1.88', 
        type: 'number',
        min: 0.1,
        max: 30,
        step: 0.01,
        validation: (value) => value > 0 && value <= 30,
        errorMessage: 'Must be between 0.1 and 30 Earth radii'
      },
      { 
        name: 'pl_eqt', 
        label: 'Planet Temperature (K)', 
        placeholder: 'e.g., 2000', 
        type: 'number',
        min: 50,
        max: 5000,
        step: 1,
        validation: (value) => value >= 50 && value <= 5000,
        errorMessage: 'Must be between 50K and 5000K'
      },
      { 
        name: 'st_rad', 
        label: 'Stellar Radius (R☉)', 
        placeholder: 'e.g., 0.94', 
        type: 'number',
        min: 0.1,
        max: 10,
        step: 0.01,
        validation: (value) => value > 0 && value <= 10,
        errorMessage: 'Must be between 0.1 and 10 Solar radii'
      },
      { 
        name: 'st_teff', 
        label: 'Stellar Temperature (K)', 
        placeholder: 'e.g., 5196', 
        type: 'number',
        min: 2000,
        max: 10000,
        step: 1,
        validation: (value) => value >= 2000 && value <= 10000,
        errorMessage: 'Must be between 2000K and 10000K'
      },
      { 
        name: 'st_logg', 
        label: 'Stellar Surface Gravity (log cm/s²)', 
        placeholder: 'e.g., 4.3', 
        type: 'number',
        min: 3.5,
        max: 5.5,
        step: 0.1,
        validation: (value) => value >= 3.5 && value <= 5.5,
        errorMessage: 'Must be between 3.5 and 5.5 log cm/s²'
      },
      { 
        name: 'pl_trandep', 
        label: 'Transit Depth (ppm)', 
        placeholder: 'e.g., 370', 
        type: 'number',
        min: 1,
        max: 50000,
        step: 1,
        validation: (value) => value > 0 && value <= 50000,
        errorMessage: 'Must be between 1 and 50,000 ppm'
      },
      { 
        name: 'pl_trandurh', 
        label: 'Transit Duration (hours)', 
        placeholder: 'e.g., 1.8', 
        type: 'number',
        min: 0.1,
        max: 24,
        step: 0.1,
        validation: (value) => value > 0 && value <= 24,
        errorMessage: 'Must be between 0.1 and 24 hours'
      },
      { 
        name: 'st_tmag', 
        label: 'TESS Magnitude', 
        placeholder: 'e.g., 10.5', 
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        validation: (value) => value >= 0 && value <= 20,
        errorMessage: 'Must be between 0 and 20'
      }
    ]
  },
  K2: {
    backendName: 'k2',
    features: [
      { 
        name: 'pl_orbper', 
        label: 'Orbital Period (days)', 
        placeholder: 'e.g., 15.2', 
        type: 'number',
        min: 0.1,
        max: 100,
        step: 0.1,
        validation: (value) => value > 0 && value <= 100,
        errorMessage: 'Must be between 0.1 and 100 days'
      },
      { 
        name: 'pl_rade', 
        label: 'Planet Radius (R⊕)', 
        placeholder: 'e.g., 2.34', 
        type: 'number',
        min: 0.1,
        max: 20,
        step: 0.01,
        validation: (value) => value > 0 && value <= 20,
        errorMessage: 'Must be between 0.1 and 20 Earth radii'
      },
      { 
        name: 'pl_eqt', 
        label: 'Planet Temperature (K)', 
        placeholder: 'e.g., 320', 
        type: 'number',
        min: 50,
        max: 3000,
        step: 1,
        validation: (value) => value >= 50 && value <= 3000,
        errorMessage: 'Must be between 50K and 3000K'
      },
      { 
        name: 'st_rad', 
        label: 'Stellar Radius (R☉)', 
        placeholder: 'e.g., 0.78', 
        type: 'number',
        min: 0.1,
        max: 5,
        step: 0.01,
        validation: (value) => value > 0 && value <= 5,
        errorMessage: 'Must be between 0.1 and 5 Solar radii'
      },
      { 
        name: 'st_teff', 
        label: 'Stellar Temperature (K)', 
        placeholder: 'e.g., 4500', 
        type: 'number',
        min: 2500,
        max: 8000,
        step: 1,
        validation: (value) => value >= 2500 && value <= 8000,
        errorMessage: 'Must be between 2500K and 8000K'
      },
      { 
        name: 'st_logg', 
        label: 'Stellar Surface Gravity (log cm/s²)', 
        placeholder: 'e.g., 4.5', 
        type: 'number',
        min: 3.5,
        max: 5.0,
        step: 0.1,
        validation: (value) => value >= 3.5 && value <= 5.0,
        errorMessage: 'Must be between 3.5 and 5.0 log cm/s²'
      },
      { 
        name: 'pl_trandep', 
        label: 'Transit Depth (ppm)', 
        placeholder: 'e.g., 280', 
        type: 'number',
        min: 1,
        max: 10000,
        step: 1,
        validation: (value) => value > 0 && value <= 10000,
        errorMessage: 'Must be between 1 and 10,000 ppm'
      },
      { 
        name: 'pl_trandur', 
        label: 'Transit Duration (hours)', 
        placeholder: 'e.g., 3.1', 
        type: 'number',
        min: 0.1,
        max: 12,
        step: 0.1,
        validation: (value) => value > 0 && value <= 12,
        errorMessage: 'Must be between 0.1 and 12 hours'
      }
    ]
  },
  Other: {
    backendName: 'other',
    features: [
      { 
        name: 'period', 
        label: 'Orbital Period (days)', 
        placeholder: 'e.g., 45.6', 
        type: 'number',
        min: 0.1,
        max: 1000,
        step: 0.1,
        validation: (value) => value > 0 && value <= 1000,
        errorMessage: 'Must be between 0.1 and 1000 days'
      },
      { 
        name: 'planet_radius', 
        label: 'Planet Radius (R⊕)', 
        placeholder: 'e.g., 0.95', 
        type: 'number',
        min: 0.1,
        max: 50,
        step: 0.01,
        validation: (value) => value > 0 && value <= 50,
        errorMessage: 'Must be between 0.1 and 50 Earth radii'
      },
      { 
        name: 'planet_temp', 
        label: 'Planet Temperature (K)', 
        placeholder: 'e.g., 245', 
        type: 'number',
        min: 50,
        max: 5000,
        step: 1,
        validation: (value) => value >= 50 && value <= 5000,
        errorMessage: 'Must be between 50K and 5000K'
      },
      { 
        name: 'stellar_radius', 
        label: 'Stellar Radius (R☉)', 
        placeholder: 'e.g., 0.61', 
        type: 'number',
        min: 0.1,
        max: 10,
        step: 0.01,
        validation: (value) => value > 0 && value <= 10,
        errorMessage: 'Must be between 0.1 and 10 Solar radii'
      },
      { 
        name: 'stellar_temp', 
        label: 'Stellar Temperature (K)', 
        placeholder: 'e.g., 3900', 
        type: 'number',
        min: 2000,
        max: 10000,
        step: 1,
        validation: (value) => value >= 2000 && value <= 10000,
        errorMessage: 'Must be between 2000K and 10000K'
      },
      { 
        name: 'stellar_logg', 
        label: 'Stellar Surface Gravity (log cm/s²)', 
        placeholder: 'e.g., 4.6', 
        type: 'number',
        min: 3.5,
        max: 5.5,
        step: 0.1,
        validation: (value) => value >= 3.5 && value <= 5.5,
        errorMessage: 'Must be between 3.5 and 5.5 log cm/s²'
      }
    ]
  }
};

const missionSamples = {
  Kepler: {
    name: "Confirmed Kepler Exoplanet - Small Rocky World",
    data: {
      koi_score: 0.95, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0,
      koi_period: 0.893, koi_prad: 1.47, koi_teq: 973, koi_depth: 738, koi_duration: 1.19, koi_impact: 0.3
    }
  },
  TESS: {
    name: "Confirmed TESS Exoplanet - Hot Jupiter", 
    data: {
      pl_orbper: 3.579, pl_rade: 10.93, pl_eqt: 1189, st_rad: 1.039, st_teff: 5731,
      st_logg: 4.4, pl_trandep: 11445, pl_trandurh: 2.90, st_tmag: 9.8
    }
  },
  K2: {
    name: "Confirmed K2 Exoplanet - Super Earth",
    data: {
      pl_orbper: 15.2, pl_rade: 2.34, pl_eqt: 320, st_rad: 0.78, st_teff: 4500,
      st_logg: 4.5, pl_trandep: 280, pl_trandur: 3.1
    }
  },
  Other: {
    name: "Generic Exoplanet Candidate",
    data: {
      period: 45.6, planet_radius: 0.95, planet_temp: 245, 
      stellar_radius: 0.61, stellar_temp: 3900, stellar_logg: 4.6
    }
  }
};

function InputField({ field, value, onChange, errors }) {
  const { name, label, placeholder, type, min, max, step, options } = field;
  const error = errors[name];

  if (type === 'select') {
    return (
      <div>
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <select
          name={name}
          value={value === undefined || value === null ? '' : value}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md border bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 ${
            error ? 'border-red-500' : 'border-gray-600'
          }`}
          required
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value === undefined || value === null ? '' : value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`mt-1 block w-full rounded-md border bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 ${
          error ? 'border-red-500' : 'border-gray-600'
        }`}
        required
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - server is taking too long to respond';
    } else if (error.response) {
      const { status, data } = error.response;
      error.message = data.detail || `Server error: ${status}`;
    } else if (error.request) {
      error.message = 'No response from server - check if backend is running';
    }
    return Promise.reject(error);
  }
);

export default function SingleAnalysisPage() {
  const [selectedMission, setSelectedMission] = useState('Kepler');
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sampleInfo, setSampleInfo] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleMissionChange = (mission) => {
    setSelectedMission(mission);
    setFormData({});
    setFieldErrors({});
    setResult(null);
    setError('');
    setSampleInfo(null);
    setSubmittedData(null);
  };

  const validateField = (name, value, fieldConfig) => {
    if (value === '' || value === null || value === undefined) {
      return 'This field is required';
    }
    if (fieldConfig.validation && !fieldConfig.validation(Number(value))) {
      return fieldConfig.errorMessage;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const currentConfig = missionConfigs[selectedMission];
    const fieldConfig = currentConfig.features.find(f => f.name === name);
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }

    let processedValue = value;
    if (fieldConfig?.type === 'select' || fieldConfig?.type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    const currentConfig = missionConfigs[selectedMission];

    currentConfig.features.forEach(field => {
      const value = formData[field.name];
      const error = validateField(field.name, value, field);
      if (error) {
        errors[field.name] = error;
        isValid = false;
      }
    });

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors above');
      return;
    }

    setSampleInfo(null);
    setIsLoading(true);
    setError('');
    setResult(null);
    setSubmittedData({ ...formData });

    try {
      // UPDATED: The mission is now retrieved for the URL path
      const missionName = missionConfigs[selectedMission].backendName;

      // UPDATED: The request body is now just the formData
      const requestData = { ...formData };
      
      console.log(`Sending to backend at /analyze/${missionName}`, requestData);

      // UPDATED: The API call includes the mission name in the URL
      const response = await api.post(`/analyze/${missionName}`, requestData);
      
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      setResult(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    const sample = missionSamples[selectedMission];
    setFormData(sample.data);
    setFieldErrors({});
    setSampleInfo(sample);
    setResult(null);
    setError('');
    setSubmittedData(null);
  };

  const currentConfig = missionConfigs[selectedMission];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 text-indigo-400">
              {selectedMission} Candidate Parameters
            </h2>
            <p className="text-gray-400 mt-2">
              Enter {selectedMission}-specific data for specialized model analysis.
            </p>
          </div>
          <motion.button
            onClick={handleLoadSample}
            whileTap={{ scale: 0.95 }}
            className="text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-4 py-2 font-semibold transition-colors text-white"
          >
            Load {selectedMission} Sample
          </motion.button>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300">Select Mission</label>
          <CustomSelect
            options={missionOptions}
            value={selectedMission}
            onChange={handleMissionChange}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          {currentConfig.features.map((field) => (
            <InputField
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
              errors={fieldErrors}
            />
          ))}

          {error && !isLoading && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300">{error}</p>
              <p className="text-red-300 text-sm mt-1">
                Check that the backend server is running on http://127.0.0.1:8000
              </p>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {isLoading ? `Analyzing ${selectedMission} Candidate...` : `Analyze ${selectedMission} Candidate`}
          </motion.button>
        </form>
      </div>

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
                  onClick={() => setError('')}
                  className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
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
                    {result.is_exoplanet ? '🪐 Genuine Exoplanet' : '⭐ Not an Exoplanet'}
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
    </div>
  );
}