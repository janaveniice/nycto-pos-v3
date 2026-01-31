import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue(), VitePWA({
      registerType: 'autoUpdate', // ensures PWA is installable and updates automatically
      manifest: {
        name: 'Nycto POS',
        short_name: 'NyctoPOS',
        description: 'For Brenda and Nycto Studio',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/nycto-app-180x180.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: '/nycto-app-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      workbox: false 
    })],
})
