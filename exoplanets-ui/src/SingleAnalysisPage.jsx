import api from './assets/api';
import { useState } from 'react';
import ParameterForm from './components/ParameterForm';
import ResultDisplay from './components/ResultDisplay';
import { missionConfigs, missionSamples } from './assets/missionConfigs';

export default function SingleAnalysisPage() {
  const [selectedMission, setSelectedMission] = useState('Kepler');
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sampleInfo, setSampleInfo] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleMissionChange = (mission) => {
    setSelectedMission(mission);
    setFormData({});
    setResult(null);
    setError('');
    setSampleInfo(null);
    setSubmittedData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const currentConfig = missionConfigs[selectedMission];
    const fieldConfig = currentConfig.features.find(f => f.name === name);

    let processedValue = value;
    if (fieldConfig?.type === 'select' || fieldConfig?.type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSampleInfo(null);
    setIsLoading(true);
    setError('');
    setResult(null);
    setSubmittedData({ ...formData });

    try {
      const missionName = missionConfigs[selectedMission].backendName;
      const requestData = { ...formData };

      console.log(`Sending to backend at /analyze/${missionName}`, requestData);

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
    const missionDataArray = missionSamples[selectedMission];
    const randomIndex = Math.floor(Math.random() * missionDataArray.length);
    const randomSample = missionDataArray[randomIndex];
    setFormData(randomSample.data);
    setSampleInfo(randomSample);
    setResult(null);
    setError('');
    setSubmittedData(null);
  };

  const handleErrorDismiss = () => {
    setError('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
      <ParameterForm
        selectedMission={selectedMission}
        onMissionChange={handleMissionChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        formData={formData}
        onFormDataChange={handleChange}
        onLoadSample={handleLoadSample}
      />

      <ResultDisplay
        isLoading={isLoading}
        selectedMission={selectedMission}
        error={error}
        result={result}
        sampleInfo={sampleInfo}
        submittedData={submittedData}
        onErrorDismiss={handleErrorDismiss}
      />
    </div>
  );
}