import Link from "next/link"
import { MapPin, Clock3, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ActionsPanel({ vehicleId }: { vehicleId: string }) {
  const actions = [
    {
      center: "Downtown Service Center",
      address: "120 Market St.",
      eta: "Tomorrow, 10:30 AM",
      cost: "$180 - $240",
    },
    {
      center: "Northside Maintenance Hub",
      address: "431 Woodland Ave.",
      eta: "In 2 days, 2:00 PM",
      cost: "$150 - $210",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((a, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-sm">
          <div className="text-sm font-medium text-foreground">{a.center}</div>
          <div className="mt-1 text-xs text-muted-foreground">{a.address}</div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="inline-flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Closest option</span>
            </div>
            <div className="inline-flex items-center gap-2 text-foreground">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              <span>{a.eta}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-foreground">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{a.cost}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <Link href={`/appointment-booking?vehicleId=${vehicleId}`}>
              <Button variant="outline">
                Book a Mechanic
              </Button>
            </Link>
            <Link
              href={`/vehicle/${vehicleId}/history`}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              View Maintenance History
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
