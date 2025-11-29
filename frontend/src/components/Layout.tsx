import React from 'react';
import logo from '../assets/logo.png';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen text-white font-sans">
            {/* Header with Glassmorphism */}
            <header className="glass-panel relative z-10 border-b border-white/5 sticky top-0">
                <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Red Set Protocell" className="h-32 w-auto drop-shadow-2xl" />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold gradient-text tracking-tight">RED SET PROTOCELL</h1>
                            <p className="text-xs text-white/40 font-mono">AI Security Testing Platform</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 glow-purple">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-white/80">OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-[1800px] mx-auto px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
