import React, { useState, FC } from 'react';
import { createRoot } from 'react-dom/client';
import { AutomatedAttackView } from './frontend/components/AutomatedAttackView';
import { LiveConversationView } from './frontend/components/LiveConversationView';
import { appStyles } from './frontend/styles';

const App: FC = () => {
    const [mode, setMode] = useState<'automated' | 'live'>('automated');

    return (
        <>
            <style>{appStyles}</style>
            <main className="app-container">
                <div className="mode-selector">
                    <button
                        className={`mode-button ${mode === 'automated' ? 'active' : ''}`}
                        onClick={() => setMode('automated')}
                        aria-pressed={mode === 'automated'}
                    >
                        Automated Attack
                    </button>
                    <button
                        className={`mode-button ${mode === 'live' ? 'active' : ''}`}
                        onClick={() => setMode('live')}
                        aria-pressed={mode === 'live'}
                    >
                        Live Conversation
                    </button>
                </div>

                {mode === 'automated' ? <AutomatedAttackView /> : <LiveConversationView />}
            </main>
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
