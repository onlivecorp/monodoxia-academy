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
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-primary mb-2">
              Səhifə yüklənərkən xəta baş verdi
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              Məlumatların göstərilməsi zamanı gözlənilməz texniki xəta qeydə alındı. Ana səhifəyə qayıtmaqla və ya səhifəni yeniləməklə davam edə bilərsiniz.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                Yenidən Yüklə
              </button>
              <a
                href="#"
                onClick={() => { window.location.hash = ''; window.location.reload(); }}
                className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-container transition-all"
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
