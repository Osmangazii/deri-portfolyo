"use client";

import { useStore } from "@/context/StoreContext";

type AccordionProps = {
  /** Çeviri anahtarı olarak da kullanılır (TR metin). */
  title: string;
  children: React.ReactNode;
};

export default function Accordion({ title, children }: AccordionProps) {
  const { t } = useStore();

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:text-white">
        {t(title)}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="h-4 w-4 text-neutral-500 transition-transform duration-300 group-open:rotate-45"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <p className="pb-5 text-sm leading-relaxed text-neutral-400">{children}</p>
    </details>
  );
}
