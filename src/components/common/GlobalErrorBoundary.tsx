import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-8">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-2xl w-full">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                        <p className="text-slate-400 mb-6">The dashboard encountered a critical error and could not load.</p>

                        <div className="bg-black/50 rounded-lg p-4 mb-6 overflow-auto max-h-64 border border-white/5">
                            <code className="text-red-400 font-mono text-sm block mb-2">
                                {this.state.error && this.state.error.toString()}
                            </code>
                            {this.state.errorInfo && (
                                <pre className="text-slate-500 text-xs">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Reload Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
