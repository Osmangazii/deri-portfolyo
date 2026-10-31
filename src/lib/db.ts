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
