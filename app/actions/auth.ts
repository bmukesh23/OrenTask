"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { TOKEN_NAME } from "@/lib/auth"

export async function setAuthCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production"
  ;(await cookies()).set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  })
}

export async function clearAuthCookie() {
  (await cookies()).set({
    name: TOKEN_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function logout() {
  await clearAuthCookie()
  revalidatePath("/")
}