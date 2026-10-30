import { lazy } from 'react';

/**
 * Robust wrapper around React.lazy to handle chunk loading failures
 * caused by subsequent deployments (e.g. stale client hashes).
 */
export function lazyRetry(componentImport) {
  return lazy(async () => {
    const pageHasBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('monodoxia_page_force_refreshed') || 'false'
    );

    try {
      return await componentImport();
    } catch (error) {
      const errorMsg = error?.message || String(error || '');
      const isDynamicImportError =
        errorMsg.includes('Failed to fetch dynamically imported module') ||
        errorMsg.includes('Importing a module script failed') ||
        errorMsg.includes('dynamically imported module') ||
        errorMsg.includes('error loading dynamically imported module') ||
        error?.name === 'ChunkLoadError';

      if (isDynamicImportError && !pageHasBeenForceRefreshed) {
        window.sessionStorage.clear();
        window.sessionStorage.setItem('monodoxia_page_force_refreshed', 'true');
        window.location.href = window.location.pathname + '?_t=' + Date.now();
        return new Promise(() => {});
      }
      throw error;
    }
  });
}

