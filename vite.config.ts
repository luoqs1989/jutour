import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Base path is injected at CI build time so the app works when served from
// a GitHub Pages project subpath (e.g. https://<user>.github.io/jutour/).
// Locally it defaults to '/' so `npm run dev` works at the site root.
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
