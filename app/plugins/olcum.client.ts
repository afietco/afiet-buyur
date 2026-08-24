/**
 * Çerezsiz ölçüm istemcisi.
 *
 * İki şey yollar: sayfa açılışında bir `goruntuleme`, `data-tik` taşıyan bir
 * bağlantıya tıklanınca bir `tik`. Kimlik üretmez, çerez ya da localStorage
 * kullanmaz - `server/api/tik.post.ts` başındaki nota bak.
 *
 * `data-tik` KURALI: dışarı çıkan her bağlantı bu özniteliği taşır ve değeri
 * bağlantının ne olduğunu söyler (`appstore`, `sosyal:instagram`,
 * `blog:<slug>`). Öznitelik yoksa tık sayılmaz; ölçülmesi istenen bir
 * bağlantıyı unutmak, yanlış bir şey ölçmekten iyidir.
 *
 * Yalnız üretim host'unda çalışır (`public.olcumHost`): yerel geliştirme ve
 * önizleme dağıtımları tabloyu kirletmesin.
 */
export default defineNuxtPlugin(() => {
  const host = String(useRuntimeConfig().public.olcumHost || '')
  if (!host || location.hostname !== host) return
  if (navigator.doNotTrack === '1') return

  const UC = '/api/tik'
  const yolla = (govde: Record<string, unknown>) => {
    try {
      const veri = JSON.stringify(govde)
      // sendBeacon gezinme sırasında bile teslim edilir; tık olayında şart.
      if (navigator.sendBeacon) {
        navigator.sendBeacon(UC, new Blob([veri], { type: 'application/json' }))
        return
      }
      void fetch(UC, { method: 'POST', body: veri, headers: { 'content-type': 'application/json' }, keepalive: true })
    } catch {
      /* ölçüm sayfayı kırmaz */
    }
  }

  yolla({ e: 'goruntuleme', r: document.referrer || '' })

  // Tek dinleyici, yakalama fazında: bağlantı yeni sekmede açılsa da,
  // aynı sekmede gezinilse de olay bu noktadan geçer.
  document.addEventListener(
    'click',
    (ev) => {
      const el = (ev.target as HTMLElement | null)?.closest?.('[data-tik]') as HTMLElement | null
      const hedef = el?.dataset.tik
      if (hedef) yolla({ e: 'tik', h: hedef })
    },
    { capture: true },
  )
})
