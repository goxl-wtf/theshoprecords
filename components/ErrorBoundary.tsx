// This is a Client Component
'use client';

import React, { ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1 style={{ color: "red", marginBottom: "1rem" }}>Something went wrong</h1>
          <p>The application encountered an error.</p>
          <pre style={{ backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "0.5rem", textAlign: "left", marginTop: "1rem" }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ 
              marginTop: "1rem", 
              backgroundColor: "#4F46E5", 
              color: "white", 
              padding: "0.5rem 1rem", 
              borderRadius: "0.25rem", 
              border: "none", 
              cursor: "pointer" 
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 