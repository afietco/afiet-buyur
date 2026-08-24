<script setup lang="ts">
import { OLCU_CIPLERI } from '#shared/baglantilar'

/**
 * Akan ölçü şeridi - afiet.co hero'sundaki şeridin aynısı, sayfayı ikiye
 * bölen dekoratif ayraç. Kesintisiz döngü için liste iki kez basılıp -%50
 * kaydırılır (main.css > --animate-marquee).
 *
 * Tamamen dekoratiftir (aria-hidden): taşıdığı dört ölçü sayfanın hiçbir
 * yerinde bilgi görevi görmez, ekran okuyucuya tekrar tekrar "2 dilim"
 * okutmanın kimseye faydası yok.
 */
const dotClasses: Record<string, string> = {
  sebze: 'bg-sebze',
  meyve: 'bg-meyve',
  protein: 'bg-protein',
  tahil: 'bg-tahil',
  sut: 'bg-sut',
}
const cipler = [...OLCU_CIPLERI, ...OLCU_CIPLERI, ...OLCU_CIPLERI]
</script>

<template>
  <div class="relative py-7" aria-hidden="true">
    <div class="marquee absolute inset-x-[-6%] top-1/2 -translate-y-1/2 -rotate-1 border-y border-line/80 bg-surface/70 py-3 backdrop-blur-sm">
      <div class="marquee-track flex w-max items-center">
        <span
          v-for="(cip, i) in [...cipler, ...cipler]"
          :key="i"
          class="mr-9 flex items-center gap-2.5 text-sm font-extrabold whitespace-nowrap text-soft"
        >
          <span class="h-2 w-2 rounded-full" :class="dotClasses[cip.accent]" />
          {{ cip.label }}
        </span>
      </div>
    </div>
    <div class="invisible py-3 text-sm font-extrabold">&nbsp;</div>
  </div>
</template>
