// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false
  },

  runtimeConfig: {
    public: {
      // Absolute URLs for SEO links (canonical, og:url). Here, not in `i18n`,
      // so NUXT_PUBLIC_I18N_BASE_URL can override it.
      i18n: {
        baseUrl: 'https://zadanie-tech.vercel.app'
      }
    }
  },

  compatibilityDate: '2026-06-30',

  typescript: {
    tsConfig: {
      compilerOptions: {
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    detectBrowserLanguage: false
  }
})
