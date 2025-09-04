"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useExportRef, ExportButtons } from "./export-buttons"

type Props = {
  labels: string[]
  datasets: { label: string; data: number[]; backgroundColor: string; borderColor?: string; borderWidth?: number }[]
  rows?: any[]
}

const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), { ssr: false })

export default function SummaryChart({ labels, datasets, rows = [] }: Props) {
  const exportRef = useExportRef<HTMLDivElement>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    import("chart.js/auto").then(() => setReady(true)).catch(() => setReady(false))
  }, [])

  if (!ready) {
    return <div className="w-full text-sm text-muted-foreground">Loading chart…</div>
  }

  return (
    <div className="space-y-4 w-full">
      {/* Export buttons aligned properly on small screens */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <ExportButtons rows={rows} />
      </div>

      {/* Chart wrapper with horizontal scroll on very small screens */}
      <div ref={exportRef} className="w-full">
        <div className="w-full bg-neutral-900 rounded-lg p-2 sm:p-4 h-[550px]">
          <Bar
            data={{ labels, datasets }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom" as const,
                  labels: { color: "#fff" },
                },
                title: { display: false },
              },
              scales: {
                x: {
                  ticks: { color: "#fff" },
                  grid: { color: "rgba(255,255,255,0.1)" },
                },
                y: {
                  beginAtZero: true,
                  ticks: { color: "#fff" },
                  grid: { color: "rgba(255,255,255,0.1)" },
                },
              },
            }}
            height={400} // keeps chart readable on mobile
          />
        </div>
      </div>
    </div>
  )
}
