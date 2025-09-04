import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"

export async function GET() {
  const startedAt = new Date().toISOString()
  const hasDbUrl = Boolean(process.env.DATABASE_URL)
  const hasJwtSecret = Boolean(process.env.NEXTAUTH_SECRET)

  try {
    const prisma = (await getPrisma()) as any
    const [usersCount, entriesCount] = await Promise.all([prisma.user.count(), prisma.yearEntry.count()])

    return NextResponse.json(
      {
        ok: true,
        startedAt,
        env: { hasDbUrl, hasJwtSecret },
        db: { connected: true, usersCount, entriesCount },
      },
      { status: 200 },
    )
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        startedAt,
        env: { hasDbUrl, hasJwtSecret },
        db: { connected: false, error: e?.message || "DB error" },
      },
      { status: 500 },
    )
  }
}