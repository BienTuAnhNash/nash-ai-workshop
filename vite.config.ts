import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [tanstackRouter(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'tests/components/**/*.test.ts',
      'tests/components/**/*.test.tsx',
      'tests/components/**/*.spec.ts',
      'tests/components/**/*.spec.tsx',
      'tests/unit/**/*.test.ts',
      'tests/unit/**/*.test.tsx',
      'tests/unit/**/*.spec.ts',
      'tests/unit/**/*.spec.tsx',
    ],
    exclude: ['e2e/**', 'tests/e2e/**'],
  },
})
