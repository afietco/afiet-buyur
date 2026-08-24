<script setup lang="ts">
import { MAGAZALAR } from '#shared/baglantilar'

/**
 * Sayfanın birincil eylemi: mağazalar.
 *
 * Yayında olan mağaza dolu yeşil karttır (tek birincil eylem), yayında
 * olmayan pasif gri karttır ve TIKLANMAZ - 404'e giden bir buton funnel'ın
 * en pahalı hatası olurdu. Pasif kartın altında ikinci bir yol YOKTUR: erken
 * erişim programı kapandı (25 Ağu 2026), kapanmış bir programa davet etmek
 * hiç davet etmemekten kötü olurdu.
 *
 * Bayrak mağaza başınadır, `#shared/baglantilar > MAGAZALAR`. Play yayına
 * girdiği gün orada tek satır değişir, buraya dokunulmaz.
 */
const magazalar = MAGAZALAR
</script>

<template>
  <div class="space-y-3">
    <component
      :is="magaza.yayinda ? 'a' : 'div'"
      v-for="magaza in magazalar"
      :key="magaza.key"
      v-bind="magaza.yayinda ? { href: magaza.href, target: '_blank', rel: 'noopener', 'data-tik': magaza.key } : {}"
      class="flex items-center gap-4 rounded-2xl px-5 py-4"
      :class="
        magaza.yayinda
          ? 'bg-brand-deep text-white shadow-float transition duration-300 hover:-translate-y-0.5 hover:bg-brand active:scale-[0.99]'
          : 'border border-dashed border-line bg-surface/60 text-muted'
      "
    >
      <!-- Mağaza markaları RESMÎ geometridir (simple-icons, CC0 - Apple ve
           Google'ın kendi işaretlerinin birebir yol verisi). Elle çizilmiş
           yaklaşık bir elma ya da üçgen, indirme butonunun üzerinde amatör
           duruyordu.

           İKİSİ DE TEK RENK (currentColor): Play'in resmî logosu dört renkli
           bir üçgendir ve o renkleri buraya elle yazmak, kaynağı olmayan bir
           marka varlığı uydurmak olur. Play yayına girdiğinde doğru hamle
           Google'ın hazır rozetini kullanmaktır; o güne kadar iki işaret de
           tek renk durur ve kartlar birbirine benzer. -->
      <svg
        v-if="magaza.key === 'appstore'"
        viewBox="0 0 24 24"
        class="h-7 w-7 shrink-0"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="h-7 w-7 shrink-0" fill="currentColor" aria-hidden="true">
        <path
          d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"
        />
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
  </div>
</template>
