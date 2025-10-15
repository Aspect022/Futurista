import { notFound } from "next/navigation"
import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HealthSummaryCard } from "@/components/predictive/health-summary-card"
import { ComponentPredictionCard } from "@/components/predictive/component-prediction-card"
import { TrendsChart } from "@/components/predictive/trends-chart"
import { AnomaliesList } from "@/components/predictive/anomalies-list"
import { ActionsPanel } from "@/components/predictive/actions-panel"
import { UnifiedNavbar } from "@/components/navbar"
import { Workflow } from "lucide-react"

// Function to get car-specific data
function getCarData(carId: string) {
  switch (carId) {
    case "car-1":
      // Skoda Superb - Excellent condition
      return {
        vehicle: {
          id: "car-1",
          model: "Skoda Superb",
          vin: "TMBJF2NP0N1234567",
          lastUpdated: "2025-10-14 12:32 UTC",
          health: 92,
          riskLevel: "Low",
          nextFailure: "Air Filter",
          daysToFailure: 120,
        },
        predictedComponents: [
          {
            name: "Air Filter",
            risk: "Low",
            daysToFailure: 120,
            confidence: 94,
            trend: [90, 91, 91, 92, 92, 92, 92],
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
            daysToFailure: 200,
            confidence: 85,
            trend: [92, 92, 92, 92, 92, 92, 92],
          },
          {
            name: "Transmission",
            risk: "Low",
            daysToFailure: 130,
            confidence: 82,
            trend: [89, 89, 90, 90, 90, 91, 91],
          },
        ],
        trends: {
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
        }
      };
    
    case "car-2":
      // Fortuner - Medium condition
      return {
        vehicle: {
          id: "car-2",
          model: "Toyota Fortuner",
          vin: "2T1BURHE0JC012345",
          lastUpdated: "2025-10-14 12:32 UTC",
          health: 78,
          riskLevel: "Medium",
          nextFailure: "Brake Pads",
          daysToFailure: 32,
        },
        predictedComponents: [
          {
            name: "Brake Pads",
            risk: "Medium",
            daysToFailure: 32,
            confidence: 87,
            trend: [85, 84, 83, 82, 81, 80, 79],
          },
          {
            name: "Air Filter",
            risk: "Low",
            daysToFailure: 55,
            confidence: 89,
            trend: [78, 78, 78, 79, 79, 80, 80],
          },
          {
            name: "Engine",
            risk: "Normal",
            daysToFailure: 150,
            confidence: 83,
            trend: [80, 80, 80, 80, 80, 80, 80],
          },
          {
            name: "Transmission",
            risk: "Low",
            daysToFailure: 90,
            confidence: 81,
            trend: [78, 78, 79, 79, 80, 80, 80],
          },
        ],
        trends: {
          brake: [
            { day: 0, value: 85 },
            { day: 5, value: 84 },
            { day: 10, value: 83 },
            { day: 15, value: 82 },
            { day: 20, value: 81 },
            { day: 25, value: 80 },
          ],
          battery: [
            { day: 0, value: 84 },
            { day: 5, value: 84 },
            { day: 10, value: 84 },
            { day: 15, value: 84 },
            { day: 20, value: 85 },
            { day: 25, value: 85 },
          ],
          engine: [
            { day: 0, value: 80 },
            { day: 5, value: 80 },
            { day: 10, value: 80 },
            { day: 15, value: 80 },
            { day: 20, value: 80 },
            { day: 25, value: 80 },
          ],
        }
      };
    
    case "car-3":
      // Innova - Bad condition
      return {
        vehicle: {
          id: "car-3",
          model: "Toyota Innova",
          vin: "MP1JY2E2XPA123456",
          lastUpdated: "2025-10-14 12:32 UTC",
          health: 48,
          riskLevel: "High",
          nextFailure: "Brake Pads",
          daysToFailure: 12,
        },
        predictedComponents: [
          {
            name: "Brake Pads",
            risk: "High",
            daysToFailure: 12,
            confidence: 95,
            trend: [75, 72, 69, 65, 60, 55, 50],
          },
          {
            name: "Air Filter",
            risk: "High",
            daysToFailure: 18,
            confidence: 91,
            trend: [65, 62, 59, 56, 53, 51, 49],
          },
          {
            name: "Engine",
            risk: "Medium",
            daysToFailure: 65,
            confidence: 79,
            trend: [65, 64, 63, 62, 61, 60, 59],
          },
          {
            name: "Transmission",
            risk: "High",
            daysToFailure: 25,
            confidence: 83,
            trend: [60, 58, 56, 54, 52, 51, 50],
          },
        ],
        trends: {
          brake: [
            { day: 0, value: 75 },
            { day: 5, value: 72 },
            { day: 10, value: 69 },
            { day: 15, value: 65 },
            { day: 20, value: 60 },
            { day: 25, value: 55 },
          ],
          battery: [
            { day: 0, value: 68 },
            { day: 5, value: 67 },
            { day: 10, value: 66 },
            { day: 15, value: 65 },
            { day: 20, value: 64 },
            { day: 25, value: 63 },
          ],
          engine: [
            { day: 0, value: 65 },
            { day: 5, value: 64 },
            { day: 10, value: 63 },
            { day: 15, value: 62 },
            { day: 20, value: 61 },
            { day: 25, value: 60 },
          ],
        }
      };
    
    default:
      // Default to car-1 if unknown id
      return {
        vehicle: {
          id: "car-1",
          model: "Skoda Superb",
          vin: "TMBJF2NP0N1234567",
          lastUpdated: "2025-10-14 12:32 UTC",
          health: 92,
          riskLevel: "Low",
          nextFailure: "Air Filter",
          daysToFailure: 120,
        },
        predictedComponents: [
          {
            name: "Air Filter",
            risk: "Low",
            daysToFailure: 120,
            confidence: 94,
            trend: [90, 91, 91, 92, 92, 92, 92],
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
            daysToFailure: 200,
            confidence: 85,
            trend: [92, 92, 92, 92, 92, 92, 92],
          },
          {
            name: "Transmission",
            risk: "Low",
            daysToFailure: 130,
            confidence: 82,
            trend: [89, 89, 90, 90, 90, 91, 91],
          },
        ],
        trends: {
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
        }
      };
  }
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  // Placeholder: validate vehicle id if needed
  if (!resolvedParams?.id) return notFound()

  const { vehicle: v, predictedComponents, trends } = getCarData(resolvedParams.id)

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <UnifiedNavbar />

      <div className="pt-16"> {/* This adds padding to account for the fixed navbar */}
      {/* Enhanced Header with Visual Indicator */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 relative">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb className="text-muted-foreground">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard-new" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/vehicle/${v.id}`} className="text-muted-foreground hover:text-foreground">
                    Vehicle
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-black font-medium">Futurista Insights</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Futurista Predictive Insights</h1>
                <p className="text-muted-foreground mt-2">AI-powered predictions to keep your vehicle running optimally</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${v.riskLevel === "High" ? "bg-red-500 animate-pulse" : v.riskLevel === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                  <span className="text-sm font-medium text-foreground">{v.riskLevel} Risk</span>
                </div>
              </div>
            </div>

            {/* Critical condition popup for low health vehicles */}
            {v.health < 70 && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Critical Vehicle Condition</h3>
                    <p className="text-red-700 mt-1">
                      Your {v.model} requires immediate attention. Health score is critically low at {v.health}%.
                    </p>
                    <div className="mt-3">
                      <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Start Emergency Workflow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle info row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Model</div>
                <div className="text-sm font-medium text-foreground">{v.model}</div>
              </div>
              <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">VIN</div>
                <div className="text-sm font-medium text-foreground">{v.vin}</div>
              </div>
              <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Risk Level</div>
                <div className="text-sm font-medium text-foreground">{v.riskLevel}</div>
              </div>
              <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Last Updated</div>
                <time className="text-sm font-medium text-foreground">{v.lastUpdated}</time>
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
            <h2 id="predicted-components-title" className="text-xl md:text-2xl font-bold text-foreground">
              Predicted Component Failures
            </h2>
            <div className="text-sm text-muted-foreground">AI-powered predictions based on 90+ data points</div>
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
            <h2 id="trends-title" className="text-xl md:text-2xl font-bold text-foreground">
              Predicted Health Trends
            </h2>
            <div className="text-sm text-muted-foreground">Based on last 30 days of driving data</div>
          </div>
          <TrendsChart data={trends} />
        </section>

        {/* Anomalies & Alerts with Enhanced Styling */}
        <section aria-labelledby="anomalies-title" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 id="anomalies-title" className="text-xl md:text-2xl font-bold text-foreground">
              Recent Anomalies & Alerts
            </h2>
            <div className="text-sm text-muted-foreground">Detected in the last 24 hours</div>
          </div>
          <AnomaliesList
            items={[
              {
                ts: "2025-10-14 12:20",
                metric: "Brake temp deviation",
                severity: "high",
                description: "High brake temperature deviation detected",
              },
              {
                ts: "2025-10-14 11:50",
                metric: "Battery voltage variance",
                severity: "medium",
                description: "Voltage variance above baseline",
              },
              {
                ts: "2025-10-14 10:05",
                metric: "Engine vibration spike",
                severity: "low",
                description: "Transient vibration spike observed",
              },
            ]}
          />
        </section>

        {/* Recommended Actions with Enhanced Styling */}
        <section aria-labelledby="next-steps-title" className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 id="next-steps-title" className="text-xl md:text-2xl font-bold text-foreground">
              Recommended Actions
            </h2>
            <div className="text-sm text-muted-foreground">Prioritized by urgency</div>
          </div>
          <ActionsPanel vehicleId={v.id} />
        </section>
      </section>
      
      </div> {/* Close the pt-16 div */}

      {/* Workflow and Appointment buttons at bottom right - using links to avoid hydration issues */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        <a href="/api/workflow" target="_blank" rel="noopener noreferrer" 
           className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105">
          <Workflow className="h-5 w-5" />
          <span className="hidden md:inline">n8n Workflow</span>
        </a>
        {v.health < 70 && (
          <a href="/appointment-booking" 
             className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transition-colors">
            <span>Schedule Appointment</span>
          </a>
        )}
      </div>
    </main>
  )
}
