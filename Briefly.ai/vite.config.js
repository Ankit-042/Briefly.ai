import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { crx } from '@crxjs/vite-plugin'
// Move your manifest.json to the ROOT folder (next to this file)
import manifest from './manifest.config.js' 

export default defineConfig({
  plugins: [
    tailwindcss(), // Tailwind v4 plugin handles content automatically
    react(),
    crx({ manifest }) 
  ],
  // Optional: If you want to raise the chunk limit for your AI libraries
  build: {
    chunkSizeWarningLimit: 1000,
  }
})