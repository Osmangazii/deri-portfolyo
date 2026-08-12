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

const PAGE_SIZE_OPTIONS = [
  { value: "12", label: "12" },
  { value: "20", label: "20" },
  { value: "40", label: "40" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Öne çıkan" },
  { value: "price-asc", label: "Fiyat (artan)" },
  { value: "price-desc", label: "Fiyat (azalan)" },
  { value: "newest", label: "En yeni" },
];

export default function CategoryView({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");

  const isListView = viewMode === "list";

  return (
    <>
      {/* Row 1: Filtreler */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <FilterButton label="STOK DURUMU" />
        <FilterButton label="FİYAT" />
      </div>

      {/* Row 2: Görünüm ve kontrol */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-y border-neutral-900 py-4 sm:flex-row">
        {/* Sol: görünüm değiştirici */}
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

        {/* Sağ: sayfa boyutu + sıralama */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-neutral-500">
              Sayfa Başına Öğe Sayısı
            </span>
            <SelectField
              label="Sayfa başına öğe sayısı"
              defaultValue="20"
              options={PAGE_SIZE_OPTIONS}
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-neutral-500">
              Sıralama Ölçütü
            </span>
            <SelectField
              label="Sıralama ölçütü"
              defaultValue="featured"
              options={SORT_OPTIONS}
            />
          </label>
        </div>
      </div>

      {/* Ürünler: liste veya ızgara görünümü */}
      {isListView ? (
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

function FilterButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 border border-neutral-800 bg-neutral-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
    >
      {label}
      <ChevronDownIcon className="h-3.5 w-3.5 text-neutral-500" />
    </button>
  );
}

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  defaultValue: string;
  options: SelectOption[];
};

function SelectField({ label, defaultValue, options }: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        aria-label={label}
        className="cursor-pointer appearance-none border border-neutral-800 bg-neutral-900 py-2.5 pl-3 pr-8 text-xs font-medium uppercase tracking-[0.15em] text-neutral-300 outline-none transition-colors hover:border-neutral-600 focus:border-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}

type IconProps = {
  className?: string;
};

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

function ChevronDownIcon({ className }: IconProps) {
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
      <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
