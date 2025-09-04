export type YearMetrics = {
  fiscal_year: number
  total_electricity?: number | null
  renewable_electricity?: number | null
  total_fuel?: number | null
  carbon_emissions?: number | null
  total_employees?: number | null
  female_employees?: number | null
  avg_training_hours?: number | null
  community_spend?: number | null
  independent_board_pct?: number | null
  has_data_privacy_policy?: boolean | null
  total_revenue?: number | null
  created_at?: string
  updated_at?: string
  id?: number
}

export type ComputedMetrics = {
  carbonIntensity?: number | null // T CO2e / INR
  renewableElectricityRatio?: number | null // %
  diversityRatio?: number | null // %
  communitySpendRatio?: number | null // %
}

export type YearEntry = YearMetrics

export function calcDerived(input: {
  carbon_emissions?: number | null
  total_revenue?: number | null
  renewable_electricity?: number | null
  total_electricity?: number | null
  female_employees?: number | null
  total_employees?: number | null
  community_spend?: number | null
}) {
  const {
    carbon_emissions,
    total_revenue,
    renewable_electricity,
    total_electricity,
    female_employees,
    total_employees,
    community_spend,
  } = input

  const safeDiv = (a?: number | null, b?: number | null) => {
    const A = a == null ? null : Number(a)
    const B = b == null ? null : Number(b)
    if (A == null || B == null || !Number.isFinite(A) || !Number.isFinite(B) || B === 0) return 0
    return A / B
  }

  const carbonIntensity = safeDiv(carbon_emissions, total_revenue) // T CO2e / INR
  const renewableRatio = safeDiv(renewable_electricity, total_electricity) * 100 // %
  const diversityRatio = safeDiv(female_employees, total_employees) * 100 // %
  const communitySpendRatio = safeDiv(community_spend, total_revenue) * 100 // %

  return { carbonIntensity, renewableRatio, diversityRatio, communitySpendRatio }
}
