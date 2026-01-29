import type { Config } from 'vike/types'

export default {
  // Enable SSG for all pages
  prerender: true,

  route: '*',

  // Client-side routing
  clientRouting: true,

  hydrationCanBeAborted: true,

  // Keep a consistent hook surface for future SSR props
  passToClient: ['pageProps'],

  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
  },
} satisfies Config
