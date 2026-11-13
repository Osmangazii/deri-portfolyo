"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import type { CartVariant } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { getDiscountedPrice } from "@/lib/pricing";
import type { Product, ProductVariant, VariantType } from "@/types/product";

type ColorOption = { name: string; hex: string };

const colorKey = (variant: Pick<ProductVariant, "color_name" | "color_hex">) =>
  variant.color_name || variant.color_hex;

function uniqueColors(variants: ProductVariant[]): ColorOption[] {
  const seen = new Map<string, ColorOption>();
  for (const variant of variants) {
    if (!variant.color_name && !variant.color_hex) {
      continue;
    }
    const key = colorKey(variant);
    if (!seen.has(key)) {
      seen.set(key, {
        name: variant.color_name,
        hex: variant.color_hex || "#000000",
      });
    }
  }
  return Array.from(seen.values());
}

function uniqueSizes(variants: ProductVariant[]): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const variant of variants) {
    if (variant.size && !seen.has(variant.size)) {
      seen.add(variant.size);
      list.push(variant.size);
    }
  }
  return list;
}

export default function ProductOptions({ product }: { product: Product }) {
  const { formatPrice, t } = useStore();
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  // Ürünün varyant ekseni: ilk varyanttan türetilir (admin ürün başına tek tip belirler)
  const variantType: VariantType = variants[0]?.variant_type ?? "none";
  const showColor = variantType === "color" || variantType === "both";
  const showSize = variantType === "size" || variantType === "both";

  const colors = useMemo(
    () => (showColor ? uniqueColors(variants) : []),
    [variants, showColor],
  );

  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0]?.name ?? "",
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Renk seçiliyse yalnızca o renge ait varyantları kapsa
  const colorScoped =
    showColor && selectedColor
      ? variants.filter((variant) => colorKey(variant) === selectedColor)
      : variants;

  const sizes = showSize ? uniqueSizes(colorScoped) : [];
  const effectiveSize =
    selectedSize && sizes.includes(selectedSize) ? selectedSize : (sizes[0] ?? null);

  let selectedVariant: ProductVariant | null = null;
  if (variantType === "both") {
    selectedVariant =
      colorScoped.find((variant) => variant.size === effectiveSize) ?? null;
  } else if (variantType === "color") {
    selectedVariant = colorScoped[0] ?? null;
  } else if (variantType === "size") {
    selectedVariant =
      variants.find((variant) => variant.size === effectiveSize) ?? null;
  }

  const basePrice = getDiscountedPrice(product);
  const adjustment = selectedVariant?.price_adjustment ?? 0;
  const unitPrice = basePrice + adjustment;
  const discount = product.discount_percent ?? 0;
  const hasDiscount = discount > 0;

  const stock = selectedVariant?.stock ?? null;
  const outOfStock = stock === 0;
  const lowStock = stock !== null && stock > 0 && stock <= 3;

  const cartVariant: CartVariant | undefined = selectedVariant
    ? {
        id: selectedVariant.id,
        variant_type: selectedVariant.variant_type,
        color_name: selectedVariant.color_name,
        color_hex: selectedVariant.color_hex,
        size: selectedVariant.size,
        price_adjustment: selectedVariant.price_adjustment,
      }
    : undefined;

  return (
    <div className="mt-4">
      {/* Fiyat (varyant farkı seçime göre güncellenir) */}
      <div className="flex flex-wrap items-baseline gap-3">
        {hasDiscount && (
          <span className="text-lg text-neutral-500 line-through">
            {formatPrice(product.price + adjustment)}
          </span>
        )}
        <p
          className={`${
            hasDiscount
              ? "text-2xl font-semibold text-white"
              : "text-xl text-neutral-300"
          }`}
        >
          {formatPrice(unitPrice)}
        </p>
        {hasDiscount && (
          <span className="bg-[#C6213A] px-2 py-1 text-[0.65rem] font-bold tracking-wider text-white">
            -%{Math.round(discount)}
          </span>
        )}
      </div>

      {/* Renk seçici — yalnızca color/both tipinde */}
      {showColor && (
        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Renk
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = color.name === selectedColor;
              return (
                <button
                  key={color.name || color.hex}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color.name);
                    setSelectedSize(null);
                  }}
                  aria-pressed={active}
                  aria-label={color.name || color.hex}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                    active
                      ? "border-white text-white"
                      : "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  {color.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Beden seçici — yalnızca size/both tipinde */}
      {showSize && (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Beden
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variantForSize =
                colorScoped.find((variant) => variant.size === size) ??
                variants.find((variant) => variant.size === size);
              const soldOut = (variantForSize?.stock ?? 0) <= 0;
              const active = size === effectiveSize;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={active}
                  disabled={soldOut}
                  className={`cursor-pointer border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? "border-white text-white"
                      : "border-neutral-700 text-neutral-300 hover:border-white hover:text-white"
                  }`}
                >
                  {size}
                  {soldOut ? " · Tükendi" : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Akıllı stok göstergesi */}
      {selectedVariant && outOfStock && (
        <p className="mt-4 inline-flex items-center gap-1.5 border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-red-400">
          {t("Tükendi")}
        </p>
      )}
      {selectedVariant && lowStock && (
        <p className="mt-4 inline-flex items-center gap-1.5 border border-amber-900/60 bg-amber-950/30 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-amber-400">
          Son {stock} ürün!
        </p>
      )}

      {/* Sepete ekle + favorilere ekle */}
      <div className="mt-10 flex gap-3">
        <AddToCartButton
          product={product}
          variant={cartVariant}
          disabled={outOfStock}
          label={outOfStock ? t("Tükendi") : undefined}
          className="flex-1 cursor-pointer bg-white py-4 text-sm font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          aria-label="Favorilere ekle"
          title="Favorilere ekle"
          className="flex w-14 cursor-pointer items-center justify-center border border-neutral-700 text-neutral-300 transition-colors hover:border-white hover:text-white"
        >
          <HeartIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
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
