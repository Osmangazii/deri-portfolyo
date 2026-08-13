import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type NavLink = {
  label: string;
  href: string;
};

const GENDER_TABS: NavLink[] = [
  { label: "KADIN", href: "/kadin" },
  { label: "ERKEK", href: "/erkek" },
  { label: "UNISEX", href: "/unisex" },
];

const NAV_SECTIONS: NavLink[] = [
  { label: "ÇANTA", href: "/kategori/canta" },
  { label: "CÜZDAN", href: "/kategori/cuzdan" },
  { label: "KEMER", href: "/kategori/kemer" },
  { label: "AKSESUAR", href: "/kategori/aksesuar" },
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Aktif cinsiyet: cinsiyet rotasından veya ?gender= parametresinden
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

  // Kategori linklerine aktif cinsiyeti ?gender= olarak eklenir
  const categoryHref = (href: string) =>
    activeGender ? `${href}?gender=${activeGender}` : href;

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
          className="max-h-screen flex-1 overflow-y-auto px-4"
        >
          <ul className="divide-y divide-neutral-900">
            {NAV_SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={categoryHref(section.href)}
                  onClick={onClose}
                  className="block py-4 text-sm font-medium uppercase tracking-[0.15em] text-neutral-100 transition-colors hover:text-neutral-400"
                >
                  {section.label}
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
