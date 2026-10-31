import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";

/** Admin oturum çerezi geçerli mi? (sunucu tarafı) */
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "ok";
}

/** Server action'lar için koruma — oturum yoksa hata fırlatır. */
export async function assertAdmin(): Promise<void> {
  if (!(await isAdminSession())) {
    throw new Error("Yetkisiz işlem: admin oturumu gerekli.");
  }
}
