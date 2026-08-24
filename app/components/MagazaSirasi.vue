<script setup lang="ts">
import { ANDROID_YOLU, MAGAZALAR } from '#shared/baglantilar'

/**
 * Sayfanın birincil eylemi: mağazalar.
 *
 * Yayında olan mağaza dolu yeşil karttır (tek birincil eylem), yayında
 * olmayan pasif gri karttır ve TIKLANMAZ - 404'e giden bir buton funnel'ın
 * en pahalı hatası olurdu. Pasif kartın altında yine de bir yol vardır
 * (`ANDROID_YOLU`): Android'den gelen ziyaretçiyi elimizden bırakmıyoruz.
 *
 * Bayrak mağaza başınadır, `#shared/baglantilar > MAGAZALAR`. Play yayına
 * girdiği gün orada tek satır değişir, buraya dokunulmaz.
 */
const magazalar = MAGAZALAR
const androidYayinda = MAGAZALAR.find((m) => m.key === 'play')?.yayinda ?? false
</script>

<template>
  <div class="space-y-3">
    <component
      :is="magaza.yayinda ? 'a' : 'div'"
      v-for="magaza in magazalar"
      :key="magaza.key"
      v-bind="magaza.yayinda ? { href: magaza.href, target: '_blank', rel: 'noopener' } : {}"
      class="flex items-center gap-4 rounded-2xl px-5 py-4"
      :class="
        magaza.yayinda
          ? 'bg-brand-deep text-white shadow-float transition duration-300 hover:-translate-y-0.5 hover:bg-brand active:scale-[0.99]'
          : 'border border-dashed border-line bg-surface/60 text-muted'
      "
    >
      <!-- Apple: ısırılmış elma yerine sade gövde+yaprak; marka rozetlerini
           taklit etmeden mağazayı işaret eder (afiet-web StoreBadges deseni). -->
      <svg
        v-if="magaza.key === 'appstore'"
        viewBox="0 0 24 24"
        class="h-7 w-7 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 7c-4 0-6.5 3-6.5 6.5 0 3 2 6.5 4 6.5 1.2 0 1.6-.7 2.5-.7s1.3.7 2.5.7c2 0 4-3.5 4-6.5C18.5 10 16 7 12 7z" />
        <path d="M12 7c0-2 1.5-3.5 3-4" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        class="h-7 w-7 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 4.5v15l12-7.5z" />
      </svg>

      <span class="min-w-0 flex-1 leading-tight">
        <span class="block text-[11px] font-bold tracking-wide uppercase" :class="magaza.yayinda ? 'text-brand-mint' : 'text-muted'">
          {{ magaza.platform }}
        </span>
        <span class="block text-lg font-extrabold">
          {{ magaza.yayinda ? `${magaza.ad}'dan indir` : magaza.ad }}
        </span>
      </span>

      <span
        v-if="!magaza.yayinda"
        class="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-extrabold text-muted"
      >
        yakında
      </span>
      <svg
        v-else
        viewBox="0 0 24 24"
        class="h-5 w-5 shrink-0 text-brand-mint"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h13m-5-6 6 6-6 6" />
      </svg>
    </component>

    <a
      v-if="!androidYayinda"
      :href="ANDROID_YOLU.href"
      class="group flex items-center justify-center gap-1.5 rounded-2xl border border-brand/25 bg-brand-mint/25 px-5 py-3 text-sm font-extrabold text-brand-deep transition duration-300 hover:-translate-y-0.5 hover:border-brand/45 hover:shadow-lift"
    >
      {{ ANDROID_YOLU.metin }}
      <span class="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
    </a>
  </div>
</template>
