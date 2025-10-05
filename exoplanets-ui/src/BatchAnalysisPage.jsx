import axios from 'axios';
import Papa from 'papaparse';
import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpTrayIcon, DocumentArrowDownIcon, ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Legend, CartesianGrid } from 'recharts';
import CustomSelect from './components/CustomSelect';

const COLORS = ['#10B981', '#F59E0B'];
const ROW_LIMIT = 1000;

// Define required features for each mission type
const missionRequirements = {
  Kepler: [
    'koi_score', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
    'koi_period', 'koi_prad', 'koi_teq', 'koi_depth', 'koi_duration', 'koi_impact'
  ],
  TESS: [
    'pl_orbper', 'pl_rade', 'pl_eqt', 'st_rad', 'st_teff', 'st_logg', 
    'pl_trandep', 'pl_trandurh', 'st_tmag'
  ],
  K2: [
    'pl_orbper', 'pl_rade', 'pl_eqt', 'st_rad', 'st_teff', 'st_logg',
    'pl_trandep', 'pl_trandur'
  ],
  Universal: [
    'period', 'planet_radius', 'planet_temp', 'stellar_radius', 
    'stellar_temp', 'stellar_logg'
  ]
};

// Column name mapping for normalization
const columnMapping = {
  // Period columns
  'koi_period': 'period',
  'pl_orbper': 'period',
  'period': 'period',
  
  // Planet radius columns
  'koi_prad': 'planet_radius', 
  'pl_rade': 'planet_radius',
  'planet_radius': 'planet_radius',
  
  // Planet temperature columns
  'koi_teq': 'planet_temp',
  'pl_eqt': 'planet_temp', 
  'planet_temp': 'planet_temp',
  
  // Stellar radius columns
  'st_rad': 'stellar_radius',
  'stellar_radius': 'stellar_radius',
  
  // Stellar temperature columns
  'st_teff': 'stellar_temp',
  'stellar_temp': 'stellar_temp',
  
  // Stellar logg columns
  'st_logg': 'stellar_logg', 
  'stellar_logg': 'stellar_logg',
  
  // Mission-specific columns (keep as-is)
  'pl_trandep': 'pl_trandep',
  'pl_trandurh': 'pl_trandurh',
  'pl_trandur': 'pl_trandur',
  'st_tmag': 'st_tmag',
  'koi_score': 'koi_score',
  'koi_fpflag_nt': 'koi_fpflag_nt',
  'koi_fpflag_ss': 'koi_fpflag_ss',
  'koi_fpflag_co': 'koi_fpflag_co',
  'koi_fpflag_ec': 'koi_fpflag_ec',
  'koi_depth': 'koi_depth',
  'koi_duration': 'koi_duration',
  'koi_impact': 'koi_impact'
};

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
        <p className="text-gray-300 text-sm">Row: {data.original_row - 1}</p>
        <p className="text-gray-300 text-sm">Period: {period ? period.toFixed(2) : 'N/A'} days</p>
        <p className="text-gray-300 text-sm">Radius: {radius ? radius.toFixed(2) : 'N/A'} R⊕</p>
        <p className="text-indigo-400">Confidence: {(data.confidence * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function BatchAnalysisPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [detectedMission, setDetectedMission] = useState(null);
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);
  const [filter, setFilter] = useState('All Results');
  const [visibleRows, setVisibleRows] = useState(10);
  const [isDragging, setIsDragging] = useState(false);

  const detectMissionType = (headers) => {
    const headerSet = new Set(headers);
    
    console.log('Available headers:', headers);
    
    // Check each mission type for exact matches
    for (const [mission, requiredColumns] of Object.entries(missionRequirements)) {
      const hasRequiredColumns = requiredColumns.every(col => headerSet.has(col));
      if (hasRequiredColumns) {
        console.log(`Exact match found: ${mission}`);
        return mission;
      }
    }
    
    // Check for partial matches with scoring
    let bestMatch = { mission: 'Universal', score: 0 };
    
    for (const [mission, requiredColumns] of Object.entries(missionRequirements)) {
      const matchingColumns = requiredColumns.filter(col => headerSet.has(col));
      const matchScore = matchingColumns.length / requiredColumns.length;
      
      console.log(`${mission} match score: ${matchScore} (${matchingColumns.length}/${requiredColumns.length})`);
      
      if (matchScore > bestMatch.score) {
        bestMatch = { mission, score: matchScore };
      }
    }
    
    // Use mission if we have at least 60% match, otherwise use Universal
    if (bestMatch.score >= 0.6) {
      console.log(`Partial match selected: ${bestMatch.mission} (${(bestMatch.score * 100).toFixed(1)}%)`);
      return bestMatch.mission;
    }
    
    console.log('Using Universal model (no good mission match)');
    return 'Universal';
  };

  const normalizeHeaders = (headers) => {
    return headers.map(header => {
      // Remove comments and trim whitespace
      const cleanHeader = header.replace(/#.*$/, '').trim();
      
      // Map to standard names
      return columnMapping[cleanHeader] || cleanHeader;
    });
  };

  const normalizeRowData = (row, originalHeaders, normalizedHeaders) => {
    const normalizedRow = {};
    
    originalHeaders.forEach((originalHeader, index) => {
      const normalizedHeader = normalizedHeaders[index];
      if (row[originalHeader] !== undefined && row[originalHeader] !== null && row[originalHeader] !== '') {
        normalizedRow[normalizedHeader] = row[originalHeader];
      }
    });
    
    return normalizedRow;
  };

  const resetState = () => {
    setFile(null);
    setFileName('');
    setResults(null);
    setIsLoading(false);
    setProgress(0);
    setError('');
    setDetectedMission(null);
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
    if (!file) {
      setError('No file selected.');
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setError('');
    setNotification('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      comments: "#",
      transformHeader: (header) => {
        return header.replace(/#.*$/, '').trim();
      },
      complete: async (parsedResults) => {
        try {
          // Check if we have valid data
          if (!parsedResults.data || parsedResults.data.length === 0) {
            throw new Error('CSV file appears to be empty or has no valid data');
          }

          // Normalize headers
          const originalHeaders = parsedResults.meta.fields;
          const normalizedHeaders = normalizeHeaders(originalHeaders);
          
          console.log('Original headers:', originalHeaders);
          console.log('Normalized headers:', normalizedHeaders);

          // Detect mission type based on normalized headers
          const mission = detectMissionType(normalizedHeaders);
          setDetectedMission(mission);

          let dataToProcess = parsedResults.data;

          // Apply row limit if needed
          if (dataToProcess.length > ROW_LIMIT) {
            setNotification(`⚠️ Your file has ${dataToProcess.length.toLocaleString()} rows. Only the first ${ROW_LIMIT.toLocaleString()} have been processed.`);
            dataToProcess = dataToProcess.slice(0, ROW_LIMIT);
          }
          
          // Progress simulation
          const progressInterval = setInterval(() => {
            setProgress(prev => {
              const newProgress = prev + (100 - prev) * 0.1;
              return newProgress >= 90 ? 90 : newProgress;
            });
          }, 500);

          // Normalize all data rows
          const normalizedData = dataToProcess.map(row => {
            const normalizedRow = normalizeRowData(row, originalHeaders, normalizedHeaders);
            normalizedRow.mission = mission;
            return normalizedRow;
          });

          console.log('Sending normalized data to backend:', normalizedData.slice(0, 2)); // Log first 2 rows

          // Send to backend
          const response = await axios.post('http://127.0.0.1:8000/batch-analyze', normalizedData);
          
          if (response.data && Array.isArray(response.data.results)) {
            const combinedResults = response.data.results.map((result, index) => ({
              ...dataToProcess[index], // Keep original data for display
              ...result,
              original_row: index + 2,
              detected_mission: mission
            }));
            setResults(combinedResults);
          } else {
            throw new Error('Unexpected response format from server');
          }
          
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => setIsLoading(false), 500);
          
        } catch (err) {
          console.error('Analysis error:', err);
          setError(err.response?.data?.detail || err.message || 'An error occurred during analysis.');
          setIsLoading(false);
        }
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        setError(`Error parsing CSV file: ${err.message}`);
        setIsLoading(false);
      }
    });
  };

  const handleDownload = () => {
    if (!resultsToDisplay || resultsToDisplay.length === 0) return;
    
    const csvData = resultsToDisplay.map(r => ({
      original_row: r.original_row,
      is_exoplanet: r.is_exoplanet,
      confidence: (r.confidence || 0).toFixed(4),
      details: r.details || 'No details available',
      model_type: r.model_type || '5-Model Ensemble',
      detected_mission: r.detected_mission || 'Unknown'
    }));
    
    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `exoplanet_results_${fileName || 'analysis'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resultsToDisplay = useMemo(() => {
    if (!results) return [];
    
    // Reset visible rows when filter changes
    setVisibleRows(10);
    
    switch (filter) {
      case 'Exoplanet Candidates':
        return results.filter(r => r.is_exoplanet);
      case 'False Positives':
        return results.filter(r => !r.is_exoplanet);
      default:
        return results;
    }
  }, [results, filter]);

  // Prepare chart data
  const pieData = results ? [
    { 
      name: 'Exoplanet Candidates', 
      value: results.filter(r => r.is_exoplanet).length, 
      total: results.length 
    },
    { 
      name: 'False Positives', 
      value: results.filter(r => !r.is_exoplanet).length, 
      total: results.length 
    },
  ] : [];

  const exoplanetScatterData = resultsToDisplay.filter(d => d.is_exoplanet);
  const falsePositiveScatterData = resultsToDisplay.filter(d => !d.is_exoplanet);
  
  // Find available keys for scatter plot
  const xKey = ['koi_period', 'pl_orbper', 'period'].find(k => 
    results?.[0]?.hasOwnProperty(k)
  ) || 'period';
  
  const yKey = ['koi_prad', 'pl_rade', 'planet_radius'].find(k => 
    results?.[0]?.hasOwnProperty(k)
  ) || 'planet_radius';

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-indigo-400">Batch Analysis</h1>
          <p className="mt-2 text-gray-400">
            Upload any CSV file with exoplanet data - we'll automatically detect the format and process it.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {!results && !isLoading && (
            <motion.div 
              key="upload" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            >
              <div
                className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                  isDragging 
                    ? 'border-indigo-400 bg-indigo-900/20' 
                    : 'border-gray-600 hover:bg-gray-800/50 cursor-pointer'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center pointer-events-none">
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-400">
                    <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports Kepler, TESS, K2, and universal exoplanet data formats
                  </p>
                  <p className="text-xs text-gray-500">
                    Comments (lines starting with #) are automatically ignored
                  </p>
                  {fileName && !error && (
                    <p className="mt-2 text-sm font-medium text-green-400">
                      Selected: {fileName}
                    </p>
                  )}
                  {error && (
                    <p className="mt-2 text-sm font-medium text-red-400">
                      {error}
                    </p>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".csv,text/csv" 
                />
              </div>
              
              <motion.button 
                onClick={handleAnalyzeClick} 
                whileTap={{ scale: 0.95 }} 
                disabled={!file || isLoading} 
                className="w-full mt-4 rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {file ? 'Analyze with Auto-Detection' : 'Upload CSV to Begin Analysis'}
              </motion.button>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              key="loading" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="mt-8 text-center"
            >
              <p className="text-lg font-semibold mb-2">
                {detectedMission 
                  ? `Analyzing with ${detectedMission} Model...` 
                  : 'Detecting data format...'
                }
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                <motion.div 
                  className="bg-indigo-500 h-2.5 rounded-full" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ duration: 0.5, ease: "easeInOut" }} 
                />
              </div>
              <p className="text-gray-400 mt-2 text-sm">
                {detectedMission 
                  ? `Using ${detectedMission} specialist model` 
                  : 'Analyzing CSV structure and column mapping...'
                }
              </p>
              <p className="text-gray-500 mt-1 text-xs">
                Progress: {Math.round(progress)}%
              </p>
            </motion.div>
          )}

          {results && !isLoading && (
            <motion.div 
              key="results" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-12"
            >
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Analysis Results</h2>
                  <p className="text-gray-400 mt-1">
                    Found {results.filter(r => r.is_exoplanet).length} potential exoplanets out of {results.length} candidates.
                    {detectedMission && (
                      <span className="text-indigo-400 ml-2">
                        Detected format: {detectedMission}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <motion.button 
                    onClick={handleDownload} 
                    whileTap={{ scale: 0.95 }} 
                    className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 rounded-md px-3 py-2 font-semibold transition-colors"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" /> 
                    Download Results
                  </motion.button>
                  <motion.button 
                    onClick={resetState} 
                    whileTap={{ scale: 0.95 }} 
                    className="flex items-center gap-2 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md px-3 py-2 font-semibold transition-colors"
                  >
                    <ArrowPathIcon className="w-5 h-5" /> 
                    Analyze New File
                  </motion.button>
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
                      <Pie 
                        data={pieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={100} 
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
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
                      <XAxis 
                        type="number" 
                        dataKey={xKey} 
                        name="Orbital Period" 
                        unit=" days" 
                        tick={{ fontSize: 10, fill: '#9ca3af' }} 
                        stroke="#9ca3af" 
                      />
                      <YAxis 
                        type="number" 
                        dataKey={yKey} 
                        name="Planet Radius" 
                        unit=" R⊕" 
                        tick={{ fontSize: 10, fill: '#9ca3af' }} 
                        stroke="#9ca3af" 
                      />
                      <ZAxis 
                        type="number" 
                        dataKey="confidence" 
                        range={[50, 400]} 
                        name="Confidence" 
                      />
                      <ChartTooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter 
                        name="Exoplanet" 
                        data={exoplanetScatterData} 
                        fill="#10B981" 
                        shape="circle" 
                      />
                      <Scatter 
                        name="False Positive" 
                        data={falsePositiveScatterData} 
                        fill="#F59E0B" 
                        shape="triangle" 
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                  <h3 className="text-xl font-bold text-white">Processed Candidates</h3>
                  <div className="w-64">
                    <CustomSelect 
                      options={['All Results', 'Exoplanet Candidates', 'False Positives']}
                      value={filter}
                      onChange={setFilter}
                    />
                  </div>
                </div>
                
                <div className="rounded-lg border border-gray-700 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                          Row
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                          Prediction
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                          Confidence
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                          Model Used
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                      {resultsToDisplay.slice(0, visibleRows).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {row.original_row - 1}
                          </td>
                          <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
                            row.is_exoplanet ? 'text-green-400' : 'text-amber-400'
                          }`}>
                            {row.is_exoplanet ? 'Exoplanet' : 'False Positive'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {(row.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {row.model_type || '5-Model Ensemble'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                            {row.details || 'No details available'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500">
                    Showing {Math.min(visibleRows, resultsToDisplay.length)} of {resultsToDisplay.length} results.
                  </p>
                  {visibleRows < resultsToDisplay.length && (
                    <motion.button 
                      onClick={() => setVisibleRows(prev => prev + 30)}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 flex items-center gap-2 mx-auto text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                      <ChevronDownIcon className="w-5 h-5" />
                      Load More Results
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