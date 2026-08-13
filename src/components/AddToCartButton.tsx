"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  product,
  className,
  label = "SEPETE EKLE",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className={className}
    >
      {label}
    </button>
  );
}
