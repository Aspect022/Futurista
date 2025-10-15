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
    <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      {/* Red workflow button for low health */}
      {showWorkflowButton && (
        <div className="mb-4">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
            ⚠️ Emergency Workflow: Critical Vehicle Condition
          </button>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Radial */}
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 100 100" className="-rotate-90 h-24 w-24">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="black"
                strokeWidth="8"
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-sm font-medium text-black">{health}%</span>
          </div>
          <div className="grid gap-1">
            <div className="text-xs text-black/60">Risk Level</div>
            <div className="text-sm font-medium">{riskLevel}</div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-black/60">Next Predicted Failure</div>
            <div className="font-medium">{nextFailure}</div>
          </div>
          <div>
            <div className="text-xs text-black/60">Days to Failure</div>
            <div className="font-medium">{daysToFailure} days</div>
          </div>
        </div>

        {/* CTA */}
        <div className="sm:text-right">
          <Link href={`/dashboard`}>
            <Button variant="outline" className="border-black/20 bg-white text-black hover:bg-white">
              View 3D Model
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
