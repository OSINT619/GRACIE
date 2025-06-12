import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/GRACIE/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
  },
});
// This configuration sets up a Vite project with React, defines an alias for the src directory,
// and configures the build output directory. The base path is set based on the environment, and
// it excludes 'lucide-react' from dependency optimization.
