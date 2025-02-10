import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/expense_tracker/',
  optimizeDeps: {
    exclude: ['react-chartjs-2'],
    include: [
      'date-fns',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/icons-material',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux'
    ]
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  }
}) 