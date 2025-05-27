import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({  base: '/3dvoronoi/', // Set base for GitHub Pages deployment
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: '3D Voronoi',
        short_name: '3D Voronoi',
        description: '3D Voronoi diagram visualization with glass-like appearance',
        theme_color: '#242424',
        background_color: '#242424',
        display: 'standalone',
        start_url: '/%REPLACE_ME%/',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
})
