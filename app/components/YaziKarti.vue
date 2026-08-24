<script setup lang="ts">
import { SITE } from '#shared/baglantilar'

/**
 * Tek blog yazısı satırı.
 *
 * KAPAK GÖRSELİ YOK (bilinçli): afiet.co'nun kapakları 1200x630 OG
 * kartlarıdır ve tek boy üretilir (afiet-web/server/routes/kapak/[slug]
 * yalnız `poz` parametresi alır). 64 piksellik bir kutuya sığdırmak için üç
 * tam boy PNG indirtmek, mobil veriyle açılan bir funnel sayfasında ilk
 * ekranı bekletmekten başka işe yaramaz; üstelik kart soldan başlık metni
 * taşıdığı için kare kırpma bozuk bir görsel gibi okunuyordu. Yerine yazının
 * kendi etiketi konur: sıfır bayt, gerçek bilgi.
 */
defineProps<{ slug: string; title: string; tags: string[]; publishedAt: string; readingMinutes: number }>()
</script>

<template>
  <a
    :href="`${SITE}/blog/${slug}`"
    class="group flex items-center gap-3.5 rounded-2xl border border-line bg-surface px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-lift"
  >
    <span class="min-w-0 flex-1">
      <span class="line-clamp-2 block font-display text-[15px] leading-snug font-semibold text-ink group-hover:text-brand-deep">
        {{ title }}
      </span>
      <span class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-soft">
        <span v-if="tags[0]" class="rounded-full bg-brand-mint/40 px-2 py-0.5 text-brand-deep">{{ tags[0] }}</span>
        <span>{{ tarihTR(publishedAt) }}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{{ readingMinutes }} dk okuma</span>
      </span>
    </span>
    <span
      class="shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-brand"
      aria-hidden="true"
    >
      &rarr;
    </span>
  </a>
</template>
