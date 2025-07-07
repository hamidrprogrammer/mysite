import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import global styles
import './styles/global.css';
import './styles/reset.css';
import './styles/radiance.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log to confirm script execution
console.log("Vite + React + TypeScript project is running via main.tsx, rendering App component!");
