"use client";
import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-3">
              Something went wrong
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              {this.state.error?.message ?? "An unexpected error occurred while loading your audit results."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
