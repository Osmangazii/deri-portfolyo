import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "El Yapımı Deri Cüzdan",
    slug: "el-yapimi-deri-cuzdan",
    price: 1850,
    category: "ÇANTA",
    images: [
      "/images/products/product-image1.avif",
      "/images/products/product-image-detail1.avif",
    ],
    isFeatured: true,
    description:
      "Bitkisel tabaklanmış deriden, elde dikilmiş klasik çift katlı cüzdan. Zamanla benzersiz bir patina kazanır.",
  },
  {
    id: "2",
    title: "Süet Deri Çanta",
    slug: "suet-deri-canta",
    price: 6900,
    category: "ÇANTA",
    images: [
      "/images/products/product-image2.avif",
      "/images/products/product-image-detail2.avif",
    ],
    isFeatured: true,
    description:
      "Yumuşak süet deriden üretilmiş, keten astarlı günlük omuz çantası. Elde dikilmiş dikişleriyle yıllarca size eşlik eder.",
  },
  {
    id: "3",
    title: "Deri Anahtarlık",
    slug: "deri-anahtarlik",
    price: 450,
    category: "AKSESUAR",
    images: ["/images/products/product-image3.avif"],
    description:
      "Tek parça deriden kesilen, pirinç halkalı sade anahtarlık. Küçük ama her gün elinize değen bir zanaat parçası.",
  },
  {
    id: "4",
    title: "Minimalist Kartlık",
    slug: "minimalist-kartlik",
    price: 950,
    category: "AKSESUAR",
    images: ["/images/products/product-image4.avif"],
    isFeatured: true,
    description:
      "Altı karta kadar taşıyan, ince ve hafif minimalist kartlık. Cebe sığan, elde dikilmiş zarif bir parça.",
  },
];

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((product) => product.isFeatured);
}

export function getProductsByCategory(category: string): Product[] {
  return MOCK_PRODUCTS.filter((product) => product.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}
