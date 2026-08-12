import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryView from "@/components/CategoryView";
import { getProductsByGender } from "@/data/products";
import type { Gender } from "@/types/product";

type GenderPageProps = {
  params: Promise<{ gender: string }>;
};

const GENDERS: Gender[] = ["kadin", "erkek", "unisex"];

const GENDER_TITLES: Record<Gender, string> = {
  kadin: "KADIN KOLEKSİYONU",
  erkek: "ERKEK KOLEKSİYONU",
  unisex: "UNISEX KOLEKSİYONU",
};

function isGender(value: string): value is Gender {
  return value === "kadin" || value === "erkek" || value === "unisex";
}

export function generateStaticParams() {
  return GENDERS.map((gender) => ({ gender }));
}

export async function generateMetadata({
  params,
}: GenderPageProps): Promise<Metadata> {
  const { gender } = await params;

  if (!isGender(gender)) {
    return { title: "Koleksiyon Bulunamadı" };
  }

  return { title: GENDER_TITLES[gender] };
}

export default async function GenderPage({ params }: GenderPageProps) {
  const { gender } = await params;

  if (!isGender(gender)) {
    notFound();
  }

  const products = getProductsByGender(gender);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Banner */}
      <div className="border-y border-neutral-900 py-14 text-center sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          {GENDER_TITLES[gender]}
        </h1>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">
          El Yapımı Deri Eşyalar
        </p>
      </div>

      {/* Filtre + görünüm kontrolleri ve ürünler (client) */}
      <CategoryView products={products} />
    </main>
  );
}
