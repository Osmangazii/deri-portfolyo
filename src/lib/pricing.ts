import type { Product } from "@/types/product";

/**
 * Ürünün indirim sonrası nihai fiyatını hesaplar.
 * İndirim yoksa (discount_percent <= 0 veya tanımsız) orijinal fiyatı döner.
 * Fiyatlar TRY cinsindendir; görüntüleme StoreContext.formatPrice ile yapılır.
 */
export function getDiscountedPrice(
  product: Pick<Product, "price" | "discount_percent">,
): number {
  const discount = product.discount_percent ?? 0;
  return discount > 0 ? product.price * (1 - discount / 100) : product.price;
}

/** Güvenli indirim yüzdesi: 0-100 aralığına kırpılmış hali (rozet/vitrin için). */
export function getDiscountPercent(
  product: Pick<Product, "discount_percent">,
): number {
  const discount = product.discount_percent ?? 0;
  return Math.min(100, Math.max(0, discount));
}
