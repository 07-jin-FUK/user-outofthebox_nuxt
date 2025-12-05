export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/variables" as *;
            @use "~/assets/scss/mixins" as *;
          `
        }
      }
    }
  },

  css: ['~/assets/scss/main.scss'],
    modules: ['@nuxt/icon']
})
