"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileMenu from "@/components/MobileMenu";

type NavLink = {
  label: string;
  href: string;
};

const GENDER_TABS: NavLink[] = [
  { label: "KADIN", href: "/kadin" },
  { label: "ERKEK", href: "/erkek" },
  { label: "UNISEX", href: "/unisex" },
];

const CATEGORY_LINKS: NavLink[] = [
  { label: "YENİ GELENLER", href: "/categories/yeni-gelenler" },
  { label: "ÜST GİYİM", href: "/categories/ust-giyim" },
  { label: "ALT GİYİM", href: "/categories/alt-giyim" },
  { label: "DIŞ GİYİM", href: "/categories/dis-giyim" },
  { label: "ÇANTA", href: "/categories/canta" },
];

const WISHLIST_COUNT = 2;
const CART_COUNT = 3;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black">
      {/* Üst bar: mobilde flex (hamburger | logo | ikonlar), md+ 3 sütunlu grid */}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 md:grid md:grid-cols-3 md:gap-4 lg:px-8">
        {/* Sol: hamburger (mobil) + cinsiyet sekmeleri (md+) */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Menüyü aç"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="cursor-pointer text-neutral-300 transition-colors hover:text-white md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <nav
            aria-label="Koleksiyon sekmeleri"
            className="hidden items-center gap-1 rounded-md border border-neutral-800 p-1 md:flex"
          >
            {GENDER_TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={pathname === tab.href ? "page" : undefined}
                className={`rounded px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors sm:text-sm sm:tracking-[0.25em] ${
                  pathname === tab.href
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Orta: logo */}
        <Link href="/" className="justify-self-center whitespace-nowrap">
          <span className="text-lg font-semibold uppercase tracking-[0.3em] text-white sm:text-xl sm:tracking-[0.35em]">
            LOGO
          </span>
        </Link>

        {/* Sağ: arama (md+) + aksiyon ikonları (mobilde yalnızca wishlist + sepet) */}
        <div className="flex items-center justify-self-end gap-3 sm:gap-5">
          {/* Arama çubuğu (masaüstü) */}
          <div className="hidden items-center gap-2 rounded-full border border-neutral-800 px-3 py-2 transition-colors focus-within:border-neutral-500 md:flex">
            <SearchIcon className="h-4 w-4 text-neutral-400" />
            <input
              type="search"
              placeholder="Ara"
              aria-label="Ürün ara"
              className="w-24 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500 lg:w-32"
            />
          </div>
          <IconButton label="Hesabım" className="hidden md:block">
            <UserIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Wishlist" badgeCount={WISHLIST_COUNT}>
            <HeartIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Sepetim" badgeCount={CART_COUNT}>
            <BagIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      {/* Alt bar: alt kategori linkleri (yalnızca md+) */}
      <nav
        aria-label="Alt kategoriler"
        className="hidden h-11 items-center gap-5 overflow-x-auto border-t border-neutral-900 px-4 scrollbar-none md:flex md:justify-center md:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-neutral-100 transition-colors hover:text-neutral-400"
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          aria-label="Daha fazla kategori"
          className="cursor-pointer text-neutral-300 transition-colors hover:text-neutral-400"
        >
          <EllipsisIcon className="h-4 w-4" />
        </button>
      </nav>

      {/* Mobil menü (drawer) */}
      <MobileMenu open={isMenuOpen} onClose={closeMenu} />
    </header>
  );
}

type IconButtonProps = {
  label: string;
  className?: string;
  badgeCount?: number;
  children: React.ReactNode;
};

function IconButton({ label, className, badgeCount, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`relative cursor-pointer text-neutral-300 transition-colors hover:text-white ${className ?? ""}`}
    >
      {children}
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-none text-black">
          {badgeCount}
        </span>
      )}
    </button>
  );
}

type IconProps = {
  className: string;
};

function MenuIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
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
      <path d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
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
      <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function HeartIcon({ className }: IconProps) {
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

function EllipsisIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}
