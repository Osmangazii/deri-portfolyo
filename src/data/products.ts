import type { Gender, Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "El Yapımı Deri Cüzdan",
    slug: "el-yapimi-deri-cuzdan",
    price: 1850,
    category: "ÇANTA",
    gender: "unisex",
    images: [
      "/images/products/product1-image1.avif",
      "/images/products/product1-image2.avif",
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
    gender: "kadin",
    images: ["/images/products/product2-image1.avif"],
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
    gender: "erkek",
    images: ["/images/products/product3-image1.avif"],
    description:
      "Tek parça deriden kesilen, pirinç halkalı sade anahtarlık. Küçük ama her gün elinize değen bir zanaat parçası.",
  },
  {
    id: "4",
    title: "Minimalist Kartlık",
    slug: "minimalist-kartlik",
    price: 950,
    category: "AKSESUAR",
    gender: "unisex",
    images: ["/images/products/product4-image1.avif"],
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

export function getProductsByGender(gender: Gender): Product[] {
  return gender === "unisex"
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((product) => product.gender === gender);
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}
