import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { verifyPassword, signUserToken } from "@/lib/auth"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { email, password } = body as { email?: string; password?: string }
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  try {
    const prisma = (await getPrisma()) as any
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, passwordHash: true }, // ✅ include name
    })
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const token = await signUserToken({ id: user.id, email: user.email, name: user.name })

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name }, // ✅ send name to frontend
    })

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}