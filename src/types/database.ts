import type { Gender } from "@/types/product";

/**
 * Supabase şemasıyla birebir eşleşen veritabanı satır tipleri.
 * Uygulama katmanındaki `Product` (src/types/product.ts) ile yapısal olarak
 * uyumludur; yalnızca DB'ye özgü `in_stock` ve `created_at` alanlarını ekler.
 */

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  gender: Gender;
  images: string[];
  in_stock: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: string;
  customer_info: Record<string, unknown> | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}
