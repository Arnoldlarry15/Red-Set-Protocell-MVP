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
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full flex items-center justify-center">
                <p className="text-white/40 text-sm font-mono">Loading analytics...</p>
            </div>
        );
    }

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full flex flex-col overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-sm font-bold font-mono text-white/90 uppercase tracking-wider">
                    Multi-Objective Optimization
                </h3>
            </div>

            <div className="flex-1 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            type="number"
                            dataKey="robustness"
                            name="Robustness"
                            domain={[0, 1]}
                            stroke="#ffffff40"
                            tick={{ fill: '#ffffff60', fontSize: 10 }}
                            label={{ value: 'Robustness (Safety)', position: 'bottom', fill: '#ffffff40', fontSize: 10 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="accuracy"
                            name="Accuracy"
                            domain={[0, 1]}
                            stroke="#ffffff40"
                            tick={{ fill: '#ffffff60', fontSize: 10 }}
                            label={{ value: 'Accuracy', angle: -90, position: 'left', fill: '#ffffff40', fontSize: 10 }}
                        />
                        <ZAxis type="number" dataKey="size" range={[50, 300]} name="Config" />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                                backgroundColor: '#0a0a0a',
                                borderColor: '#ffffff20',
                                color: '#ffffff',
                                borderRadius: '8px',
                                fontSize: '11px'
                            }}
                            itemStyle={{ color: '#ffffff80' }}
                        />
                        <Scatter name="Configurations" data={data} fill="#ef4444">
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className="px-6 py-3 border-t border-white/10 text-[10px] text-white/40 font-mono space-y-1">
                <p>• X: Resistance to attacks</p>
                <p>• Y: Valid response accuracy</p>
                <p>• Size: Configuration weight</p>
            </div>
        </div>
    );
};

export default ParetoChart;
