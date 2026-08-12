import Image from "next/image";
import Link from "next/link";
import HeroCta from "@/components/HeroCta";
import ProductCard from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";

type Category = {
  name: string;
  href: string;
};

const CATEGORIES: Category[] = [
  { name: "GIYIM", href: "/categories/giyim" },
  { name: "AKSESUAR", href: "/categories/aksesuar" },
  { name: "ÇANTA", href: "/categories/canta" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero: tam ekran */}
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/hero/photo-1711915506137-dd9e9b3488a1.avif"
          alt="El yapımı deri koleksiyonu"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Karartma gradyanı — metin ve navigasyon okunabilirliği için */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/40" />

        {/* İçerik */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-300">
            El Yapımı Deri Eşyalar
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            EL YAPIMI DERİ KOLEKSİYONU
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Zamana meydan okuyan zanaat.
          </p>
          <HeroCta />
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
            {MOCK_PRODUCTS.map((product) => (
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
              href="/categories/yeni-gelenler"
              className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-white"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
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
