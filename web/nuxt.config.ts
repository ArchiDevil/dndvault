// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  pinia: {
    storesDirs: ['app/stores/**'],
  },
  compatibilityDate: '2025-12-21',
  runtimeConfig: {
    backendAddress: 'http://directus:8055',
  },
})
