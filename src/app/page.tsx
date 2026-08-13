import Image from "next/image";
import Link from "next/link";
import HeroCta from "@/components/HeroCta";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/productService";

type Category = {
  name: string;
  href: string;
};

const CATEGORIES: Category[] = [
  { name: "ÇANTA", href: "/kategori/canta" },
  { name: "CÜZDAN", href: "/kategori/cuzdan" },
  { name: "KEMER", href: "/kategori/kemer" },
  { name: "AKSESUAR", href: "/kategori/aksesuar" },
];

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero: baskın sola hizalı tipografi */}
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/hero/photo-1711915506137-dd9e9b3488a1.avif"
          alt="El yapımı deri koleksiyonu"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Vinyet karartma — beyaz metin okunabilirliği için */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/45" />

        {/* İçerik: solda hizalanmış dev tipografi */}
        <div className="absolute top-1/2 left-[5%] w-[90%] -translate-y-1/2 text-left sm:left-[7%]">
          <p className="text-sm font-light uppercase tracking-[0.35em] text-neutral-400">
            YENİ SEZON — 2026
          </p>
          <h1 className="mt-4 text-8xl font-extrabold leading-none tracking-tight text-white md:text-[12rem]">
            LOGO
          </h1>
          <p className="mb-10 mt-6 max-w-lg text-base leading-relaxed text-neutral-200">
            Elde dikilen çanta, cüzdan ve aksesuarlar. Her parça, yıllar içinde
            size eşlik eden gerçek deriden üretilir.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <HeroCta />
            <Link
              href="/kategori/yeni-gelenler"
              className="bg-[#C6213A] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a91b30]"
            >
              YENİ GELENLER
            </Link>
          </div>
        </div>
      </section>

      {/* Özel koleksiyon vitrini */}
      <section
        id="products-section"
        className="scroll-mt-32 border-t border-neutral-900 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              ÖZEL KOLEKSİYON
            </h2>
            <p className="mt-3 text-sm text-neutral-400 sm:text-base">
              Elden ele geçen, zamansız deri parçalar
            </p>
          </div>

          {/* Ürün ızgarası: 1 → 2 → 4 sütun */}
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="border-t border-zinc-800 px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Kategoriler
            </h2>
            <Link
              href="/kategori/yeni-gelenler"
              className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-white"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {CATEGORIES.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  return (
    <Link href={category.href} className="group block">
      <div className="relative aspect-3/4 overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-800 to-zinc-950 transition-transform duration-500 group-hover:scale-105" />
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
          0{index + 1}
        </p>
      </div>
      <p className="mt-5 text-center text-sm font-semibold uppercase tracking-[0.3em] text-zinc-300 transition-colors group-hover:text-white">
        {category.name}
      </p>
    </Link>
  );
}
