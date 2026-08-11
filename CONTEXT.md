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

## Mevcut Durum

- [x] Klasör yapısı ve Git entegrasyonu tamamlandı
- [x] `src/app/globals.css` temizliği (sadece Tailwind kaldı, siyah tema tabanı hazır)
- [x] Header bileşeni `src/app/layout.tsx` içine eklendi
- [x] Mobil menü (drawer) kuruldu — hamburger ikonuyla açılan tam ekran slide-in panel (`src/components/MobileMenu.tsx`), cinsiyet switcher'ı, alt kategori listesi ve alt aksiyonlar
- [x] Header responsive düzeltmesi: logo `LOGO` olarak kısaltıldı; mobilde (<md) yalnızca hamburger + logo + sepet/wishlist görünür, sekmeler/arama/alt kategori linkleri gizli
- [x] Ana sayfaya **ÖZEL KOLEKSİYON** ürün vitrini eklendi — mobilde yatay kaydırmalı şerit, sm+ ızgara; kartlar görsel + başlık + fiyat (indirimde üstü çizili eski fiyat)

### Değişiklik Kaydı

- **Header responsive düzeltmesi:** `LOGO PLACEHOLDER` metni `LOGO` olarak kısaltıldı (taşma/komşu eleman itmesi önlendi). Mobil (<md) üst barda yalnızca hamburger (sol), `LOGO` (orta) ve sepet/wishlist ikonları (sağ) kalıyor; KADIN/ERKEK/UNISEX sekmeleri, arama çubuğu ve alt kategori linkleri tamamen gizlendi. Üst bar mobilde `flex justify-between items-center w-full`, masaüstünde (md+) 3 sütunlu grid olarak çalışıyor; hamburger yalnızca mobilde (`md:hidden`). Hesabım ikonu ve alt bar da yalnızca md+ görünür.

- **Mobil menü ve vitrin eklendi:** Header `"use client"` yapıldı; mobilde hamburger ikonu `useState` ile açılan drawer'ı tetikliyor (`MobileMenu.tsx`: üstte KADIN/ERKEK/UNISEX switcher, ortada dikey kategori listesi — alt menüsü olacak satırlarda `>` işareti — altta Oturum Aç / İstek Listem; Escape, kapatma butonu ve arka plan tıklamasıyla kapanır). Ana sayfada Hero'nun altına ÖZEL KOLEKSİYON vitrini (snap'lı yatay kaydırma + masaüstü ızgarası) eklendi.

## Yapılacaklar (TODO)

- [ ] Ürün tipi (`Product` interface) ve örnek veri seti (`mockProducts`) tanımlanması (`src/types`, `src/data`) ve vitrinin gerçek verilere bağlanması
- [ ] Footer bileşeninin yazılması
- [ ] Gerçek görseller, fontlar ve logonun eklenmesi
