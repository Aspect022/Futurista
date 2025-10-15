"use client"

type Risk = "Normal" | "Low" | "Medium" | "High" | "Critical"

export function ComponentPredictionCard({
  name,
  risk,
  daysToFailure,
  confidence,
  trend,
}: {
  name: string
  risk: Risk
  daysToFailure: number
  confidence: number
  trend: number[]
}) {
  const riskLabelStyles: Record<Risk, string> = {
    Normal: "text-black/70 border-black/10",
    Low: "text-black/70 border-black/10",
    Medium: "text-black/80 border-black/20",
    High: "text-black border-black/30",
    Critical: "text-black border-black/40",
  }

  const points = trend.map((v, i) => `${(i / (trend.length - 1)) * 100},${100 - v}`).join(" ")

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="mt-1 inline-flex items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-xs ${riskLabelStyles[risk]}`}>{risk}</span>
            <span className="text-xs text-black/60">{daysToFailure} days</span>
            <span className="text-xs text-black/60">{confidence}% conf.</span>
          </div>
        </div>
        <div className="text-xs">
          <button className="text-black/70 hover:text-black underline underline-offset-4">View Details</button>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-4 h-16 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <polyline fill="none" stroke="#111111" strokeWidth="2" points={points} />
          {/* Baseline grid */}
          <line x1="0" y1="100" x2="100" y2="100" stroke="#EAEAEA" strokeWidth="1" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#F0F0F0" strokeWidth="1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#F5F5F5" strokeWidth="1" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#FAFAFA" strokeWidth="1" />
        </svg>
      </div>

      {/* CTA row */}
      <div className="mt-3">
        <button className="text-sm text-black/70 hover:text-black underline underline-offset-4">
          Schedule Service
        </button>
      </div>
    </div>
  )
}
