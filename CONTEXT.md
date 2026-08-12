# CONTEXT.md — Deri Portfolyo

Bu dosya, projedeki yapay zeka hafızasıdır. Proje geliştikçe her adımda güncel tutulmalıdır.

## Proje Amacı

El yapımı deri eşyaların (çanta, cüzdan, aksesuar) sergilendiği minimalist, yüksek performanslı ve görsel odaklı bir portfolyo/sergi sitesi.

## Tech Stack

- **Next.js** (App Router) — v16.3.0
- **TypeScript**
- **Tailwind CSS** (v4)
- **React** 19

## Tasarım Dili

- Minimalist, siyah tema
- Büyük görsel odaklı düzen
- Beyaz/gri tipografi ve sade, premium his veren yerleşim
- Özel marka fontu (`next/font/local` ile self-hosted, `--font-custom` → varsayılan `font-sans`)

## Mevcut Durum

- [x] Klasör yapısı ve Git entegrasyonu tamamlandı
- [x] `src/app/globals.css` temizliği (sadece Tailwind kaldı, siyah tema tabanı hazır)
- [x] Header bileşeni `src/app/layout.tsx` içine eklendi
- [x] Mobil menü (drawer) kuruldu — hamburger ikonuyla açılan tam ekran slide-in panel (`src/components/MobileMenu.tsx`), cinsiyet switcher'ı, alt kategori listesi ve alt aksiyonlar
- [x] Header responsive düzeltmesi: logo `LOGO` olarak kısaltıldı; mobilde (<md) yalnızca hamburger + logo + sepet/wishlist görünür, sekmeler/arama/alt kategori linkleri gizli
- [x] Özel marka fontu entegrasyonu tamamlandı — `next/font/local` ile `src/app/fonts/custom-brand-font.woff2` yüklendi (`--font-custom`), Tailwind `font-sans` eşlemesiyle tüm sitede varsayılan font yapıldı
- [x] Ürün veri mimarisi kuruldu — `src/types/product.ts` (`Product` interface) ve `src/data/products.ts` (`MOCK_PRODUCTS` + `getFeaturedProducts()` / `getProductsByCategory()`)
- [x] Vitrin `MOCK_PRODUCTS` ile beslendi — `ProductCard` bileşeni (`next/image`, fiyat formatı, hover efektleri) ve responsive ızgara (1/2/4 sütun)
- [x] Ürün detay sayfası oluşturuldu (`/product/[slug]`) — galeri, detay paneli, SEPETE EKLE, akordeonlar, `notFound()`
- [x] Detay sayfası geliştirildi — dikey thumbnail galerisi (`useState` ile aktif görsel), hover zoom, SEPETE EKLE yanında favori kalbi
- [x] Kategori liste sayfası iskeleti oluşturuldu (`/categories/[slug]`) — breadcrumb, başlık, filtre + sıralama kontrolleri, aksiyon overlay'li ürün ızgarası
- [x] Etkileşimli görünüm değiştirici tamamlandı — Grid (4/3/2 sütun) ve yatay Liste modu arasında `useState` ile geçiş, yumuşak geçiş animasyonu
- [x] Dinamik cinsiyet rotası eklendi (`/[gender]`) — Header sekmeleri `/kadin`, `/erkek`, `/unisex`'e bağlı ve `usePathname` ile aktif sekme vurgulanıyor; `Product.gender` alanı + `getProductsByGender()` helper'ı
- [x] Tam ekran hero + şeffaf floating navbar — `h-svh` hero (gerçek görsel + gradyan overlay), scroll'da `bg-black/90 backdrop-blur`'a geçen sabit header
- [x] Header cam efekti (glassmorphism) — yarı saydam `border-white/10` sınırlar, `bg-white/5` sekmeler/arama, hero üzerinde `bg-black/30 backdrop-blur-md`
- [x] Minimalist açılış header'ı — sayfa başında yalnızca ortalanmış LOGO, scroll (>100px) sonrası tam iki satırlı navbar fade-in
- [x] Sabit yapılı header fade-in — scroll'da yalnızca opacity geçişi, yükseklik/düzen hiç değişmiyor (layout shift yok)
- [x] Sayfa bazlı header görünürlüğü — fade-in mantığı yalnızca ana sayfada; alt sayfalarda tam navbar her zaman görünür
- [x] Mobil drawer etkileşim düzeltmeleri — body scroll kilidi (scroll bleed yok), drawer içi `overflow-y-auto max-h-screen`, backdrop tıklamasıyla kapanma
- [x] Hero baskın sola-hizalı tipografi düzenine geçirildi — dev `LOGO` tipografisi, vinyet overlay, çift aksiyon butonu
- [x] Ana sayfaya **ÖZEL KOLEKSİYON** ürün vitrini eklendi — mobilde yatay kaydırmalı şerit, sm+ ızgara; kartlar görsel + başlık + fiyat (indirimde üstü çizili eski fiyat)

## Yapılacaklar (TODO)

- [ ] Footer bileşeninin yazılması
- [ ] Gerçek görseller ve logonun eklenmesi

## Değişiklik Kaydı

- **Mobil drawer etkileşim düzeltmeleri:** `Header.tsx`'e `isMenuOpen` bağımlı yeni `useEffect` eklendi — menü açıkken `document.body.style.overflow = "hidden"`, kapalıyken/cleanup'ta `"unset"` (arka plan sayfası kilitleniyor, scroll bleed yok; cleanup sayesinde state değişse bile overflow asla takılı kalmıyor). `MobileMenu.tsx`'teki navigasyon listesine `max-h-screen` eklendi (`flex-1 overflow-y-auto` ile birlikte) — içerik ekran yüksekliğini aşarsa yalnızca drawer içinde kayar. Backdrop (karartma katmanı) zaten `onClick={onClose}` ile kapanıyordu — doğrulandı, değişiklik gerekmedi.

- **Hero "baskın sola hizalı tipografi" düzenine geçirildi (image_9):** İçerik konumu `absolute top-1/2 left-[5%] -translate-y-1/2 text-left` oldu. Tipografi: üstte ince kicker "YENİ SEZON — 2026" (`text-neutral-400 text-sm`), onun altında dev marka tipografisi `text-8xl md:text-[12rem] font-extrabold leading-none tracking-tight text-white` ("LOGO"), altında `max-w-lg text-neutral-200` açıklama ve `mb-10`, en altta iki butonluk satır: beyaz `bg-white text-black px-8 py-3` (KOLEKSİYONU KEŞFET — HeroCta, vitrine scroll) + kırmızı `bg-[#C6213A] text-white px-8 py-3` (YENİ GELENLER → `/categories/yeni-gelenler`, hover `#a91b30`) — keskin, geometrik butonlar (rounded yok). Arka plan görselinde `object-cover object-center` + vinyet: `bg-linear-to-r from-black/70 via-black/35 to-black/45` (sol tarafta metin bölgesi daha koyu). `HeroCta` butonu `px-8 py-3` stiline güncellendi (eski `px-10 py-4 mt-10` kaldırıldı). Responsive: mobilde `text-8xl` (96px), md+ `12rem` (192px) — "LOGO" dar ekranlarda taşmıyor; header ile çakışma yok (içerik dikey ortada, header üstte şeffaf).

- **Sayfa bazlı header görünürlüğü:** `isHomepage = pathname === "/"` türetildi; `showControls = !isHomepage || isScrolled`. Ana sayfada önceki davranış korunuyor (başlangıçta yalnızca LOGO, scroll >100px sonrası fade-in). Alt sayfalarda (`/categories/...`, `/product/...`, `/[gender]` vb.) scroll mantığı tamamen devre dışı: tam iki satırlı navbar, kontroller ve `bg-black/90 border-b border-white/10` arka plan en üstten itibaren `opacity-100 pointer-events-auto` (inert yok). Header arka planı: ana sayfa scroll'da `bg-black/80`, alt sayfalarda `bg-black/90`.

- **Sabit yapılı fade-in header (layout shift düzeltmesi):** İki ayrı durum div'i (minimal logo satırı + kaydırılabilir tam navbar) kaldırıldı; header artık **tek sabit yapı**: üst bar (`h-16 sm:h-20`) + alt bar (`h-11`, md+) her zaman yerinde — scroll durumu yüksekliği/dezreni değiştirmiyor. LOGO her zaman aynı koordinatlarda (üst barın orta sütunu) görünür. Scroll geçişi yalnızca **opacity** üzerinden: çevre elemanlar (sol sekmeler/hamburger, sağ arama+ikonlar, alt kategori linkleri) `transition-opacity duration-500 ease-in-out` ile `opacity-0 pointer-events-none inert` ↔ `opacity-100 pointer-events-auto` arasında yerinde geçiş yapıyor. Header arka planı `transition-colors duration-500` ile `bg-transparent` ↔ `bg-black/80 backdrop-blur-md border-b border-white/10` (border-b her iki durumda da var, `border-transparent` → renk geçişi; sıçrama yok). Gölge kaldırıldı.

- **Minimalist açılış header'ı:** `window.scrollY > 100` eşiğiyle iki durumlu header — sayfa başında (hero üzerinde) yalnızca ortalanmış `LOGO` görünür (sekmeler, arama, ikonlar ve alt bar tamamen gizli, `pointer-events-none`); scroll geçince tüm iki satırlı navbar `bg-black/90 backdrop-blur-md` + `border-b border-white/10` ile `duration-300 ease-in-out` fade-in/slide-down yapıyor. Her iki durum aynı fixed header içinde `opacity`/`translate` geçişiyle yönetiliyor (layout sıçraması yok); logo tek `Logo` bileşeninden render ediliyor (minimal durumda `justify-center`, tam barda `justify-self-center`). Hero CTA'sı client `HeroCta` bileşenine dönüştü — `scrollIntoView({ behavior: "smooth" })` ile `#products-section`'a kaydırıyor; vitrin bölümüne `id="products-section"` + `scroll-mt-32` (fixed header altında kalmaması için) eklendi. Mobilde de aynı davranış: başlangıçta yalnızca logo, scroll sonrası hamburger dahil tam header.

- **Header glassmorphism iyileştirmesi:** Opak `border-neutral-800`/`border-neutral-900` sınırlar yarı saydam `border-white/10`'a çevrildi (sekmeler kabı, arama çubuğu, alt bar ayracı, header alt çizgisi). Cinsiyet sekmeleri ve arama çubuğu `bg-white/5` + `backdrop-blur-sm` cam dokusu kazandı; aktif sekme `bg-white/15`, hover `bg-white/10`. Header'ın hero üzerindeki hali `bg-transparent` → `bg-black/30 backdrop-blur-md border-b border-white/10` oldu (scroll'da `bg-black/90` + aynı alt çizgi). İkon/metin kontrastı `text-neutral-200` tabanına yükseltildi (hamburger, ikon butonları, arama ikonu, ellipsis).

- **Tam ekran hero + şeffaf navbar:** Ana sayfanın üst bölümü `h-svh w-full relative overflow-hidden` tam ekran hero'ya dönüştü; `next/image` `fill` + `priority` + `object-cover` ile `/images/hero/photo-1711915506137-dd9e9b3488a1.avif` (gerçek dosya adı; `hero-main.avif` değil) kullanılıyor, üstünde `bg-linear-to-t from-black/80 via-black/25 to-black/40` karartma gradyanı var. İçerik ortalanmış: kicker + "EL YAPIMI DERİ KOLEKSİYONU" + "Zamana meydan okuyan zanaat." + beyaz "KOLEKSİYONU KEŞFET" CTA'sı (`/categories/yeni-gelenler`). Eski iki sütunlu hero (tote-bag silüeti SVG) kaldırıldı. Header `sticky` → `fixed inset-x-0 top-0 z-50` oldu; `useEffect` scroll listener'ı (`window.scrollY > 50`) ile sayfa yükünde şeffaf, aşağı kaydırınca `bg-black/90 backdrop-blur-md` + hafif gölge (`transition-all duration-300`). Fixed header içeriğin altında kaldığı için kategori, ürün detay ve cinsiyet sayfalarına üst boşluk eklendi (`pt-24 sm:pt-36`).

- **Dinamik cinsiyet rotası eklendi (`/[gender]`):** `src/types/product.ts`'e `Gender = "kadin" | "erkek" | "unisex"` tipi ve `Product.gender` alanı eklendi; `MOCK_PRODUCTS`'e gender değerleri atandı (cüzdan/kartlık → unisex, süet çanta → kadin, anahtarlık → erkek). `getProductsByGender(gender)` helper'ı: `unisex` ise tüm ürünleri, değilse eşleşenleri döner. `src/app/[gender]/page.tsx`: Promise `params`, `isGender` tip koruması (bilinmeyen değer → `notFound()`), `generateStaticParams` (kadin/erkek/unisex) + `generateMetadata` ("KADIN KOLEKSİYONU" vb.). Sayfa banner + aynı `CategoryView`'i (filtre, toolbar, grid/list toggle) yeniden kullanıyor. Header'da `usePathname()` ile aktif sekme vurgusu (`aria-current="page"` + `bg-neutral-800`).

- **Görünüm değiştirici (grid/list) eklendi:** `src/components/CategoryView.tsx` (client) oluşturuldu; `useState<'grid-4' | 'grid-3' | 'grid-2' | 'list'>('grid-4')` ile çalışıyor. Toolbar ikonlarına tıklayınca `viewMode` güncellenir; aktif mod `aria-pressed` + beyaz border ile işaretlenir. Izgara sınıfları `GRID_LAYOUTS` haritasından geliyor (`grid-4`: 2/lg:4, `grid-3`: 2/lg:3, `grid-2`: 2/lg:2). Liste modunda `ProductCard variant="list"` kullanılıyor — `flex-col sm:flex-row` yatay düzen, `sm:w-72` sabit görsel, yıldız değerlendirme placeholder'ı (4 dolu + 1 boş), `line-clamp-2` kısaltılmış açıklama ve fiyat; görsel üzerindeki aksiyon butonları (kalp/göz/karşılaştır) korunuyor. Mod geçişlerinde `animate-fade-in-up` (globals.css'te `@theme` + `@keyframes` ile tanımlı, Tailwind v4 deseni) ile yumuşak belirme. Sayfa server component kaldı; client kısım yalnızca `CategoryView`.

- **Kategori liste sayfası eklendi (`/categories/[slug]`):** Üstte `Anasayfa / ⭐ YENİ GELENLER` breadcrumb'ı ve ortalanmış büyük başlık. Row 1: ortalanmış STOK DURUMU / FİYAT filtre butonları (chevron'lu, `bg-neutral-900`). Row 2: solda 4/3/2 sütun + liste görünüm ikonları (varsayılan 4 sütun aktif), sağda "Sayfa Başına Öğe Sayısı" (varsayılan 20) ve "Sıralama Ölçütü" (varsayılan Öne çıkan) native `<select>`'leri (custom chevron, `appearance-none`). Slug→başlık eşlemesi `CATEGORIES_BY_SLUG` haritasında; kategori değeri olan slug'lar (`canta`, `aksesuar`) `getProductsByCategory` ile filtreleniyor, diğerleri `MOCK_PRODUCTS`'in tamamını gösteriyor; bilinmeyen slug → `notFound()`. `generateStaticParams` + `generateMetadata` eklendi. Izgara: `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.

- **ProductCard aksiyon overlay'leri:** `showActions` prop'u eklendi — kategori görünümünde görselin sağ üstünde dikey üç beyaz buton (kalp Favorilere ekle, göz Hızlı görünüm, döngü Karşılaştır); masaüstünde hover ile sağdan kayarak belirir, mobilde kalıcı. Butonların Link içine gömülmemesi için kart kökü `div.group` oldu. Ana sayfadaki kartlar eski "İncele" overlay'iyle devam ediyor (`showActions` varsayılan false).

- **Link rotaları `/categories/[...]`'e taşındı:** Header alt barı, mobil menü ve ana sayfa kategori kartları `/urunler/...` yerine `/categories/...`'e; hero "İncele" ve "Tümünü Gör" butonları `/categories/yeni-gelenler`'e yönlendirildi (eski `/urunler` rotası yoktu).

- **Detay sayfası etkileşimleri eklendi:** `src/components/ProductGallery.tsx` (client bileşen) — masaüstünde solda dikey thumbnail listesi + sağında ana görsel, thumbnail tıklaması `useState(activeIndex)` ile ana görseli değiştiriyor (aktif thumb'da beyaz border); mobilde ana görsel üstte, thumbnail'ler yatay kaydırmalı şerit olarak altta (`flex-col-reverse` + `overflow-x-auto`). Ana görselde hover zoom: `group-hover:scale-110` + `overflow-hidden` + `cursor-zoom-in`. Sayfa server component kaldı (metadata/static params korunuyor); yalnızca galeri client. Sağ panelde SEPETE EKLE butonunun yanına minimalist kalp (favori) butonu eklendi (`w-14`, border kutu, hover'da border+ikonda beyaza geçiş). Görsel adlandırma standardına geçildi: `productN-imageM.avif` — ürün 1 → `product1-image1` + `product1-image2` (2 görsel; `product1-image3.avif` henüz diskte yok), ürün 2/3/4 → kendi `productN-image1` görselleri. Eski `product-imageN` / `product-image-detailN` adları klasörden kalktı. Galeri: `images[0]` varsayılan aktif, tüm `images` thumbnail olarak listeleniyor (değişiklik gerekmedi).

- **Ürün detay sayfası eklendi (`/product/[slug]`):** Next.js 15+ standardına uygun `params: Promise<{ slug: string }>` (await ile okunuyor). `getProductBySlug()` helper'ı `src/data/products.ts`'e eklendi; ürün bulunamazsa `notFound()`. `generateStaticParams()` ile 4 mock ürün derleme zamanında statik üretiliyor, `generateMetadata()` başlık/açıklama sağlıyor. Layout: solda `lg:sticky` görsel galerisi (ilk görselde `priority`), sağda kategori/büyük başlık/fiyat (`3.450 TL`), açıklama, Renk + Beden seçici placeholder'ları, beyaz **SEPETE EKLE** butonu ve `<details>` tabanlı "Kargo & Teslimat" / "Bakım Talimatları" akordeonları (açılınca `+` ikonu 45° döner). `ProductCard` linki `/urunler/[slug]` yerine `/product/[slug]` olarak güncellendi.

- **Vitrin gerçek verilere bağlandı:** `src/components/ProductCard.tsx` oluşturuldu — `next/image` ile `images[0]` (fill + `object-cover`, `aspect-3/4`, responsive `sizes`), hover'da görsel zoom (`scale-105`) + alttan beliren "İncele" katmanı, kategori/title/price alanlarında yumuşak renk geçişi. Fiyat `toLocaleString("tr-TR")` ile "3.450 TL" biçiminde. `page.tsx`'teki statik `SHOWCASE_PRODUCTS` ve yerel kart kaldırıldı; vitrin `MOCK_PRODUCTS` üzerinde `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` ile çalışıyor (mobildeki yatay kaydırma şeridi yerine temiz ızgara).

- **Ürün veri mimarisi ve mock veri seti eklendi:** `src/types/product.ts` içinde `Product` interface (`id`, `title`, `slug`, `price`, `category`, `images`, `isFeatured?`, `description`) tanımlandı. `src/data/products.ts` içinde 4 el yapımı deri ürünü (`MOCK_PRODUCTS`) oluşturuldu — görseller `public/images/products/product-image{1-4}.avif` (dosya adları `product-imageN.avif` biçiminde; istenen `product-N.avif` değil). Yardımcı fonksiyonlar: `getFeaturedProducts()` (isFeatured filtresi) ve `getProductsByCategory(category)`. Kategoriler sitedeki mevcut değerlerle uyumlu (ÇANTA / AKSESUAR).

- **Marka fontu eklendi:** `next/font/google` (Geist) kaldırıldı; yerine `next/font/local` ile `src/app/fonts/custom-brand-font.woff2` yüklendi (`variable: "--font-custom"`, `body` className'ine enjekte edildi). Tailwind v4 CSS-first yapılandırmasıyla `globals.css` içindeki `@theme inline { --font-sans: var(--font-custom, …) }` eşlemesi sayesinde `font-sans` utility'si ve varsayılan site fontu marka fontu oldu (tailwind.config dosyası gerekmedi — proje Tailwind v4 kullanıyor).

- **Header responsive düzeltmesi:** `LOGO PLACEHOLDER` metni `LOGO` olarak kısaltıldı (taşma/komşu eleman itmesi önlendi). Mobil (<md) üst barda yalnızca hamburger (sol), `LOGO` (orta) ve sepet/wishlist ikonları (sağ) kalıyor; KADIN/ERKEK/UNISEX sekmeleri, arama çubuğu ve alt kategori linkleri tamamen gizlendi. Üst bar mobilde `flex justify-between items-center w-full`, masaüstünde (md+) 3 sütunlu grid olarak çalışıyor; hamburger yalnızca mobilde (`md:hidden`). Hesabım ikonu ve alt bar da yalnızca md+ görünür.

- **Mobil menü ve vitrin eklendi:** Header `"use client"` yapıldı; mobilde hamburger ikonu `useState` ile açılan drawer'ı tetikliyor (`MobileMenu.tsx`: üstte KADIN/ERKEK/UNISEX switcher, ortada dikey kategori listesi — alt menüsü olacak satırlarda `>` işareti — altta Oturum Aç / İstek Listem; Escape, kapatma butonu ve arka plan tıklamasıyla kapanır). Ana sayfada Hero'nun altına ÖZEL KOLEKSİYON vitrini (snap'lı yatay kaydırma + masaüstü ızgarası) eklendi.
