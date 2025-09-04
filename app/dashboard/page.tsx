import Header from "@/components/header"
import { getPrisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import SummaryChart from "@/components/summary-chart"

function serializeRow(row: any) {
  return {
    ...row,
    totalElectricity: row.totalElectricity ? Number(row.totalElectricity) : null,
    renewableElectricity: row.renewableElectricity ? Number(row.renewableElectricity) : null,
    totalFuel: row.totalFuel ? Number(row.totalFuel) : null,
    carbonEmissions: row.carbonEmissions ? Number(row.carbonEmissions) : null,
    totalEmployees: row.totalEmployees,
    femaleEmployees: row.femaleEmployees,
    avgTrainingHours: row.avgTrainingHours ? Number(row.avgTrainingHours) : null,
    communitySpend: row.communitySpend ? Number(row.communitySpend) : null,
    independentBoardPct: row.independentBoardPct ? Number(row.independentBoardPct) : null,
    hasDataPrivacyPolicy: row.hasDataPrivacyPolicy,
    totalRevenue: row.totalRevenue ? Number(row.totalRevenue) : null,
    createdAt: row.createdAt ? row.createdAt.toISOString() : null,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
  }
}

export default async function DashboardPage() {
  const user = await getUserFromRequest()
  console.log(user);
  if (!user) redirect("/login")

  // ✅ get token safely
  const token = (await cookies()).get("token")?.value || null

  // ✅ get rows from DB
  const prisma = (await getPrisma()) as import("@prisma/client").PrismaClient
  const dbRows = await prisma.yearEntry.findMany({
    where: { userId: user.id },
    orderBy: { fiscalYear: "asc" },
  })

  const rows = dbRows.map(serializeRow)

  // ✅ Chart data
  const labels = rows.map((r: any) => String(r.fiscalYear))
  const datasets = [
    {
      label: "Carbon Intensity (T/INR)",
      data: rows.map((r: any) =>
        r.carbonEmissions != null && r.totalRevenue && Number(r.totalRevenue) !== 0
          ? Number(r.carbonEmissions) / Number(r.totalRevenue)
          : 0,
      ),
      backgroundColor: "rgba(13, 148, 136, 0.8)",
      borderColor: "rgba(13, 148, 136, 1)",
      borderWidth: 2,
    },
    {
      label: "Renewable Electricity (%)",
      data: rows.map((r: any) =>
        r.renewableElectricity != null && r.totalElectricity && Number(r.totalElectricity) !== 0
          ? (Number(r.renewableElectricity) / Number(r.totalElectricity)) * 100
          : 0,
      ),
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 2,
    },
  ]

  return (
    <>
      <Header currentPath="/dashboard" token={token} user={user} />

      <main className="py-24 w-full min-h-screen bg-black text-white flex flex-col items-center">
        <div className="w-full max-w-8xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Chart */}
          <div className="w-full">
            <SummaryChart labels={labels} datasets={datasets} rows={rows} />
          </div>

          {/* ESG Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-neutral-800">
              <thead className="bg-neutral-900 text-white">
                <tr>
                  <th className="px-4 py-2 border border-neutral-800">Year</th>
                  <th className="px-4 py-2 border border-neutral-800">Carbon Emissions</th>
                  <th className="px-4 py-2 border border-neutral-800">Total Revenue</th>
                  <th className="px-4 py-2 border border-neutral-800">
                    Electricity (Total / Renewable)
                  </th>
                  <th className="px-4 py-2 border border-neutral-800">
                    Employees (Total / Female)
                  </th>
                  <th className="px-4 py-2 border border-neutral-800">Board Independence %</th>
                  <th className="px-4 py-2 border border-neutral-800">Data Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any, idx: number) => (
                  <tr key={idx} className="border border-neutral-800 hover:bg-neutral-800/40">
                    <td className="px-4 py-2">{r.fiscalYear}</td>
                    <td className="px-4 py-2">{r.carbonEmissions ?? "-"}</td>
                    <td className="px-4 py-2">{r.totalRevenue ?? "-"}</td>
                    <td className="px-4 py-2">
                      {r.totalElectricity ?? "-"} / {r.renewableElectricity ?? "-"}
                    </td>
                    <td className="px-4 py-2">
                      {r.totalEmployees ?? "-"} / {r.femaleEmployees ?? "-"}
                    </td>
                    <td className="px-4 py-2">
                      {r.independentBoardPct != null ? `${r.independentBoardPct}%` : "-"}
                    </td>
                    <td className="px-4 py-2">{r.hasDataPrivacyPolicy ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
