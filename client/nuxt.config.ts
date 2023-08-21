// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig(
  {
    devtools: { enabled: false },
    modules: [
      '@ant-design-vue/nuxt','@pinia/nuxt'
    ],
  }
);


