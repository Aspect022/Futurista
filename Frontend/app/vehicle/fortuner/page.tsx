import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HealthSummaryCard } from "@/components/predictive/health-summary-card";
import { ComponentPredictionCard } from "@/components/predictive/component-prediction-card";
import { TrendsChart } from "@/components/predictive/trends-chart";
import { AnomaliesList } from "@/components/predictive/anomalies-list";
import { ActionsPanel } from "@/components/predictive/actions-panel";

// Fortuner specific data
const fortunerData = {
  id: "car-2",
  model: "Toyota Fortuner",
  year: 2024,
  engine: "2.8L Turbo Diesel",
  vin: "2T1BURHE0JC012345",
  lastUpdated: "2025-10-14 11:45 UTC",
  health: 92,
  riskLevel: "Normal",
  nextFailure: "Air Filter",
  daysToFailure: 60,
  features: [
    "4WD System",
    "Multi-Terrain Select",
    "Hill Start Assist",
    "Traction Control",
    "360° Camera",
    "Power Windows"
  ]
};

const predictedComponents = [
  {
    name: "Air Filter",
    risk: "Normal",
    daysToFailure: 60,
    confidence: 88,
    trend: [78, 79, 80, 81, 82, 83, 83],
  },
  {
    name: "Brake Pads",
    risk: "Normal",
    daysToFailure: 95,
    confidence: 91,
    trend: [88, 89, 89, 90, 90, 91, 91],
  },
  {
    name: "Engine",
    risk: "Normal",
    daysToFailure: 180,
    confidence: 85,
    trend: [92, 92, 92, 92, 92, 92, 92],
  },
  {
    name: "Transmission",
    risk: "Low",
    daysToFailure: 120,
    confidence: 82,
    trend: [87, 88, 88, 89, 89, 90, 90],
  },
];

const trends = {
  brake: [
    { day: 0, value: 88 },
    { day: 5, value: 89 },
    { day: 10, value: 89 },
    { day: 15, value: 90 },
    { day: 20, value: 90 },
    { day: 25, value: 91 },
  ],
  battery: [
    { day: 0, value: 93 },
    { day: 5, value: 93 },
    { day: 10, value: 93 },
    { day: 15, value: 94 },
    { day: 20, value: 94 },
    { day: 25, value: 94 },
  ],
  engine: [
    { day: 0, value: 92 },
    { day: 5, value: 92 },
    { day: 10, value: 92 },
    { day: 15, value: 92 },
    { day: 20, value: 92 },
    { day: 25, value: 92 },
  ],
};

export default function FortunerPage({ params }: { params: { id: string } }) {
  // Placeholder: validate vehicle id if needed
  if (!params?.id) return notFound()

  const v = fortunerData;

  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-black">
      {/* Enhanced Header with Visual Indicator */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-10"></div>
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 relative">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb className="text-black/60">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard-new" className="text-black/60 hover:text-black">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/vehicle/${v.id}`} className="text-black/60 hover:text-black">
                    Vehicle
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-black font-medium">Toyota Fortuner</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{v.model} Dashboard</h1>
                <p className="text-gray-600 mt-2">Advanced predictive maintenance for your premium SUV</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${v.riskLevel === "High" ? "bg-red-500 animate-pulse" : v.riskLevel === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                  <span className="text-sm font-medium">{v.riskLevel} Risk</span>
                </div>
              </div>
            </div>

            {/* Vehicle info row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-xs text-black/60">Model</div>
                <div className="text-sm font-medium">{v.model}</div>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-xs text-black/60">Engine</div>
                <div className="text-sm font-medium">{v.engine}</div>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-xs text-black/60">Year</div>
                <div className="text-sm font-medium">{v.year}</div>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-xs text-black/60">Last Updated</div>
                <time className="text-sm font-medium">{v.lastUpdated}</time>
              </div>
            </div>

            {/* Features list */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-black/80 mb-2">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {v.features.map((feature, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 text-xs bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Health Summary with Enhanced Styling */}
          <div className="mb-10">
            <HealthSummaryCard
              health={v.health}
              riskLevel={v.riskLevel}
              nextFailure={v.nextFailure}
              daysToFailure={v.daysToFailure}
              vehicleId={v.id}
            />
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 -mt-16 relative z-10">
        {/* Predicted Components Grid with Enhanced Styling */}
        <section aria-labelledby="predicted-components-title" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 id="predicted-components-title" className="text-xl md:text-2xl font-bold">
              Predicted Component Failures
            </h2>
            <div className="text-sm text-black/60">AI-powered predictions based on 90+ data points</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {predictedComponents.map((c, index) => (
              <ComponentPredictionCard
                key={c.name}
                name={c.name}
                risk={c.risk as "Normal" | "Low" | "Medium" | "High" | "Critical"}
                daysToFailure={c.daysToFailure}
                confidence={c.confidence}
                trend={c.trend}
              />
            ))}
          </div>
        </section>

        {/* Trends Section with Enhanced Styling */}
        <section aria-labelledby="trends-title" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 id="trends-title" className="text-xl md:text-2xl font-bold">
              Predicted Health Trends
            </h2>
            <div className="text-sm text-black/60">Based on last 30 days of driving data</div>
          </div>
          <TrendsChart data={trends} />
        </section>

        {/* Anomalies & Alerts with Enhanced Styling */}
        <section aria-labelledby="anomalies-title" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 id="anomalies-title" className="text-xl md:text-2xl font-bold">
              Recent Anomalies & Alerts
            </h2>
            <div className="text-sm text-black/60">Detected in the last 24 hours</div>
          </div>
          <AnomaliesList
            items={[
              {
                ts: "2025-10-14 11:30",
                metric: "Tire pressure variance",
                severity: "low",
                description: "Minor pressure variation detected",
              },
              {
                ts: "2025-10-14 09:15",
                metric: "Transmission temp",
                severity: "low",
                description: "Slight temperature increase during off-road use",
              },
            ]}
          />
        </section>

        {/* Recommended Actions with Enhanced Styling */}
        <section aria-labelledby="next-steps-title" className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 id="next-steps-title" className="text-xl md:text-2xl font-bold">
              Recommended Actions
            </h2>
            <div className="text-sm text-black/60">Prioritized by urgency</div>
          </div>
          <ActionsPanel vehicleId={v.id} />
        </section>
      </section>
    </main>
  )
}