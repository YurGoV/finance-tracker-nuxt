// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

// @ts-ignore
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    '@': resolve(__dirname, '/')
  },
  modules: ['@nuxt/ui', '@nuxtjs/supabase'],
  tailwindcss: {
    quiet: true
  },
  supabase: {
    redirect: false
  }
})
