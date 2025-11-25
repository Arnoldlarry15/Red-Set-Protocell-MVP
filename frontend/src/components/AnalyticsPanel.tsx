import React from 'react';
import ParetoChart from './ParetoChart';

interface Stats {
    risk: string;
    iterations: number;
    success_rate: number;
    average_score?: number;
    max_score?: number;
}

interface Log {
    score?: number;
    risk?: string;
}

interface AnalyticsPanelProps {
    stats: Stats;
    sessionId: string | null;
    logs: Log[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats, sessionId, logs }) => {
    const handleExport = () => {
        if (!sessionId) return;
        window.location.href = `http://localhost:5000/api/session/${sessionId}/export`;
    };

    // Calculate graph data from logs
    const graphData = logs.map(log => {
        if (log.score !== undefined && log.score !== null) return log.score;
        // Fallback if no score
        switch (log.risk) {
            case 'CRITICAL': return 100;
            case 'HIGH': return 80;
            case 'MEDIUM': return 60;
            case 'LOW': return 40;
            case 'SAFE': return 20;
            default: return 10;
        }
    });

    // Fill with empty bars if not enough data to look good
    const displayData = graphData.length > 0 ? graphData : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    return (
        <div className="flex flex-col gap-6 pr-2 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-neon-red/10 rounded-full blur-2xl -mr-10 -mt-10" />

                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-lg font-bold font-mono flex items-center gap-2 tracking-wider">
                        <span className="text-neon-red">///</span> ANALYTICS
                    </h2>
                    <button
                        onClick={handleExport}
                        disabled={!sessionId}
                        className="text-xs font-mono bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-white/10 hover:border-neon-red/50 text-white px-3 py-1.5 rounded transition-all disabled:opacity-50 disabled:hover:bg-white/5 disabled:hover:text-white disabled:hover:border-white/10"
                    >
                        EXPORT_DATA
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    {/* Risk Score Card */}
                    <div className="p-4 rounded-lg bg-bg-card border border-white/5 hover:border-primary-red/30 transition-colors group/card">
                        <div className="text-xs font-mono text-secondary-slate uppercase tracking-wider mb-2">Current Risk Level</div>
                        <div className={`font-bold font-mono ${stats.risk === 'SAFE' ? 'text-secondary-blue' : 'text-primary-red animate-pulse'} ${stats.risk === 'CRITICAL' ? 'text-2xl' : 'text-3xl'}`}>
                            {stats.risk}
                        </div>
                        <div className="text-xs text-secondary-slate mt-2 flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${stats.risk === 'SAFE' ? 'bg-secondary-blue' : 'bg-primary-red'}`} />
                            Real-time assessment
                        </div>
                    </div>

                    {/* Iterations Card */}
                    <div className="p-4 rounded-lg bg-bg-card border border-white/5 hover:border-secondary-blue/30 transition-colors">
                        <div className="text-xs font-mono text-secondary-slate uppercase tracking-wider mb-2">Total Iterations</div>
                        <div className="text-3xl font-bold font-mono text-primary-white">{stats.iterations}</div>
                        <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary-blue w-full animate-pulse-slow" />
                        </div>
                    </div>

                    {/* Success Rate Card */}
                    <div className="p-4 rounded-lg bg-bg-card border border-white/5 hover:border-secondary-gold/30 transition-colors">
                        <div className="text-xs font-mono text-secondary-slate uppercase tracking-wider mb-2">Success Rate</div>
                        <div className="text-3xl font-bold font-mono text-primary-white">{stats.success_rate}</div>
                        <div className="text-xs text-secondary-slate mt-2">Bypass confirmed</div>
                    </div>

                    {/* Average Score Card */}
                    <div className="p-4 rounded-lg bg-bg-card border border-white/5 hover:border-secondary-slate/30 transition-colors">
                        <div className="text-xs font-mono text-secondary-slate uppercase tracking-wider mb-2">Avg Safety Score</div>
                        <div className="text-3xl font-bold font-mono text-primary-white">
                            {stats.average_score ? stats.average_score.toFixed(1) : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col">
                <h3 className="text-sm font-bold font-mono mb-4 text-text-secondary tracking-wide">ACTIVITY_GRAPH (SAFETY SCORE)</h3>
                <div className="flex-1 flex items-end justify-between gap-1 min-h-[100px]">
                    {displayData.map((h, i) => (
                        <div
                            key={i}
                            style={{ height: `${Math.max(h, 5)}%` }}
                            className="w-full bg-neon-red/20 hover:bg-neon-red transition-all duration-300 rounded-t-sm relative group"
                            title={`Score: ${h}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-neon-red/0 to-neon-red/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col min-h-[450px]">
                <ParetoChart />
            </div>
        </div>
    );
};

export default AnalyticsPanel;
