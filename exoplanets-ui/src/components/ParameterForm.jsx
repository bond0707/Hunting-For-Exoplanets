// components/ParameterForm.js
import React from 'react';
import { motion } from 'framer-motion';
import InputField from './InputField';

function ParameterForm({
    selectedMission,
    formData,
    fieldErrors,
    isLoading,
    error,
    onMissionChange,
    onChange,
    onSubmit,
    onLoadSample
}) {
    const currentConfig = missionConfigs[selectedMission];

    return (
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
                    onClick={onLoadSample}
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
                    onChange={onMissionChange}
                />
            </div>

            <form onSubmit={onSubmit} className="space-y-4 mt-4 bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                {currentConfig.features.map((field) => (
                    <InputField
                        key={field.name}
                        field={field}
                        value={formData[field.name]}
                        onChange={onChange}
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
    );
}

export default ParameterForm;