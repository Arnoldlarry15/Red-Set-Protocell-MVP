import React, { useEffect, useRef, useState } from 'react';

interface Log {
    timestamp: string;
    role: string;
    message: string;
    risk?: string;
    score?: number;
    category?: string;
    cvss_vector?: string;
    cvss_score?: number;
    mitre_id?: string;
    remediation?: {
        mitre_id: string;
        mitre_name: string;
        mitre_url: string;
        steps: string[];
    };
}

interface ExecutionLogProps {
    logs: Log[];
    sessionId?: string | null;
}

const ExecutionLog: React.FC<ExecutionLogProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [expandedRemediations, setExpandedRemediations] = useState<Set<number>>(new Set());

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const toggleRemediation = (index: number) => {
        const newExpanded = new Set(expandedRemediations);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedRemediations(newExpanded);
    };

    const getRiskColor = (risk?: string) => {
        switch (risk) {
            case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/40 glow-purple';
            case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
            case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
            case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500/40';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    const getCVSSColor = (score?: number) => {
        if (!score) return 'text-white/40';
        if (score >= 9.0) return 'text-red-400';
        if (score >= 7.0) return 'text-orange-400';
        if (score >= 4.0) return 'text-yellow-400';
        return 'text-green-400';
    };

    const getRoleStyle = (role: string) => {
        switch (role) {
            case 'SNIPER':
                return {
                    bg: 'glass-panel border-purple-500/30 glow-purple',
                    text: 'gradient-text font-bold',
                    indicator: 'bg-gradient-to-r from-purple-500 to-cyan-500'
                };
            case 'SPOTTER':
                return {
                    bg: 'glass-panel border-cyan-500/30 glow-cyan',
                    text: 'text-cyan-400 font-bold',
                    indicator: 'bg-cyan-500'
                };
            default:
                return {
                    bg: 'glass-panel border-white/10',
                    text: 'text-white/60',
                    indicator: 'bg-white/40'
                };
        }
    };

    return (
        <div className="glass-panel rounded-2xl h-full flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-sm font-bold font-mono gradient-text uppercase tracking-wider">Execution Log</h2>
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse" />
                    <span>LIVE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
                {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-white/20 text-xs">
                        <p>Waiting for session to start...</p>
                    </div>
                ) : (
                    logs.map((log, idx) => {
                        const roleStyle = getRoleStyle(log.role);
                        return (
                            <div key={idx} className="group animate-[slideUp_0.3s_ease-out]">
                                {/* Message */}
                                <div className={`p-4 rounded-xl border transition-all ${roleStyle.bg}`}>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 ${roleStyle.indicator} rounded-full`} />
                                            <span className={`text-xs ${roleStyle.text}`}>{log.role}</span>
                                            <span className="text-[10px] text-white/30">{log.timestamp}</span>
                                        </div>

                                        {log.risk && (
                                            <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getRiskColor(log.risk)}`}>
                                                {log.risk}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">
                                        {log.message}
                                    </p>

                                    {/* SPOTTER Analysis */}
                                    {log.role === 'SPOTTER' && (
                                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                                            <div className="grid grid-cols-3 gap-2 text-[10px]">
                                                {log.category && (
                                                    <div>
                                                        <span className="text-white/40">Category:</span>
                                                        <span className="ml-1 text-cyan-400 font-semibold">{log.category}</span>
                                                    </div>
                                                )}
                                                {log.cvss_score !== undefined && (
                                                    <div>
                                                        <span className="text-white/40">CVSS:</span>
                                                        <span className={`ml-1 font-bold ${getCVSSColor(log.cvss_score)}`}>
                                                            {log.cvss_score.toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                                {log.mitre_id && (
                                                    <div>
                                                        <span className="text-white/40">MITRE:</span>
                                                        <a
                                                            href={`https://attack.mitre.org/techniques/${log.mitre_id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-1 text-purple-400 hover:text-purple-300 underline transition-colors"
                                                        >
                                                            {log.mitre_id}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Remediation */}
                                            {log.remediation && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => toggleRemediation(idx)}
                                                        className="text-[10px] text-white/60 hover:text-cyan-400 flex items-center gap-1 transition-colors font-semibold"
                                                    >
                                                        <span>{expandedRemediations.has(idx) ? '▼' : '▶'}</span>
                                                        <span>Remediation Plan</span>
                                                    </button>

                                                    {expandedRemediations.has(idx) && (
                                                        <div className="mt-2 pl-4 border-l-2 border-cyan-500/40 space-y-1">
                                                            <p className="text-[10px] text-cyan-400">
                                                                {log.remediation.mitre_name}
                                                            </p>
                                                            <ul className="space-y-1">
                                                                {log.remediation.steps.map((step, i) => (
                                                                    <li key={i} className="text-[10px] text-white/50 flex gap-2">
                                                                        <span className="text-cyan-500/60 font-bold">{i + 1}.</span>
                                                                        <span>{step}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default ExecutionLog;
