import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  showActions?: boolean;
  variant?: "grid" | "list";
};

export default function ProductCard({
  product,
  showActions = false,
  variant = "grid",
}: ProductCardProps) {
  const primaryImage = product.images[0];

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
          {showActions && <CardActions />}
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
            <p className="mt-4 text-lg font-medium text-white">
              {formatPrice(product.price)}
            </p>
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
            {!showActions && (
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="w-full pb-5 text-center text-[0.65rem] font-medium uppercase tracking-[0.3em] text-white">
                  İncele
                </span>
              </div>
            )}
          </div>
        </Link>
        {showActions && <CardActions />}
      </div>

      {/* Bilgi */}
      <div className="mt-4">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 group-hover:text-neutral-300">
          {product.category.toLocaleUpperCase("tr-TR")}
        </p>
        <h3 className="mt-1.5 truncate text-sm font-medium text-neutral-100 transition-colors duration-300 group-hover:text-white">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-400">
          {formatPrice(product.price)}
        </p>
        <AddToCartButton
          product={product}
          className="mt-3 w-full cursor-pointer border border-neutral-800 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:border-white hover:bg-white hover:text-black"
        />
      </div>
    </div>
  );
}

function CardActions() {
  return (
    <div className="absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 sm:translate-x-3 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
      <ActionButton label="Favorilere ekle">
        <HeartIcon className="h-4 w-4" />
      </ActionButton>
      <ActionButton label="Hızlı görünüm">
        <EyeIcon className="h-4 w-4" />
      </ActionButton>
      <ActionButton label="Karşılaştır">
        <SyncIcon className="h-4 w-4" />
      </ActionButton>
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  children: React.ReactNode;
};

function ActionButton({ label, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center bg-white text-black shadow-lg shadow-black/40 transition-colors hover:bg-neutral-200"
    >
      {children}
    </button>
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

function HeartIcon({ className }: IconProps) {
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

function EyeIcon({ className }: IconProps) {
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
      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SyncIcon({ className }: IconProps) {
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
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}
