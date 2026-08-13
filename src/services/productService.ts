import { supabase } from "@/lib/supabase/client";
import { MOCK_PRODUCTS } from "@/data/products";
import type { Gender, Product } from "@/types/product";
import type { Product as DbProduct } from "@/types/database";

/**
 * Supabase'ten stokta olan tüm ürünleri getirir.
 * Sorgu hata verirse (ilk kurulum, ağ sorunu) veya boş dönerse
 * MOCK_PRODUCTS'e yumuşak bir geçiş (fallback) yapar.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return MOCK_PRODUCTS;
    }

    return data as Product[];
  } catch {
    return MOCK_PRODUCTS;
  }
}

/**
 * Kategori + cinsiyet bileşik filtrelemesi. Her iki parametre opsiyoneldir:
 * - ikisi de verilirse: .eq('category', category).in('gender', [gender, 'unisex'])
 * - tek parametre: o filtre uygulanır
 * - hiçbiri: tüm stoktaki ürünler
 * Cinsiyet kuralı (standart e-ticaret): 'unisex' = tümü (filtre uygulanmaz);
 * 'kadin' = in('kadin','unisex'); 'erkek' = in('erkek','unisex').
 * Hata durumunda boş dizi döner (mock karışımı yok).
 */
export async function getProductsFiltered(filter: {
  category?: string;
  gender?: string;
}): Promise<Product[]> {
  try {
    let query = supabase.from("products").select("*").eq("in_stock", true);

    if (filter.category) {
      query = query.eq("category", filter.category);
    }
    // 'unisex' tüm ürünleri temsil eder — cinsiyet kısıtı uygulanmaz
    if (filter.gender && filter.gender !== "unisex") {
      query = query.in("gender", [filter.gender, "unisex"]);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

/** Belirli bir kategorideki ürünleri Supabase'ten getirir. Eşleşme yoksa veya hata olursa boş dizi. */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProductsFiltered({ category });
}

/** Cinsiyete göre ürün getirir: seçilen cinsiyet + unisex ürünler. */
export async function getProductsByGender(gender: string): Promise<Product[]> {
  return getProductsFiltered({ gender });
}

/**
 * Slug değerine göre tek bir ürün getirir.
 * Veritabanında bulunamazsa veya sorgu hata verirse mock veriye düşer;
 * hiçbir yerde yoksa null döner.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return MOCK_PRODUCTS.find((product) => product.slug === slug) ?? null;
    }

    return data as Product;
  } catch {
    return MOCK_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }
}

// ------------------------------------------------------------
// Admin: ürün yönetimi (RLS gereği admin oturumu ile çalışır)
// ------------------------------------------------------------

export type ProductInput = {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  gender: Gender;
  images: string[];
  in_stock: boolean;
};

/** Tüm ürünleri (stok durumu fark etmeksizin) getirir. Admin paneline özel. */
export async function getAllProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as DbProduct[];
}

/** Yeni ürün ekler ve eklenen kaydı döner. */
export async function insertProduct(input: ProductInput): Promise<DbProduct> {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as DbProduct;
}

/** Ürünün stok durumunu günceller. */
export async function toggleProductStock(
  productId: string,
  inStock: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ in_stock: inStock })
    .eq("id", productId);

  if (error) {
    throw error;
  }
}

/** Ürünü siler. */
export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw error;
  }
}
