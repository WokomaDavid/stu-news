import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // This is where you add rollupOptions
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          framer: ['framer-motion'],
          tailwind: ['tailwindcss'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Optional: increase chunk size warning limit
  },
});

