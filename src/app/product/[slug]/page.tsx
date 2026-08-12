import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import { formatPrice } from "@/components/ProductCard";
import { getProductBySlug, MOCK_PRODUCTS } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Ürün Bulunamadı" };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Sol: görsel galerisi (masaüstünde yapışkan) */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Sağ: ürün detayları ve aksiyonlar */}
        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            {product.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-4 text-xl text-neutral-300">
            {formatPrice(product.price)}
          </p>

          <p className="mt-8 leading-relaxed text-neutral-400">
            {product.description}
          </p>

          {/* Renk seçici placeholder */}
          <div className="mt-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Renk
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Kahverengi", "Siyah", "Kum"].map((color) => (
                <button
                  key={color}
                  type="button"
                  className="cursor-pointer border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 transition-colors hover:border-white hover:text-white"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Beden seçici placeholder */}
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Beden
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Tek Beden"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className="cursor-pointer border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 transition-colors hover:border-white hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sepete ekle + favorilere ekle */}
          <div className="mt-10 flex gap-3">
            <button
              type="button"
              className="flex-1 cursor-pointer bg-white py-4 text-sm font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-neutral-200"
            >
              SEPETE EKLE
            </button>
            <button
              type="button"
              aria-label="Favorilere ekle"
              title="Favorilere ekle"
              className="flex w-14 cursor-pointer items-center justify-center border border-neutral-700 text-neutral-300 transition-colors hover:border-white hover:text-white"
            >
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Akordeonlar */}
          <div className="mt-10 divide-y divide-neutral-900 border-y border-neutral-900">
            <Accordion title="Kargo & Teslimat">
              Siparişleriniz 2-4 iş günü içinde, özenle paketlenerek kargoya
              verilir. Kargo detayları (placeholder).
            </Accordion>
            <Accordion title="Bakım Talimatları">
              Deriyi nemden ve doğrudan güneş ışığından koruyun; düzenli olarak
              bakım yağı uygulayın. Elde dikilmiş parçalar zamanla benzersiz bir
              patina kazanır.
            </Accordion>
          </div>
        </div>
      </div>
    </main>
  );
}

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:text-white">
        {title}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="h-4 w-4 text-neutral-500 transition-transform duration-300 group-open:rotate-45"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <p className="pb-5 text-sm leading-relaxed text-neutral-400">{children}</p>
    </details>
  );
}

function HeartIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}
