/**
 * buyur.afiet.co'nun TEK bağlantı kaynağı.
 *
 * Sayfadaki hiçbir bileşen kendi içine adres yazmaz, hepsi buradan okur:
 * funnel'in tamamı tek dosyada görünür olmazsa bir kanal sessizce eski bir
 * adrese işaret etmeye başlar ve bunu kimse fark etmez.
 *
 * UTM YOK (bilinçli karar): afiet.co'ya giden bağlantılara utm eklenmez.
 * afiet.co'nun analitiği `hasUtm` gören her ziyareti 'campaign' kanalına
 * yazıyor (afiet-web/server/utils/analyticsStore.ts > channelFor) - buradan
 * gelen organik trafiği utm ile işaretlersek reklam raporlarının içine
 * karışır. İşaret zaten var: referrer 'buyur.afiet.co' olarak düşüyor ve
 * kanal 'referral' oluyor. Dışarıya (mağaza, sosyal) giden adreslerde
 * referrer korunmadığı için oralarda utm/referrer AYRI ele alınır.
 */

/** Sosyal ikon kümesi - SocialSirasi.vue içindeki SVG'lerle birebir eşleşir. */
export type SosyalIkon = 'instagram' | 'medium' | 'substack' | 'hashnode' | 'linkedin'

export const SITE = 'https://afiet.co'

/**
 * Mağaza kapısı MAĞAZA BAŞINA açılır (afiet.co'daki tek bayraktan farkı bu).
 *
 * NEDEN AYRI: 24 Ağu 2026 itibarıyla iOS App Store'da YAYINDA, Google Play
 * listesi ise hâlâ 404 (kapalı test). Tek bayrak ikisini birlikte açıp
 * kapatıyor; burada açsaydık funnel sayfasının en görünür butonu 404'e
 * giderdi, kapalı tutsaydık yayında olan uygulamayı "yakında" diye
 * saklardık. Play yayına girdiği gün `yayinda: true` yeter.
 */
export const MAGAZALAR = [
  {
    key: 'appstore' as const,
    ad: 'App Store',
    platform: 'iPhone ve iPad',
    yayinda: true,
    href: 'https://apps.apple.com/tr/app/id6789522761',
  },
  {
    key: 'play' as const,
    ad: 'Google Play',
    platform: 'Android',
    yayinda: false,
    href: 'https://play.google.com/store/apps/details?id=co.afiet.app',
  },
]

/**
 * Android'de uygulama daha yayında değil. Boş bir "yakında" rozeti Android
 * ziyaretçisini elimizden çıkarır; erken erişim başvurusu tek dönüşüm
 * yolumuz (bekleme listesi 27 Tem 2026'da kaldırıldı, geriye /beta kaldı).
 */
export const ANDROID_YOLU = {
  href: `${SITE}/beta`,
  metin: 'Android için erken erişime katıl',
}

export const SOSYAL: { ad: string; href: string; ikon: SosyalIkon }[] = [
  { ad: 'Instagram', href: 'https://www.instagram.com/afiet.co/', ikon: 'instagram' },
  { ad: 'Medium', href: 'https://medium.com/@afiet.co', ikon: 'medium' },
  { ad: 'Substack', href: 'https://afiet.substack.com', ikon: 'substack' },
  { ad: 'Hashnode', href: 'https://afiet.hashnode.dev', ikon: 'hashnode' },
  { ad: 'LinkedIn', href: 'https://www.linkedin.com/company/afiet-app', ikon: 'linkedin' },
]

/**
 * Alt sıradaki ince bağlantılar: sayfanın gövdesiyle yarışmazlar.
 *
 * `anahtar` ölçüm içindir ve etiketten TÜRETİLMEZ: etiketler Türkçe ve
 * boşluklu ("basın kiti"), ölçüm anahtarı ise sabit ve ASCII olmak zorunda,
 * yoksa etiketi güzelleştiren bir düzenleme geçmişteki sayıları koparır.
 */
export const INCE_BAGLANTILAR = [
  { ad: 'hesaplayıcılar', anahtar: 'ince:hesapla', href: `${SITE}/hesapla` },
  { ad: 'destek', anahtar: 'ince:destek', href: `${SITE}/destek` },
  { ad: 'basın kiti', anahtar: 'ince:basin', href: `${SITE}/basin` },
  { ad: 'iletişim', anahtar: 'ince:iletisim', href: `${SITE}/iletisim` },
  { ad: 'gizlilik', anahtar: 'ince:gizlilik', href: `${SITE}/gizlilik` },
]

/** Akan ölçü şeridi - afiet.co hero'sundaki çiplerin aynısı, yeni metin yok. */
export const OLCU_CIPLERI: { label: string; accent: 'sebze' | 'meyve' | 'protein' | 'tahil' | 'sut' }[] = [
  { label: '2 dilim', accent: 'meyve' },
  { label: 'yarım kase', accent: 'tahil' },
  { label: 'bir avuç', accent: 'sebze' },
  { label: '1 fincan', accent: 'sut' },
]
