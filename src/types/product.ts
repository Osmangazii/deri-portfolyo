export type Gender = "kadin" | "erkek" | "unisex";

/** Ürünün sunduğu varyant eksenleri. */
export type VariantType = "color" | "size" | "both" | "none";

/** Ürün varyantı (renk ve/veya beden kombinasyonu). */
export type ProductVariant = {
  id: string;
  product_id: string;
  /** Bu varyantın tipi; alanların hangilerinin kullanıldığını belirler. */
  variant_type: VariantType;
  /** Kullanılmıyorsa boş string. */
  color_name: string;
  color_hex: string;
  /** Kullanılmıyorsa boş string. */
  size: string;
  /** Taban (indirimli) fiyata eklenen fark; negatif olabilir. */
  price_adjustment: number;
  stock: number;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  /** İndirim yüzdesi (0-100). 0 veya tanımsız = indirim yok. */
  discount_percent?: number;
  category: string;
  gender: Gender;
  images: string[];
  isFeatured?: boolean;
  description: string;
  /** Renk/beden varyantları (varsa). */
  variants?: ProductVariant[];
};
