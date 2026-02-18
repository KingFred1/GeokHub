"use client";

import React from "react";

type Props = { children: React.ReactNode };

export default class ClientErrorBoundary extends React.Component<Props, { hasError: boolean; error?: Error | null }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error, info: any) {
    // Log full stack to console for debugging
    console.error("ClientErrorBoundary caught an error:", error, info);
    this.setState({ hasError: true, error });
  }

  componentDidMount() {
    // Global listeners to capture unhandled errors and rejections
    window.addEventListener("error", (e) => {
      try {
        console.error("Global error captured:", e.error || e.message, e);
      } catch (ex) {
        // no-op
      }
    });

    window.addEventListener("unhandledrejection", (e) => {
      try {
        console.error("Unhandled promise rejection:", e.reason);
      } catch (ex) {}
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Something went wrong rendering the page.</h2>
          <p>Check the browser console for the full error and stack trace.</p>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
