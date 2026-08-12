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
- [x] Ana sayfaya **ÖZEL KOLEKSİYON** ürün vitrini eklendi — mobilde yatay kaydırmalı şerit, sm+ ızgara; kartlar görsel + başlık + fiyat (indirimde üstü çizili eski fiyat)

## Yapılacaklar (TODO)

- [ ] Footer bileşeninin yazılması
- [ ] Ürün detay sayfasının (`/urunler/[slug]`) yazılması
- [ ] Gerçek görseller ve logonun eklenmesi

## Değişiklik Kaydı

- **Vitrin gerçek verilere bağlandı:** `src/components/ProductCard.tsx` oluşturuldu — `next/image` ile `images[0]` (fill + `object-cover`, `aspect-3/4`, responsive `sizes`), hover'da görsel zoom (`scale-105`) + alttan beliren "İncele" katmanı, kategori/title/price alanlarında yumuşak renk geçişi. Fiyat `toLocaleString("tr-TR")` ile "3.450 TL" biçiminde. `page.tsx`'teki statik `SHOWCASE_PRODUCTS` ve yerel kart kaldırıldı; vitrin `MOCK_PRODUCTS` üzerinde `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` ile çalışıyor (mobildeki yatay kaydırma şeridi yerine temiz ızgara).

- **Ürün veri mimarisi ve mock veri seti eklendi:** `src/types/product.ts` içinde `Product` interface (`id`, `title`, `slug`, `price`, `category`, `images`, `isFeatured?`, `description`) tanımlandı. `src/data/products.ts` içinde 4 el yapımı deri ürünü (`MOCK_PRODUCTS`) oluşturuldu — görseller `public/images/products/product-image{1-4}.avif` (dosya adları `product-imageN.avif` biçiminde; istenen `product-N.avif` değil). Yardımcı fonksiyonlar: `getFeaturedProducts()` (isFeatured filtresi) ve `getProductsByCategory(category)`. Kategoriler sitedeki mevcut değerlerle uyumlu (ÇANTA / AKSESUAR).

- **Marka fontu eklendi:** `next/font/google` (Geist) kaldırıldı; yerine `next/font/local` ile `src/app/fonts/custom-brand-font.woff2` yüklendi (`variable: "--font-custom"`, `body` className'ine enjekte edildi). Tailwind v4 CSS-first yapılandırmasıyla `globals.css` içindeki `@theme inline { --font-sans: var(--font-custom, …) }` eşlemesi sayesinde `font-sans` utility'si ve varsayılan site fontu marka fontu oldu (tailwind.config dosyası gerekmedi — proje Tailwind v4 kullanıyor).

- **Header responsive düzeltmesi:** `LOGO PLACEHOLDER` metni `LOGO` olarak kısaltıldı (taşma/komşu eleman itmesi önlendi). Mobil (<md) üst barda yalnızca hamburger (sol), `LOGO` (orta) ve sepet/wishlist ikonları (sağ) kalıyor; KADIN/ERKEK/UNISEX sekmeleri, arama çubuğu ve alt kategori linkleri tamamen gizlendi. Üst bar mobilde `flex justify-between items-center w-full`, masaüstünde (md+) 3 sütunlu grid olarak çalışıyor; hamburger yalnızca mobilde (`md:hidden`). Hesabım ikonu ve alt bar da yalnızca md+ görünür.

- **Mobil menü ve vitrin eklendi:** Header `"use client"` yapıldı; mobilde hamburger ikonu `useState` ile açılan drawer'ı tetikliyor (`MobileMenu.tsx`: üstte KADIN/ERKEK/UNISEX switcher, ortada dikey kategori listesi — alt menüsü olacak satırlarda `>` işareti — altta Oturum Aç / İstek Listem; Escape, kapatma butonu ve arka plan tıklamasıyla kapanır). Ana sayfada Hero'nun altına ÖZEL KOLEKSİYON vitrini (snap'lı yatay kaydırma + masaüstü ızgarası) eklendi.
