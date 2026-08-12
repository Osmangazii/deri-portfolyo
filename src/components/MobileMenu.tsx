import Link from "next/link";
import { useEffect } from "react";

type NavLink = {
  label: string;
  href: string;
};

type MobileNavSection = NavLink & {
  hasSubmenu: boolean;
};

const GENDER_TABS: NavLink[] = [
  { label: "KADIN", href: "/kadin" },
  { label: "ERKEK", href: "/erkek" },
  { label: "UNISEX", href: "/unisex" },
];

const NAV_SECTIONS: MobileNavSection[] = [
  { label: "YENİ GELENLER", href: "/categories/yeni-gelenler", hasSubmenu: false },
  { label: "ÜST GİYİM", href: "/categories/ust-giyim", hasSubmenu: true },
  { label: "ALT GİYİM", href: "/categories/alt-giyim", hasSubmenu: true },
  { label: "DIŞ GİYİM", href: "/categories/dis-giyim", hasSubmenu: true },
  { label: "ÇANTA", href: "/categories/canta", hasSubmenu: true },
  { label: "AKSESUAR", href: "/categories/aksesuar", hasSubmenu: true },
];

const BOTTOM_ACTIONS: NavLink[] = [
  { label: "Oturum Aç", href: "/hesap" },
  { label: "İstek Listem", href: "/istek-listesi" },
];

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div className="fixed inset-0 z-60 md:hidden" inert={!open}>
      {/* Karartma katmanı */}
      <div
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
        className={`absolute inset-y-0 left-0 flex h-dvh w-80 max-w-[85%] flex-col border-r border-neutral-900 bg-black transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Üst: cinsiyet switcher + kapat */}
        <div className="flex items-center justify-between gap-3 border-b border-neutral-900 px-4 py-4">
          <div className="flex items-center gap-1 rounded-md border border-neutral-800 p-1">
            {GENDER_TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={onClose}
                className="rounded px-2.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800 hover:text-neutral-400"
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={onClose}
            className="cursor-pointer text-neutral-300 transition-colors hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Orta: dikey navigasyon listesi */}
        <nav
          aria-label="Mobil gezinme"
          className="flex-1 overflow-y-auto px-4"
        >
          <ul className="divide-y divide-neutral-900">
            {NAV_SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 text-sm font-medium uppercase tracking-[0.15em] text-neutral-100 transition-colors hover:text-neutral-400"
                >
                  {section.label}
                  {section.hasSubmenu && (
                    <ChevronIcon className="h-4 w-4 text-neutral-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Alt: aksiyonlar */}
        <div className="border-t border-neutral-900 px-4 py-3">
          <ul className="divide-y divide-neutral-900">
            {BOTTOM_ACTIONS.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  onClick={onClose}
                  className="block py-4 text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

type IconProps = {
  className: string;
};

function ChevronIcon({ className }: IconProps) {
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
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
