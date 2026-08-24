/**
 * Duman testi: yayına çıkmış çıktının (`.output/`) gerçekten ayakta olduğunu
 * ve sayfanın taşıması gereken üç şeyi taşıdığını doğrular.
 *
 * Tarayıcı KULLANMAZ (afiet-web'in smoke'undan farkı bu): burada tek sayfa
 * var ve doğrulanacak şeyler sunucunun bastığı HTML'de. Headless Chrome
 * kurmak CI'a dakikalar ekler, karşılığında bir şey vermez.
 *
 * `npm run build` sonrası koşar. Sunucuyu kendi başlatır, bitince öldürür.
 */
import { spawn } from 'node:child_process'

const PORT = process.env.SMOKE_PORT || '3221'
const BASE = `http://127.0.0.1:${PORT}`

const sunucu = spawn('node', ['.output/server/index.mjs'], {
  env: { ...process.env, PORT, NITRO_PORT: PORT, HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let sunucuCiktisi = ''
sunucu.stdout.on('data', (d) => (sunucuCiktisi += d))
sunucu.stderr.on('data', (d) => (sunucuCiktisi += d))

const bekle = (ms) => new Promise((r) => setTimeout(r, ms))

async function ayaktaMi() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(BASE, { signal: AbortSignal.timeout(2000) })
      if (r.ok) return true
    } catch {
      /* henüz açılmadı */
    }
    await bekle(500)
  }
  return false
}

const hatalar = []
const kontrol = (kosul, ad) => {
  if (kosul) console.log(`✓ ${ad}`)
  else hatalar.push(ad)
}

try {
  if (!(await ayaktaMi())) throw new Error(`sunucu ${BASE} adresinde açılmadı\n${sunucuCiktisi}`)

  const r = await fetch(BASE)
  const html = await r.text()
  kontrol(r.status === 200, 'ana sayfa 200')
  // Kesme işareti HTML'de kaçırılıyor (&#39;), metni birebir aramak kırılgan:
  // iki parçayı ayrı ayrı sormak hem sağlam hem yeter.
  kontrol(html.includes('App Store') && html.includes('dan indir'), 'mağaza butonu basılıyor')
  // Sayfanın en kritik sözleşmesi: indekslenmemek.
  kontrol(/name="robots" content="noindex/.test(html), 'noindex meta etiketi var')
  // Play henüz yayında değil; yayına girene kadar pasif kart durmalı.
  kontrol(html.includes('yakında'), 'yayında olmayan mağaza pasif duruyor')

  const rb = await fetch(`${BASE}/robots.txt`)
  kontrol(rb.status === 200 && (await rb.text()).includes('Allow: /'), 'robots.txt taramaya izin veriyor')
} catch (err) {
  hatalar.push(String(err))
} finally {
  sunucu.kill('SIGTERM')
}

if (hatalar.length) {
  console.error(`\n✗ ${hatalar.length} kontrol düştü:\n  - ${hatalar.join('\n  - ')}`)
  process.exit(1)
}
console.log('\nduman testi temiz')
