"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, assertAdmin } from "@/lib/adminAuth";
import {
  deleteProduct,
  getAllProducts,
  insertProduct,
  replaceProductVariants,
  toggleProductStock,
  updateProductDiscount,
  updateProductPrice,
} from "@/services/productService";
import type { ProductInput, VariantInput } from "@/services/productService";
import type { AdminProduct } from "@/types/database";
import type { ProductVariant } from "@/types/product";

const SESSION_MAX_AGE = 60 * 60 * 8; // 8 saat

/** Şifre doğruysa oturum çerezi yazar ve panele yönlendirir. */
export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected || password !== expected) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}

/** Oturum çerezini siler ve giriş ekranına döner. */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

/** Admin paneli ürün listesi. */
export async function fetchProductsAction(): Promise<AdminProduct[]> {
  await assertAdmin();
  return getAllProducts();
}

/** Yeni ürün oluşturur. */
export async function createProductAction(
  input: ProductInput,
): Promise<AdminProduct> {
  await assertAdmin();
  const product = await insertProduct(input);
  revalidatePath("/");
  revalidatePath("/admin");
  return product;
}

/** Stok durumunu günceller. */
export async function setStockAction(
  productId: string,
  inStock: boolean,
): Promise<void> {
  await assertAdmin();
  await toggleProductStock(productId, inStock);
  revalidatePath("/");
  revalidatePath("/admin");
}

/** Fiyatı günceller. */
export async function setPriceAction(
  productId: string,
  price: number,
): Promise<void> {
  await assertAdmin();
  await updateProductPrice(productId, price);
  revalidatePath("/");
  revalidatePath("/admin");
}

/** İndirim yüzdesini günceller. */
export async function setDiscountAction(
  productId: string,
  discountPercent: number,
): Promise<void> {
  await assertAdmin();
  await updateProductDiscount(productId, discountPercent);
  revalidatePath("/");
  revalidatePath("/admin");
}

/** Ürünün varyantlarını (renk/beden) değiştirir. */
export async function updateVariantsAction(
  productId: string,
  variants: VariantInput[],
): Promise<ProductVariant[]> {
  await assertAdmin();
  const updated = await replaceProductVariants(productId, variants);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/product/[slug]", "page");
  return updated;
}

/** Ürünü siler. */
export async function removeProductAction(productId: string): Promise<void> {
  await assertAdmin();
  await deleteProduct(productId);
  revalidatePath("/");
  revalidatePath("/admin");
}
