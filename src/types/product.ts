export type Gender = "kadin" | "erkek" | "unisex";

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
};
