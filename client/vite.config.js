import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';


export default defineConfig(() => {
  return {
    define: {
        'process.env': process.env
    },
    build: {
      outDir: 'dist',
    },
    plugins: [react()],
  };
});