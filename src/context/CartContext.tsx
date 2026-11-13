"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getDiscountedPrice } from "@/lib/pricing";
import type { Product, VariantType } from "@/types/product";

/** Sepette taşınan seçili varyant bilgisi. */
export type CartVariant = {
  id: string;
  variant_type: VariantType;
  color_name: string;
  color_hex: string;
  size: string;
  price_adjustment: number;
};

export type CartItem = {
  /** Ürün + varyant kombinasyonunu benzersiz tanımlar. */
  key: string;
  product: Product;
  variant?: CartVariant;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  totalItemCount: number;
  subtotal: number;
  addToCart: (product: Product, variant?: CartVariant) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, delta: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildKey(productId: string, variant?: CartVariant): string {
  return variant ? `${productId}:${variant.id}` : productId;
}

/** Varyant fiyat farkı dahil birim fiyat (TRY). */
export function getUnitPrice(item: Pick<CartItem, "product" | "variant">): number {
  return getDiscountedPrice(item.product) + (item.variant?.price_adjustment ?? 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product: Product, variant?: CartVariant) => {
    const key = buildKey(product.id, variant);
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { key, product, variant, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totalItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getUnitPrice(item) * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isCartOpen,
      totalItemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      closeCart,
    }),
    [
      items,
      isCartOpen,
      totalItemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
