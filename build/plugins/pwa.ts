import { VitePWA } from 'vite-plugin-pwa';

export default function setupVitePwa() {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['logo.svg'],
    manifest: {
      name: 'editorTemplate',
      short_name: 'editor-template',
      theme_color: '#000',
      icons: [
        {
          src: '/logo.svg',
          sizes: '192x192',
          type: 'image/svg'
        },
        {
          src: '/logo.svg',
          sizes: '512x512',
          type: 'image/svg'
        },
        {
          src: '/logo.svg',
          sizes: '512x512',
          type: 'image/svg',
          purpose: 'any maskable'
        }
      ]
    }
  });
}
