// components/InputField.js
import React from 'react';

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
                    className={`mt-1 block w-full rounded-md border bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 ${error ? 'border-red-500' : 'border-gray-600'
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
                className={`mt-1 block w-full rounded-md border bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 ${error ? 'border-red-500' : 'border-gray-600'
                    }`}
                required
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}

export default InputField;