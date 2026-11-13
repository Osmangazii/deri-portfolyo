"use client";

import { useCart } from "@/context/CartContext";
import type { CartVariant } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
  variant?: CartVariant;
  className?: string;
  label?: string;
  disabled?: boolean;
};

export default function AddToCartButton({
  product,
  variant,
  className,
  label,
  disabled = false,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { t } = useStore();

  return (
    <button
      type="button"
      onClick={() => addToCart(product, variant)}
      disabled={disabled}
      className={className}
    >
      {label ?? t("Sepete Ekle")}
    </button>
  );
}
