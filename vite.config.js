import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// Puerto donde corre tareas-api. Cámbialo si tu API usa otro.
const API = 'http://localhost:3000'
const proxy = { '/api': API, '/socket.io': { target: API, ws: true } }

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tareas',
        short_name: 'Tareas',
        description: 'Gestor de tareas que consume tareas-api',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#faf5ff',
        theme_color: '#7c3aed',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/socket\.io/],
        runtimeCaching: [
          {
            // Solo se cachea la LECTURA de la lista; nunca POST/PUT/DELETE.
            urlPattern: ({ url, request }) =>
              request.method === 'GET' && url.pathname === '/api/tareas',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-tareas',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [200] }
            }
          }
        ]
      }
    })
  ],
  server: { proxy },
  preview: { proxy },
  test: { environment: 'node' }
})
