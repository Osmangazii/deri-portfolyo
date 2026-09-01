import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import Price from "@/components/Price";
import QuickActions from "@/components/QuickActions";
import { getDiscountedPrice } from "@/lib/pricing";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  /** Kategori sayfalarında "İncele" hover overlay'ini gizle (hızlı aksiyon butonları zaten görünür) */
  hideIncele?: boolean;
  variant?: "grid" | "list";
};

export default function ProductCard({
  product,
  hideIncele = false,
  variant = "grid",
}: ProductCardProps) {
  const primaryImage = product.images[0];
  const discount = product.discount_percent ?? 0;
  const hasDiscount = discount > 0;
  const finalPrice = getDiscountedPrice(product);

  if (variant === "list") {
    return (
      <div className="group relative flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Görsel (sabit genişlik) */}
        <div className="relative w-full sm:w-72">
          <Link href={`/product/${product.slug}`} className="block">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-900">
              {primaryImage && (
                <Image
                  src={primaryImage}
                  alt={product.title}
                  fill
                  sizes="(min-width: 640px) 288px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
            </div>
          </Link>
          {hasDiscount && (
            <span className="absolute left-3 top-3 z-10 bg-[#C6213A] px-2 py-1 text-[0.65rem] font-bold tracking-wider text-white">
              -%{Math.round(discount)}
            </span>
          )}
          <QuickActions product={product} />
        </div>

        {/* Detaylar: başlık + yıldız + açıklama + fiyat */}
        <div className="flex flex-1 flex-col">
          <Link href={`/product/${product.slug}`} className="block">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-neutral-500">
              {product.category.toLocaleUpperCase("tr-TR")}
            </p>
            <h3 className="mt-1.5 text-lg font-medium text-white transition-colors duration-300 group-hover:text-neutral-300">
              {product.title}
            </h3>
            <div
              className="mt-2 flex items-center gap-0.5"
              aria-label="Yıldız değerlendirmesi (placeholder)"
            >
              {[0, 1, 2, 3].map((i) => (
                <StarIcon
                  key={i}
                  filled
                  className="h-3.5 w-3.5 text-neutral-200"
                />
              ))}
              <StarIcon className="h-3.5 w-3.5 text-neutral-600" />
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-400">
              {product.description}
            </p>
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              {hasDiscount && (
                <Price
                  value={product.price}
                  className="text-base text-neutral-500 line-through"
                />
              )}
              <p className="text-lg font-medium text-white">
                <Price value={finalPrice} />
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      {/* Görsel */}
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-900">
            {primaryImage && (
              <Image
                src={primaryImage}
                alt={product.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            )}
            {!hideIncele && (
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="w-full pb-5 text-center text-[0.65rem] font-medium uppercase tracking-[0.3em] text-white">
                  İncele
                </span>
              </div>
            )}
          </div>
        </Link>
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 bg-[#C6213A] px-2 py-1 text-[0.65rem] font-bold tracking-wider text-white">
            -%{Math.round(discount)}
          </span>
        )}
        <QuickActions product={product} />
      </div>

      {/* Bilgi */}
      <div className="mt-4">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 group-hover:text-neutral-300">
          {product.category.toLocaleUpperCase("tr-TR")}
        </p>
        <h3 className="mt-1.5 truncate text-sm font-medium text-neutral-100 transition-colors duration-300 group-hover:text-white">
          {product.title}
        </h3>
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          {hasDiscount && (
            <Price
              value={product.price}
              className="text-sm text-neutral-500 line-through"
            />
          )}
          <p
            className={`text-sm ${
              hasDiscount ? "font-semibold text-white" : "text-neutral-400"
            }`}
          >
            <Price value={finalPrice} />
          </p>
        </div>
        <AddToCartButton
          product={product}
          className="mt-3 w-full cursor-pointer border border-neutral-800 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:border-white hover:bg-white hover:text-black"
        />
      </div>
    </div>
  );
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("tr-TR")} TL`;
}

type IconProps = {
  className: string;
};

function StarIcon({
  className,
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}


