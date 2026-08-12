export type Gender = "kadin" | "erkek" | "unisex";

export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  gender: Gender;
  images: string[];
  isFeatured?: boolean;
  description: string;
};
