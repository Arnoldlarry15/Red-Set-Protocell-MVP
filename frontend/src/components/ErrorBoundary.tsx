import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-red-500 font-mono p-8 overflow-auto">
                    <h1 className="text-4xl font-bold mb-4">SYSTEM FAILURE</h1>
                    <div className="border border-red-500/30 bg-red-500/10 p-4 rounded mb-4">
                        <h2 className="text-xl mb-2">Error Log:</h2>
                        <pre className="whitespace-pre-wrap text-sm">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    </div>
                    <div className="border border-white/10 bg-white/5 p-4 rounded">
                        <h2 className="text-xl mb-2 text-white">Stack Trace:</h2>
                        <pre className="whitespace-pre-wrap text-xs text-gray-400">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
