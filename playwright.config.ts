import { defineConfig, devices } from '@playwright/test';

const PORT: number = 4321;

/** E2E-Smoke-Tests gegen den Dev-Server (`npm run e2e`). Eigener Port, damit ein laufendes `ng serve` nicht stört. */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx ng serve --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
