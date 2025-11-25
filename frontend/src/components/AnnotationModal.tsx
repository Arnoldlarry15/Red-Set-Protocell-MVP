import React, { useState, useEffect } from 'react';

interface AnnotationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (risk: string, category: string, attackMode: string, failureTarget: string, notes: string) => void;
    currentRisk?: string;
    currentCategory?: string;
}

const AnnotationModal: React.FC<AnnotationModalProps> = ({ isOpen, onClose, onSave, currentRisk, currentCategory }) => {
    const [risk, setRisk] = useState(currentRisk || 'SAFE');
    const [category, setCategory] = useState(currentCategory || 'None');
    const [attackMode, setAttackMode] = useState('Direct');
    const [failureTarget, setFailureTarget] = useState('General');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRisk(currentRisk || 'SAFE');
            setCategory(currentCategory || 'None');
            setAttackMode('Direct');
            setFailureTarget('General');
            setNotes('');
        }
    }, [isOpen, currentRisk, currentCategory]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(risk, category, attackMode, failureTarget, notes);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-bg-card border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple" />

                <h3 className="text-xl font-bold font-mono text-white mb-6 flex items-center gap-2">
                    <span className="text-neon-blue">///</span> ANNOTATE_LOG
                </h3>

                <div className="space-y-4">
                    {/* Risk Level */}
                    <div>
                        <label className="block text-xs font-mono text-text-muted uppercase mb-2">Risk Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRisk(r)}
                                    className={`text-xs font-mono py-2 rounded border transition-all ${risk === r
                                            ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                            : 'bg-bg-dark border-white/10 text-text-muted hover:border-white/30'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-mono text-text-muted uppercase mb-2">Category (ALERT Taxonomy)</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-bg-dark border border-white/10 rounded p-2 text-sm text-white font-mono focus:border-neon-blue focus:outline-none"
                        >
                            <option value="None">None</option>
                            <option value="Violence">Violence</option>
                            <option value="Hate Speech">Hate Speech</option>
                            <option value="Sexual Content">Sexual Content</option>
                            <option value="Self-Harm">Self-Harm</option>
                            <option value="PII/Privacy">PII/Privacy</option>
                            <option value="Malware/Hacking">Malware/Hacking</option>
                            <option value="Fraud/Deception">Fraud/Deception</option>
                            <option value="Political Misinfo">Political Misinfo</option>
                            <option value="Medical Misinfo">Medical Misinfo</option>
                        </select>
                    </div>

                    {/* Attack Mode (Adversarial Nibbler) */}
                    <div>
                        <label className="block text-xs font-mono text-text-muted uppercase mb-2">Attack Mode</label>
                        <select
                            value={attackMode}
                            onChange={(e) => setAttackMode(e.target.value)}
                            className="w-full bg-bg-dark border border-white/10 rounded p-2 text-sm text-white font-mono focus:border-neon-blue focus:outline-none"
                        >
                            <option value="Direct">Direct Question</option>
                            <option value="Jailbreak">Jailbreak / Roleplay</option>
                            <option value="Prompt Injection">Prompt Injection</option>
                            <option value="Obfuscation">Obfuscation (Base64, etc.)</option>
                            <option value="Multi-turn">Multi-turn / Context</option>
                        </select>
                    </div>

                    {/* Failure Target */}
                    <div>
                        <label className="block text-xs font-mono text-text-muted uppercase mb-2">Failure Target (Demographic/System)</label>
                        <input
                            type="text"
                            value={failureTarget}
                            onChange={(e) => setFailureTarget(e.target.value)}
                            className="w-full bg-bg-dark border border-white/10 rounded p-2 text-sm text-white font-mono focus:border-neon-blue focus:outline-none"
                            placeholder="e.g., General, Kids, Elderly, Linux System..."
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-mono text-text-muted uppercase mb-2">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-bg-dark border border-white/10 rounded p-2 text-sm text-white font-mono focus:border-neon-blue focus:outline-none h-24 resize-none"
                            placeholder="Add context or reasoning..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-xs font-mono text-text-muted hover:text-white transition-colors"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded bg-neon-blue/10 border border-neon-blue text-neon-blue text-xs font-mono font-bold hover:bg-neon-blue/20 transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                    >
                        SAVE_ANNOTATION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnotationModal;
