import React from 'react';

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
      const lastReload = window.sessionStorage.getItem('last_chunk_eb_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        window.sessionStorage.setItem('last_chunk_eb_reload', String(now));
        window.location.reload();
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
              Səhifə yüklənərkən xəta baş verdi
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Məlumatların göstərilməsi zamanı gözlənilməz texniki xəta qeydə alındı. Ana səhifəyə qayıtmaqla və ya səhifəni yeniləməklə davam edə bilərsiniz.
            </p>
            {errorMsg && (
              <div className="mb-5 p-2.5 rounded bg-rose-50 text-rose-700 text-[11px] font-mono text-left max-h-36 overflow-auto border border-rose-200">
                <div className="font-bold mb-1">{errorMsg}</div>
                {errorStack && <div className="text-[10px] opacity-75 whitespace-pre-wrap">{errorStack}</div>}
              </div>
            )}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                Yenidən Yüklə
              </button>
              <button
                onClick={this.handleCleanReset}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary/90 transition-all cursor-pointer shadow-sm"
              >
                Keşi Təmizlə & Yenilə
              </button>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/';
                }}
                className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-container transition-all"
              >
                Ana Səhifə
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
