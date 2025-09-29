import { FireIcon, CloudIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function HabitabilityIndicator({ eqTemp }) {
    const [indicator, setIndicator] = useState({
        icon: <ShieldExclamationIcon className="w-8 h-8" />,
        text: "Unknown Zone",
        color: "text-gray-400",
        bg: "bg-gray-800/50",
        border: "border-gray-600"
    });

    useEffect(() => {
        if (eqTemp === undefined || eqTemp === null) return;

        let newIndicator;
        if (eqTemp < 273) {
            newIndicator = {
                icon: <ShieldExclamationIcon className="w-8 h-8" />,
                text: "Too Cold (Frozen)",
                color: "text-blue-400",
                bg: "bg-blue-500/20",
                border: "border-blue-500/30"
            };
        } else if (eqTemp >= 273 && eqTemp <= 373) {
            newIndicator = {
                icon: <CloudIcon className="w-8 h-8" />,
                text: "Habitable Zone (Temperate)",
                color: "text-green-400",
                bg: "bg-green-500/20",
                border: "border-green-500/30"
            };
        } else {
            newIndicator = {
                icon: <FireIcon className="w-8 h-8" />,
                text: "Too Hot (Scorched)",
                color: "text-red-400",
                bg: "bg-red-500/20",
                border: "border-red-500/30"
            };
        }
        setIndicator(newIndicator);
    }, [eqTemp]);

    return (
        <div className={`flex flex-col items-center justify-center text-center p-4 rounded-lg border ${indicator.bg} ${indicator.border}`}>
            <div className={indicator.color}>
                {indicator.icon}
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{indicator.text}</p>
            <p className="text-xs text-gray-400 mt-1">{eqTemp ? `${eqTemp} K` : 'No data'}</p>
        </div>
    );
}

export function CategoryVisualizer({ planetRadius }) {
    const [category, setCategory] = useState({
        name: 'Unknown',
        desc: 'Could not be classified.',
        color: "text-gray-400",
        bg: "bg-gray-800/50",
        border: "border-gray-600"
    });

    useEffect(() => {
        if (planetRadius === undefined || planetRadius === null) return;

        let newCategory;
        if (planetRadius < 0.8) {
            newCategory = {
                name: 'Sub-Earth',
                desc: 'Smaller than Earth.',
                color: "text-purple-400",
                bg: "bg-purple-500/20",
                border: "border-purple-500/30"
            };
        } else if (planetRadius <= 1.25) {
            newCategory = {
                name: 'Earth-like',
                desc: 'Similar in size to Earth.',
                color: "text-green-400",
                bg: "bg-green-500/20",
                border: "border-green-500/30"
            };
        } else if (planetRadius <= 2) {
            newCategory = {
                name: 'Super-Earth',
                desc: 'Larger than Earth, but still rocky.',
                color: "text-blue-400",
                bg: "bg-blue-500/20",
                border: "border-blue-500/30"
            };
        } else if (planetRadius <= 4) {
            newCategory = {
                name: 'Mini-Neptune',
                desc: 'A gaseous planet, smaller than Neptune.',
                color: "text-cyan-400",
                bg: "bg-cyan-500/20",
                border: "border-cyan-500/30"
            };
        } else {
            newCategory = {
                name: 'Gas-Giant',
                desc: 'A large planet like Jupiter or Neptune.',
                color: "text-orange-400",
                bg: "bg-orange-500/20",
                border: "border-orange-500/30"
            };
        }
        setCategory(newCategory);
    }, [planetRadius]);

    // Use emoji as fallback since we don't have actual planet images
    const getPlanetEmoji = (categoryName) => {
        const emojiMap = {
            'Sub-Earth': '🪐',
            'Earth-like': '🌍',
            'Super-Earth': '🪐',
            'Mini-Neptune': '🔵',
            'Gas-Giant': '🪐',
            'Unknown': '❓'
        };
        return emojiMap[categoryName] || '🪐';
    };

    return (
        <div className={`flex flex-col items-center justify-center text-center p-4 rounded-lg border ${category.bg} ${category.border}`}>
            <motion.div
                className="text-6xl mb-2"
                animate={{ y: ["-4px", "4px", "-4px"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {getPlanetEmoji(category.name)}
            </motion.div>
            <p className={`text-sm font-semibold ${category.color}`}>{category.name.replace('-', ' ')}</p>
            <p className="text-xs text-gray-400 mt-1">{category.desc}</p>
            <p className="text-xs text-gray-500 mt-1">{planetRadius ? `${planetRadius} R⊕` : 'No radius data'}</p>
        </div>
    );
}

export function TransitVisualizer({ transitDepth = 8400, transitDuration = 4 }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const generateLightCurveData = () => {
            const points = 100;
            const dipStart = Math.floor((points - (transitDuration * 10)) / 2);
            const dipEnd = dipStart + Math.floor(transitDuration * 10);
            const dipValue = 1 - (transitDepth / 1000000);

            const generatedData = [];
            for (let i = 0; i < points; i++) {
                let brightness = 1.0;
                if (i >= dipStart && i <= dipEnd) {
                    brightness = dipValue;
                }
                generatedData.push({
                    time: i,
                    brightness: Math.max(0, Math.min(1, brightness))
                });
            }
            return generatedData;
        };

        setData(generateLightCurveData());
    }, [transitDepth, transitDuration]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                    <p className="text-gray-300 text-sm">Time: {label}</p>
                    <p className="text-indigo-400 font-mono">
                        Brightness: {payload[0].value.toFixed(4)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 h-48 w-full">
            <p className="text-sm font-semibold text-white text-center mb-3">Transit Light Curve</p>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 0, bottom: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="time"
                        stroke="#9ca3af"
                        tick={{ fontSize: 10 }}
                        label={{
                            value: "Observation Time",
                            position: "insideBottom",
                            offset: -3,
                            fill: '#9ca3af',
                            fontSize: 10
                        }}
                    />
                    <YAxis
                        domain={[0.98, 1.002]}
                        stroke="#9ca3af"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.toFixed(3)}
                        label={{
                            value: 'Relative Brightness',
                            angle: -90,
                            position: 'bottomLeft',
                            fill: '#9ca3af',
                            fontSize: 10,
                            dx: -13,
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="brightness"
                        stroke="#818cf8"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Depth: {transitDepth} ppm</span>
                <span>Duration: {transitDuration}h</span>
            </div>
        </div>
    );
}