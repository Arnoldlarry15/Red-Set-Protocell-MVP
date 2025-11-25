import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ConfigurationPanel from './components/ConfigurationPanel';
import ExecutionLog from './components/ExecutionLog';
import ParetoChart from './components/ParetoChart';
import { AuthProvider, useAuth } from './context/AuthProvider';
import LoginPage from './components/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';

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
  analysis?: string;
  metrics?: {
    toxicity: number;
    bias: number;
  };
}

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/logs/${sessionId}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
        }
      } catch (e) {
        console.error("Failed to fetch logs", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, isAuthenticated]);

  const handleStart = async (prompt: string, strategy: string, model: string, apiKey: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt, strategy, model, api_key: apiKey }),
      });
      const data = await res.json();
      if (data.session_id) {
        setSessionId(data.session_id);
        setLogs([]);
      }
    } catch (e) {
      console.error("Failed to start session", e);
    }
  };

  const handleStop = async () => {
    if (!sessionId) return;
    try {
      await fetch(`http://localhost:5000/api/stop/${sessionId}`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error("Failed to stop session", e);
    }
  };

  const handleReset = () => {
    setSessionId(null);
    setLogs([]);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-500 font-mono">LOADING SYSTEM...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <ConfigurationPanel
            onStart={handleStart}
            onStop={handleStop}
            onReset={handleReset}
            isRunning={!!sessionId}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          {/* Execution Log */}
          <div className="h-[550px]">
            <ExecutionLog logs={logs} sessionId={sessionId} />
          </div>

          {/* Pareto Chart - Taller */}
          <div className="h-[500px]">
            <ParetoChart />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
