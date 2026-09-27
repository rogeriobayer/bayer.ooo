import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/app/**/*.{js,jsx,ts,tsx}'
      ],
      exclude: [
        'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
        'src/test/**',
        '**/*.config.*',
        '**/*.d.ts',
        '.next/**',
        '.open-next/**',
        'coverage/**',
        'node_modules/**',
        'src/app/globals.css',
        'src/app/favicon.ico',
        'src/app/layout.js',
        'src/app/page.js',
        'src/app/**/page.js'
      ],
      thresholds: {
        branches: 9,
        functions: 15,
        lines: 15,
        statements: 15
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
