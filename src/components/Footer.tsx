import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

const QUICK_LINKS: FooterLink[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Kategoriler", href: "/kategori/yeni-gelenler" },
  { label: "Zanaat", href: "/about" },
  { label: "Yeni Gelenler", href: "/kategori/yeni-gelenler" },
];

const CUSTOMER_CARE_LINKS: FooterLink[] = [
  { label: "Deri Bakım Rehberi", href: "#" },
  { label: "Kargo ve Teslimat", href: "#" },
  { label: "İade ve Değişim Politikası", href: "#" },
];

const SOCIAL_LINKS: FooterLink[] = [
  { label: "Instagram", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "E-posta", href: "#" },
];

const PAYMENT_BADGES = ["VISA", "MASTERCARD", "TROY"];

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-16 text-neutral-400 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sütun 1: Marka */}
          <div>
            <span className="text-xl font-semibold uppercase tracking-[0.35em] text-white">
              LOGO
            </span>
            <p className="mt-4 text-sm leading-relaxed">
              Elde dikilen hakiki deri ürünler. Her parça, zamanla güzelleşen
              bir hikaye taşır.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.2em] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Sütun 2: Hızlı erişim */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Hızlı Erişim
            </h3>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 3: Müşteri hizmetleri */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Müşteri Hizmetleri
            </h3>
            <ul className="mt-5 space-y-3">
              {CUSTOMER_CARE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 4: Bülten */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Bülten
            </h3>
            <p className="mt-5 text-sm leading-relaxed">
              E-bültene katılın, yeni koleksiyonlardan ilk siz haberdar olun.
            </p>
            <div className="mt-4 flex border border-white/10 transition-colors focus-within:border-white/40">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                aria-label="E-posta adresiniz"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600"
              />
              <button
                type="button"
                aria-label="Abone ol"
                className="cursor-pointer px-4 text-neutral-400 transition-colors hover:text-white"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Alt bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-neutral-500">
            © 2026 LOGO. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-3">
            {PAYMENT_BADGES.map((badge) => (
              <span
                key={badge}
                className="border border-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-500"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

type IconProps = {
  className: string;
};

function SendIcon({ className }: IconProps) {
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
      <path d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
    </svg>
  );
}
