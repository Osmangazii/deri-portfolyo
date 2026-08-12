import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];

  return (
    <Link href={`/urunler/${product.slug}`} className="group block">
      {/* Görsel alanı */}
      <div className="relative aspect-3/4 overflow-hidden bg-neutral-900">
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        {/* Hover'da beliren incele katmanı */}
        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="w-full pb-5 text-center text-[0.65rem] font-medium uppercase tracking-[0.3em] text-white">
            İncele
          </span>
        </div>
      </div>

      {/* Bilgi alanı */}
      <div className="mt-4">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 group-hover:text-neutral-300">
          {product.category}
        </p>
        <h3 className="mt-1.5 truncate text-sm font-medium text-neutral-100 transition-colors duration-300 group-hover:text-white">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-400">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("tr-TR")} TL`;
}
