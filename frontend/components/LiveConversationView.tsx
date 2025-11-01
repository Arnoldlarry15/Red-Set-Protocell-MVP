import React, { useState, FC, useRef, useEffect } from 'react';
import { postSniper, postSpotter } from '../apiClient';

// --- TYPE DEFINITIONS ---
interface TranscriptMessage {
    id: number;
    speaker: 'user' | 'model' | 'system';
    text: string;
}

export const LiveConversationView: FC = () => {
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userInput, setUserInput] = useState<string>('');
    const [spotterSuggestion, setSpotterSuggestion] = useState<string>('');
    const [sessionId, setSessionId] = useState<string | null>(null);

    const transcriptEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        setError(null);
        setIsLoading(true);
        const userMessage = userInput;
        setTranscript(prev => [...prev, { id: Date.now(), speaker: 'user', text: userMessage }]);
        setUserInput('');
        setSpotterSuggestion('Analyzing turn...');

        try {
            // Step 1: Call sniper to get the model's response.
            const sniperResult = await postSniper(userMessage, 1, 'gemini-2.5-flash');
            if (!sniperResult.round_responses || sniperResult.round_responses.length === 0) {
                throw new Error("Backend returned no responses.");
            }
            const modelResponseText = sniperResult.round_responses[0].text;
            const currentSessionId = sniperResult.session_id;

            // Update session ID for subsequent turns if it's the first message.
            if (!sessionId) {
                setSessionId(currentSessionId);
            }
            
            // Add model response to transcript
            setTranscript(prev => [...prev, { id: Date.now() + 1, speaker: 'model', text: modelResponseText }]);

            // Step 2: Call spotter to analyze the model's response.
            const spotterResult = await postSpotter(currentSessionId, modelResponseText);
            const analysis = `Score: ${spotterResult.score} | Labels: ${spotterResult.labels.join(', ') || 'none'}\n\n${spotterResult.comments}`;
            setSpotterSuggestion(analysis);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get response: ${errorMessage}`);
            setTranscript(prev => [...prev, { id: Date.now() + 2, speaker: 'system', text: `Error: ${errorMessage}` }]);
            setSpotterSuggestion('Analysis failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="live-grid">
            <section className="panel live-transcript-panel">
                <div className="panel-header">
                    <h1 className="panel-title">Live Conversation</h1>
                </div>
                <div className="live-transcript-container">
                    {transcript.map(msg => (
                        <div key={msg.id} className={`transcript-message ${msg.speaker}`}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{msg.text}</pre>
                        </div>
                    ))}
                    <div ref={transcriptEndRef} />
                </div>
                <form className="message-input-form" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={isLoading ? "Waiting for response..." : "Type your message here..."}
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button type="submit" className="button primary" disabled={isLoading || !userInput.trim()}>
                        {isLoading ? <div className="spinner"></div> : 'Send'}
                    </button>
                </form>
            </section>
            <section className="panel live-controls-panel">
                <div className="panel-header">
                    <h1 className="panel-title">Spotter Co-pilot</h1>
                </div>
                {error && <div className="error-message" role="alert" style={{ marginBottom: '1rem' }}>{error}</div>}
                <div className="copilot-suggestion">
                    <h3>Analysis</h3>
                    <p>{spotterSuggestion || 'Analysis of the model\'s last response will appear here.'}</p>
                </div>
                <div className="disclaimer" style={{ marginTop: 'var(--section-gap)' }}>
                    <h3>Live Conversation Mode</h3>
                    <p>
                        This mode sends each message to the backend for a single-round attack and analysis. Your conversation history is maintained for the session.
                    </p>
                </div>

                <style>{`
                    .message-input-form {
                        display: flex;
                        gap: 0.5rem;
                        padding-top: 1rem;
                        border-top: 1px solid var(--border-color);
                    }
                    .message-input-form input {
                        flex-grow: 1;
                    }
                     .transcript-message pre {
                        font-family: var(--font-family-sans) !important;
                    }
                `}</style>
            </section>
        </div>
    );
};
