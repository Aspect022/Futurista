 "use client";

import React from "react";
import Link from "next/link";
import { UnifiedNavbar } from "@/components/navbar";
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
import { Loader2, Sparkles, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ANOMALIES } from "@/lib/mock-data";

type PredictiveMaintenanceClientProps = {
  v: any;
  predictedComponents: any[];
  trends: any[];
};

export function PredictiveMaintenanceClient({
  v,
  predictedComponents,
  trends,
}: PredictiveMaintenanceClientProps) {
  const [explanation, setExplanation] = React.useState<string | null>(null);
  const [isExplaining, setIsExplaining] = React.useState(false);
  const [explainingComponent, setExplainingComponent] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleExplain = async (componentName: string, predictionData: any) => {
    setExplainingComponent(componentName);
    setIsExplaining(true);
    setExplanation(null);
    setIsDialogOpen(true);

    try {
      const response = await fetch("/api/predictive-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentName,
          predictionData,
          vehicleModel: v.model,
        }),
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Explanation failed", error);
      setExplanation("Failed to generate explanation. Please try again.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <UnifiedNavbar />

      <div className="pt-16">
        {/* Enhanced Header with Visual Indicator */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10" />
          <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 relative">
            <div className="mb-6">
              <Breadcrumb className="text-muted-foreground">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard-new" className="text-muted-foreground hover:text-foreground">
                      My Car
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-black font-medium">Health Report</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Your Car&apos;s Health Report
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Here&apos;s what our AI found after checking your car
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        v.riskLevel === "High"
                          ? "bg-red-500 animate-pulse"
                          : v.riskLevel === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
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
                      <h3 className="font-semibold text-red-800">Your Car Needs Attention</h3>
                      <p className="text-red-700 mt-1">
                        Your {v.model} health score is at {v.health}% — that&apos;s below what we&apos;d recommend for safe driving. Let&apos;s get this sorted.
                      </p>
                      <div className="mt-3">
                        <Link href="/appointment-booking">
                          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            Book a Mechanic Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle info row — NO VIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                  <div className="text-xs text-muted-foreground">Car</div>
                  <div className="text-sm font-medium text-foreground">{v.model}</div>
                </div>
                <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                  <div className="text-sm font-medium text-foreground">{v.riskLevel}</div>
                </div>
                <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                  <div className="text-xs text-muted-foreground">Last Checked</div>
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
                Parts That May Need Fixing Soon
              </h2>
              <div className="text-sm text-muted-foreground">
                AI-powered predictions based on 90+ data points
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {predictedComponents.map((c) => (
                <ComponentPredictionCard
                  key={c.name}
                  name={c.name}
                  risk={c.risk as "Normal" | "Low" | "Medium" | "High" | "Critical"}
                  daysToFailure={c.daysToFailure}
                  confidence={c.confidence}
                  trend={c.trend}
                  onExplain={() => handleExplain(c.name, c)}
                />
              ))}
            </div>
          </section>

          {/* Trends Section with Enhanced Styling */}
          <section aria-labelledby="trends-title" className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 id="trends-title" className="text-xl md:text-2xl font-bold text-foreground">
                How Your Car&apos;s Condition is Changing
              </h2>
              <div className="text-sm text-muted-foreground">Based on last 30 days of driving data</div>
            </div>
            <TrendsChart data={trends} />
          </section>

          {/* Anomalies & Alerts with Enhanced Styling */}
          <section aria-labelledby="anomalies-title" className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 id="anomalies-title" className="text-xl md:text-2xl font-bold text-foreground">
                Recent Warnings
              </h2>
              <div className="text-sm text-muted-foreground">Detected in the last 24 hours</div>
            </div>
            <AnomaliesList items={ANOMALIES as any[]} />
          </section>

          {/* Recommended Actions with Enhanced Styling */}
          <section aria-labelledby="next-steps-title" className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 id="next-steps-title" className="text-xl md:text-2xl font-bold text-foreground">
                What You Should Do
              </h2>
              <div className="text-sm text-muted-foreground">Prioritised by urgency</div>
            </div>
            <ActionsPanel vehicleId={v.id} />
          </section>

          {/* Book a Mechanic CTA */}
          <div className="mb-10 text-center">
            <Link
              href="/appointment-booking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Wrench className="h-5 w-5" />
              Book a Mechanic
            </Link>
          </div>
        </section>
      </div>

      {/* AI Explanation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-700">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              AI Insight: {explainingComponent}
            </DialogTitle>
            <DialogDescription>
              Here&apos;s why this part might need attention — explained simply.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/40 rounded-lg">
            {isExplaining ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
                <p className="text-sm text-muted-foreground">Checking your car&apos;s data...</p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-foreground/90">
                {explanation}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Powered by Llama 3 AI</span>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
