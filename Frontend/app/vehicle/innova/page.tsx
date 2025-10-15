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

// Innova specific data
const innovaData = {
  id: "car-3",
  model: "Toyota Innova",
  year: 2023,
  engine: "2.4L Diesel",
  vin: "MP1JY2E2XPA123456",
  lastUpdated: "2025-10-14 10:15 UTC",
  health: 78,
  riskLevel: "Medium",
  nextFailure: "Brake Pads",
  daysToFailure: 25,
  features: [
    "7 Seater",
    "Dual AC",
    "Entertainment System",
    "Power Sliding Doors",
    "Cruise Control",
    "Parking Sensors"
  ]
};

const predictedComponents = [
  {
    name: "Brake Pads",
    risk: "High",
    daysToFailure: 25,
    confidence: 94,
    trend: [85, 83, 81, 79, 78, 77, 76],
  },
  {
    name: "Air Filter",
    risk: "Medium",
    daysToFailure: 40,
    confidence: 87,
    trend: [75, 76, 76, 77, 77, 78, 78],
  },
  {
    name: "Engine",
    risk: "Normal",
    daysToFailure: 150,
    confidence: 83,
    trend: [82, 82, 82, 82, 82, 82, 82],
  },
  {
    name: "Transmission",
    risk: "Low",
    daysToFailure: 90,
    confidence: 85,
    trend: [80, 80, 81, 81, 81, 82, 82],
  },
];

const trends = {
  brake: [
    { day: 0, value: 85 },
    { day: 5, value: 83 },
    { day: 10, value: 81 },
    { day: 15, value: 79 },
    { day: 20, value: 78 },
    { day: 25, value: 77 },
  ],
  battery: [
    { day: 0, value: 85 },
    { day: 5, value: 84 },
    { day: 10, value: 84 },
    { day: 15, value: 84 },
    { day: 20, value: 85 },
    { day: 25, value: 85 },
  ],
  engine: [
    { day: 0, value: 82 },
    { day: 5, value: 82 },
    { day: 10, value: 82 },
    { day: 15, value: 82 },
    { day: 20, value: 82 },
    { day: 25, value: 82 },
  ],
};

export default function InnovaPage({ params }: { params: { id: string } }) {
  // Placeholder: validate vehicle id if needed
  if (!params?.id) return notFound()

  const v = innovaData;

  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-black">
      {/* Enhanced Header with Visual Indicator */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-10"></div>
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
                  <BreadcrumbPage className="text-black font-medium">Toyota Innova</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{v.model} Dashboard</h1>
                <p className="text-gray-600 mt-2">Comprehensive predictive maintenance for your premium MPV</p>
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
                    className="px-2 py-1 text-xs bg-amber-50 text-amber-800 rounded-full border border-amber-200"
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
                ts: "2025-10-14 10:20",
                metric: "Brake temperature",
                severity: "high",
                description: "Elevated brake temperature detected",
              },
              {
                ts: "2025-10-14 09:45",
                metric: "Air filter clog",
                severity: "medium",
                description: "Air filter showing signs of clogging",
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