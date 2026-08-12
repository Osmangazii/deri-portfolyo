import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryView from "@/components/CategoryView";
import { getProductsByCategory, MOCK_PRODUCTS } from "@/data/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

type CategoryInfo = {
  title: string;
  /** Veri setindeki kategori değeriyle eşleşirse ürünler filtrelenir, yoksa tümü gösterilir. */
  category?: string;
};

const CATEGORIES_BY_SLUG: Record<string, CategoryInfo> = {
  "yeni-gelenler": { title: "⭐ YENİ GELENLER" },
  "ust-giyim": { title: "ÜST GİYİM" },
  "alt-giyim": { title: "ALT GİYİM" },
  "dis-giyim": { title: "DIŞ GİYİM" },
  "canta": { title: "ÇANTA", category: "ÇANTA" },
  "aksesuar": { title: "AKSESUAR", category: "AKSESUAR" },
  "giyim": { title: "GIYIM" },
};

export function generateStaticParams() {
  return Object.keys(CATEGORIES_BY_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const info = CATEGORIES_BY_SLUG[slug];

  if (!info) {
    return { title: "Kategori Bulunamadı" };
  }

  return { title: info.title };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const info = CATEGORIES_BY_SLUG[slug];

  if (!info) {
    notFound();
  }

  const products = info.category
    ? getProductsByCategory(info.category)
    : MOCK_PRODUCTS;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-500"
      >
        <Link href="/" className="transition-colors hover:text-white">
          Anasayfa
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-neutral-300">{info.title}</span>
      </nav>

      {/* Sayfa başlığı */}
      <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {info.title}
      </h1>

      {/* Filtre + görünüm kontrolleri ve ürünler (client) */}
      <CategoryView products={products} />
    </main>
  );
}
