import type { Gender, Product } from "@/types/product";

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

/** Admin panelinde kullanılan ürün tipi (uygulama Product + stok/tarih alanları). */
export type AdminProduct = Product & {
  /** Admin tarafında her zaman tanımlı (DB default 0). */
  discount_percent: number;
  in_stock: boolean;
  created_at: string;
};
