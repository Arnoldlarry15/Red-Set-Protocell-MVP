import React, { useState, FC, useCallback } from 'react';
import { postSniper, postSpotter } from '../apiClient';
import { ATTACK_CATEGORIES, attackCategoryNames } from '../constants';

// This is the data structure for a fully processed log entry shown in the UI.
// It combines user input, sniper results, and spotter results.
interface CombinedAttackLog {
    id: string;
    round: number;
    attackCategory: string;
    targetModel: string;
    sniperPrompt: string;
    targetResponse: string;
    spotterAnalysis: string;
}


const LogEntry: FC<{ log: CombinedAttackLog }> = React.memo(({ log }) => {
    return (
        <details className="log-entry" open>
            <summary>
                <span>Round {log.round} - {attackCategoryNames[log.attackCategory as keyof typeof attackCategoryNames] || log.attackCategory}</span>
                <div className="log-meta">
                    <span>Target: {log.targetModel}</span>
                </div>
            </summary>
            <div className="log-entry-content">
                <div className="log-section">
                    <h3 className="sniper">Sniper Prompt</h3>
                    <pre>{log.sniperPrompt}</pre>
                </div>
                <div className="log-section">
                    <h3 className="target">Target Response</h3>
                    <pre>{log.targetResponse}</pre>
                </div>
                <div className="log-section">
                    <h3 className="spotter">Spotter Analysis</h3>
                    <pre>{log.spotterAnalysis}</pre>
                </div>
            </div>
        </details>
    );
});


export const AutomatedAttackView: FC = () => {
    const [attackCategory, setAttackCategory] = useState<string>('misinformation');
    const [seedPrompt, setSeedPrompt] = useState<string>(ATTACK_CATEGORIES['misinformation']);
    const [attackLogs, setAttackLogs] = useState<CombinedAttackLog[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [targetModel, setTargetModel] = useState<string>('gemini-2.5-flash');
    const [numRounds, setNumRounds] = useState<number>(5);

    const resetState = useCallback(() => {
        setError(null);
        setSuccessMessage(null);
        setAttackLogs([]);
    }, []);
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setAttackCategory(newCategory);
        setSeedPrompt(ATTACK_CATEGORIES[newCategory as keyof typeof ATTACK_CATEGORIES] || '');
    };

    const handleAttack = async (rounds: number) => {
        if (!seedPrompt.trim()) {
            setError('Seed prompt cannot be empty.');
            return;
        }

        setIsLoading(true);
        resetState();
        
        try {
            // Step 1: Call the sniper endpoint to run the attack rounds.
            const sniperResult = await postSniper(seedPrompt, rounds, targetModel);
            
            // Step 2: For each round's response, call the spotter endpoint for analysis.
            const spotterPromises = sniperResult.round_responses.map(response => 
                postSpotter(sniperResult.session_id, response.text)
            );
            const spotterResults = await Promise.all(spotterPromises);

            // Step 3: Combine the results into a single log structure for the UI.
            const combinedLogs: CombinedAttackLog[] = sniperResult.round_responses.map((roundResponse, index) => {
                const spotterData = spotterResults[index];
                const sniperPromptForDisplay = roundResponse.round === 1
                    ? seedPrompt
                    : `[Evolved prompt for Round ${roundResponse.round} - not returned from backend]`;
                
                return {
                    id: `${sniperResult.session_id}-${roundResponse.round}`,
                    round: roundResponse.round,
                    attackCategory,
                    targetModel,
                    sniperPrompt: sniperPromptForDisplay,
                    targetResponse: roundResponse.text,
                    spotterAnalysis: `Score: ${spotterData.score}\nLabels: ${spotterData.labels.join(', ')}\n\nComments:\n${spotterData.comments}`,
                };
            });

            setAttackLogs(combinedLogs.sort((a, b) => b.round - a.round)); // Newest first
            setSuccessMessage(`Attack complete. ${combinedLogs.length} rounds logged and analyzed.`);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Attack failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const exportLogs = () => {
        if (attackLogs.length === 0) {
            setError("No logs to export.");
            return;
        }

        const headers = ["Round", "Category", "Target Model", "Sniper Prompt", "Target Response", "Spotter Analysis"];
        const csvRows = [headers.join(',')];

        // Sort logs by round ascending for export
        const sortedLogs = [...attackLogs].sort((a, b) => a.round - b.round);

        sortedLogs.forEach(log => {
            const values = [
                log.round,
                log.attackCategory,
                log.targetModel,
                `"${log.sniperPrompt.replace(/"/g, '""')}"`,
                `"${log.targetResponse.replace(/"/g, '""')}"`,
                `"${log.spotterAnalysis.replace(/"/g, '""')}"`,
            ];
            csvRows.push(values.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `red-set-protocell-logs-${new Date().toISOString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setSuccessMessage("Logs exported successfully.");
    };

    return (
        <div className="main-grid">
            <section className="panel sniper-console-panel">
                 <div className="panel-header">
                    <h1 className="panel-title">Sniper Console</h1>
                </div>
                 <div className="sniper-console-content">
                    <fieldset disabled={isLoading}>
                        <legend>Attack Configuration</legend>
                        <div className="form-group">
                            <label htmlFor="attack-category">Attack Category</label>
                            <select id="attack-category" value={attackCategory} onChange={handleCategoryChange}>
                                {Object.entries(attackCategoryNames).map(([key, name]) => (
                                    <option key={key} value={key}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="seed-prompt">Seed Prompt / Initial Strategy</label>
                            <textarea
                                id="seed-prompt"
                                value={seedPrompt}
                                onChange={(e) => setSeedPrompt(e.target.value)}
                                placeholder="Enter your initial attack strategy here..."
                            />
                        </div>
                         <div className="form-group">
                            <label htmlFor="target-model">Target Model</label>
                             <select id="target-model" value={targetModel} onChange={(e) => setTargetModel(e.target.value)}>
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                            </select>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Execution</legend>
                         <div className="status-dashboard">
                            <div className="status-item">
                                <span className="status-item-label">Status</span>
                                <span className="status-item-value">{isLoading ? `ATTACKING...` : 'IDLE'}</span>
                            </div>
                            <div className="status-item">
                                <span className="status-item-label">Rounds</span>
                                <span className="status-item-value">{attackLogs.length}</span>
                             </div>
                             <div className="status-item">
                                <span className="status-item-label">Mode</span>
                                <span className="status-item-value">BACKEND</span>
                            </div>
                        </div>
                         <div className="form-group-inline">
                             <div className="form-group">
                                <label htmlFor="num-rounds">Evolving Rounds</label>
                                 <input
                                     type="number"
                                     id="num-rounds"
                                     value={numRounds}
                                     onChange={(e) => setNumRounds(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                     min="1"
                                     disabled={isLoading}
                                 />
                             </div>
                             <button className="button primary" onClick={() => handleAttack(numRounds)} disabled={isLoading}>
                                 {isLoading ? <div className="spinner"></div> : null}
                                 Start Evolving Attack
                             </button>
                        </div>

                         <div className="button-group">
                              <button className="button secondary" onClick={() => handleAttack(1)} disabled={isLoading}>
                                 Launch Single Attack
                            </button>
                        </div>
                    </fieldset>
                    
                    {error && <div className="error-message" role="alert">{error}</div>}
                    {successMessage && <div className="success-message" role="status">{successMessage}</div>}

                    <div className="disclaimer">
                        <h3>Disclaimer</h3>
                        <p>This tool is for authorized security research only. Do not use for malicious purposes. The backend server will incur API costs.</p>
                    </div>
                </div>
            </section>
            <section className="panel spotter-feed-panel">
                <div className="panel-header">
                    <h1 className="panel-title">Spotter Feed</h1>
                    <button className="button-small" onClick={exportLogs} disabled={attackLogs.length === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Export Logs
                    </button>
                </div>
                 <div className="logs-container">
                     {attackLogs.length > 0 ? (
                        attackLogs.map(log => <LogEntry key={log.id} log={log} />)
                     ) : (
                         <div style={{textAlign: 'center', color: 'var(--text-secondary-color)', marginTop: '2rem'}}>
                            {isLoading ? <div className="spinner" style={{margin: '0 auto', width: 32, height: 32}}></div> : <p>Attack logs will appear here after execution.</p>}
                         </div>
                     )}
                </div>
            </section>
        </div>
    );
};
