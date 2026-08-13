"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import { formatPrice } from "@/components/ProductCard";

export default function CartDrawer() {
  const { items, isCartOpen, subtotal, closeCart } = useCart();

  // Sepet açıkken arka plan sayfasının kaymasını engelle
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <div
      className={`fixed inset-0 z-70 ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      inert={!isCartOpen}
    >
      {/* Karartma katmanı */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Alışveriş sepeti"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-900 text-white shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
            SEPETİNİZ
          </h2>
          <button
            type="button"
            aria-label="Sepeti kapat"
            onClick={closeCart}
            className="cursor-pointer text-neutral-400 transition-colors hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Gövde */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-sm text-neutral-400">Sepetiniz henüz boş.</p>
            <Link
              href="/kategori/yeni-gelenler"
              onClick={closeCart}
              className="bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <ul className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </ul>
        )}

        {/* Alt bilgi */}
        {items.length > 0 && (
          <div className="border-t border-neutral-800 px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                Ara Toplam
              </span>
              <span className="text-base font-semibold text-white">
                {formatPrice(subtotal)}
              </span>
            </div>
            <button
              type="button"
              className="mt-4 w-full cursor-pointer bg-white py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#C9A227]"
            >
              SİPARİŞİ TAMAMLA (WHATSAPP)
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();
  const image = item.product.images[0];

  return (
    <li className="flex gap-4">
      <Link
        href={`/product/${item.product.slug}`}
        className="relative aspect-3/4 w-20 shrink-0 overflow-hidden bg-neutral-800"
      >
        {image && (
          <Image src={image} alt={item.product.title} fill sizes="80px" className="object-cover" />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-neutral-500">
              {item.product.category.toLocaleUpperCase("tr-TR")}
            </p>
            <h3 className="mt-0.5 text-sm font-medium text-white">
              {item.product.title}
            </h3>
          </div>
          <button
            type="button"
            aria-label={`${item.product.title} ürününü sepetten çıkar`}
            onClick={() => removeFromCart(item.product.id)}
            className="cursor-pointer text-neutral-500 transition-colors hover:text-white"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-neutral-800">
            <button
              type="button"
              aria-label="Miktarı azalt"
              onClick={() => updateQuantity(item.product.id, -1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              −
            </button>
            <span className="w-8 text-center text-sm text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Miktarı arttır"
              onClick={() => updateQuantity(item.product.id, 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              +
            </button>
          </div>
          <span className="text-sm font-medium text-white">
            {formatPrice(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}

type IconProps = {
  className: string;
};

function CloseIcon({ className }: IconProps) {
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
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TrashIcon({ className }: IconProps) {
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
      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}
