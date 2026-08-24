<script setup lang="ts">
import { SITE } from '#shared/baglantilar'

/**
 * En son sürüm. Özet iki satıra kırpılır: funnel sayfasında sürüm notunun
 * tamamını okutmak istemiyoruz, tıklamayı istiyoruz.
 */
defineProps<{ version: string; date: string; title: string; summary: string }>()
</script>

<template>
  <a
    :href="`${SITE}/yenilikler/${version}`"
    class="group block rounded-2xl border border-line bg-surface p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-lift"
  >
    <span class="flex items-center gap-2">
      <span class="rounded-full bg-brand-mint/50 px-2.5 py-0.5 text-xs font-extrabold text-brand-deep">
        {{ version }}
      </span>
      <span class="text-xs font-bold text-muted">{{ tarihTR(date) }}</span>
    </span>
    <span class="mt-2 block font-display text-lg leading-snug font-semibold tracking-tight text-ink transition group-hover:text-brand-deep">
      {{ title }}
    </span>
    <span class="mt-1 line-clamp-2 block text-sm leading-relaxed text-soft">{{ summary }}</span>
  </a>
</template>
