import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Temporary loading state while fetching translations
rootElement.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:grey;">Loading Culinary Assistant...</div>`;

async function main() {
  try {
    const [enRes, trRes] = await Promise.all([
      fetch('./locales/en.json'),
      fetch('./locales/tr.json')
    ]);

    if (!enRes.ok || !trRes.ok) {
        throw new Error('Failed to load translation files.');
    }

    const en = await enRes.json();
    const tr = await trRes.json();
    const translations = { en, tr };

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <LanguageProvider translations={translations}>
          <App />
        </LanguageProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to initialize the app:", error);
    rootElement.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:red;">Error loading application. Please check the console.</div>`;
  }
}

main();
