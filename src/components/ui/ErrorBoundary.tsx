"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Engine Crash Caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 bg-deep-black flex items-center justify-center -z-20">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/10 via-transparent to-deep-black" />
          <div className="absolute inset-0 css-grid-bg opacity-20" />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
