'use client';

import React from 'react';
import { isAPIError, isAuthError, isValidationError } from '@/utils/errors';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  private getErrorMessage(error: Error): string {
    if (isAPIError(error)) {
      return `Service Error: ${error.message} (Status: ${error.status})`;
    }
    if (isAuthError(error)) {
      return 'Authentication Error: Please sign in again';
    }
    if (isValidationError(error)) {
      return `Validation Error: ${error.message}`;
    }
    return 'An unexpected error occurred';
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
            <div className="text-red-600 text-xl mb-4">
              {this.state.error && this.getErrorMessage(this.state.error)}
            </div>
            <button
              onClick={this.handleRetry}
              className="btn-primary w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}