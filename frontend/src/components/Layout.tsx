import React from 'react';
import logo from '../assets/logo.png';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
                <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Red Set Protocell" className="h-32 w-auto" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-white/60">OPERATIONAL</span>
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
