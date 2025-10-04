import CustomSelect from './CustomSelect';

function InputField({ field, value, onChange }) {
    const { name, label, placeholder, type, options } = field;

    if (type === 'select') {
        return (
            <div>
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <CustomSelect
                    options={options.map(opt => ({ value: opt.value, label: opt.label }))}
                    value={value === undefined || value === null ? '' : value}
                    onChange={(selectedValue) => {
                        const event = {
                            target: {
                                name: name,
                                value: selectedValue
                            }
                        };
                        onChange(event);
                    }}
                    placeholder={`Choose ${label}`}
                />
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
                className="mt-1 block w-full rounded-md border bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border-gray-600"
                required  // This enables browser validation
            />
        </div>
    );
}

export default InputField;