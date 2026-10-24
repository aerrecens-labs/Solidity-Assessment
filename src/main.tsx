
// --- CRITICAL ERROR TRAP ---
// --- CRITICAL ERROR TRAP ---
window.onerror = function (msg, url, line, col, error) {
  // Ignore external script errors (common with third-party widgets like TradingView)
  if (typeof msg === 'string' && msg.toLowerCase().includes('script error')) {
    console.warn('suppressed critical error:', msg);
    return false;
  }

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="background:black; color:red; padding:20px; font-family:monospace; height:100vh;">
        <h1>CRITICAL STARTUP ERROR</h1>
        <p>${msg}</p>
        <p>${url}:${line}:${col}</p>
        <pre>${error?.stack}</pre>
      </div>
    `;
  }
};

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // <--- CHANGED: Removed ".tsx"
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import GlobalErrorBoundary from './components/common/GlobalErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
