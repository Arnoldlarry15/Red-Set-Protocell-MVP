import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ParetoPoint {
    name: string;
    robustness: number;
    accuracy: number;
    fairness: number;
    size: number;
}

const ParetoChart: React.FC = () => {
    const [data, setData] = useState<ParetoPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/evaluation/pareto', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setData(data);
                } else {
                    console.error("Pareto data is not an array:", data);
                    setData([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch pareto data", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="glass-panel rounded-2xl h-full flex items-center justify-center">
                <p className="text-white/40 text-sm font-mono">Loading analytics...</p>
            </div>
        );
    }

    // Gradient colors for data points
    const COLORS = ['#a855f7', '#6366f1', '#06b6d4', '#10b981'];

    return (
        <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-sm font-bold font-mono gradient-text uppercase tracking-wider">
                    Multi-Objective Optimization
                </h3>
                <p className="text-[10px] text-white/40 mt-1 font-mono">Pareto Frontier Analysis</p>
            </div>

            <div className="flex-1 p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 30 }}>
                        <defs>
                            <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                        <XAxis
                            type="number"
                            dataKey="robustness"
                            name="Robustness"
                            domain={[0, 1]}
                            stroke="#ffffff50"
                            tick={{ fill: '#ffffff70', fontSize: 11 }}
                            label={{ value: 'Robustness (Safety)', position: 'bottom', fill: '#a855f7', fontSize: 11, offset: 10 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="accuracy"
                            name="Accuracy"
                            domain={[0, 1]}
                            stroke="#ffffff50"
                            tick={{ fill: '#ffffff70', fontSize: 11 }}
                            label={{ value: 'Accuracy', angle: -90, position: 'left', fill: '#06b6d4', fontSize: 11, offset: 10 }}
                        />
                        <ZAxis type="number" dataKey="size" range={[100, 400]} name="Config" />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3', stroke: '#ffffff30' }}
                            contentStyle={{
                                background: 'rgba(15, 15, 35, 0.95)',
                                backdropFilter: 'blur(16px)',
                                borderColor: '#ffffff20',
                                color: '#ffffff',
                                borderRadius: '12px',
                                fontSize: '11px',
                                padding: '8px 12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ color: '#ffffff90' }}
                        />
                        <Scatter name="Configurations" data={data}>
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    opacity={0.8}
                                    style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}40)` }}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className="px-6 py-3 border-t border-white/10 text-[10px] text-white/40 font-mono space-y-1 bg-white/[0.02]">
                <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    X-Axis: Resistance to security attacks
                </p>
                <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Y-Axis: Valid response accuracy
                </p>
                <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                    Size: Configuration complexity
                </p>
            </div>
        </div>
    );
};

export default ParetoChart;
