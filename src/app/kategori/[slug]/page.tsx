import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryView from "@/components/CategoryView";
import { getProductsFiltered } from "@/services/productService";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type CategoryInfo = {
  title: string;
  /** DB'deki kategori değeri; varsa ürünler bu kategoriden sorgulanır, yoksa tüm ürünler gösterilir. */
  category?: string;
};

const CATEGORIES_BY_SLUG: Record<string, CategoryInfo> = {
  "yeni-gelenler": { title: "⭐ YENİ GELENLER" },
  "canta": { title: "ÇANTA", category: "canta" },
  "cuzdan": { title: "CÜZDAN", category: "cuzdan" },
  "kemer": { title: "KEMER", category: "kemer" },
  "aksesuar": { title: "AKSESUAR", category: "aksesuar" },
};

const GENDERS = ["kadin", "erkek", "unisex"] as const;

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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const info = CATEGORIES_BY_SLUG[slug];

  if (!info) {
    notFound();
  }

  const rawGender = (await searchParams).gender;
  const gender =
    typeof rawGender === "string" &&
    (GENDERS as readonly string[]).includes(rawGender)
      ? rawGender
      : undefined;

  // Bileşik filtre: kategori (varsa) + cinsiyet (opsiyonel)
  const products = await getProductsFiltered({
    category: info.category,
    gender,
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-36 lg:px-8">
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
