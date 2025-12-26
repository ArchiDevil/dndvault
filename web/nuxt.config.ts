// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  pinia: {
    storesDirs: ['app/stores/**'],
  },
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
      ],
      meta: [
        {property: 'og:locale', content: 'ru_RU'},
        {
          property: 'og:image',
          content: 'https://dndvault.ru/apple-touch-icon.png',
        },
      ],
    },
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
})
