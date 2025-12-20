import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for a plain JavaScript React application.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
