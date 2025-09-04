"use client"

import type React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function useExportRef<T extends HTMLElement>() {
  return useRef<T | null>(null)
}

export function ExportButtons({
  rows,
}: {
  rows: any[]
}) {
  async function exportExcel() {
    const XLSX = await import("xlsx")
    const sheet = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, "ESG")
    XLSX.writeFile(wb, "esg-data.xlsx")
  }

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
      <h2 className="text-xl font-semibold text-left">Your ESG Summary</h2>
      <div className="flex flex-wrap gap-2">
        <Link href={`/esg-form`} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-teal-600 text-white hover:bg-teal-700 cursor-pointer">
            Add ESG Details
          </Button>
        </Link>
        <Button
          variant="secondary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={exportExcel}
        >
          Download Excel
        </Button>
      </div>
    </div>
  )
}