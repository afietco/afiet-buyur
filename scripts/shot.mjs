/**
 * Tasarım turu görüntüleri (`node scripts/shot.mjs`, çıktı .shots/).
 * Sistem Chrome'u ile koşar (afiet-web/scripts/ui-shots.mjs ile aynı yol) ve
 * dev sunucusunun 3220'de açık olmasını bekler (BASE_URL ile değişir).
 */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3220'
const OUT = process.env.SHOT_DIR || '.shots'
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: CHROME, headless: true })

async function shot(name, { width = 390, height = 844, full = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const hatalar = []
  page.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  page.on('pageerror', (e) => hatalar.push(String(e)))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  // Nuxt DevTools düğmesi sayfanın ortasında duruyor; onay görüntüsünde
  // tasarımın önünü kapatmasın (yalnız dev sunucusunda var).
  await page.addStyleTag({ content: '#nuxt-devtools-anchor{display:none!important}' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full })
  await ctx.close()
  console.log(`✓ ${name}${hatalar.length ? ` (konsol hatası: ${hatalar.join(' | ')})` : ''}`)
}

await shot('01-mobil')
await shot('02-mobil-ilk-ekran', { full: false })
await shot('03-masaustu', { width: 1280, height: 900 })
await browser.close()
