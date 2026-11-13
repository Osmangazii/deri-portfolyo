import type { Gender, Product, ProductVariant } from "@/types/product";

/**
 * Turso/SQLite `products` tablosunun ham satır tipi.
 * - `in_stock` SQLite'ta 0/1 olarak saklanır.
 * - `images` JSON metni olarak saklanır; `image_url` birincil görseldir.
 */
export interface ProductRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  gender: Gender;
  image_url: string;
  images: string;
  discount_percent: number;
  in_stock: number;
  created_at: string;
}

/** Turso/SQLite `product_variants` tablosunun ham satır tipi. */
export interface VariantRow {
  id: string;
  product_id: string;
  variant_type: string;
  color_name: string | null;
  color_hex: string | null;
  size: string | null;
  price_adjustment: number;
  stock: number;
}

/** Admin panelinde kullanılan ürün tipi (uygulama Product + stok/tarih + varyantlar). */
export type AdminProduct = Product & {
  /** Admin tarafında her zaman tanımlı (DB default 0). */
  discount_percent: number;
  in_stock: boolean;
  created_at: string;
  variants: ProductVariant[];
};
