# afiet-buyur - çalışma notları

Bu repo **buyur.afiet.co**'yu yayınlar: afiet'in funnel sayfası. Kapsamı
bilinçli olarak dardır, tek sayfadır ve öyle kalmalıdır.

## Kurallar

- Marka kuralları afiet-mobile/BRAND.md'dir: her yerde küçük harf "afiet",
  em dash (—) kullanılmaz, ürün metni Türkçe yazılır.
- Dal ve commit mesajları İngilizce, ürün metinleri Türkçe.
- `shared/marka.ts` bir AYNADIR. Tek kaynak afiet-web/shared/utils/marka.ts;
  bir cümle değişecekse önce orada değişir.
- Yeni bir bağlantı `shared/baglantilar.ts`e girer, bileşenin içine değil.
- Tasarım değişikliğinden sonra `npm run shot` koşulur ve görüntü onaya
  sunulur; simülatörde/tarayıcıda görülmemiş bir UI değişikliği yayına
  çıkmaz.

## Sınırlar

- Bu sayfa arama motorlarına `noindex` der. Kaldırmadan önce afiet.co'nun
  SEO'suyla nasıl yarışacağı konuşulur.
- afiet.co'ya giden bağlantılara UTM eklenmez (nedeni
  `shared/baglantilar.ts` başındaki notta).
- Sayfa afiet.co'nun herkese açık uçlarına bağlıdır; veritabanına doğrudan
  bağlanmaz.
