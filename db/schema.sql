-- ============================================================
-- Deri Portfolyo — Turso / SQLite şema referansı
-- Tablolar uygulama ilk sorguda otomatik de oluşturulur
-- (src/lib/db.ts → ensureSchema). Bu dosya manuel kurulum içindir.
-- Turso CLI: `turso db shell <db>` üzerinden çalıştırılabilir.
-- ============================================================

create table if not exists products (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text not null default '',
  price real not null default 0 check (price >= 0),
  category text not null,
  gender text not null default 'unisex' check (gender in ('kadin', 'erkek', 'unisex')),
  image_url text not null default '',
  images text not null default '[]', -- JSON dizi: ["/images/...avif", ...]
  discount_percent real not null default 0 check (discount_percent >= 0 and discount_percent <= 100),
  in_stock integer not null default 1, -- 0/1
  created_at text not null default (datetime('now'))
);

create index if not exists products_slug_idx on products (slug);
create index if not exists products_category_idx on products (category);

-- ------------------------------------------------------------
-- Ürün varyantları (renk + beden kombinasyonları)
-- ------------------------------------------------------------
create table if not exists product_variants (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  variant_type text not null default 'both' check (variant_type in ('color', 'size', 'both', 'none')),
  color_name text,
  color_hex text,
  size text,
  price_adjustment real not null default 0,
  stock integer not null default 10
);

-- Mevcut (eski şemalı) kurulumlarda variant_type sütunu yoksa (yalnızca bir kez):
-- alter table product_variants add column variant_type text not null default 'both';
-- (SQLite "ADD COLUMN IF NOT EXISTS" desteklemez; uygulama bunu PRAGMA ile
--  otomatik kontrol edip gerekirse ekler — src/lib/db.ts.)

create index if not exists product_variants_product_idx on product_variants (product_id);
