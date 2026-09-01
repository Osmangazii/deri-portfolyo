"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ViewMode = "grid-3" | "grid-6";

const GRID_LAYOUTS: Record<ViewMode, string> = {
  // Büyük / geniş görünüm: satırda daha az, daha büyük ürünler
  "grid-3": "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
  // Küçük / kompakt görünüm: satırda daha çok, daha küçük ürünler
  "grid-6": "grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
};

export default function CategoryView({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid-3");

  return (
    <>
      {/* Görünüm değiştirici */}
      <div className="mt-8 flex items-center justify-center border-y border-neutral-900 py-4">
        <div role="group" aria-label="Görünüm seçimi" className="flex items-center gap-1">
          {VIEW_MODES.map((view) => (
            <button
              key={view.mode}
              type="button"
              aria-label={view.label}
              title={view.label}
              aria-pressed={viewMode === view.mode}
              onClick={() => setViewMode(view.mode)}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center border transition-colors ${
                viewMode === view.mode
                  ? "border-white text-white"
                  : "border-neutral-800 text-neutral-500 hover:border-neutral-500 hover:text-neutral-200"
              }`}
            >
              {view.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Ürünler: seçili ızgara görünümü */}
      {products.length === 0 ? (
        <p className="mt-12 text-center text-sm text-neutral-500">
          Bu kategoride henüz ürün bulunmuyor.
        </p>
      ) : (
        <ul
          key={viewMode}
          className={`mt-8 grid animate-fade-in-up ${GRID_LAYOUTS[viewMode]}`}
        >
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} hideIncele />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const VIEW_MODES: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: "grid-3", label: "Geniş görünüm (3 sütun)", icon: <GridIcon columns={3} /> },
  { mode: "grid-6", label: "Kompakt görünüm (6 sütun)", icon: <GridIcon columns={6} /> },
];

function GridIcon({
  columns,
  className = "h-4 w-4",
}: {
  columns: number;
  className?: string;
}) {
  const width = 24 / (columns * 2 - 1);
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {Array.from({ length: columns }, (_, i) => {
        const x = i * (width * 2);
        return <rect key={i} x={x} y="3" width={width} height="18" />;
      })}
    </svg>
  );
}
