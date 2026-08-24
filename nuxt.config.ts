import tailwindcss from '@tailwindcss/vite'

import { MARKA_TANIM } from './shared/marka'

/**
 * buyur.afiet.co - dijital kanalların tek buluşma noktası.
 *
 * ARAMA MOTORLARI: sayfa bilinçli olarak `noindex, follow`tur. İçeriğinin
 * tamamı afiet.co'da zaten var (mağaza, blog, yenilikler); indekslenirse
 * SEO emeği verilmiş sayfalarla aynı sorgularda birbirimizle yarışırız ve
 * ince/yinelenen içerik olarak da okunabilir. `follow` açık kalır ki
 * buradan afiet.co'ya giden bağlantılar taranmaya devam etsin. robots.txt
 * taramayı ENGELLEMEZ: engellenirse motor sayfayı indiremez, noindex'i de
 * göremez.
 */
export default defineNuxtConfig({
  compatibilityDate: '2026-08-24',
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  /**
   * Blog ve sürüm blokları afiet.co'nun herkese açık uçlarından SUNUCUDA
   * çekilir; 60 sn'lik ISR penceresi hem yeni yazının en geç bir iki dakikada
   * görünmesini sağlar hem her ziyarette afiet.co'ya istek atmamızı önler.
   * (afiet-web'de `swr` Vercel'de hiç tazelenmemişti, oradaki not gereği
   * doğrudan `isr` kullanılıyor.)
   */
  routeRules: {
    '/': { isr: 60 },
  },

  runtimeConfig: {
    /**
     * Neon bağlantı dizesi (sunucu tarafı, gizli). Env: NUXT_DATABASE_URL -
     * afiet-web'de de aynı ad, aynı değer, aynı veritabanı.
     * Boşken `/api/tik` sessizce 204 döner: ölçüm yoksa sayfa yine çalışır.
     */
    databaseUrl: '',

    public: {
      /**
       * Ölçümün açık olduğu TEK host. Yerelde ve önizleme dağıtımlarında
       * eşleşmez, beacon hiç çalışmaz; `buyur_events` yalnız gerçek ziyaretle
       * dolar (afiet-web'deki `analyticsDomains` kuralının aynısı).
       */
      olcumHost: 'buyur.afiet.co',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      title: 'afiet | buyur',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: MARKA_TANIM },
        { name: 'robots', content: 'noindex, follow' },
        { name: 'theme-color', content: '#fdfaf3' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'afiet' },
        { property: 'og:title', content: 'afiet | buyur' },
        { property: 'og:description', content: MARKA_TANIM },
        { property: 'og:url', content: 'https://buyur.afiet.co/' },
        { property: 'og:image', content: 'https://buyur.afiet.co/og.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // Kanonik afiet.co'yu GÖSTERMEZ: bu sayfa afiet.co'nun bir kopyası
        // değil, ayrı bir varlıktır. noindex zaten indekslenmesini engelliyor;
        // ikisini birlikte vermek motora çelişkili iki emir olur.
        { rel: 'canonical', href: 'https://buyur.afiet.co/' },
      ],
    },
  },

  // Tek sayfalık bir vitrin için DevTools düğmesi ekranın ortasında durup
  // tasarım turlarının görüntüsünü kapatmaktan başka bir iş yapmıyor.
  devtools: { enabled: false },

  devServer: { port: 3220 },
})
