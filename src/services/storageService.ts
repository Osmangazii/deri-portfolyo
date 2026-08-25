import { supabase } from "@/lib/supabase/client";

const TURKISH_TO_ASCII: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  I: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

/**
 * Supabase Storage anahtar kurallarına uygun dosya adı üretir:
 * - Türkçe/non-ASCII karakterleri ASCII karşılıklarına indirger (ö→o, ü→u, ş→s, ı→i, ğ→g, ç→c, İ→i…)
 * - Boşlukları, iki noktayı ve özel karakterleri tireye çevirir
 * - Yalnızca küçük harf, rakam, tire ve nokta bırakır
 * - Tamamen boş kalan adlar için "product" fallback'i döner
 */
export function sanitizeFileName(fileName: string): string {
  const ascii = fileName
    .toLocaleLowerCase("tr-TR")
    .replace(/[çÇğĞıİIöÖşŞüÜ]/g, (ch) => TURKISH_TO_ASCII[ch] ?? ch);

  const safe = ascii.replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");

  return safe || "product";
}

/**
 * Benzersiz ve güvenli bir Storage yolu üretir:
 * `${sanitizeBase}-${Date.now()}-${random6}${ext}`
 * Örn: "deri-canta-foto-1718…-x9k2d2.jpg"
 */
function buildFilePath(fileName: string): string {
  const safeName = sanitizeFileName(fileName);
  const dotIndex = safeName.lastIndexOf(".");
  const hasExtension = dotIndex > 0 && dotIndex < safeName.length - 1;
  const base = hasExtension ? safeName.slice(0, dotIndex) : safeName;
  const extension = hasExtension ? safeName.slice(dotIndex) : "";

  return `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
}

/**
 * Seçilen dosyaları `product-images` bucket'ına yükler ve her biri için
 * public URL döner. Yükleme sırasındaki herhangi bir hata fırlatılır.
 * Not: Bucket'ın Supabase'te oluşturulmuş ve public erişimli olması gerekir.
 */
export async function uploadProductImages(files: File[]): Promise<string[]> {
  const publicUrls: string[] = [];

  for (const file of files) {
    const filePath = buildFilePath(file.name);

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { upsert: false });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    publicUrls.push(data.publicUrl);
  }

  return publicUrls;
}
