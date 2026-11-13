import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";

/**
 * Turso (cloud SQLite) bağlantısı.
 * - Prodüksiyon/Vercel: `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` env değişkenleri.
 * - Yerel geliştirme: env tanımlı değilse `file:local.db` dosyasına düşer
 *   (token gerekmez). Vercel'de dosya sistemi kalıcı olmadığı için mutlaka
 *   Turso URL/token kullanılmalıdır.
 */
const url = process.env.TURSO_DATABASE_URL ?? "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db: Client = createClient({
  url,
  authToken: authToken || undefined,
});

let initPromise: Promise<void> | null = null;

async function initSchema(): Promise<void> {
  await db.execute(`
    create table if not exists products (
      id text primary key,
      title text not null,
      slug text not null unique,
      description text not null default '',
      price real not null default 0 check (price >= 0),
      category text not null,
      gender text not null default 'unisex' check (gender in ('kadin', 'erkek', 'unisex')),
      image_url text not null default '',
      images text not null default '[]',
      discount_percent real not null default 0 check (discount_percent >= 0 and discount_percent <= 100),
      in_stock integer not null default 1,
      created_at text not null default (datetime('now'))
    )
  `);
  await db.execute(
    "create index if not exists products_slug_idx on products (slug)",
  );
  await db.execute(
    "create index if not exists products_category_idx on products (category)",
  );

  // Ürün varyantları (renk ve/veya beden). products silinince ilişkili satırlar da silinir.
  await db.execute(`
    create table if not exists product_variants (
      id text primary key,
      product_id text not null references products (id) on delete cascade,
      variant_type text not null default 'both' check (variant_type in ('color', 'size', 'both', 'none')),
      color_name text,
      color_hex text,
      size text,
      price_adjustment real not null default 0,
      stock integer not null default 10
    )
  `);
  // Mevcut kurulumlar için idempotent migrasyon: variant_type sütunu yoksa ekle.
  // Not: SQLite "ADD COLUMN IF NOT EXISTS" desteklemez → PRAGMA ile kontrol edilir.
  const columnInfo = await db.execute(
    "select name from pragma_table_info('product_variants')",
  );
  const hasVariantType = columnInfo.rows.some(
    (row) => String(row.name) === "variant_type",
  );
  if (!hasVariantType) {
    await db.execute(
      "alter table product_variants add column variant_type text not null default 'both'",
    );
  }
  await db.execute(
    "create index if not exists product_variants_product_idx on product_variants (product_id)",
  );
}

/**
 * Tabloların var olduğundan emin olur (cold start'ta ilk sorguda bir kez).
 * Hata durumunda promise sıfırlanır; sonraki çağrı yeniden dener.
 */
export function ensureSchema(): Promise<void> {
  if (!initPromise) {
    initPromise = initSchema().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}
