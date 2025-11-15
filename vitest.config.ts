import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'tests/',
        '**.config.**',
        '.next/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        'skills/',
        'src/app/**', // Exclude Next.js app directory (UI components)
        'src/components/**', // Exclude UI components for now
        'src/content/**' // Exclude content files
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
