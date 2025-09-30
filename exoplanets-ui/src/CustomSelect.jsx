import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export default function CustomSelect({ value, onChange, options }) {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-600 bg-gray-800 py-2 pl-3 pr-10 text-left text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                    <span className="block truncate">{value}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition 
                    as={Fragment} 
                    leave="transition ease-in duration-100" 
                    leaveFrom="opacity-100" 
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-600">
                        {options.map((option, optionIdx) => (
                            <Listbox.Option 
                                key={optionIdx} 
                                className={({ active }) => 
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-200'
                                    }`
                                } 
                                value={option}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400">
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}