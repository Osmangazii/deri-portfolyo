import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { isAdminSession } from "@/lib/adminAuth";

const INPUT_CLASS =
  "w-full border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-600";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  // Zaten oturum varsa doğrudan panele gönder
  if (await isAdminSession()) {
    redirect("/admin");
  }

  const hasError = (await searchParams).error === "1";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-10 pt-24 sm:pb-16 sm:pt-36">
      <div className="border border-neutral-800 bg-neutral-950 p-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
          ARTERNATIVE
        </p>
        <h1 className="mt-3 text-center text-2xl font-semibold tracking-tight text-white">
          Admin Girişi
        </h1>

        {hasError && (
          <p className="mt-5 border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-400">
            Hatalı şifre. Lütfen tekrar deneyin.
          </p>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={INPUT_CLASS}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-white py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200"
          >
            Giriş Yap
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
