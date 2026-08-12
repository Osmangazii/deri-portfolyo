"use client";

export default function HeroCta() {
  const scrollToProducts = () => {
    document
      .getElementById("products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToProducts}
      className="mt-10 inline-flex items-center bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-neutral-200"
    >
      KOLEKSİYONU KEŞFET
    </button>
  );
}
