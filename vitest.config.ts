
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts', './tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/setup.ts', 'tests/setup.ts']
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/**/*.{test,spec}.{js,ts}'],
    testTimeout: 30000, // Increased timeout for DB operations in RLS tests
    hookTimeout: 60000, // 1 minute for setup/teardown in RLS tests
    // Run RLS tests sequentially to avoid conflicts with shared test users
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: process.env.NODE_ENV === 'test'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
