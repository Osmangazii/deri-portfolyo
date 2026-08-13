-- ============================================================
-- Deri Portfolyo — Başlangıç seed verisi
-- MOCK_PRODUCTS'ten dönüştürüldü. İlk kurulumda (veya sıfırlama
-- sonrasında) Supabase Dashboard > SQL Editor üzerinden çalıştırılır.
-- `slug` çakışmasında satırı günceller (idempotent — tekrar çalıştırılabilir).
-- ============================================================

insert into public.products (title, slug, description, price, category, gender, images, in_stock)
values
  (
    'El Yapımı Deri Cüzdan',
    'el-yapimi-deri-cuzdan',
    'Bitkisel tabaklanmış deriden, elde dikilmiş klasik çift katlı cüzdan. Zamanla benzersiz bir patina kazanır.',
    1850,
    'cuzdan',
    'unisex',
    array['/images/products/product1-image1.avif', '/images/products/product1-image2.avif'],
    true
  ),
  (
    'Süet Deri Çanta',
    'suet-deri-canta',
    'Yumuşak süet deriden üretilmiş, keten astarlı günlük omuz çantası. Elde dikilmiş dikişleriyle yıllarca size eşlik eder.',
    6900,
    'canta',
    'kadin',
    array['/images/products/product2-image1.avif'],
    true
  ),
  (
    'Deri Anahtarlık',
    'deri-anahtarlik',
    'Tek parça deriden kesilen, pirinç halkalı sade anahtarlık. Küçük ama her gün elinize değen bir zanaat parçası.',
    450,
    'aksesuar',
    'erkek',
    array['/images/products/product3-image1.avif'],
    true
  ),
  (
    'Minimalist Kartlık',
    'minimalist-kartlik',
    'Altı karta kadar taşıyan, ince ve hafif minimalist kartlık. Cebe sığan, elde dikilmiş zarif bir parça.',
    950,
    'aksesuar',
    'unisex',
    array['/images/products/product4-image1.avif'],
    true
  ),
  (
    'Deri Kemer',
    'deri-kemer',
    'Tek parça bitkisel tabaklanmış deriden kesilen, pirinç tokalı zamansız kemer. Her gün kullanıma dayanacak şekilde tasarlandı.',
    1450,
    'kemer',
    'unisex',
    array['/images/products/product5-image1.avif'],
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  category = excluded.category,
  gender = excluded.gender,
  images = excluded.images,
  in_stock = excluded.in_stock;
