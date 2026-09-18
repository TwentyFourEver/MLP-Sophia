import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  workers: 2,
  timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:5174', channel: 'msedge', headless: true, trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev -- --port 5174 --strictPort', url: 'http://127.0.0.1:5174', reuseExistingServer: !process.env.CI },
});
