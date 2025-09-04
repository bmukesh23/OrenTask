import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export async function GET(req: Request) {
  const user = await requireUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const prisma = (await getPrisma()) as any
  const url = new URL(req.url)
  const fyParam = url.searchParams.get("fiscal_year")

  if (fyParam) {
    const fy = Number(fyParam)
    if (!Number.isFinite(fy)) return NextResponse.json({ error: "Invalid fiscal_year" }, { status: 400 })
    const entry = await prisma.yearEntry.findUnique({
      where: { userId_fiscalYear: { userId: user.id, fiscalYear: fy } },
    })
    return NextResponse.json({ entry: entry ?? null })
  }

  const entries = await prisma.yearEntry.findMany({
    where: { userId: user.id },
    orderBy: { fiscalYear: "asc" },
  })
  return NextResponse.json({ entries })
}

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await req.json().catch(() => ({}))) as Record<string, any>
  const fy = body.fiscal_year ?? body.fiscalYear
  const fiscalYear = Number(fy)

  if (!Number.isFinite(fiscalYear)) {
    return NextResponse.json({ error: "fiscal_year required" }, { status: 400 })
  }

  const prisma = (await getPrisma()) as any

  const data = {
    userId: user.id,
    fiscalYear,
    totalElectricity: body.total_electricity ?? body.totalElectricity ?? null,
    renewableElectricity: body.renewable_electricity ?? body.renewableElectricity ?? null,
    totalFuel: body.total_fuel ?? body.totalFuel ?? null,
    carbonEmissions: body.carbon_emissions ?? body.carbonEmissions ?? null,
    totalEmployees: body.total_employees ?? body.totalEmployees ?? null,
    femaleEmployees: body.female_employees ?? body.femaleEmployees ?? null,
    avgTrainingHours: body.avg_training_hours ?? body.avgTrainingHours ?? null,
    communitySpend: body.community_spend ?? body.communitySpend ?? null,
    independentBoardPct: body.independent_board_pct ?? body.independentBoardPct ?? null,
    hasDataPrivacyPolicy: body.has_data_privacy_policy ?? body.hasDataPrivacyPolicy ?? null,
    totalRevenue: body.total_revenue ?? body.totalRevenue ?? null,
  }

  const saved = await prisma.yearEntry.upsert({
    where: { userId_fiscalYear: { userId: user.id, fiscalYear } },
    create: data,
    update: { ...data },
  })
  return NextResponse.json({ ok: true, data: saved })
}