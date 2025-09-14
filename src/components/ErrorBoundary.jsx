import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // A more polished and helpful fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-50 dark:bg-red-900/20">
            <div className="w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900/50 rounded-full mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Something went wrong.</h1>
          <p className="text-red-600 dark:text-red-300 mb-6">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Refresh Page
          </Button>
          {this.state.error && (
            <details className="mt-6 text-xs text-red-700 dark:text-red-400 text-left bg-red-100 dark:bg-red-900/30 p-3 rounded-lg w-full max-w-2xl">
                <summary>Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap break-all">
                    {this.state.error.toString()}
                </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;