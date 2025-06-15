
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { ThemeProvider } from 'next-themes'

// Optimize root rendering
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
