import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Monaco is by far the heaviest dependency in this app (the bulk of what made
        // the Editor page's bundle feel slow to load) — splitting it into its own
        // chunk means the browser can cache it separately from the rest of the app
        // code. Once a visitor has loaded the Editor once, later visits reuse the
        // cached Monaco chunk instead of re-downloading it every time the app's own
        // code changes.
        manualChunks: {
          monaco: ['monaco-editor', '@monaco-editor/react'],
          charts: ['recharts'],
        },
      },
    },
  },
});
