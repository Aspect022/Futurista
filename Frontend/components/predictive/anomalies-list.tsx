import { AlertTriangle, Octagon } from "lucide-react"

type Severity = "low" | "medium" | "high"
type Item = {
  ts: string
  metric: string
  severity: Severity
  description: string
}

export function AnomaliesList({ items }: { items: Item[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-sm">
      <ul className="divide-y divide-border">
        {items.map((it, idx) => (
          <li key={idx} className="py-3 flex items-start gap-3">
            <SeverityIcon severity={it.severity} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <time className="text-xs text-muted-foreground">{it.ts}</time>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{it.metric}</span>
              </div>
              <div className="text-sm font-medium text-foreground mt-0.5">{it.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SeverityIcon({ severity }: { severity: Severity }) {
  const base = "h-5 w-5 text-muted-foreground"
  if (severity === "high") return <Octagon className="h-5 w-5 text-red-500" aria-label="High severity" />
  if (severity === "medium") return <AlertTriangle className="h-5 w-5 text-amber-500" aria-label="Medium severity" />
  return <AlertTriangle className={base} aria-label="Low severity" />
}
