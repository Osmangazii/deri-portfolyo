"use client";

import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

/** Ücretsiz kargo eşiği (TRY cinsinden; ürün fiyatları TRY). StoreContext seçili para birimine çevirir. */
const FREE_SHIPPING_THRESHOLD_TRY = 1500;

export default function FreeShippingBar() {
  const { subtotal } = useCart();
  const { formatPrice, t } = useStore();

  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD_TRY;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_TRY) * 100);
  const remaining = FREE_SHIPPING_THRESHOLD_TRY - subtotal;

  return (
    <div className="border-b border-neutral-800 px-5 py-4">
      {isFree ? (
        <p className="flex items-center gap-2 text-sm font-medium text-white">
          <GiftIcon className="h-4 w-4 shrink-0 text-[#C9A227]" />
          {t("Tebrikler, Kargonuz Ücretsiz! 🎉")}
        </p>
      ) : (
        <p className="text-sm text-neutral-300">
          {t("Ücretsiz kargo için {{amount}} daha ekleyin").replace(
            "{{amount}}",
            formatPrice(remaining),
          )}
        </p>
      )}

      {/* İlerleme çubuğu + eşik ikonu (barın ucunda) */}
      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isFree
                ? "bg-[#C9A227] shadow-[0_0_10px_rgba(201,162,39,0.6)]"
                : "bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.35)]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <GiftIcon
          className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
            isFree ? "text-[#C9A227]" : "text-neutral-500"
          }`}
        />
      </div>
    </div>
  );
}

type IconProps = {
  className: string;
};

function GiftIcon({ className }: IconProps) {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
