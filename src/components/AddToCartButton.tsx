"use client";

import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  product,
  className,
  label,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { t } = useStore();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className={className}
    >
      {label ?? t("Sepete Ekle")}
    </button>
  );
}
