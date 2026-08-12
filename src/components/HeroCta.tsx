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
      className="bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200"
    >
      KOLEKSİYONU KEŞFET
    </button>
  );
}
