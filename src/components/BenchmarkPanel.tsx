'use client'
import {
  getCompanySize,
  getSpendPerDev,
  getBenchmarkPosition,
  BENCHMARK_DATA,
} from '@/lib/benchmarks'

interface BenchmarkPanelProps {
  totalMonthlySpend: number
  engineerCount: number
  teamSize: number
}

export function BenchmarkPanel({
  totalMonthlySpend,
  engineerCount,
  teamSize,
}: BenchmarkPanelProps) {
  if (engineerCount === 0) return null

  const sizeKey = getCompanySize(teamSize)
  const benchmark = BENCHMARK_DATA[sizeKey]
  const yourSpend = getSpendPerDev(
    totalMonthlySpend,
    engineerCount
  )
  const position = getBenchmarkPosition(yourSpend, sizeKey)

  const positionConfig = {
    low: {
      label: 'Below average spend',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      message:
        'Your team spends less per developer than most ' +
        'companies your size. Make sure you have the ' +
        'tools you need to stay productive.',
    },
    normal: {
      label: 'Within normal range',
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
      message:
        'Your spend is in line with similar-sized companies. ' +
        'Focus on optimizing plan tiers rather than ' +
        'cutting tools entirely.',
    },
    high: {
      label: 'Above average spend',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      message:
        'Your team spends more per developer than 75% of ' +
        'companies your size. The recommendations above ' +
        'can bring you back into range.',
    },
  }

  const config = positionConfig[position]
  const barMax = benchmark.p75SpendPerDev * 1.6
  const p25Pct =
    (benchmark.p25SpendPerDev / barMax) * 100
  const p75Pct =
    (benchmark.p75SpendPerDev / barMax) * 100
  const yourPct = Math.min((yourSpend / barMax) * 100, 97)

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-slate-500 text-xs font-semibold
                     uppercase tracking-widest mb-4">
        How You Compare
      </h2>

      <div className={`rounded-xl p-4 border mb-6 ${config.bg}`}>
        <div className="flex items-start justify-between
                        gap-4 mb-1">
          <span className={`font-semibold ${config.color}`}>
            {config.label}
          </span>
          <span
            className={`text-2xl font-black tabular-nums
                        flex-shrink-0 ${config.color}`}
          >
            ${yourSpend}/dev
          </span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          {config.message}
        </p>
      </div>

      {/* Visual comparison bar */}
      <div className="mb-2">
        <div
          className="relative h-5 bg-slate-800
                     rounded-full overflow-visible"
        >
          {/* Normal range band */}
          <div
            className="absolute h-full bg-brand-500/25
                       rounded-full"
            style={{
              left: `${p25Pct}%`,
              width: `${p75Pct - p25Pct}%`,
            }}
          />

          {/* Your spend marker */}
          <div
            className="absolute w-4 h-7 -top-1
                       -translate-x-1/2 bg-white
                       rounded-full shadow-lg
                       border-2 border-brand-400
                       transition-all duration-700"
            style={{ left: `${yourPct}%` }}
            aria-label={`Your spend: $${yourSpend} per developer`}
          />
        </div>

        <div className="flex justify-between
                        text-xs mt-3 text-slate-500 tabular-nums">
          <span>25th %ile: ${benchmark.p25SpendPerDev}</span>
          <span className={`font-semibold ${config.color}`}>
            You: ${yourSpend}/dev/mo
          </span>
          <span>75th %ile: ${benchmark.p75SpendPerDev}</span>
        </div>
      </div>

      <p className="text-slate-600 text-xs mt-4 leading-relaxed">
        Benchmarks based on industry estimates for{' '}
        {sizeKey}-person {benchmark.label} companies.
        Updated Q1 2025.
      </p>
    </div>
  )
}
