-- ============================================================
-- Deri Portfolyo — Turso / SQLite başlangıç seed verisi
-- MOCK_PRODUCTS'ten dönüştürüldü. `slug` çakışmasında satırı
-- günceller (idempotent — tekrar çalıştırılabilir).
-- ============================================================

insert into products
  (id, title, slug, description, price, category, gender, image_url, images, discount_percent, in_stock)
values
  (
    'seed-cuzdan',
    'El Yapımı Deri Cüzdan',
    'el-yapimi-deri-cuzdan',
    'Bitkisel tabaklanmış deriden, elde dikilmiş klasik çift katlı cüzdan. Zamanla benzersiz bir patina kazanır.',
    1850,
    'cuzdan',
    'unisex',
    '/images/products/product1-image1.avif',
    '["/images/products/product1-image1.avif","/images/products/product1-image2.avif"]',
    0,
    1
  ),
  (
    'seed-canta',
    'Süet Deri Çanta',
    'suet-deri-canta',
    'Yumuşak süet deriden üretilmiş, keten astarlı günlük omuz çantası. Elde dikilmiş dikişleriyle yıllarca size eşlik eder.',
    6900,
    'canta',
    'kadin',
    '/images/products/product2-image1.avif',
    '["/images/products/product2-image1.avif"]',
    20,
    1
  ),
  (
    'seed-anahtarlik',
    'Deri Anahtarlık',
    'deri-anahtarlik',
    'Tek parça deriden kesilen, pirinç halkalı sade anahtarlık. Küçük ama her gün elinize değen bir zanaat parçası.',
    450,
    'aksesuar',
    'erkek',
    '/images/products/product3-image1.avif',
    '["/images/products/product3-image1.avif"]',
    0,
    1
  ),
  (
    'seed-kartlik',
    'Minimalist Kartlık',
    'minimalist-kartlik',
    'Altı karta kadar taşıyan, ince ve hafif minimalist kartlık. Cebe sığan, elde dikilmiş zarif bir parça.',
    950,
    'aksesuar',
    'unisex',
    '/images/products/product4-image1.avif',
    '["/images/products/product4-image1.avif"]',
    10,
    1
  ),
  (
    'seed-kemer',
    'Deri Kemer',
    'deri-kemer',
    'Tek parça bitkisel tabaklanmış deriden kesilen, pirinç tokalı zamansız kemer. Her gün kullanıma dayanacak şekilde tasarlandı.',
    1450,
    'kemer',
    'unisex',
    '/images/products/product5-image1.avif',
    '["/images/products/product5-image1.avif"]',
    15,
    1
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  category = excluded.category,
  gender = excluded.gender,
  image_url = excluded.image_url,
  images = excluded.images,
  discount_percent = excluded.discount_percent,
  in_stock = excluded.in_stock;
