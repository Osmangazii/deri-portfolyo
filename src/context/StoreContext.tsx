"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type Currency = "TRY" | "USD" | "EUR";
export type Language = "TR" | "EN";

/**
 * Yaklaşık standart kur çarpanları (1 TRY karşılığı).
 * Gerçek canlı kur entegrasyonu geldiğinde bu tablo değiştirilir.
 */
const EXCHANGE_RATES: Record<Currency, number> = {
  TRY: 1,
  USD: 0.03,
  EUR: 0.028,
};

const TRANSLATIONS: Record<string, Record<Language, string>> = {
  "Sepete Ekle": { TR: "Sepete Ekle", EN: "Add to Cart" },
  "Kargo & Teslimat": { TR: "Kargo & Teslimat", EN: "Shipping & Delivery" },
  "Bakım Talimatları": { TR: "Bakım Talimatları", EN: "Care Instructions" },
  "Stokta": { TR: "Stokta", EN: "In Stock" },
  "Tükendi": { TR: "Tükendi", EN: "Out of Stock" },
  "Sepetiniz": { TR: "Sepetiniz", EN: "Your Cart" },
  "Sepetiniz henüz boş.": {
    TR: "Sepetiniz henüz boş.",
    EN: "Your cart is empty.",
  },
  "Alışverişe Başla": { TR: "Alışverişe Başla", EN: "Start Shopping" },
  "Ara Toplam": { TR: "Ara Toplam", EN: "Subtotal" },
  "SİPARİŞİ TAMAMLA (WHATSAPP)": {
    TR: "SİPARİŞİ TAMAMLA (WHATSAPP)",
    EN: "COMPLETE ORDER (WHATSAPP)",
  },
};

const CURRENCY_STORAGE_KEY = "store-currency";
const LANGUAGE_STORAGE_KEY = "store-language";

function isCurrency(value: string | null): value is Currency {
  return value === "TRY" || value === "USD" || value === "EUR";
}

function isLanguage(value: string | null): value is Language {
  return value === "TR" || value === "EN";
}

type StoreContextValue = {
  currency: Currency;
  language: Language;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  /** TRY cinsinden fiyatı seçili para birimine çevirip biçimlendirir. */
  formatPrice: (priceInTRY: number) => string;
  /** Bilinen anahtarları seçili dile çevirir; bilinmeyen anahtar olduğu gibi döner. */
  t: (key: string) => string;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("TRY");
  const [language, setLanguageState] = useState<Language>("TR");

  // localStorage'dan kayıtlı tercihleri oku (hydration sonrası, setTimeout ile)
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (isCurrency(storedCurrency)) {
        setCurrencyState(storedCurrency);
      }
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isLanguage(storedLanguage)) {
        setLanguageState(storedLanguage);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tercihler değişince localStorage'a yaz
  useEffect(() => {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setCurrency = useCallback((value: Currency) => {
    setCurrencyState(value);
  }, []);

  const setLanguage = useCallback((value: Language) => {
    setLanguageState(value);
  }, []);

  const formatPrice = useCallback(
    (priceInTRY: number): string => {
      const value = priceInTRY * EXCHANGE_RATES[currency];
      const locale = currency === "TRY" ? "tr-TR" : "en-US";
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    },
    [currency],
  );

  const t = useCallback(
    (key: string): string => TRANSLATIONS[key]?.[language] ?? key,
    [language],
  );

  const value = useMemo(
    () => ({
      currency,
      language,
      setCurrency,
      setLanguage,
      formatPrice,
      t,
    }),
    [currency, language, setCurrency, setLanguage, formatPrice, t],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
