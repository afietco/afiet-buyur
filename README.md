# afiet-buyur

**buyur.afiet.co** - afiet'in tek funnel sayfası. Dijital kanallardaki her
bağlantı (Instagram biyografisi, TikTok, mağaza dışı her yer) buraya bakar;
sayfa gelen ziyaretçiyi doğru kapıya yollar: uygulama, son yazılar, sürüm
notları, sosyal hesaplar.

## Neden ayrı repo

afiet.co (afiet-web) SEO'su, blogu, panelleri ve API'leriyle büyük bir
uygulama. Funnel sayfası tek dosyalık bir vitrin ve kampanya hızında değişir;
onu afiet-web'in deploy hattına bağlamak, bir bağlantı sırasını değiştirmek
için bütün siteyi yeniden yayına almak demekti.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:3220
npm run shot       # .shots/ altına tasarım turu görüntüleri (sistem Chrome'u)
npm run typecheck
```

## Nasıl kurulu

- **Nuxt 4 + Tailwind 4.** Tasarım sistemi afiet.co'nun "sıcak sofra"
  katmanının taşınmış hâlidir (`app/assets/css/main.css`); değerler birebir
  aynıdır, iki site yan yana açıldığında aynı sofradan çıkmış görünmeli.
- **Bağlantıların tek kaynağı** `shared/baglantilar.ts`. Hiçbir bileşen kendi
  içine adres yazmaz.
- **Dinamik bloklar** afiet.co'nun herkese açık uçlarından sunucuda çekilir
  (`/api/blog/posts`, `/api/yenilikler`), sayfa 60 sn ISR ile tazelenir. Uç
  düşerse blok sessizce kaybolur, mağaza butonu ayakta kalır.
- **Mağaza kapısı mağaza başınadır** (`MAGAZALAR[].yayinda`). afiet.co'daki
  tek bayraktan farkı budur: iOS yayında, Play henüz değil.

## Ölçüm

Sayfa kendi ölçümünü tutar ve **çerezsizdir**: ziyaretçi/oturum kimliği yok,
çerez yok, localStorage yok, IP saklanmıyor. Bu yüzden çerez onay bildirimi de
yok. Saklanan satır bir kişiye bağlanamaz.

- İki olay var: sayfa açılışında `goruntuleme`, dışarı giden bağlantıda `tik`.
- Dışarı çıkan her bağlantı `data-tik="<anahtar>"` taşır (`appstore`,
  `sosyal:instagram`, `blog:<slug>`). Öznitelik yoksa tık sayılmaz.
- Veri aynı Neon veritabanında ayrı bir `buyur_events` tablosunda yaşar.
  afiet.co'nun `analytics_events` tablosuna yazılmaz: orası `visitor_id`
  zorunlu tutuyor ve her istekte kimlik uydurmak panelin tekil ziyaretçi
  sayısını şişirirdi.
- Beacon yalnız `buyur.afiet.co` host'unda çalışır; yerel ve önizleme
  dağıtımları tabloyu kirletmez. DNT sinyaline saygı gösterir.
- Gereken env değişkeni: `NUXT_DATABASE_URL` (afiet-web ile aynı ad, aynı
  değer). Boşken ölçüm sessizce kapalıdır, sayfa çalışmaya devam eder.

Sorabildiği soru: kaç görüntüleme, hangi bağlantıya kaç tık, dolayısıyla
bağlantı başına tıklama oranı. Soramadığı: kaç tekil kişi.

## Bilinçli kararlar

| Karar | Neden |
| --- | --- |
| `noindex, follow` | İçeriğin tamamı afiet.co'da var; indekslenirse SEO emeği verilmiş sayfalarla aynı sorgularda yarışır. `follow` açık kalır, bağlantılar taranır. |
| robots.txt taramayı engellemez | Engellenirse motor sayfayı indirip `noindex`i göremez, adres yine indekste görünebilir. |
| afiet.co bağlantılarında UTM yok | afiet.co analitiği `utm` gören her ziyareti `campaign` kanalına yazıyor; organik funnel trafiği reklam raporlarına karışırdı. İşaret zaten var: referrer `buyur.afiet.co`, kanal `referral`. |
| Android'e ikinci bir yol yok | Erken erişim programı 25 Ağu 2026'da kapandı. Pasif "yakında" kartının altında `/beta` bağlantısı vardı, kaldırıldı: kapanmış bir programa davet etmek hiç davet etmemekten kötü. |
| Blog kartlarında kapak görseli yok | Kapaklar tek boy 1200x630 üretiliyor; 64 pikselik kutuya üç tam boy PNG indirtmek mobil funnel sayfasında ilk ekranı bekletir. |
