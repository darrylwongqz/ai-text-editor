import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom', // emulates a browser environment
    globals: true, // allows you to use global test APIs like describe/it/expect
    setupFiles: './tests/setup.ts', // setup file for any global configuration
  },
});
