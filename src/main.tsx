
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { ThemeProvider } from 'next-themes'

// Create a helmet context to ensure proper initialization
const helmetContext = {};

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  // Preload fonts with better performance
  const fontDisplay = document.createElement('link');
  fontDisplay.rel = 'preload';
  fontDisplay.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap';
  fontDisplay.as = 'style';
  fontDisplay.crossOrigin = 'anonymous';
  document.head.appendChild(fontDisplay);
  
  // Add proper font loading
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap';
  fontLink.media = 'print';
  fontLink.onload = () => {
    fontLink.media = 'all';
  };
  document.head.appendChild(fontLink);
  
  // Add DNS prefetch for external resources
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = 'https://fonts.googleapis.com';
  document.head.appendChild(dnsPrefetch);
  
  // Preconnect to external domains
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);
};

// Initialize performance optimizations
preloadCriticalResources();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange={true}
      >
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
