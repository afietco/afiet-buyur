/**
 * Tarihi Türkçe uzun biçimde yazar: "20 Ağustos 2026".
 *
 * Saat dilimi AÇIKÇA Europe/Istanbul'dur ve olmak zorundadır: sunucu UTC'de,
 * ziyaretçi kendi diliminde biçimlendirirse aynı yazı sunucuda "20 Ağustos",
 * tarayıcıda "19 Ağustos" olabilir ve Vue hydration uyuşmazlığı verir.
 */
export function tarihTR(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(d)
}
