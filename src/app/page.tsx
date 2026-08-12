import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";

type Category = {
  name: string;
  href: string;
};

const CATEGORIES: Category[] = [
  { name: "GIYIM", href: "/urunler/giyim" },
  { name: "AKSESUAR", href: "/urunler/aksesuar" },
  { name: "ÇANTA", href: "/urunler/canta" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:min-h-[calc(100vh-7.75rem)] lg:grid-cols-2">
        {/* Görsel alanı */}
        <div className="relative flex items-center justify-center overflow-hidden bg-linear-to-br from-zinc-800 via-zinc-900 to-black">
          <svg
            viewBox="0 0 200 240"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-56 w-auto text-zinc-700 sm:h-72"
            aria-hidden="true"
          >
            {/* Tote bag silüeti */}
            <path d="M58 88h84l12 132H46L58 88z" />
            <path d="M70 88c0-32 60-32 60 0" />
            <path d="M64 132h72" />
            <path d="M66 156h68" />
            <path d="M68 180h64" />
          </svg>
          <p className="absolute bottom-6 left-6 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-zinc-600">
            Görsel Alanı
          </p>
        </div>

        {/* Metin ve CTA */}
        <div className="flex flex-col items-start justify-center px-6 py-24 sm:px-12 lg:px-20 lg:py-0">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-400">
            El Yapımı Deri Eşyalar
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Deri, zamana meydan okur.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
            Elde dikilen çanta, cüzdan ve aksesuarlar. Her parça, yıllar içinde
            size eşlik eden gerçek deriden üretilir.
          </p>
          <Link
            href="/urunler"
            className="mt-10 inline-flex items-center bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200"
          >
            İncele
          </Link>
        </div>
      </section>

      {/* Özel koleksiyon vitrini */}
      <section className="border-t border-neutral-900 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
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
              href="/urunler"
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
