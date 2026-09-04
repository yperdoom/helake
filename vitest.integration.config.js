import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// Separate config so the fast unit suite never pays for booting a real mongod.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['test/integration/**/*.test.js'],
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.js'],
    testTimeout: 30000,
    hookTimeout: 300000,
  },
});
