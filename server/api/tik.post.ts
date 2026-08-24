import { OLAYLAR, botMu, hedefTemizle, olcumSql, refHost, tabloyuHazirla, uaCoz, type Olay } from '../utils/olcum'

/**
 * Çerezsiz ölçüm beacon'ı (herkese açık).
 *
 * `app/plugins/olcum.client.ts` sayfa açılışında bir `goruntuleme`, dışarı
 * giden her bağlantı tıklamasında bir `tik` yollar. Çerez yazılmaz, kimlik
 * üretilmez, IP saklanmaz; ülke bilgisi Vercel'in kenar başlığından gelir ve
 * ülke düzeyinde kalır.
 *
 * SÖZLEŞME: ölçüm ASLA sayfayı kırmaz. Geçersiz gövde, bot, veritabanı yokluğu
 * ya da herhangi bir hata sessizce 204 döner (sendBeacon yanıtı zaten yok
 * sayılır).
 */
export default defineEventHandler(async (event) => {
  const bitir = () => {
    setResponseStatus(event, 204)
    return null
  }

  try {
    const ua = getHeader(event, 'user-agent') || ''
    if (botMu(ua)) return bitir()
    // Tarayıcının izlenmeme sinyaline saygı (afiet.co ile aynı duruş).
    if (getHeader(event, 'dnt') === '1') return bitir()

    const govde = (await readBody(event).catch(() => null)) as Record<string, unknown> | null
    if (!govde || typeof govde !== 'object') return bitir()

    const olay = String(govde.e ?? '') as Olay
    if (!OLAYLAR.includes(olay)) return bitir()

    const sql = olcumSql(event)
    if (!sql) return bitir()
    await tabloyuHazirla(sql)

    const { device, browser, os } = uaCoz(ua)
    await sql`
      INSERT INTO buyur_events (event, hedef, referrer_host, device, browser, os, country)
      VALUES (
        ${olay},
        ${hedefTemizle(govde.h)},
        ${refHost(String(govde.r ?? ''))},
        ${device},
        ${browser},
        ${os},
        ${getHeader(event, 'x-vercel-ip-country') || null}
      )
    `
  } catch {
    /* ölçüm sayfayı kırmaz */
  }

  return bitir()
})
