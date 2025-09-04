import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

export const TOKEN_NAME = "token"
const alg = "HS256"

function getJwtSecret() {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set.")
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function signUserToken(payload: { id: number; email: string, name: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret())
}

export async function getUserFromRequest() {
  const token = (await cookies()).get(TOKEN_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as { id: number; email: string; name?: string; iat: number; exp: number }
  } catch {
    return null
  }
}

export async function requireUser() {
  const user = await getUserFromRequest()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}