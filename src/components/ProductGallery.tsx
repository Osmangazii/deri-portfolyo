"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export default function ProductGallery({
  images,
  title,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Küçük resimler: mobilde yatay kaydırma, masaüstünde dikey liste */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none sm:flex-col sm:overflow-visible sm:pb-0">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${title} — görsel ${index + 1} önizlemesi`}
            aria-current={index === activeIndex}
            className={`relative aspect-3/4 w-16 shrink-0 cursor-pointer overflow-hidden transition-all duration-300 sm:w-20 ${
              index === activeIndex
                ? "border border-white"
                : "border border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Ana görsel (hover'da zoom) */}
      <div className="group relative aspect-3/4 w-full flex-1 cursor-zoom-in overflow-hidden bg-neutral-900">
        {activeImage && (
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
      </div>
    </div>
  );
}
