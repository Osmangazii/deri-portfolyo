"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ViewMode = "grid-4" | "grid-3" | "grid-2" | "list";

const GRID_LAYOUTS: Record<Exclude<ViewMode, "list">, string> = {
  "grid-4": "grid-cols-2 lg:grid-cols-4",
  "grid-3": "grid-cols-2 lg:grid-cols-3",
  "grid-2": "grid-cols-2 lg:grid-cols-2",
};

export default function CategoryView({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");

  const isListView = viewMode === "list";

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

      {/* Ürünler: liste veya ızgara görünümü */}
      {products.length === 0 ? (
        <p className="mt-12 text-center text-sm text-neutral-500">
          Bu kategoride henüz ürün bulunmuyor.
        </p>
      ) : isListView ? (
        <ul
          key="list"
          className="mt-8 flex animate-fade-in-up flex-col divide-y divide-neutral-800"
        >
          {products.map((product) => (
            <li key={product.id} className="py-6 first:pt-0">
              <ProductCard product={product} showActions variant="list" />
            </li>
          ))}
        </ul>
      ) : (
        <ul
          key={viewMode}
          className={`mt-8 grid animate-fade-in-up gap-4 sm:gap-6 ${GRID_LAYOUTS[viewMode]}`}
        >
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} showActions />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const VIEW_MODES: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: "grid-4", label: "4 sütun görünüm", icon: <GridIcon columns={4} /> },
  { mode: "grid-3", label: "3 sütun görünüm", icon: <GridIcon columns={3} /> },
  { mode: "grid-2", label: "2 sütun görünüm", icon: <GridIcon columns={2} /> },
  { mode: "list", label: "Liste görünümü", icon: <ListIcon /> },
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

function ListIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
