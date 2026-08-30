"use client";

import { useStore } from "@/context/StoreContext";

type PriceProps = {
  /** TRY cinsinden fiyat. */
  value: number;
  className?: string;
};

/** Fiyatı seçili para birimine göre biçimlendirir (server component içinde kullanılabilir). */
export default function Price({ value, className }: PriceProps) {
  const { formatPrice } = useStore();
  return <span className={className}>{formatPrice(value)}</span>;
}
