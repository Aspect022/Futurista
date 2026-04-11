import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HealthSummaryCard({
  health,
  riskLevel,
  nextFailure,
  daysToFailure,
  vehicleId,
}: {
  health: number
  riskLevel: string
  nextFailure: string
  daysToFailure: number
  vehicleId: string
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, health))
  const dash = (progress / 100) * circumference

  // Add red workflow button if health is low
  const showWorkflowButton = health < 70;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm">
      {/* Alert button for low health */}
      {showWorkflowButton && (
        <div className="mb-4">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
            ⚠️ Your car needs urgent attention — book a mechanic now
          </button>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Radial */}
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 100 100" className="-rotate-90 h-24 w-24">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" className="text-muted" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={health >= 70 ? "#22c55e" : health >= 50 ? "#eab308" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-sm font-medium text-foreground">{health}%</span>
          </div>
          <div className="grid gap-1">
            <div className="text-xs text-muted-foreground">Risk Level</div>
            <div className="text-sm font-medium text-foreground">{riskLevel}</div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Next Predicted Failure</div>
            <div className="font-medium text-foreground">{nextFailure}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Days to Failure</div>
            <div className="font-medium text-foreground">{daysToFailure} days</div>
          </div>
        </div>

        {/* CTA */}
        <div className="sm:text-right">
          <Link href="/appointment-booking">
            <Button variant="outline">
              Book a Mechanic
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
