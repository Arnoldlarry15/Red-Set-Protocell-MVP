import React from 'react';

interface Stats {
    risk: string;
    iterations: number;
    success_rate: number;
    average_score?: number;
    max_score?: number;
}

interface StatsPanelProps {
    stats: Stats;
    sessionId: string | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, sessionId }) => {
    const handleExport = () => {
        if (!sessionId) return;
        window.location.href = `http://localhost:5000/api/session/${sessionId}/export`;
    };

    return (
        <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-red/10 rounded-full blur-2xl -mr-10 -mt-10" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-lg font-bold font-mono flex items-center gap-2 tracking-wider">
                    <span className="text-primary-red">///</span> ANALYTICS
                </h2>
                <button
                    onClick={handleExport}
                    disabled={!sessionId}
                    className="text-xs font-mono bg-white/5 hover:bg-primary-red/20 hover:text-primary-red border border-white/10 hover:border-primary-red/50 text-white px-3 py-1.5 rounded transition-all disabled:opacity-50 disabled:hover:bg-white/5 disabled:hover:text-white disabled:hover:border-white/10"
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
    );
};

export default StatsPanel;
