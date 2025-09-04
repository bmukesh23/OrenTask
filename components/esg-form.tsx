"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useSWR from "swr"
import { calcDerived } from "@/types/esg"
import { useRouter } from "next/navigation"

type Props = {
  initialYear: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ESGForm({ initialYear }: Props) {
  const router = useRouter()
  const [year, setYear] = useState<number>(initialYear)
  const { data, mutate, isLoading } = useSWR<{ entry: any }>(`/api/responses?fiscal_year=${year}`, fetcher)
  const [form, setForm] = useState<Record<string, any>>({
    fiscal_year: initialYear,
    total_electricity: "",
    renewable_electricity: "",
    total_fuel: "",
    carbon_emissions: "",
    total_employees: "",
    female_employees: "",
    avg_training_hours: "",
    community_spend: "",
    independent_board_pct: "",
    has_data_privacy_policy: false,
    total_revenue: "",
  })

  useEffect(() => {
    setForm((prev) => ({ ...prev, fiscal_year: year }))
  }, [year])

  useEffect(() => {
    if (data?.entry) {
      const e = data.entry
      setForm({
        fiscal_year: e.fiscal_year ?? year,
        total_electricity: e.total_electricity ?? "",
        renewable_electricity: e.renewable_electricity ?? "",
        total_fuel: e.total_fuel ?? "",
        carbon_emissions: e.carbon_emissions ?? "",
        total_employees: e.total_employees ?? "",
        female_employees: e.female_employees ?? "",
        avg_training_hours: e.avg_training_hours ?? "",
        community_spend: e.community_spend ?? "",
        independent_board_pct: e.independent_board_pct ?? "",
        has_data_privacy_policy: e.has_data_privacy_policy ?? false,
        total_revenue: e.total_revenue ?? "",
      })
    } else {
      setForm((prev) => ({
        ...prev,
        total_electricity: "",
        renewable_electricity: "",
        total_fuel: "",
        carbon_emissions: "",
        total_employees: "",
        female_employees: "",
        avg_training_hours: "",
        community_spend: "",
        independent_board_pct: "",
        has_data_privacy_policy: false,
        total_revenue: "",
      }))
    }
  }, [data?.entry, isLoading])

  const derived = useMemo(() => {
    return calcDerived({
      carbon_emissions: parseNum(form.carbon_emissions),
      total_revenue: parseNum(form.total_revenue),
      renewable_electricity: parseNum(form.renewable_electricity),
      total_electricity: parseNum(form.total_electricity),
      female_employees: parseNum(form.female_employees),
      total_employees: parseNum(form.total_employees),
      community_spend: parseNum(form.community_spend),
    })
  }, [form])

  function parseNum(v: any): number | null {
    if (v === "" || v === null || v === undefined) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }

  function setField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSave() {
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fiscal_year: form.fiscal_year,
        total_electricity: parseNum(form.total_electricity),
        renewable_electricity: parseNum(form.renewable_electricity),
        total_fuel: parseNum(form.total_fuel),
        carbon_emissions: parseNum(form.carbon_emissions),
        total_employees: parseNum(form.total_employees),
        female_employees: parseNum(form.female_employees),
        avg_training_hours: parseNum(form.avg_training_hours),
        community_spend: parseNum(form.community_spend),
        independent_board_pct: parseNum(form.independent_board_pct),
        has_data_privacy_policy: !!form.has_data_privacy_policy,
        total_revenue: parseNum(form.total_revenue),
      }),
    })
    if (res.ok) {
      await mutate()
      // router.push("/dashboard")
      alert("Saved! Go to the dashboard");
    } else {
      const j = await res.json()
      alert(j.error || "Save failed")
    }
  }

  return (
    <div className="grid gap-6 bg-black text-white py-6 min-h-screen">
      <div className="grid grid-cols-2 items-end gap-4 max-w-sm">
        <div className="grid gap-2">
          <Label htmlFor="year">Financial year</Label>
          <Input
            id="year"
            type="number"
            min={2000}
            max={3000}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-gray-900 text-white"
          />
        </div>
        <Button onClick={onSave} className="bg-teal-600 hover:bg-teal-700 text-white hover:cursor-pointer">
          Save
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Total electricity consumption (kWh)">
          <Input
            type="number"
            value={form.total_electricity}
            onChange={(e) => setField("total_electricity", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
        <Field label="Renewable electricity consumption (kWh)">
          <Input
            type="number"
            value={form.renewable_electricity}
            onChange={(e) => setField("renewable_electricity", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
        <Field label="Total fuel consumption (liters)">
          <Input
            type="number"
            value={form.total_fuel}
            onChange={(e) => setField("total_fuel", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
        <Field label="Carbon emissions (T CO2e)">
          <Input
            type="number"
            value={form.carbon_emissions}
            onChange={(e) => setField("carbon_emissions", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>

        <Field label="Total number of employees">
          <Input
            type="number"
            value={form.total_employees}
            onChange={(e) => setField("total_employees", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
        <Field label="Number of female employees">
          <Input
            type="number"
            value={form.female_employees}
            onChange={(e) => setField("female_employees", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
        <Field label="Average training hours per employee (per year)">
          <Input
            type="number"
            value={form.avg_training_hours}
            onChange={(e) => setField("avg_training_hours", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
        <Field label="Community investment spend (INR)">
          <Input
            type="number"
            value={form.community_spend}
            onChange={(e) => setField("community_spend", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>

        <Field label="% of independent board members">
          <Input
            type="number"
            value={form.independent_board_pct}
            onChange={(e) => setField("independent_board_pct", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
        <div className="grid gap-2">
          <Label>Data privacy policy?</Label>
          <select
            className="h-10 rounded-md border bg-gray-900 text-white px-3"
            value={form.has_data_privacy_policy ? "Yes" : "No"}
            onChange={(e) => setField("has_data_privacy_policy", e.target.value === "Yes")}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <Field label="Total Revenue (INR)">
          <Input
            type="number"
            value={form.total_revenue}
            onChange={(e) => setField("total_revenue", e.target.value)}
            className="bg-gray-900 text-white"
          />
        </Field>
      </section>

      <section className="rounded-lg border p-4 bg-gray-900 text-white">
        <h3 className="mb-3 font-medium">Auto-calculated metrics</h3>
        <ul className="grid gap-2">
          <li>Carbon Intensity: {derived.carbonIntensity.toFixed(6)} T CO2e / INR</li>
          <li>Renewable Electricity Ratio: {derived.renewableRatio.toFixed(2)}%</li>
          <li>Diversity Ratio: {derived.diversityRatio.toFixed(2)}%</li>
          <li>Community Spend Ratio: {derived.communitySpendRatio.toFixed(4)}%</li>
        </ul>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-white">{label}</Label>
      {children}
    </div>
  )
}