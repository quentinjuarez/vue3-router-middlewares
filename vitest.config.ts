import { defineConfig } from 'vitest/config';

// Two suites, two environments: the unit tests are pure functions and run in
// node, the integration test mounts a real app and needs a DOM.
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'jsdom',
          include: ['tests/integration/**/*.test.ts'],
          globals: true,
        },
      },
    ],
  },
});
