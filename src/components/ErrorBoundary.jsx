import { Component } from "react";
import { logger } from "../services/logger";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected application error" };
  }

  componentDidCatch(error, info) {
    logger.error("React render error", {
      error: error?.message,
      stack: error?.stack,
      componentStack: info?.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-content-center bg-medical-bg px-4 text-center">
          <section className="card max-w-lg p-8">
            <h1 className="text-2xl font-bold text-medical-900">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-600">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-5"
            >
              Reload App
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
