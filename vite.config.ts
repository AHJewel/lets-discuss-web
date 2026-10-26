import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['lets-discuss.localhost'],
    // Browser reaches Vite through nginx on :80
    hmr: { host: 'lets-discuss.localhost', clientPort: 80 },
    // Windows bind mounts do not deliver inotify events into the container
    watch: { usePolling: true, interval: 300 },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
