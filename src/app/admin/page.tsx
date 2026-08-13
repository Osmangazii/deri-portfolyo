"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { formatPrice } from "@/components/ProductCard";
import {
  deleteProduct,
  getAllProducts,
  insertProduct,
  toggleProductStock,
} from "@/services/productService";
import type { Product } from "@/types/database";
import type { Gender } from "@/types/product";

const CATEGORY_OPTIONS = [
  { value: "canta", label: "Çanta" },
  { value: "cuzdan", label: "Cüzdan" },
  { value: "kemer", label: "Kemer" },
  { value: "aksesuar", label: "Aksesuar" },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "unisex", label: "Unisex" },
  { value: "kadin", label: "Kadın" },
  { value: "erkek", label: "Erkek" },
];

const INPUT_CLASS =
  "w-full border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-600";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ürünler yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getAllProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Ürünler yüklenemedi.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleStock = async (product: Product) => {
    const next = !product.in_stock;
    try {
      await toggleProductStock(product.id, next);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, in_stock: next } : p)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stok güncellenemedi.");
    }
  };

  const handleDelete = async (product: Product) => {
    if (
      !window.confirm(`"${product.title}" kalıcı olarak silinecek. Emin misiniz?`)
    ) {
      return;
    }
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ürün silinemedi.");
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-36 lg:px-8">
      {/* Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          ARTERNATIVE ADMIN PANELİ
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="border border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:border-white hover:text-white"
          >
            Mağazaya Dön
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setError(null);
              loadProducts();
            }}
            className="cursor-pointer border border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:border-white hover:text-white"
          >
            Yenile
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200"
          >
            Ürün Ekle
          </button>
        </div>
      </div>

      {/* Durum mesajları */}
      {error && (
        <p className="mt-6 border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {isLoading && (
        <p className="mt-10 text-center text-sm text-neutral-500">Yükleniyor…</p>
      )}
      {!isLoading && !error && products.length === 0 && (
        <p className="mt-10 text-center text-sm text-neutral-500">
          Henüz ürün yok. “Ürün Ekle” ile başlayın.
        </p>
      )}

      {/* Ürün tablosu */}
      {!isLoading && products.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-170 text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-xs uppercase tracking-[0.2em] text-neutral-500">
                <th className="py-3 pr-4 font-medium">Ürün</th>
                <th className="py-3 pr-4 font-medium">Fiyat</th>
                <th className="py-3 pr-4 font-medium">Kategori</th>
                <th className="py-3 pr-4 font-medium">Stok</th>
                <th className="py-3 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative aspect-3/4 w-12 shrink-0 overflow-hidden bg-neutral-900">
                        <ProductThumb src={product.images[0]} alt={product.title} />
                      </div>
                      <span className="font-medium text-white">{product.title}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-neutral-300">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-4 pr-4 uppercase tracking-wider text-neutral-400">
                    {product.category.toLocaleUpperCase("tr-TR")}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest ${
                        product.in_stock ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          product.in_stock ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      {product.in_stock ? "Stokta" : "Tükendi"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(product)}
                        className="cursor-pointer border border-neutral-800 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-neutral-300 transition-colors hover:border-white hover:text-white"
                      >
                        {product.in_stock ? "Stoğu Kapat" : "Stoğa Aç"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="cursor-pointer border border-red-900/60 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <AddProductModal
          onClose={() => setIsModalOpen(false)}
          onAdded={(product) => setProducts((prev) => [product, ...prev])}
        />
      )}
    </main>
  );
}

/**
 * Admin tablosundaki küçük ürün görseli. Görsel yoksa, kırıksa veya
 * yüklenemezse (onError) sessizce bir placeholder gösterir — uncaught hata yok.
 */
function ProductThumb({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-900">
        <span className="text-[0.5rem] font-medium uppercase tracking-[0.2em] text-neutral-600">
          Görsel Yok
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="48px"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function AddProductModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (product: Product) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    category: "canta",
    gender: "unisex" as Gender,
    description: "",
    images: "",
    in_stock: true,
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(form.price);
    if (!form.title.trim() || !form.slug.trim() || !price || price <= 0) {
      setFormError("Başlık, slug ve geçerli bir fiyat gereklidir.");
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      const product = await insertProduct({
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        gender: form.gender,
        images: form.images
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean),
        in_stock: form.in_stock,
      });
      onAdded(product);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Ürün eklenemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Yeni ürün ekle"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-neutral-800 bg-neutral-950 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
            Yeni Ürün
          </h2>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="cursor-pointer text-neutral-400 transition-colors hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {formError && (
          <p className="mt-4 border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-400">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              Başlık
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={INPUT_CLASS}
              placeholder="Örn. El Yapımı Deri Kemer"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((prev) => ({ ...prev, slug: e.target.value }));
              }}
              className={INPUT_CLASS}
              placeholder="el-yapimi-deri-kemer"
            />
            <p className="mt-1 text-[0.65rem] text-neutral-600">
              Başlıktan otomatik üretilir; isterseniz elle düzenleyin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
                Fiyat (₺)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                className={INPUT_CLASS}
                placeholder="1850"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
                Kategori
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className={INPUT_CLASS}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              Cinsiyet
            </label>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  gender: e.target.value as Gender,
                }))
              }
              className={INPUT_CLASS}
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              Açıklama
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className={INPUT_CLASS}
              placeholder="Ürün açıklaması…"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              Görsel URL&apos;leri
            </label>
            <input
              type="text"
              value={form.images}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, images: e.target.value }))
              }
              className={INPUT_CLASS}
              placeholder="/images/products/… (virgülle ayırın)"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, in_stock: e.target.checked }))
              }
              className="h-4 w-4 accent-white"
            />
            Stokta
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-neutral-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:border-white hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Ekleniyor…" : "Ürünü Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function slugify(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
