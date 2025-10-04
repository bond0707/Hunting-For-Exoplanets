import axios from 'axios';
import Papa from 'papaparse';
import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpTrayIcon, DocumentArrowDownIcon, ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Legend, CartesianGrid } from 'recharts';
import CustomSelect from './components/CustomSelect';

const COLORS = ['#10B981', '#F59E0B'];
const missionOptions = ['Kepler', 'TESS', 'K2', 'Other'];
const ROW_LIMIT = 1000;

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

const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        const period = data.koi_period || data.pl_orbper || data.period;
        const radius = data.koi_prad || data.pl_rade || data.planet_radius;

        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                <p className={`font-semibold ${data.is_exoplanet ? 'text-green-400' : 'text-amber-400'}`}>
                    {data.is_exoplanet ? 'Exoplanet Candidate' : 'False Positive'}
                </p>
                <p className="text-gray-300 text-sm">Row: {data.original_row}</p>
                <p className="text-gray-300 text-sm">Period: {period ? period.toFixed(2) : 'N/A'} days</p>
                <p className="text-gray-300 text-sm">Radius: {radius ? radius.toFixed(2) : 'N/A'} R⊕</p>
                <p className="text-indigo-400">Confidence: {(data.confidence * 100).toFixed(1)}%</p>
            </div>
        );
    }
    return null;
};

const csvTemplates = {
  Kepler: `koi_score,koi_fpflag_nt,koi_fpflag_ss,koi_fpflag_co,koi_fpflag_ec,koi_period,koi_prad,koi_teq,koi_depth,koi_duration,koi_impact`,
  TESS: `pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandurh,st_tmag`,
  K2: `pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandur`,
  Other: `period,planet_radius,planet_temp,stellar_radius,stellar_temp,stellar_logg`
};

export default function BatchAnalysisPage() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [selectedMission, setSelectedMission] = useState('Kepler');
    const [notification, setNotification] = useState('');
    const fileInputRef = useRef(null);
    const [filter, setFilter] = useState('All Results');
    const [visibleRows, setVisibleRows] = useState(10);
    const [isDragging, setIsDragging] = useState(false);

    const resetState = () => {
        setFile(null); setFileName(''); setResults(null);
        setIsLoading(false); setProgress(0); setError('');
        setNotification('');
        setFilter('All Results');
        setVisibleRows(10);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const processFile = (uploadedFile) => {
        resetState();
        if (uploadedFile && (uploadedFile.type === 'text/csv' || uploadedFile.name.endsWith('.csv'))) {
            setFile(uploadedFile);
            setFileName(uploadedFile.name);
        } else if (uploadedFile) {
            setError('Invalid file type. Please upload or drop a CSV file.');
        } else {
            setError('No file detected. Please try again.');
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            processFile(event.target.files[0]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            processFile(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    };

    const handleAnalyzeClick = () => {
        if (!file) { setError('No file selected.'); return; }
        setIsLoading(true); setProgress(0); setError(''); setNotification('');

        Papa.parse(file, {
            header: true, skipEmptyLines: true, dynamicTyping: true,
            complete: async (parsedResults) => {
                const expectedHeaders = new Set(csvTemplates[selectedMission].split(','));
                const uploadedHeaders = new Set(parsedResults.meta.fields);
                const allHeadersPresent = [...expectedHeaders].every(header => uploadedHeaders.has(header.trim()));

                if (!allHeadersPresent || parsedResults.errors.length > 0) {
                    const parseError = parsedResults.errors[0]?.message || '';
                    setError(`CSV headers do not match template for ${selectedMission}. ${parseError}`);
                    setIsLoading(false);
                    return;
                }

                let dataToProcess = parsedResults.data;

                if (dataToProcess.length > ROW_LIMIT) {
                    setNotification(`⚠️ Your file has ${dataToProcess.length.toLocaleString()} rows. Only the first ${ROW_LIMIT.toLocaleString()} have been processed.`);
                    dataToProcess = dataToProcess.slice(0, ROW_LIMIT);
                }
                
                const progressInterval = setInterval(() => setProgress(prev => Math.min(prev + 10, 90)), 500);

                try {
                    const dataWithMission = dataToProcess.map(row => ({ ...row, mission: selectedMission }));
                    const response = await axios.post('http://127.0.0.1:8000/batch-analyze', dataWithMission);
                    
                    if (response.data && Array.isArray(response.data.results)) {
                        const combinedResults = response.data.results.map((result, index) => ({
                            ...dataToProcess[index],
                            ...result,
                            original_row: index + 2
                        }));
                        setResults(combinedResults);
                    } else {
                        setError('Unexpected response format from server');
                        setResults([]);
                    }
                } catch (err) {
                    setError(err.response?.data?.detail || err.message || 'An error occurred.');
                } finally {
                    clearInterval(progressInterval);
                    setProgress(100);
                    setTimeout(() => setIsLoading(false), 500);
                }
            },
            error: (err) => {
                setError(`Error parsing CSV file: ${err.message}`);
                setIsLoading(false);
            }
        });
    };

    const handleDownload = () => {
        if (!resultsToDisplay) return;
        const csvString = Papa.unparse(resultsToDisplay.map(r => ({
            original_row: r.original_row,
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
        const fullTemplate = csvTemplates[selectedMission] + '\n';
        const blob = new Blob([fullTemplate], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `template_${selectedMission.toLowerCase()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resultsToDisplay = useMemo(() => {
        if (!results) return [];
        setVisibleRows(10);
        if (filter === 'Exoplanet Candidates') {
            return results.filter(r => r.is_exoplanet);
        }
        if (filter === 'False Positives') {
            return results.filter(r => !r.is_exoplanet);
        }
        return results;
    }, [results, filter]);

    const pieData = results ? [
        { name: 'Exoplanet Candidates', value: results.filter(r => r.is_exoplanet).length, total: results.length },
        { name: 'False Positives', value: results.filter(r => !r.is_exoplanet).length, total: results.length },
    ] : [];
    
    const exoplanetScatterData = resultsToDisplay.filter(d => d.is_exoplanet);
    const falsePositiveScatterData = resultsToDisplay.filter(d => !d.is_exoplanet);
    const xKey = ['koi_period', 'pl_orbper', 'period'].find(k => results?.[0]?.hasOwnProperty(k)) || 'period';
    const yKey = ['koi_prad', 'pl_rade', 'planet_radius'].find(k => results?.[0]?.hasOwnProperty(k)) || 'planet_radius';

    return (
        <div className="p-8 text-white max-w-7xl mx-auto">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-indigo-400">Batch Analysis</h1>
                    <p className="mt-2 text-gray-400">Upload a CSV file with up to 1,000 candidates for analysis.</p>
                </div>
                <motion.button onClick={handleDownloadTemplate} whileTap={{ scale: 0.95 }} className="text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-4 py-2 font-semibold transition-colors text-white whitespace-nowrap">
                    Download {selectedMission} Template
                </motion.button>
            </div>

            <div className="mt-6 max-w-md">
                <label className="text-sm font-medium text-gray-300">Select Mission for Analysis</label>
                <CustomSelect options={missionOptions} value={selectedMission} onChange={(mission) => { resetState(); setSelectedMission(mission); }} />
                <p className="text-xs text-gray-500 mt-1">Choose the mission format for your CSV data.</p>
            </div>

            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {!results && !isLoading && (
                        <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div
                                className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg transition-colors duration-200 ${isDragging ? 'border-indigo-400 bg-indigo-900/20' : 'border-gray-600 hover:bg-gray-800/50 cursor-pointer'}`}
                                onClick={() => fileInputRef.current.click()}
                                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                            >
                                <div className="text-center pointer-events-none">
                                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-400"><span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">CSV must use {selectedMission} feature names</p>
                                    {fileName && !error && <p className="mt-2 text-sm font-medium text-green-400">{fileName}</p>}
                                    {error && <p className="mt-2 text-sm font-medium text-red-400">{error}</p>}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv,text/csv" />
                            </div>
                            <motion.button onClick={handleAnalyzeClick} whileTap={{ scale: 0.95 }} disabled={!file || isLoading} className="w-full mt-4 rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed">
                                Analyze with {selectedMission} Model
                            </motion.button>
                        </motion.div>
                    )}
                    {isLoading && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 text-center">
                            <p className="text-lg font-semibold">Analyzing with 5-Model Ensemble...</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                                <motion.div className="bg-indigo-500 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
                            </div>
                            <p className="text-gray-400 mt-2 text-sm">Processing {fileName}...</p>
                        </motion.div>
                    )}
                    {results && !isLoading && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold">Analysis Results</h2>
                                    <p className="text-gray-400 mt-1">Found {results.filter(r => r.is_exoplanet).length} potential exoplanets out of {results.length} candidates.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <motion.button onClick={handleDownload} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 rounded-md px-3 py-2 font-semibold"><DocumentArrowDownIcon className="w-5 h-5" /> Download Results</motion.button>
                                    <motion.button onClick={resetState} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-3 py-2 font-semibold"><ArrowPathIcon className="w-5 h-5" /> Analyze New File</motion.button>
                                </div>
                            </div>
                            
                            {notification && (
                                <div className="mt-6 p-3 text-center bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
                                    {notification}
                                </div>
                            )}

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
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">Processed Candidates</h3>
                                    <div className="w-64">
                                        <CustomSelect 
                                            options={['All Results', 'Exoplanet Candidates', 'False Positives']}
                                            value={filter}
                                            onChange={setFilter}
                                        />
                                    </div>
                                </div>
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-400">Row</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Prediction</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Confidence</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Model Used</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                                        {resultsToDisplay.slice(0, visibleRows).map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-800/50">
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 font-mono">{row.original_row}</td>
                                                <td className={`px-4 py-2 whitespace-nowrap text-sm font-semibold ${row.is_exoplanet ? 'text-green-400' : 'text-amber-400'}`}>{row.is_exoplanet ? 'Exoplanet' : 'False Positive'}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{(row.confidence * 100).toFixed(1)}%</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{row.model_type}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                <div className="text-center mt-4">
                                    <p className="text-sm text-gray-500">
                                        Showing {Math.min(visibleRows, resultsToDisplay.length)} of {resultsToDisplay.length} results.
                                    </p>
                                    {visibleRows < resultsToDisplay.length && (
                                        <motion.button 
                                            onClick={() => setVisibleRows(prev => prev + 30)}
                                            whileTap={{ scale: 0.95 }}
                                            className="mt-4 flex items-center gap-2 mx-auto text-sm text-indigo-400 hover:text-indigo-300 font-semibold"
                                        >
                                            <ChevronDownIcon className="w-5 h-5" />
                                            Load More
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}