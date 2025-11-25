import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

const LoginPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(password);
        if (!success) {
            setError('ACCESS DENIED: Invalid Credentials');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-red/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-blue/10 rounded-full blur-[100px] animate-pulse delay-1000" />

            <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-black tracking-tighter mb-0 glitch-text text-white" data-text="RED SET">
                        RED SET
                    </h1>
                    <h2 className="text-3xl font-bold font-mono text-neon-red tracking-widest mb-2">
                        PROTOCELL
                    </h2>
                    <p className="text-xs font-mono text-secondary-blue tracking-[0.5em] uppercase">
                        Access Control
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                            Security Clearance Code
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue transition-all placeholder-white/20"
                            placeholder="ENTER PASSWORD"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-primary-red text-xs font-mono bg-primary-red/10 border border-primary-red/20 p-2 rounded text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-secondary-blue/10 hover:bg-secondary-blue/20 border border-secondary-blue/50 text-secondary-blue font-mono font-bold py-3 rounded transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] uppercase tracking-widest"
                    >
                        Authenticate
                    </button>
                </form>

                <div className="mt-8 pt-4 border-t border-white/5 text-center">
                    <p className="text-[10px] font-mono text-white/30">
                        UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
                        <br />
                        SYSTEM ID: RSP-PROTOCELL-V2
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
