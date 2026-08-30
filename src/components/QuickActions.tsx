"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type QuickActionsProps = {
  product: Product;
};

export default function QuickActions({ product }: QuickActionsProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  // Butonlar görsel üzerinde Link dışında olsa da nav tetiklenmesin diye çifte güvence
  const stop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 transition-opacity duration-200 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
      <QuickActionButton
        label={isWishlisted ? "Favorilerden çıkar" : "Favorilere ekle"}
        onClick={(e) => {
          stop(e);
          setIsWishlisted((v) => !v);
        }}
      >
        <HeartIcon
          className={`h-4 w-4 ${isWishlisted ? "fill-current text-[#C6213A]" : ""}`}
        />
      </QuickActionButton>
      <QuickActionButton
        label="Sepete ekle"
        onClick={(e) => {
          stop(e);
          addToCart(product);
        }}
      >
        <BagIcon className="h-4 w-4" />
      </QuickActionButton>
    </div>
  );
}

type QuickActionButtonProps = {
  label: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

function QuickActionButton({
  label,
  className,
  onClick,
  children,
}: QuickActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

type IconProps = {
  className: string;
};

function HeartIcon({
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
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function BagIcon({ className }: IconProps) {
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
      <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
    </svg>
  );
}
