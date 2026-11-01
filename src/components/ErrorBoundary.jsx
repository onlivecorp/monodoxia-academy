import React from 'react';
import { translations } from '../i18n/locales';
import { DEFAULT_LANGUAGE } from '../i18n/languages';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    const msg = error?.message || String(error || '');
    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('dynamically imported module') ||
      msg.includes('error loading dynamically imported module') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError) {
      const alreadyReloaded = window.sessionStorage.getItem('chunk_eb_reloaded');
      if (!alreadyReloaded) {
        window.sessionStorage.clear();
        window.sessionStorage.setItem('chunk_eb_reloaded', '1');
        window.location.href = window.location.pathname + '?_t=' + Date.now();
      }
    }
  }

  handleReset = () => {
    try {
      sessionStorage.removeItem('monodoxia_page_force_refreshed');
      sessionStorage.removeItem('last_chunk_eb_reload');
      sessionStorage.removeItem('last_vite_preload_reload');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname + '?_t=' + Date.now();
  };

  handleCleanReset = () => {
    try {
      localStorage.removeItem('monodoxia_admin_events');
      localStorage.removeItem('monodoxia_admin_courses');
      localStorage.removeItem('monodoxia_admin_categories');
      localStorage.removeItem('monodoxia_admin_home_content');
      localStorage.removeItem('monodoxia_admin_roles');
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname + '?_t=' + Date.now();
  };

  t = (key) => {
    let lang = DEFAULT_LANGUAGE;
    try {
      lang = localStorage.getItem('monodoxia_lang') || DEFAULT_LANGUAGE;
    } catch (e) {}
    const dict = translations[lang] || translations[DEFAULT_LANGUAGE] || {};
    return dict[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || String(this.state.error || '');
      const errorStack = this.state.error?.stack || '';
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-primary mb-2">
              {this.t('error_boundary_title')}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              {this.t('error_boundary_desc')}
            </p>

            {/* Error detail accordion for diagnostics */}
            {errorMsg && (
              <details className="mb-6 text-left bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-[11px] text-slate-600 dark:text-slate-400">
                <summary className="font-semibold cursor-pointer select-none text-slate-700 dark:text-slate-300">
                  Xəta təfərrüatları (Diaqnostika)
                </summary>
                <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-950 rounded overflow-x-auto text-[10px] text-red-600 dark:text-red-400 whitespace-pre-wrap font-mono">
                  {errorMsg}
                  {errorStack && `\n\nStack:\n${errorStack.slice(0, 400)}...`}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>{this.t('error_boundary_reload')}</span>
              </button>
              <button
                onClick={this.handleCleanReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-outline text-on-surface text-xs font-medium hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Müvəqqəti keş məlumatlarını təmizləyərək yenidən aç"
              >
                <span className="material-symbols-outlined text-sm">cleaning_services</span>
                <span>{this.t('error_boundary_clean_reset')}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
