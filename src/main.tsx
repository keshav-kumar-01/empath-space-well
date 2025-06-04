
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { ThemeProvider } from 'next-themes'

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
