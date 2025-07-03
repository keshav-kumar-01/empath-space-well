
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { ThemeProvider } from 'next-themes'

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  // Preload fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap';
  fontLink.as = 'style';
  fontLink.onload = () => {
    fontLink.rel = 'stylesheet';
  };
  document.head.appendChild(fontLink);
  
  // Add DNS prefetch for external resources
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = 'https://fonts.googleapis.com';
  document.head.appendChild(dnsPrefetch);
};

// Initialize performance optimizations
preloadCriticalResources();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={true}
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
