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
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <ul className="divide-y divide-black/5">
        {items.map((it, idx) => (
          <li key={idx} className="py-3 flex items-start gap-3">
            <SeverityIcon severity={it.severity} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <time className="text-xs text-black/60">{it.ts}</time>
                <span className="text-xs text-black/60">•</span>
                <span className="text-xs text-black/60">{it.metric}</span>
              </div>
              <div className="text-sm font-medium mt-0.5">{it.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SeverityIcon({ severity }: { severity: Severity }) {
  const base = "h-5 w-5 text-black/50"
  if (severity === "high") return <Octagon className={base} aria-label="High severity" />
  return <AlertTriangle className={base} aria-label={severity === "medium" ? "Medium severity" : "Low severity"} />
}
