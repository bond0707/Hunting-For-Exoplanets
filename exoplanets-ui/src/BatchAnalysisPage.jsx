import axios from 'axios';
import Papa from 'papaparse';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpTrayIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Legend } from 'recharts';
import CustomSelect from './components/CustomSelect';

const COLORS = ['#10B981', '#F59E0B'];
const missionOptions = ['Kepler', 'TESS', 'K2', 'Other'];

// NEW: Definition for the missing PieTooltip component.
const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = (data.value / data.total * 100).toFixed(1);
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                <p className="text-gray-200">{data.name}</p>
                <p className="font-semibold text-white">Count: {data.value}</p>
                <p className="text-sm text-gray-400">{percentage}% of total</p>
            </div>
        );
    }
    return null;
};

// NEW: Definition for the missing ScatterTooltip component.
const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        // Use generic keys and provide fallbacks to work with any mission's data
        const period = data.koi_period || data.pl_orbper || data.period;
        const radius = data.koi_prad || data.pl_rade || data.planet_radius;

        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                <p className={`font-semibold ${data.is_exoplanet ? 'text-green-400' : 'text-amber-400'}`}>
                    {data.is_exoplanet ? 'Exoplanet Candidate' : 'False Positive'}
                </p>
                <p className="text-gray-300 text-sm">Period: {period ? period.toFixed(2) : 'N/A'} days</p>
                <p className="text-gray-300 text-sm">Radius: {radius ? radius.toFixed(2) : 'N/A'} R⊕</p>
                <p className="text-indigo-400">Confidence: {(data.confidence * 100).toFixed(1)}%</p>
            </div>
        );
    }
    return null;
};


const csvTemplates = {
  Kepler: `koi_score,koi_fpflag_nt,koi_fpflag_ss,koi_fpflag_co,koi_fpflag_ec,koi_period,koi_prad,koi_teq,koi_depth,koi_duration,koi_impact
0.95,0,0,0,0,129.9,1.17,188,430,5.3,0.5
0.87,0,1,0,0,45.6,2.34,320,280,3.1,0.3`,

  TESS: `pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandurh,st_tmag
0.73,1.88,2000,0.94,5196,4.3,370,1.8,10.5
3.58,10.93,1189,1.04,5731,4.4,11445,2.9,9.8`,

  K2: `pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandur
15.2,2.34,320,0.78,4500,4.5,280,3.1
45.6,0.95,245,0.61,3900,4.6,510,4.7`,

  Other: `period,planet_radius,planet_temp,stellar_radius,stellar_temp,stellar_logg
129.9,1.17,188,0.52,3755,4.7
0.73,1.88,2000,0.94,5196,4.3`
};


export default function BatchAnalysisPage() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [results, setResults] = useState(null);
    const [originalData, setOriginalData] = useState(null); // Store original CSV data
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [selectedMission, setSelectedMission] = useState('Kepler');
    const fileInputRef = useRef(null);

    const resetState = () => {
        setFile(null); setFileName(''); setResults(null);
        setOriginalData(null); setIsLoading(false); setProgress(0); setError('');
    };

    const handleFileChange = (event) => {
        resetState();
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile); setFileName(selectedFile.name);
        } else if (selectedFile) {
            setError('Please select a valid CSV file.');
        }
    };

    const handleAnalyzeClick = () => {
        if (!file) { setError('No file selected.'); return; }
        setIsLoading(true); setProgress(0); setError('');

        Papa.parse(file, {
            header: true, skipEmptyLines: true, dynamicTyping: true,
            complete: async (parsedResults) => {
                if (parsedResults.errors.length > 0) {
                    setError(`Error parsing CSV: ${parsedResults.errors[0].message}`);
                    setIsLoading(false); return;
                }
                
                setOriginalData(parsedResults.data);
                const progressInterval = setInterval(() => setProgress(prev => Math.min(prev + 10, 90)), 500);

                try {
                    const dataWithMission = parsedResults.data.map(row => ({ ...row, mission: selectedMission }));
                    const response = await axios.post('http://127.0.0.1:8000/batch-analyze', dataWithMission);
                    
                    if (response.data && Array.isArray(response.data.results)) {
                        // Combine original data with results for charting
                        const combinedResults = response.data.results.map((result, index) => ({
                            ...parsedResults.data[index],
                            ...result
                        }));
                        setResults(combinedResults);
                    } else {
                        setError('Unexpected response format from server');
                        setResults([]);
                    }
                    clearInterval(progressInterval);
                    setProgress(100);
                } catch (err) {
                    setError(err.response?.data?.detail || err.message || 'An error occurred.');
                    clearInterval(progressInterval);
                } finally {
                    setTimeout(() => setIsLoading(false), 500);
                }
            },
        });
    };

    const handleDownload = () => {
        if (!results || !Array.isArray(results)) return;
        const csvString = Papa.unparse(results.map(r => ({
            mission: r.mission || selectedMission,
            is_exoplanet: r.is_exoplanet,
            confidence: (r.confidence || 0).toFixed(4),
            details: r.details,
            model_type: r.model_type || '5-Model Ensemble'
        })));
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `exoplanet_results_${fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([csvTemplates[selectedMission]], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `exoplanet_template_${selectedMission}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const pieData = results && Array.isArray(results) ? [
        { name: 'Exoplanet Candidates', value: results.filter(r => r.is_exoplanet).length, total: results.length },
        { name: 'False Positives', value: results.filter(r => !r.is_exoplanet).length, total: results.length },
    ] : [];

    const scatterData = results || [];
    const exoplanetScatterData = scatterData.filter(d => d.is_exoplanet);
    const falsePositiveScatterData = scatterData.filter(d => !d.is_exoplanet);
    
    // Generic keys for scatter plot axes to handle different mission data
    const xKey = ['koi_period', 'pl_orbper', 'period'].find(k => scatterData[0]?.hasOwnProperty(k)) || 'period';
    const yKey = ['koi_prad', 'pl_rade', 'planet_radius'].find(k => scatterData[0]?.hasOwnProperty(k)) || 'planet_radius';


    return (
        <div className="p-8 text-white max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-indigo-400">Batch Analysis</h1>
                    <p className="mt-2 text-gray-400">Upload a CSV file with mission-specific data to analyze multiple candidates.</p>
                </div>
                <motion.button
                    onClick={handleDownloadTemplate}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-4 py-2 font-semibold transition-colors text-white"
                >
                    Download {selectedMission} Template
                </motion.button>
            </div>

            <div className="mt-6 max-w-md">
                <label className="text-sm font-medium text-gray-300">Select Mission for Analysis</label>
                <CustomSelect
                    options={missionOptions}
                    value={selectedMission}
                    onChange={setSelectedMission}
                />
                <p className="text-xs text-gray-500 mt-1">Choose the mission format for your CSV data</p>
            </div>

            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {!results && !isLoading && (
                        <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div
                                className="flex justify-center items-center w-full px-6 py-10 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800/50"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <div className="text-center">
                                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-400"><span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">CSV must use {selectedMission} feature names</p>
                                    {fileName && !error && <p className="mt-2 text-sm font-medium text-green-400">{fileName}</p>}
                                    {error && <p className="mt-2 text-sm font-medium text-red-400">{error}</p>}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                            </div>
                            <motion.button
                                onClick={handleAnalyzeClick}
                                whileTap={{ scale: 0.95 }}
                                disabled={!file || isLoading}
                                className="w-full mt-4 rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-500"
                            >
                                Analyze with {selectedMission} Model
                            </motion.button>
                        </motion.div>
                    )}
                    {isLoading && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
                            <p className="text-center text-lg font-semibold">Analyzing with {selectedMission} Specialist Model...</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <motion.div className="bg-indigo-500 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
                            </div>
                            <p className="text-center text-gray-400 mt-2">Processing with 5-Model Ensemble...</p>
                        </motion.div>
                    )}
                    {results && !isLoading && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold">Analysis Results</h2>
                                    <p className="text-gray-400 mt-1">Found {pieData[0]?.value || 0} potential exoplanets out of {results.length} candidates.</p>
                                    <p className="text-sm text-indigo-400">Analyzed with: {selectedMission} Specialist + 5-Model Ensemble</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <motion.button onClick={handleDownload} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-3 py-2 font-semibold"><DocumentArrowDownIcon className="w-5 h-5" /> Download Results</motion.button>
                                    <motion.button onClick={resetState} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-3 py-2 font-semibold"><ArrowPathIcon className="w-5 h-5" /> Analyze New File</motion.button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                                    <h3 className="font-semibold text-center mb-4">Prediction Breakdown</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <ChartTooltip content={<PieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                                    <h3 className="font-semibold text-center mb-4">Radius vs. Orbital Period</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <XAxis type="number" dataKey={xKey} name="Orbital Period" unit=" days" tick={{ fontSize: 10, fill: '#9ca3af' }} stroke="#9ca3af" domain={['dataMin', 'dataMax']} />
                                            <YAxis type="number" dataKey={yKey} name="Planet Radius" unit=" R⊕" tick={{ fontSize: 10, fill: '#9ca3af' }} stroke="#9ca3af" domain={['dataMin', 'dataMax']} />
                                            <ZAxis type="number" dataKey="confidence" range={[50, 400]} name="Confidence" />
                                            <ChartTooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                            <Legend />
                                            <Scatter name="Exoplanet" data={exoplanetScatterData} fill="#10B981" shape="circle" />
                                            <Scatter name="False Positive" data={falsePositiveScatterData} fill="#F59E0B" shape="triangle" />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="mt-8 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Prediction</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Confidence</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Model Used</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                                        {results.slice(0, 10).map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-800/50">
                                                <td className={`px-4 py-2 whitespace-nowrap text-sm font-semibold ${row.is_exoplanet ? 'text-green-400' : 'text-amber-400'}`}>{row.is_exoplanet ? 'Exoplanet' : 'False Positive'}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{(row.confidence * 100).toFixed(1)}%</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{row.model_type}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {results.length > 10 && <p className="text-center mt-2 text-sm text-gray-500">Showing first 10 of {results.length} results.</p>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}