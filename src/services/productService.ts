import { randomUUID } from "node:crypto";
import { db, ensureSchema } from "@/lib/db";
import { MOCK_PRODUCTS } from "@/data/products";
import type { Gender, Product, ProductVariant, VariantType } from "@/types/product";
import type { AdminProduct, ProductRow, VariantRow } from "@/types/database";

// ------------------------------------------------------------
// Satır → uygulama tipi dönüşümleri
// ------------------------------------------------------------

function parseImages(row: ProductRow): string[] {
  try {
    const parsed = JSON.parse(row.images) as unknown;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed as string[];
    }
  } catch {
    // Bozuk JSON — image_url'e geri düş
  }
  return row.image_url ? [row.image_url] : [];
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    price: Number(row.price),
    discount_percent: Number(row.discount_percent ?? 0),
    category: row.category,
    gender: row.gender,
    images: parseImages(row),
    description: row.description,
  };
}

function mapRowToAdmin(
  row: ProductRow,
  variants: ProductVariant[] = [],
): AdminProduct {
  return {
    ...mapRow(row),
    discount_percent: Number(row.discount_percent ?? 0),
    in_stock: Number(row.in_stock) === 1,
    created_at: row.created_at,
    variants,
  };
}

function normalizeVariantType(value: unknown): VariantType {
  return value === "color" || value === "size" || value === "none" || value === "both"
    ? value
    : "both";
}

function mapVariant(row: VariantRow): ProductVariant {
  return {
    id: row.id,
    product_id: row.product_id,
    variant_type: normalizeVariantType(row.variant_type),
    color_name: row.color_name ?? "",
    color_hex: row.color_hex ?? "",
    size: row.size ?? "",
    price_adjustment: Number(row.price_adjustment ?? 0),
    stock: Number(row.stock ?? 0),
  };
}

/** Verilen ürün id'leri için varyantları tek sorguda getirip gruplar. Hata → boş map. */
async function fetchVariantsByProductIds(
  productIds: string[],
): Promise<Map<string, ProductVariant[]>> {
  const grouped = new Map<string, ProductVariant[]>();
  if (productIds.length === 0) {
    return grouped;
  }

  try {
    const placeholders = productIds.map(() => "?").join(", ");
    const result = await db.execute({
      sql: `select * from product_variants where product_id in (${placeholders}) order by color_name, size`,
      args: productIds,
    });

    for (const row of result.rows as unknown as VariantRow[]) {
      const variant = mapVariant(row);
      const list = grouped.get(variant.product_id) ?? [];
      list.push(variant);
      grouped.set(variant.product_id, list);
    }
  } catch {
    // Varyant tablosu yok/erişilemez — ürün listesi yine dönsün
  }

  return grouped;
}

async function attachVariants(products: Product[]): Promise<Product[]> {
  if (products.length === 0) {
    return products;
  }
  const grouped = await fetchVariantsByProductIds(products.map((p) => p.id));
  return products.map((product) => ({
    ...product,
    variants: grouped.get(product.id) ?? [],
  }));
}

function asRows(rows: unknown): ProductRow[] {
  return rows as ProductRow[];
}

// ------------------------------------------------------------
// Vitrin sorguları (fallback: MOCK_PRODUCTS)
// ------------------------------------------------------------

/**
 * Stokta olan tüm ürünleri getirir. Sorgu hata verirse (kurulum/ağ)
 * veya tablo boşsa MOCK_PRODUCTS'e yumuşak geçiş yapar.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    await ensureSchema();
    const result = await db.execute(
      "select * from products where in_stock = 1 order by created_at desc",
    );
    if (result.rows.length === 0) {
      return MOCK_PRODUCTS;
    }
    return attachVariants(asRows(result.rows).map(mapRow));
  } catch {
    return MOCK_PRODUCTS;
  }
}

/**
 * Kategori + cinsiyet bileşik filtrelemesi (opsiyonel parametreler).
 * 'unisex' = tümü; 'kadin' = kadin+unisex; 'erkek' = erkek+unisex.
 * Hata durumunda boş dizi döner (mock karışımı yok).
 */
export async function getProductsFiltered(filter: {
  category?: string;
  gender?: string;
}): Promise<Product[]> {
  try {
    await ensureSchema();
    const conditions = ["in_stock = 1"];
    const args: Array<string | number> = [];

    if (filter.category) {
      conditions.push("category = ?");
      args.push(filter.category);
    }
    if (filter.gender && filter.gender !== "unisex") {
      conditions.push("gender in (?, 'unisex')");
      args.push(filter.gender);
    }

    const result = await db.execute({
      sql: `select * from products where ${conditions.join(" and ")} order by created_at desc`,
      args,
    });

    return attachVariants(asRows(result.rows).map(mapRow));
  } catch {
    return [];
  }
}

/** Belirli bir kategorideki ürünler. */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProductsFiltered({ category });
}

/** Cinsiyete göre ürünler: seçilen cinsiyet + unisex. */
export async function getProductsByGender(gender: string): Promise<Product[]> {
  return getProductsFiltered({ gender });
}

/** URL-encoded rota segmentini güvenle çözer (bozuk % dizilerinde orijinali döner). */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Ürünü anahtarla getirir. Anahtar URL'den geldiği için ham ve decode edilmiş
 * halleri denenir (örn. `yeni%20deneme` → `yeni deneme`). Eşleşme sırası:
 * `slug` → `id` → birebir `title`. DB'de bulunamazsa mock veriye düşer;
 * hiçbir yerde yoksa null döner.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const decoded = safeDecode(slug);
  const candidates = Array.from(new Set([slug, decoded])).filter(Boolean);

  try {
    await ensureSchema();

    for (const key of candidates) {
      // 1) slug
      let result = await db.execute({
        sql: "select * from products where slug = ? limit 1",
        args: [key],
      });
      let row = result.rows[0] as unknown as ProductRow | undefined;

      // 2) slug bulunamadıysa id ile dene
      if (!row) {
        result = await db.execute({
          sql: "select * from products where id = ? limit 1",
          args: [key],
        });
        row = result.rows[0] as unknown as ProductRow | undefined;
      }

      // 3) hâlâ yoksa birebir başlık ile dene
      if (!row) {
        result = await db.execute({
          sql: "select * from products where title = ? limit 1",
          args: [key],
        });
        row = result.rows[0] as unknown as ProductRow | undefined;
      }

      if (row) {
        const [withVariants] = await attachVariants([mapRow(row)]);
        return withVariants;
      }
    }
  } catch {
    // DB erişilemez — mock fallback'e düş
  }

  // Mock fallback: slug / id / birebir başlık eşleşmesi
  return (
    MOCK_PRODUCTS.find(
      (product) =>
        candidates.includes(product.slug) ||
        candidates.includes(product.id) ||
        candidates.includes(product.title),
    ) ?? null
  );
}

// ------------------------------------------------------------
// Admin: ürün yönetimi (yalnızca sunucuda; server action'lar üzerinden çağrılır)
// ------------------------------------------------------------

export type VariantInput = {
  variant_type: VariantType;
  color_name: string;
  color_hex: string;
  size: string;
  price_adjustment: number;
  stock: number;
};

export type ProductInput = {
  title: string;
  slug: string;
  description: string;
  price: number;
  /** İndirim yüzdesi (0-100). Belirtilmezse 0. */
  discount_percent?: number;
  category: string;
  gender: Gender;
  images: string[];
  in_stock: boolean;
  /** Renk/beden varyantları (opsiyonel). */
  variants?: VariantInput[];
};

const VARIANT_INSERT_SQL = `insert into product_variants
  (id, product_id, variant_type, color_name, color_hex, size, price_adjustment, stock)
  values (?, ?, ?, ?, ?, ?, ?, ?)`;

function variantInsertStatement(
  variant: ProductVariant,
): { sql: string; args: Array<string | number> } {
  return {
    sql: VARIANT_INSERT_SQL,
    args: [
      variant.id,
      variant.product_id,
      variant.variant_type,
      variant.color_name,
      variant.color_hex,
      variant.size,
      variant.price_adjustment,
      variant.stock,
    ],
  };
}

/** Tüm ürünleri (stok durumu fark etmeksizin) varyantlarıyla birlikte getirir. */
export async function getAllProducts(): Promise<AdminProduct[]> {
  await ensureSchema();
  const result = await db.execute(
    "select * from products order by created_at desc",
  );
  const rows = asRows(result.rows);
  const grouped = await fetchVariantsByProductIds(rows.map((row) => row.id));
  return rows.map((row) => mapRowToAdmin(row, grouped.get(row.id) ?? []));
}

/** Yeni ürün ekler (varsa varyantlarıyla birlikte, tek transaction'da). */
export async function insertProduct(input: ProductInput): Promise<AdminProduct> {
  await ensureSchema();
  const id = randomUUID();
  const images = input.images.map((url) => url.trim()).filter(Boolean);
  const imageUrl = images[0] ?? "";
  const discountPercent = input.discount_percent ?? 0;

  const variants: ProductVariant[] = (input.variants ?? []).map((variant) => ({
    id: randomUUID(),
    product_id: id,
    variant_type: variant.variant_type,
    color_name: variant.color_name,
    color_hex: variant.color_hex,
    size: variant.size,
    price_adjustment: variant.price_adjustment,
    stock: variant.stock,
  }));

  await db.batch(
    [
      {
        sql: `insert into products
                (id, title, slug, description, price, category, gender, image_url, images, discount_percent, in_stock)
              values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          input.title,
          input.slug,
          input.description,
          input.price,
          input.category,
          input.gender,
          imageUrl,
          JSON.stringify(images),
          discountPercent,
          input.in_stock ? 1 : 0,
        ],
      },
      ...variants.map(variantInsertStatement),
    ],
    "write",
  );

  return mapRowToAdmin(
    {
      id,
      title: input.title,
      slug: input.slug,
      description: input.description,
      price: input.price,
      category: input.category,
      gender: input.gender,
      image_url: imageUrl,
      images: JSON.stringify(images),
      discount_percent: discountPercent,
      in_stock: input.in_stock ? 1 : 0,
      created_at: new Date().toISOString(),
    },
    variants,
  );
}

/** Ürünün tüm varyantlarını verilen listeyle değiştirir (sil + yeniden ekle). */
export async function replaceProductVariants(
  productId: string,
  variants: VariantInput[],
): Promise<ProductVariant[]> {
  await ensureSchema();
  const rows: ProductVariant[] = variants.map((variant) => ({
    id: randomUUID(),
    product_id: productId,
    variant_type: variant.variant_type,
    color_name: variant.color_name,
    color_hex: variant.color_hex,
    size: variant.size,
    price_adjustment: variant.price_adjustment,
    stock: variant.stock,
  }));

  await db.batch(
    [
      {
        sql: "delete from product_variants where product_id = ?",
        args: [productId],
      },
      ...rows.map(variantInsertStatement),
    ],
    "write",
  );

  return rows;
}

/** Ürünün stok durumunu günceller. */
export async function toggleProductStock(
  productId: string,
  inStock: boolean,
): Promise<void> {
  await ensureSchema();
  await db.execute({
    sql: "update products set in_stock = ? where id = ?",
    args: [inStock ? 1 : 0, productId],
  });
}

/** Ürünün taban fiyatını günceller (indirim ayrı yönetilir). */
export async function updateProductPrice(
  productId: string,
  price: number,
): Promise<void> {
  await ensureSchema();
  await db.execute({
    sql: "update products set price = ? where id = ?",
    args: [price, productId],
  });
}

/** Ürünün indirim yüzdesini günceller (0 = indirim kaldır). */
export async function updateProductDiscount(
  productId: string,
  discountPercent: number,
): Promise<void> {
  await ensureSchema();
  await db.execute({
    sql: "update products set discount_percent = ? where id = ?",
    args: [discountPercent, productId],
  });
}

/** Ürünü (ve varyantlarını) siler. */
export async function deleteProduct(productId: string): Promise<void> {
  await ensureSchema();
  await db.batch(
    [
      {
        sql: "delete from product_variants where product_id = ?",
        args: [productId],
      },
      { sql: "delete from products where id = ?", args: [productId] },
    ],
    "write",
  );
}
