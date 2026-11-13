import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Accordion from "@/components/Accordion";
import ProductGallery from "@/components/ProductGallery";
import ProductOptions from "@/components/ProductOptions";
import { MOCK_PRODUCTS } from "@/data/products";
import { getProductBySlug } from "@/services/productService";

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
  const product = await getProductBySlug(slug);

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
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-10 pt-24 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
      {/* Sıkı sütun tanımı + items-start: sol sütun sağ sütunun yüksekliğinden bağımsız */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        {/* Sol: görsel galerisi (masaüstünde yapışkan) */}
        <div className="min-w-0 lg:sticky lg:top-32">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Sağ: ürün detayları, varyant seçimi ve aksiyonlar */}
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            {product.category.toLocaleUpperCase("tr-TR")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {product.title}
          </h1>

          {/* Fiyat + renk/beden + sepete ekle (client, varyant state'i) */}
          <ProductOptions product={product} />

          <p className="mt-8 leading-relaxed text-neutral-400">
            {product.description}
          </p>

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
