import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable source maps in production so original TypeScript source can't be
    // reconstructed in Chrome DevTools → Sources. Keep them in dev for debugging.
    sourcemap: mode === 'development',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-toast'],
          router: ['react-router-dom'],
          i18n: ['react-i18next', 'i18next'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    // Strip console.* and debugger statements from production bundles.
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
  css: {
    devSourcemap: true,
  },
}));
