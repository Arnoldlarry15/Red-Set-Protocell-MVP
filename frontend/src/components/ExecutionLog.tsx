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
            case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/30';
            case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
            case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
            case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/30';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    const getCVSSColor = (score?: number) => {
        if (!score) return 'text-white/40';
        if (score >= 9.0) return 'text-red-500';
        if (score >= 7.0) return 'text-orange-500';
        if (score >= 4.0) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full flex flex-col shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-sm font-bold font-mono text-white/90 uppercase tracking-wider">Execution Log</h2>
                <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span>LIVE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
                {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-white/20 text-xs">
                        <p>Waiting for session to start...</p>
                    </div>
                ) : (
                    logs.map((log, idx) => (
                        <div key={idx} className="group">
                            {/* Message */}
                            <div className={`p-4 rounded-lg border transition-all ${log.role === 'SNIPER'
                                    ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                                    : log.role === 'SPOTTER'
                                        ? 'bg-white/5 border-white/10 hover:border-white/20'
                                        : 'bg-white/[0.02] border-white/5'
                                }`}>
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold ${log.role === 'SNIPER' ? 'text-red-500' :
                                                log.role === 'SPOTTER' ? 'text-white' :
                                                    'text-white/60'
                                            }`}>{log.role}</span>
                                        <span className="text-[10px] text-white/30">{log.timestamp}</span>
                                    </div>

                                    {log.risk && (
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(log.risk)}`}>
                                            {log.risk}
                                        </div>
                                    )}
                                </div>

                                <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">
                                    {log.message}
                                </p>

                                {/* SPOTTER Analysis */}
                                {log.role === 'SPOTTER' && (
                                    <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                                            {log.category && (
                                                <div>
                                                    <span className="text-white/40">Category:</span>
                                                    <span className="ml-1 text-white/80">{log.category}</span>
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
                                                        className="ml-1 text-red-500 hover:text-red-400 underline"
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
                                                    className="text-[10px] text-white/60 hover:text-white/90 flex items-center gap-1 transition-colors"
                                                >
                                                    <span>{expandedRemediations.has(idx) ? '▼' : '▶'}</span>
                                                    <span>Remediation Plan</span>
                                                </button>

                                                {expandedRemediations.has(idx) && (
                                                    <div className="mt-2 pl-4 border-l-2 border-red-500/30 space-y-1">
                                                        <p className="text-[10px] text-white/60">
                                                            {log.remediation.mitre_name}
                                                        </p>
                                                        <ul className="space-y-1">
                                                            {log.remediation.steps.map((step, i) => (
                                                                <li key={i} className="text-[10px] text-white/40 flex gap-2">
                                                                    <span className="text-red-500/60">{i + 1}.</span>
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
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default ExecutionLog;
