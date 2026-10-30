import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Automatically handle stale chunks after deployments
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = window.sessionStorage.getItem('last_vite_preload_reload');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    window.sessionStorage.setItem('last_vite_preload_reload', String(now));
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

