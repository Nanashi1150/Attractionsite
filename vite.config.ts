import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { productionContentSecurityPolicy, responseSecurityHeaders } from './config/security.mjs'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id, importer) {
      // Figma exports can include a package version in import specifiers.
      if (/^[^./].+@\d/.test(id)) {
        return this.resolve(id.replace(/@\d[^/]*(?=\/|$)/, ''), importer, { skipSelf: true })
      }
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    {
      name: 'production-content-security-policy',
      apply: 'build',
      transformIndexHtml() {
        return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: productionContentSecurityPolicy }, injectTo: 'head-prepend' }]
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    strictPort: true,
    cors: false,
    headers: responseSecurityHeaders,
    fs: {
      strict: true,
      allow: [path.resolve(__dirname)],
      deny: ['**/.env', '**/.env.*', '**/*.{crt,pem,key}', '**/.git/**', '**/reference/photos/**', '**/.test-output/**', '**/.npm-cache/**'],
    },
  },
  preview: { host: '127.0.0.1', strictPort: true, headers: responseSecurityHeaders },
  resolve: {
    alias: {
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
