"use client";

import type { VariantInput } from "@/services/productService";
import type { VariantType } from "@/types/product";

/** Form içinde tutulan (string tabanlı) varyant satırı. */
export type VariantDraft = {
  color_name: string;
  color_hex: string;
  size: string;
  price_adjustment: string;
  stock: string;
};

export function emptyVariantDraft(): VariantDraft {
  return {
    color_name: "",
    color_hex: "#000000",
    size: "",
    price_adjustment: "0",
    stock: "10",
  };
}

export function variantsToDrafts(
  variants: {
    color_name: string;
    color_hex: string;
    size: string;
    price_adjustment: number;
    stock: number;
  }[],
): VariantDraft[] {
  return variants.map((variant) => ({
    color_name: variant.color_name,
    color_hex: variant.color_hex || "#000000",
    size: variant.size,
    price_adjustment: String(variant.price_adjustment),
    stock: String(variant.stock),
  }));
}

/**
 * Form satırlarını varyant tipine göre normalize edip `VariantInput[]`'a
 * dönüştürür. Kullanılmayan alanlar boş string olarak saklanır; boş satırlar atlanır.
 */
export function draftsToInput(
  drafts: VariantDraft[],
  variantType: VariantType,
): VariantInput[] {
  if (variantType === "none") {
    return [];
  }

  const usesColor = variantType === "color" || variantType === "both";
  const usesSize = variantType === "size" || variantType === "both";

  return drafts
    .filter((draft) => {
      if (variantType === "color") {
        return draft.color_name.trim().length > 0;
      }
      if (variantType === "size") {
        return draft.size.trim().length > 0;
      }
      return draft.color_name.trim().length > 0 || draft.size.trim().length > 0;
    })
    .map((draft) => ({
      variant_type: variantType,
      color_name: usesColor ? draft.color_name.trim() || "Renk" : "",
      color_hex: usesColor ? draft.color_hex || "#000000" : "",
      size: usesSize ? draft.size.trim() || "Tek Beden" : "",
      price_adjustment: Number(draft.price_adjustment) || 0,
      stock: Math.max(0, Math.round(Number(draft.stock) || 0)),
    }));
}

const FIELD_CLASS =
  "border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-600";

export default function VariantEditor({
  variantType,
  drafts,
  onChange,
}: {
  variantType: VariantType;
  drafts: VariantDraft[];
  onChange: (drafts: VariantDraft[]) => void;
}) {
  const usesColor = variantType === "color" || variantType === "both";
  const usesSize = variantType === "size" || variantType === "both";

  const update = (index: number, patch: Partial<VariantDraft>) => {
    onChange(
      drafts.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)),
    );
  };
  const add = () => onChange([...drafts, emptyVariantDraft()]);
  const remove = (index: number) =>
    onChange(drafts.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {drafts.map((draft, index) => (
        <div key={index} className="flex flex-wrap items-center gap-2">
          {usesColor && (
            <>
              <input
                value={draft.color_name}
                onChange={(e) => update(index, { color_name: e.target.value })}
                placeholder="Renk adı"
                aria-label="Renk adı"
                className={`${FIELD_CLASS} min-w-28 flex-1`}
              />
              <input
                type="color"
                value={draft.color_hex}
                onChange={(e) => update(index, { color_hex: e.target.value })}
                aria-label="Renk kodu"
                title="Renk kodu"
                className="h-9 w-9 cursor-pointer border border-neutral-800 bg-neutral-950 p-0.5"
              />
            </>
          )}

          {usesSize && (
            <input
              value={draft.size}
              onChange={(e) => update(index, { size: e.target.value })}
              placeholder="Beden"
              aria-label="Beden"
              className={`${FIELD_CLASS} w-24`}
            />
          )}

          <input
            type="number"
            value={draft.price_adjustment}
            onChange={(e) => update(index, { price_adjustment: e.target.value })}
            placeholder="Fiyat farkı"
            aria-label="Fiyat farkı"
            className={`${FIELD_CLASS} w-28`}
          />
          <input
            type="number"
            min={0}
            value={draft.stock}
            onChange={(e) => update(index, { stock: e.target.value })}
            placeholder="Stok"
            aria-label="Stok"
            className={`${FIELD_CLASS} w-20`}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label="Varyantı kaldır"
            title="Varyantı kaldır"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-neutral-800 text-neutral-400 transition-colors hover:border-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="cursor-pointer border border-neutral-800 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-neutral-300 transition-colors hover:border-white hover:text-white"
      >
        + Varyant Ekle
      </button>
    </div>
  );
}
