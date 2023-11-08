// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig(
  {
    app: {
      head: {
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/icons8-job-seeker-office-m-32.png' }
        ]
      },
    },
    devtools: { enabled: false },
    sourcemap: {
      server: true,
      client: true
    },
    // vue: {  
    //   compilerOptions: {
    //     isCustomElement: (tag) => { return tag.startsWith('a-')},
    //   },
    // },
    // plugins: [
    //   '~/plugins/novu-notify.ts',
    // ],
    
    modules: [
      '@ant-design-vue/nuxt','@pinia/nuxt','vue3-carousel-nuxt','dayjs-nuxt','nuxt-icon',"nuxt-lodash"
    ],
  }
);


