import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: config({ path: '.env' }).parsed,
  },
  resolve: {
    alias: {
      '@': './src',
      '@posts': './src/posts',
      '@auth': './src/auth',
      '@profiles': './src/profiles',
      '@shared': './src/shared',
    },
  },
});
