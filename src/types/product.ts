export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  images: string[];
  isFeatured?: boolean;
  description: string;
};
