"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import type { Currency, Language } from "@/context/StoreContext";

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
  { label: "ÇANTA", href: "/kategori/canta" },
  { label: "CÜZDAN", href: "/kategori/cuzdan" },
  { label: "KEMER", href: "/kategori/kemer" },
  { label: "AKSESUAR", href: "/kategori/aksesuar" },
];

/** Para birimi toggle'ı — arama çubuğuyla aynı pil stili, ilgili SVG ikonlarla. */
const CURRENCY_OPTIONS: {
  value: Currency;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "TRY", label: "TRY", icon: <LiraIcon className="h-4 w-4 fill-current" /> },
  { value: "USD", label: "USD", icon: <DollarIcon className="h-4 w-4 fill-current" /> },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "TR", label: "TR" },
  { value: "EN", label: "EN" },
];

const WISHLIST_COUNT = 2;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHomepage = pathname === "/";
  // Ana sayfada en üstte gizli, scroll'da görünür; diğer tüm sayfalarda her zaman görünür
  const showHeader = !isHomepage || isScrolled;
  const { totalItemCount, toggleCart } = useCart();
  const { currency, language, setCurrency, setLanguage } = useStore();

  // Aktif cinsiyet: cinsiyet rotasından (/kadin vb.) veya ?gender= parametresinden
  const queryGender = searchParams.get("gender");
  const activeGender =
    pathname === "/kadin"
      ? "kadin"
      : pathname === "/erkek"
        ? "erkek"
        : pathname === "/unisex"
          ? "unisex"
          : queryGender === "kadin" || queryGender === "erkek" || queryGender === "unisex"
            ? queryGender
            : undefined;

  // Sekme aktif mi: cinsiyet rotasında mıyız yoksa ?gender= sekmesini mi işaret ediyor
  const isTabActive = (href: string) => {
    const tabGender = href.slice(1); // "/kadin" -> "kadin"
    return pathname === href || queryGender === tabGender;
  };

  // Kategori linklerine aktif cinsiyeti ?gender= olarak ekle (bileşik filtre)
  const categoryHref = (href: string) =>
    activeGender ? `${href}?gender=${activeGender}` : href;

  // Ana sayfada scroll eşiği: >40px'te header görünür. Rota değişince yeniden hesapla.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    // Navigasyon sonrası tarayıcı scroll'u sıfırlayabilir — bir sonraki karede teyit et
    const raf = requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Mobil menü açıkken arka plan sayfasının kaymasını engelle (scroll bleed)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
      <header
        inert={!showHeader}
        className={`fixed left-0 right-0 top-0 z-50 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md transition-all duration-300 ease-in-out ${
          showHeader
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
      {/* Üst bar — yapı her zaman görünür (scroll'da gizlenmez) */}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Sol: hamburger (mobil) + cinsiyet sekmeleri (md+) */}
        <div className="flex min-w-0 flex-1 items-center">
          <button
            type="button"
            aria-label="Menüyü aç"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="cursor-pointer text-neutral-200 transition-colors hover:text-white md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <nav
            aria-label="Koleksiyon sekmeleri"
            className="hidden shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1 md:flex"
          >
            {GENDER_TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isTabActive(tab.href) ? "page" : undefined}
                className={`rounded px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors sm:text-sm sm:tracking-[0.25em] ${
                  isTabActive(tab.href)
                    ? "bg-white font-semibold text-black"
                    : "text-neutral-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Orta: logo (esnemez, ortalı) */}
        <Logo className="shrink-0" />

        {/* Sağ: dil/para birimi + arama + aksiyon ikonları (mobilde yalnızca wishlist + sepet) */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-4">
          {/* Para birimi & dil toggle'ları (xl+; arama çubuğuyla aynı pil stili) */}
          <div className="hidden shrink-0 items-center gap-1.5 xl:flex">
            {CURRENCY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCurrency(option.value)}
                aria-label={`Para birimi: ${option.label}`}
                aria-pressed={currency === option.value}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                  currency === option.value
                    ? "border-white bg-white text-black"
                    : "border-neutral-800 bg-neutral-950/50 text-neutral-300 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}

            <span className="mx-0.5 h-4 w-px bg-white/10" aria-hidden="true" />

            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                aria-label={`Dil: ${option.label === "TR" ? "Türkçe" : "English"}`}
                aria-pressed={language === option.value}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                  language === option.value
                    ? "border-white bg-white text-black"
                    : "border-neutral-800 bg-neutral-950/50 text-neutral-300 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {/* Arama çubuğu (masaüstü) */}
          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm transition-colors focus-within:border-white/40 md:flex">
            <SearchIcon className="h-4 w-4 text-neutral-300" />
            <input
              type="search"
              placeholder="Ara"
              aria-label="Ürün ara"
              className="w-24 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            />
          </div>
          <IconButton label="Hesabım" className="hidden md:block">
            <UserIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Wishlist" badgeCount={WISHLIST_COUNT}>
            <HeartIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Sepetim" badgeCount={totalItemCount} onClick={toggleCart}>
            <BagIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      {/* Alt bar: ana kategoriler (yalnızca md+, her zaman görünür) */}
      <nav
        aria-label="Alt kategoriler"
        className="hidden h-11 items-center gap-5 overflow-x-auto border-t border-neutral-900 px-4 scrollbar-none md:flex md:justify-center md:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={categoryHref(link.href)}
            className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-neutral-100 transition-colors hover:text-neutral-400"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobil menü (drawer) */}
      <MobileMenu open={isMenuOpen} onClose={closeMenu} />
    </header>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`whitespace-nowrap ${className}`}>
      <span className="text-lg font-semibold uppercase tracking-[0.3em] text-white sm:text-xl sm:tracking-[0.35em]">
        LOGO
      </span>
    </Link>
  );
}

type IconButtonProps = {
  label: string;
  className?: string;
  badgeCount?: number;
  onClick?: () => void;
  children: React.ReactNode;
};

function IconButton({ label, className, badgeCount, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`relative shrink-0 cursor-pointer text-neutral-200 transition-colors hover:text-white ${className ?? ""}`}
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

/** Türk lirası (₺) ikonu — Font Awesome Free. */
function LiraIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 640 640"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M256 96C273.7 96 288 110.3 288 128L288 171.6L409.4 136.9C422.1 133.3 435.4 140.6 439.1 153.4C442.8 166.2 435.4 179.4 422.6 183.1L288 221.6L288 267.7L409.4 233C422.1 229.4 435.4 236.7 439.1 249.5C442.8 262.3 435.4 275.5 422.6 279.2L288 317.7L288 480.2L360 480.2C413 480.2 456 437.2 456 384.2C456 366.5 470.3 352.2 488 352.2C505.7 352.2 520 366.5 520 384.2C520 472.6 448.4 544.2 360 544.2L256 544.2C238.3 544.2 224 529.9 224 512.2L224 336L198.6 343.3C185.9 346.9 172.6 339.6 168.9 326.8C165.2 314 172.6 300.8 185.4 297.1L224 286.1L224 240L198.6 247.3C185.9 250.9 172.6 243.6 168.9 230.8C165.2 218 172.6 204.8 185.4 201.1L224 190.1L224 128.2C224 110.5 238.3 96.2 256 96.2z" />
    </svg>
  );
}

/** Dolar ($) ikonu — Font Awesome Free. */
function DollarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 640 640"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M296 88C296 74.7 306.7 64 320 64C333.3 64 344 74.7 344 88L344 128L400 128C417.7 128 432 142.3 432 160C432 177.7 417.7 192 400 192L285.1 192C260.2 192 240 212.2 240 237.1C240 259.6 256.5 278.6 278.7 281.8L370.3 294.9C424.1 302.6 464 348.6 464 402.9C464 463.2 415.1 512 354.9 512L344 512L344 552C344 565.3 333.3 576 320 576C306.7 576 296 565.3 296 552L296 512L224 512C206.3 512 192 497.7 192 480C192 462.3 206.3 448 224 448L354.9 448C379.8 448 400 427.8 400 402.9C400 380.4 383.5 361.4 361.3 358.2L269.7 345.1C215.9 337.5 176 291.4 176 237.1C176 176.9 224.9 128 285.1 128L296 128L296 88z" />
    </svg>
  );
}