/**
 * Taramaya izin verir, indekslemeyi sayfanın kendi `noindex` meta'sı keser
 * (nuxt.config.ts'teki nota bak: Disallow yazsaydık motor sayfayı indirip
 * noindex'i göremezdi ve adres yine de indekste görünebilirdi).
 *
 * Site haritası YOK: indekslenmesini istemediğimiz tek sayfalık bir funnel
 * sayfası için sunulacak harita da yok.
 */
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=3600')
  return ['User-agent: *', 'Allow: /', ''].join('\n')
})
