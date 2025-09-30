import { useState, useRef } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Legend } from 'recharts';
import { ArrowUpTrayIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const COLORS = ['#10B981', '#F59E0B'];

const csvTemplate = `koi_period,koi_depth,koi_prad,koi_duration,koi_srad,koi_steff,koi_teq,mission
129.9,430,1.17,5.3,0.52,3755,188,Kepler
0.73,370,1.88,1.8,0.94,5196,2000,TESS
15.2,280,2.34,3.1,0.78,4500,320,Kepler
45.6,510,0.95,4.7,0.61,3900,245,Kepler
3.8,190,3.21,2.4,1.12,5800,890,TESS`;

export default function BatchAnalysisPage() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const resetState = () => {
        setFile(null); setFileName(''); setResults(null);
        setIsLoading(false); setProgress(0); setError('');
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
                const progressInterval = setInterval(() => { setProgress(prev => Math.min(prev + 10, 90)); }, 500);
                try {
                    const response = await axios.post('http://localhost:8000/batch-analyze', parsedResults.data);
                    setResults(response.data);
                    clearInterval(progressInterval); setProgress(100);
                } catch (err) {
                    setError(err.response?.data?.detail || 'An error occurred during analysis.');
                    clearInterval(progressInterval);
                } finally {
                    setTimeout(() => setIsLoading(false), 500);
                }
            },
        });
    };

    const handleDownload = () => {
        const createCsvString = (records) => {
            const header = "koi_period,koi_prad,koi_teq,is_exoplanet,confidence,details,model_type\n";
            const rows = records.map(r => 
                `${r.koi_period},${r.koi_prad},${r.koi_teq},${r.is_exoplanet},${(r.confidence || 0).toFixed(4)},"${r.details}","${r.model_type || 'GradientBoosting'}"`
            ).join("\n");
            return header + rows;
        };
        const blob = new Blob([createCsvString(results)], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url); 
        link.setAttribute("download", `kepler_results_${fileName}`);
        link.style.visibility = 'hidden'; 
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link);
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url); 
        link.setAttribute("download", "kepler_batch_template.csv");
        link.style.visibility = 'hidden'; 
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link);
    };

    const pieData = results ? [
        { name: 'Exoplanet Candidates', value: results.filter(r => r.is_exoplanet).length },
        { name: 'False Positives', value: results.filter(r => !r.is_exoplanet).length },
    ] : [];

    return (
        <div className="p-8 text-white max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-indigo-400">Kepler Batch Analysis</h1>
                    <p className="mt-2 text-gray-400">Upload a CSV file with Kepler data to analyze multiple candidates.</p>
                </div>
                <button 
                    onClick={handleDownloadTemplate} 
                    className="text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-3 py-2 font-semibold transition-colors"
                >
                    Download Template
                </button>
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
                                    <p className="mt-2 text-sm text-gray-400">
                                        <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">CSV must use Kepler KOI feature names</p>
                                    {fileName && !error && <p className="mt-2 text-sm font-medium text-green-400">{fileName}</p>}
                                    {error && <p className="mt-2 text-sm font-medium text-red-400">{error}</p>}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                            </div>
                            <button 
                                onClick={handleAnalyzeClick} 
                                disabled={!file || isLoading} 
                                className="w-full mt-4 rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-500"
                            >
                                Analyze CSV File
                            </button>
                        </motion.div>
                    )}
                    {isLoading && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
                            <p className="text-center text-lg font-semibold">Analyzing Kepler Data...</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <motion.div 
                                    className="bg-indigo-500 h-2.5 rounded-full" 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${progress}%` }} 
                                    transition={{ duration: 0.5, ease: "easeInOut" }} 
                                />
                            </div>
                            <p className="text-center text-gray-400 mt-2">
                                Processing with Gradient Boosting model...
                            </p>
                        </motion.div>
                    )}
                    {results && !isLoading && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold">Kepler Analysis Results</h2>
                                    <p className="text-gray-400 mt-1">
                                        Found {pieData[0]?.value || 0} potential exoplanets out of {results.length} candidates.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={handleDownload} 
                                        className="flex items-center gap-2 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-3 py-2 font-semibold"
                                    >
                                        <DocumentArrowDownIcon className="w-5 h-5" /> Download Results
                                    </button>
                                    <button 
                                        onClick={resetState} 
                                        className="flex items-center gap-2 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-3 py-2 font-semibold"
                                    >
                                        <ArrowPathIcon className="w-5 h-5" /> Analyze New File
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                <div className="p-4 rounded-lg bg-gray-800/50">
                                    <h3 className="font-semibold text-center">Prediction Breakdown</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie 
                                                data={pieData} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                outerRadius={100} 
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip wrapperClassName="!bg-gray-700 !border-gray-600 rounded-md" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-800/50">
                                    <h3 className="font-semibold text-center">Radius vs. Orbital Period</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <XAxis 
                                                type="number" 
                                                dataKey="koi_period" 
                                                name="Orbital Period" 
                                                unit=" days" 
                                                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                                                stroke="#9ca3af" 
                                            />
                                            <YAxis 
                                                type="number" 
                                                dataKey="koi_prad" 
                                                name="Planet Radius" 
                                                unit=" R⊕" 
                                                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                                                stroke="#9ca3af" 
                                            />
                                            <ZAxis type="number" dataKey="confidence" range={[50, 500]} name="Confidence" />
                                            <ChartTooltip 
                                                cursor={{ strokeDasharray: '3 3' }} 
                                                wrapperClassName="!bg-gray-700 !border-gray-600 rounded-md" 
                                                formatter={(value, name) => [value, name === 'koi_period' ? 'Orbital Period (days)' : 'Planet Radius (R⊕)']}
                                            />
                                            <Legend />
                                            <Scatter 
                                                name="Exoplanet Candidates" 
                                                data={results.filter(r => r.is_exoplanet)} 
                                                fill="#10B981" 
                                                shape="circle" 
                                            />
                                            <Scatter 
                                                name="False Positives" 
                                                data={results.filter(r => !r.is_exoplanet)} 
                                                fill="#F59E0B" 
                                                shape="triangle" 
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="mt-8 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Period (d)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Radius (R⊕)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Temp (K)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Prediction</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Confidence</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                                        {results.slice(0, 10).map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-800/50">
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{row.koi_period}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{row.koi_prad}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{row.koi_teq}</td>
                                                <td className={`px-4 py-2 whitespace-nowrap text-sm font-semibold ${row.is_exoplanet ? 'text-green-400' : 'text-amber-400'}`}>
                                                    {row.is_exoplanet ? 'Exoplanet' : 'False Positive'}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{(row.confidence * 100).toFixed(1)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {results.length > 10 && (
                                    <p className="text-center mt-2 text-sm text-gray-500">
                                        Showing first 10 of {results.length} Kepler candidates.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}