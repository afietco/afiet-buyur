import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import type { H3Event } from 'h3'

/**
 * buyur.afiet.co'nun ölçüm deposu.
 *
 * ÇEREZSİZ (kullanıcı kararı, 24 Ağu 2026): ziyaretçi ya da oturum kimliği
 * YOKTUR, çerez yazılmaz, localStorage'a dokunulmaz, IP saklanmaz. Bu yüzden
 * sayfanın kendi onay bildirimi de yoktur - saklanan hiçbir satır bir kişiye
 * bağlanamaz. Karşılığında "kaç tekil kişi" sorusunu cevaplayamayız; funnel
 * için gereken soru zaten o değil: kaç görüntüleme, hangi bağlantıya kaç tık.
 *
 * NEDEN AYRI TABLO: afiet.co'nun `analytics_events` tablosu `visitor_id` ve
 * `session_id` alanlarını ZORUNLU tutuyor. Oraya yazmak için her istekte
 * rastgele kimlik uydurmak gerekirdi ve panel bunları tekil ziyaretçi diye
 * sayıp afiet.co'nun rakamlarını şişirirdi. Ayrıca o tablonun `event` CHECK
 * kısıtı afiet-web tarafında her açılışta düşürülüp yeniden kuruluyor; oraya
 * yeni bir olay adı eklemek, iki repo arasında sessizce bozulacak bir bağ
 * kurmak olurdu.
 *
 * Tablo aynı Neon veritabanında yaşar (tek yer, tek yedek), sahibi bu repodur
 * ve şemasına başka kimse dokunmaz.
 */

type Sql = NeonQueryFunction<false, false>
let tabloHazir = false

/**
 * Bağlantı afiet-web ile AYNI env değişkeninden okunur: `NUXT_DATABASE_URL`.
 * İki repoda iki ayrı ad kullanmak, aynı veritabanının adresini iki yerde
 * ayrı ayrı döndürmek demekti; Neon şifresi döndüğü gün biri unutulurdu.
 * Değer yoksa ölçüm sessizce kapalıdır, sayfa çalışmaya devam eder.
 */
export function olcumSql(event: H3Event): Sql | null {
  const url = useRuntimeConfig(event).databaseUrl
  return url ? neon(url) : null
}

export async function tabloyuHazirla(sql: Sql) {
  if (tabloHazir) return
  await sql`
    CREATE TABLE IF NOT EXISTS buyur_events (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      ts timestamptz NOT NULL DEFAULT now(),
      event text NOT NULL,
      hedef text,
      referrer_host text,
      device text,
      browser text,
      os text,
      country text
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS buyur_events_ts_idx ON buyur_events (ts)`
  await sql`CREATE INDEX IF NOT EXISTS buyur_events_hedef_idx ON buyur_events (hedef) WHERE hedef IS NOT NULL`
  tabloHazir = true
}

/**
 * Olay adları KODDA doğrulanır, veritabanında CHECK kısıtı yoktur.
 * Bilinçli: kısıt, yeni bir olay eklendiği gün migration ile kodun aynı anda
 * gitmesini şart koşar ve biri unutulduğunda yazma sessizce düşer. Liste
 * burada tek satır, kapı da burada.
 */
export const OLAYLAR = ['goruntuleme', 'tik'] as const
export type Olay = (typeof OLAYLAR)[number]

/**
 * Tık hedefi anahtarı: `appstore`, `sosyal:instagram`, `blog:<slug>` gibi.
 * Serbest metin kabul edilmez; biçimi tutmayan değer null'a düşer ve satır
 * yine yazılır (görüntüleme sayısı, bozuk bir hedef yüzünden kaybolmasın).
 */
const HEDEF_RE = /^[a-z0-9]+(?:[:.-][a-zA-Z0-9._-]+)*$/

export function hedefTemizle(ham: unknown): string | null {
  const s = typeof ham === 'string' ? ham.trim() : ''
  if (!s || s.length > 120) return null
  return HEDEF_RE.test(s) ? s : null
}

/** Bot/tarayıcı denetim trafiğini eler (afiet-web'deki listenin aynısı). */
export function botMu(ua: string): boolean {
  return /bot|crawl|spider|slurp|headless|preview|monitor|lighthouse|pingdom|uptime|curl|wget|python-requests|axios|node-fetch|facebookexternalhit|embedly|vercel-screenshot|google-inspectiontool|bytespider|ahrefs|semrush/i.test(
    ua || '',
  )
}

/** UA ayrıştırma - afiet-web/server/utils/analyticsStore.ts > parseUa aynası. */
export function uaCoz(ua: string): { device: string; browser: string; os: string } {
  const u = ua || ''
  const isTablet = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(u)
  const isMobile = /Mobi|iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|BlackBerry|Opera Mini/i.test(u)
  const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

  let os = 'Diğer'
  if (/iPhone|iPad|iPod/i.test(u)) os = 'iOS'
  else if (/Android/i.test(u)) os = 'Android'
  else if (/Windows NT/i.test(u)) os = 'Windows'
  else if (/Mac OS X/i.test(u)) os = 'macOS'
  else if (/Linux/i.test(u)) os = 'Linux'

  let browser = 'Diğer'
  if (/Edg\//i.test(u)) browser = 'Edge'
  else if (/SamsungBrowser/i.test(u)) browser = 'Samsung Internet'
  else if (/OPR\/|Opera/i.test(u)) browser = 'Opera'
  else if (/Firefox\/|FxiOS/i.test(u)) browser = 'Firefox'
  else if (/CriOS/i.test(u) || (/Chrome\//i.test(u) && !/Edg\/|OPR\/|SamsungBrowser/i.test(u))) browser = 'Chrome'
  else if (/Safari/i.test(u) && !/Chrome\/|CriOS/i.test(u)) browser = 'Safari'

  return { device, browser, os }
}

/** URL/host değerinden temiz hostname (www. atılır); geçersizse null. */
export function refHost(ham: string): string | null {
  const raw = (ham || '').trim()
  if (!raw) return null
  try {
    const host = new URL(raw).hostname.toLowerCase()
    return host.replace(/^www\./, '') || null
  } catch {
    return null
  }
}
