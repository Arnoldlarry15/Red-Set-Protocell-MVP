import React from 'react';

interface Log {
    score?: number;
    risk?: string;
}

interface ActivityGraphProps {
    logs: Log[];
}

const ActivityGraph: React.FC<ActivityGraphProps> = ({ logs }) => {
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
        <div className="glass-panel rounded-xl p-6 flex flex-col h-full">
            <h3 className="text-sm font-bold font-mono mb-4 text-text-secondary tracking-wide">ACTIVITY_GRAPH (SAFETY SCORE)</h3>
            <div className="flex-1 flex items-end justify-between gap-1 min-h-[100px]">
                {displayData.map((h, i) => (
                    <div
                        key={i}
                        style={{ height: `${Math.max(h, 5)}%` }}
                        className="w-full bg-primary-red/20 hover:bg-primary-red transition-all duration-300 rounded-t-sm relative group"
                        title={`Score: ${h}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-red/0 to-primary-red/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityGraph;
