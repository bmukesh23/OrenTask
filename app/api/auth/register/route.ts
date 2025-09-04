import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { hashPassword, signUserToken } from "@/lib/auth"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { name, email, password } = body as { name?: string; email?: string; password?: string }

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    const prisma = (await getPrisma()) as any

    // check existing
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const created = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, email: true, name: true},
    })

    const token = await signUserToken({ id: created.id, email: created.email, name: created.name })
    const res = NextResponse.json({ ok: true, user: created })
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    })
    return res
  } catch (e: any) {
    // P2002 unique violation or other prisma errors
    const msg = e?.code === "P2002" ? "Email already registered" : "Registration failed"
    const status = e?.code === "P2002" ? 409 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}