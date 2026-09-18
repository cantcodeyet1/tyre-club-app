import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      'http://localhost:4000/api',
    ),
    'import.meta.env.VITE_USE_MOCK_API': JSON.stringify('true'),
  },
  test: {
    css: true,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setupTests.ts',
  },
});
