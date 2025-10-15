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
        <div key={i} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium">{a.center}</div>
          <div className="mt-1 text-xs text-black/60">{a.address}</div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="inline-flex items-center gap-2 text-black/80">
              <MapPin className="h-4 w-4 text-black/50" />
              <span>Closest option</span>
            </div>
            <div className="inline-flex items-center gap-2 text-black/80">
              <Clock3 className="h-4 w-4 text-black/50" />
              <span>{a.eta}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-black/80">
              <DollarSign className="h-4 w-4 text-black/50" />
              <span>{a.cost}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <Link href={`/appointment-booking?vehicleId=${vehicleId}`}>
              <Button variant="outline" className="border-black/20 bg-white text-black hover:bg-white">
                Book Appointment
              </Button>
            </Link>
            <Link
              href={`/vehicle/${vehicleId}/history`}
              className="text-sm text-black/70 hover:text-black underline underline-offset-4"
            >
              View Maintenance History
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
