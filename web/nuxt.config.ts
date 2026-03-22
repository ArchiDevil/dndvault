// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/icon',
    'reka-ui/nuxt',
  ],
  compatibilityDate: '2025-12-21',
  runtimeConfig: {
    backendAddress: 'http://backend:8055',
    staticToken: '',
  },
  app: {
    head: {
      title: 'DnD Vault',
      htmlAttrs: {
        lang: 'ru',
      },
      script: [
        {
          src: 'https://stats.codecliffs.ru/script.js',
          defer: true,
          'data-website-id': 'a10ae2b7-497b-4b10-8b21-e2c1dac0bad3',
        },
      ],
      link: [
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
          href: '/fonts/Roboto.woff2',
          fetchpriority: 'low',
        },
      ],
      meta: [
        {property: 'og:locale', content: 'ru_RU'},
        {
          property: 'og:image',
          content: 'https://dndvault.ru/apple-touch-icon.png',
        },
      ],
    },
    buildAssetsDir: '/_vault/',
    rootId: '__vault',
  },
  robots: {
    disallow: ['/_vault/builds/meta/*'],
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/backgrounds',
      '/api/__sitemap__/books',
      '/api/__sitemap__/feats',
      '/api/__sitemap__/spells',
      '/api/__sitemap__/facilities',
    ],
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          container: {
            padding: '2rem',
            center: true,
          },
        },
        fontFamily: {
          sans: ['Roboto', 'sans-serif'],
        },
      },
    },
    cssPath: ['~/assets/css/styles.css', {injectPosition: 'first'}],
  },
  nitro: {
    serveStatic: false,
  },
  vite: {
    optimizeDeps: {
      include: ['marked', 'reka-ui'],
    },
  },
  routeRules: {
    '/spells/**': {swr: 3600},
    '/feats/**': {swr: 3600},
    '/backgrounds/**': {swr: 3600},
    '/facilities/**': {swr: 3600},

    '/magic-items': {robots: false, sitemap: false},
    '/monsters': {robots: false, sitemap: false},
    '/species': {robots: false, sitemap: false},
  },
})
