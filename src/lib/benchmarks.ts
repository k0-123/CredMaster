export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'

export const BENCHMARK_DATA: Record<CompanySize, {
  avgSpendPerDev: number
  p25SpendPerDev: number
  p75SpendPerDev: number
  label: string
}> = {
  '1-10': {
    avgSpendPerDev: 48,
    p25SpendPerDev: 22,
    p75SpendPerDev: 67,
    label: 'Seed / early stage',
  },
  '11-50': {
    avgSpendPerDev: 63,
    p25SpendPerDev: 35,
    p75SpendPerDev: 89,
    label: 'Series A',
  },
  '51-200': {
    avgSpendPerDev: 82,
    p25SpendPerDev: 51,
    p75SpendPerDev: 118,
    label: 'Series B',
  },
  '201-500': {
    avgSpendPerDev: 71,
    p25SpendPerDev: 44,
    p75SpendPerDev: 103,
    label: 'Growth stage',
  },
}

export function getCompanySize(teamSize: number): CompanySize {
  if (teamSize <= 10) return '1-10'
  if (teamSize <= 50) return '11-50'
  if (teamSize <= 200) return '51-200'
  return '201-500'
}

export function getSpendPerDev(
  totalMonthlySpend: number,
  engineerCount: number
): number {
  if (engineerCount === 0) return 0
  return Math.round(totalMonthlySpend / engineerCount)
}

export function getBenchmarkPosition(
  spendPerDev: number,
  companySize: CompanySize
): 'low' | 'normal' | 'high' {
  const benchmark = BENCHMARK_DATA[companySize]
  if (spendPerDev < benchmark.p25SpendPerDev) return 'low'
  if (spendPerDev > benchmark.p75SpendPerDev) return 'high'
  return 'normal'
}
