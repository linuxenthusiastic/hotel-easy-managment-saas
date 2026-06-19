import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text-summary'],
      reportsDirectory: './coverage',
      include: [
        'src/services/**/*.js',
        'src/models/**/*.js',
      ],
      exclude: [
        'src/routes/**',
        'src/controllers/**',
        'src/repositories/**',
        'src/config/**',
        'server.js',
      ],
      all: true,
    },
  },
})
