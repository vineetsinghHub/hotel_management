import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[Aura] error boundary caught:", error, info);
  }
  reset = () => {
    this.setState({ error: null });
  };
  reload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };
  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6" data-testid="error-boundary">
        <div className="max-w-md w-full text-center">
          <svg viewBox="0 0 200 160" className="w-48 h-32 mx-auto opacity-80" aria-hidden="true">
            <circle cx="100" cy="80" r="56" fill="none" stroke="#C9A227" strokeWidth="2.5" opacity="0.6" />
            <path d="M78 68 l44 24 M122 68 l-44 24" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
            <path d="M70 116 q30 -18 60 0" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <p className="text-eyebrow text-brand-accent mt-6">Something went sideways</p>
          <h2 className="mt-2 font-serif text-3xl text-slate-900">A gentle pause</h2>
          <p className="mt-3 text-sm text-slate-500">
            Our concierge has been notified. Try refreshing the page &mdash; we&rsquo;ll take you
            right back where you were.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={this.reset}
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm text-slate-700"
              data-testid="error-boundary-dismiss"
            >Dismiss</button>
            <button
              onClick={this.reload}
              className="px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]"
              data-testid="error-boundary-refresh"
            >
              <i className="fa-solid fa-rotate mr-1.5 text-[11px]"></i>Refresh page
            </button>
          </div>
          {process.env.NODE_ENV !== "production" && this.state.error?.message && (
            <pre className="mt-6 text-left text-[10px] text-slate-400 bg-slate-50 rounded-[12px] p-3 overflow-auto max-h-40 font-mono">
              {String(this.state.error.stack || this.state.error.message)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
