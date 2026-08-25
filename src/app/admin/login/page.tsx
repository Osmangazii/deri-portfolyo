"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

const INPUT_CLASS =
  "w-full border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-600";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Hatalı e-posta veya şifre.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Giriş sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-10 pt-24 sm:pb-16 sm:pt-36">
      <div className="border border-neutral-800 bg-neutral-950 p-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
          ARTERNATIVE
        </p>
        <h1 className="mt-3 text-center text-2xl font-semibold tracking-tight text-white">
          Admin Girişi
        </h1>

        {error && (
          <p className="mt-5 border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              placeholder="admin@ornek.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT_CLASS}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-white py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-white"
          >
            ← Mağazaya Dön
          </Link>
        </p>
      </div>
    </main>
  );
}
