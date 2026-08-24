<script setup lang="ts">
import { INCE_BAGLANTILAR, MAGAZALAR, SITE } from '#shared/baglantilar'
import { MARKA_TANIM, TAGLINE } from '#shared/marka'

/**
 * buyur.afiet.co - tek sayfa, tek sütun, tek iş: gelen ziyaretçiyi doğru
 * kapıya götürmek.
 *
 * SIRALAMA funnel sırasıdır ve keyfi değildir: önce uygulama (asıl dönüşüm),
 * sonra okunacak şeyler, en sonda takip edilecek hesaplar. Ne kadar aşağı
 * inilirse niyet o kadar zayıflar.
 *
 * VERİ: blog ve sürüm blokları afiet.co'nun herkese açık uçlarından SUNUCUDA
 * çekilir. Uç düşerse blok sessizce kaybolur, sayfa ayakta kalır - funnel
 * sayfasının bir API hatası yüzünden mağaza butonunu göstermemesi kabul
 * edilemez. Boş cevap 60 sn (ISR penceresi) önbellekte kalabilir; bu bilinçli
 * takas, alternatifi her ziyarette afiet.co'ya iki istek atmak.
 */
type Yazi = {
  slug: string
  title: string
  tags: string[]
  publishedAt: string
  readingMinutes: number
}
type Surum = { version: string; date: string; title: string; summary: string }

const { data: blog } = await useAsyncData(
  'blog',
  () => $fetch<{ posts: Yazi[] }>(`${SITE}/api/blog/posts`).catch(() => ({ posts: [] as Yazi[] })),
  { default: () => ({ posts: [] as Yazi[] }) },
)
const { data: yenilikler } = await useAsyncData(
  'yenilikler',
  () => $fetch<{ releases: Surum[] }>(`${SITE}/api/yenilikler`).catch(() => ({ releases: [] as Surum[] })),
  { default: () => ({ releases: [] as Surum[] }) },
)

const yazilar = computed(() => (blog.value?.posts ?? []).slice(0, 3))
const sonSurum = computed(() => (yenilikler.value?.releases ?? [])[0] ?? null)

/** Rozet yalnız gerçekten yayında olan bir mağaza varken çıkar. */
const yayindaMagaza = MAGAZALAR.find((m) => m.yayinda) ?? null
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- sofra ışığı: tepeden süzülen gün ışığı + yumuşak nane ve amber lekeleri -->
    <div class="pointer-events-none absolute -top-52 left-1/2 h-[26rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#fff3d6]/70 blur-3xl" aria-hidden="true" />
    <div class="pointer-events-none absolute -top-32 -left-40 h-[26rem] w-[26rem] rounded-full bg-brand-mint/40 blur-3xl" aria-hidden="true" />
    <div class="pointer-events-none absolute top-[28%] -right-44 h-[24rem] w-[24rem] rounded-full bg-[#fde68a]/40 blur-3xl" aria-hidden="true" />

    <main class="relative mx-auto w-full max-w-[34rem] px-5 pt-12 pb-14">
      <!-- ── künye ───────────────────────────────────────────────────────── -->
      <header class="flex flex-col items-center text-center">
        <a
          :href="SITE"
          data-tik="kunye"
          class="afi-float animate-afi-float rounded-[26%] shadow-float transition duration-300 hover:scale-[1.03]"
          aria-label="afiet.co"
        >
          <AfiRozet class="h-20 w-20 rounded-[26%]" />
        </a>

        <h1 class="mt-5 text-4xl font-extrabold tracking-tight text-brand lowercase">afiet</h1>

        <p class="mt-1.5 font-display text-lg font-semibold text-brand-deep italic">{{ TAGLINE }}</p>

        <p class="mt-4 max-w-[27rem] text-[13px] leading-relaxed text-soft">{{ MARKA_TANIM }}</p>

        <p
          v-if="yayindaMagaza"
          class="mt-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-mint/30 px-3.5 py-1.5 text-[13px] font-extrabold text-brand-deep"
        >
          <span class="relative flex h-2 w-2" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-bright opacity-60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-brand-bright" />
          </span>
          {{ yayindaMagaza.ad }}'da yayında
        </p>
      </header>

      <!-- ── mağazalar (birincil eylem) ──────────────────────────────────── -->
      <section class="mt-8" aria-labelledby="baslik-magaza">
        <h2 id="baslik-magaza" class="sr-only">Uygulamayı indir</h2>
        <MagazaSirasi />
      </section>

      <OlcuSeridi />

      <!-- ── son yazılar ─────────────────────────────────────────────────── -->
      <section v-if="yazilar.length" aria-labelledby="baslik-blog">
        <div class="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="baslik-blog" class="flex items-center gap-3 text-sm font-extrabold tracking-wide text-brand">
            <span class="h-px w-8 bg-brand/40" aria-hidden="true" />
            Son yazılar
          </h2>
          <a :href="`${SITE}/blog`" data-tik="blog-hepsi" class="shrink-0 text-sm font-bold text-ink transition hover:text-brand-deep">
            hepsi &rarr;
          </a>
        </div>
        <div class="space-y-2.5">
          <YaziKarti v-for="yazi in yazilar" :key="yazi.slug" v-bind="yazi" />
        </div>
      </section>

      <!-- ── son sürüm ───────────────────────────────────────────────────── -->
      <section v-if="sonSurum" class="mt-8" aria-labelledby="baslik-surum">
        <div class="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="baslik-surum" class="flex items-center gap-3 text-sm font-extrabold tracking-wide text-brand">
            <span class="h-px w-8 bg-brand/40" aria-hidden="true" />
            Yenilikler
          </h2>
          <a :href="`${SITE}/yenilikler`" data-tik="surum-hepsi" class="shrink-0 text-sm font-bold text-ink transition hover:text-brand-deep">
            tüm sürümler &rarr;
          </a>
        </div>
        <SurumKarti v-bind="sonSurum" />
      </section>

      <!-- ── sosyal ──────────────────────────────────────────────────────── -->
      <section class="mt-9" aria-labelledby="baslik-sosyal">
        <h2
          id="baslik-sosyal"
          class="mb-4 flex items-center justify-center gap-3 text-sm font-extrabold tracking-wide text-brand"
        >
          <span class="h-px w-8 bg-brand/40" aria-hidden="true" />
          Sofrada bize katıl
          <span class="h-px w-8 bg-brand/40" aria-hidden="true" />
        </h2>
        <SosyalSirasi />
      </section>

      <!-- ── ince bağlantılar + künye ────────────────────────────────────── -->
      <footer class="mt-10 border-t border-line pt-6 text-center">
        <ul class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <li v-for="b in INCE_BAGLANTILAR" :key="b.href">
            <a
              :href="b.href"
              :data-tik="b.anahtar"
              class="text-[13px] font-bold text-soft transition hover:text-brand-deep"
              >{{ b.ad }}</a
            >
          </li>
        </ul>
        <p class="mt-5 text-xs font-bold text-soft">
          <a :href="SITE" data-tik="kunye-alt" class="hover:text-brand-deep">afiet.co</a>
        </p>
      </footer>
    </main>
  </div>
</template>
