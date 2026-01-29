import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'
import vike from 'vike/plugin'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      ...copy({
        targets: [
          { src: 'routes.json', dest: '../Hannastiina_Node/build/dist' },
        ],
        hook: 'writeBundle', // run the plugin after all the files are bundled and written to disk
      }),
      enforce: 'post', // run the plugin after all the other plugins
    },
    vike(),
  ],
  server: {
    host: true,
  },
  base: '/',
  build: {
    emptyOutDir: true,
    // Build directly into the Node server's runtime folder
    outDir: '../Hannastiina_Node/build/dist',
    chunkSizeWarningLimit: 500,
  },
  ssr: {
    // Dev SSR: bundle only problematic deps if needed.
    // Build/prerender: bundle everything because output lives outside Hannastiina_React,
    // and Node won't resolve Hannastiina_React/node_modules from ../Hannastiina_Node/build/dist/server.
    noExternal: command === 'build' ? true : ['react-helmet-async'],
  },
}))
