import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      ...copy({
        targets: [
          { src: './dist/*', dest: '../Hannastiina_Node/build/dist' },
          { src: 'routes.json', dest: '../Hannastiina_Node/build/dist' },
        ],
        hook: 'writeBundle', // run the plugin after all the files are bundled and written to disk
      }),
      enforce: 'post', // run the plugin after all the other plugins
    },
  ],
  server: {
    host: true,
  },
  base: '/',
})
