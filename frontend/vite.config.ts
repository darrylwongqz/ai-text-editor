import { defineConfig, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom', // Use jsdom for browser emulation
    globals: true, // Expose globals like describe, it, expect, etc.
    setupFiles: './tests/setup.ts', // Setup file for global test configuration
  },
} as unknown as UserConfigExport);
