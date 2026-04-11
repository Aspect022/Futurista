"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UnifiedNavbar } from "@/components/navbar";
import { ComponentPredictionCard } from "@/components/predictive/component-prediction-card";
import { TrendsChart } from "@/components/predictive/trends-chart";
import { CAR_DATA } from "@/lib/mock-data";
import { DataInputPanel } from "@/components/data-input-panel";
import { AskMyCar } from "@/components/ask-my-car";
import {
  Car,
  Wrench,
  MapPin,
  Shield,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

// Always show car-3 (Toyota Innova) — the single driver's car
const carData = CAR_DATA["car-3"];
const v = carData.vehicle;
const predictedComponents = carData.predictedComponents;
const trends = carData.trends;

export default function MyCarDashboard() {
  const router = useRouter();

  // Predictive toast notifications — simulate real-time warnings
  useEffect(() => {
    const timer1 = setTimeout(() => {
      toast.warning("Brake pads wearing fast", {
        description: "Your brake pads have worn 8% in the last week. A check-up this week is recommended.",
        action: {
          label: "Book Now",
          onClick: () => router.push("/appointment-booking"),
        },
        duration: 8000,
      });
    }, 2500);

    const timer2 = setTimeout(() => {
      toast.info("AI has finished analysing your car", {
        description: "3 components checked. 1 needs your attention soon.",
        action: {
          label: "See Report",
          onClick: () => router.push("/vehicle/car-3/predictive-maintenance"),
        },
        duration: 8000,
      });
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  // AI Summary state
  const [aiSummary, setAiSummary] = useState<string[] | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [hasFetchedSummary, setHasFetchedSummary] = useState(false);

  // XAI explanation dialog state
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainingComponent, setExplainingComponent] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch AI summary on mount
  const fetchSummary = async () => {
    if (hasFetchedSummary) return;
    setIsSummaryLoading(true);
    setHasFetchedSummary(true);
    try {
      const response = await fetch("/api/health-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleModel: v.model,
          health: v.health,
          components: predictedComponents,
        }),
      });
      const data = await response.json();
      setAiSummary(data.summary);
    } catch {
      setAiSummary([
        "Your brake pads have about 12 days before they need replacing — book a check soon.",
        "Your battery is stable and charging normally — no action needed.",
        "Everything else looks good — your engine and tyres are in healthy condition.",
      ]);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Trigger fetch on first render
  if (!hasFetchedSummary) {
    fetchSummary();
  }

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
    } catch {
      setExplanation("Failed to generate explanation. Please try again.");
    } finally {
      setIsExplaining(false);
    }
  };

  // Health ring config
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const healthProgress = (v.health / 100) * circumference;
  const healthColor = v.health >= 70 ? "#22c55e" : v.health >= 50 ? "#eab308" : "#ef4444";

  return (
    <main className="min-h-dvh bg-background text-foreground relative">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src="/Generated/Videos/Dashboard-Background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <UnifiedNavbar includeFleetScore={true} fleetHealth={v.health} />

      <div className="pt-20 min-h-dvh py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* 1. Friendly Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Hi, welcome back 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s how your car is doing today.
            </p>
          </header>

          {/* 2. Hero Car Card */}
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md p-6 md:p-8 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

              {/* Health Ring */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={healthColor}
                    strokeWidth="10"
                    strokeDasharray={`${healthProgress} ${circumference}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{v.health}%</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Health</span>
                </div>
              </div>

              {/* Car Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-bold text-foreground">Your {v.model} (2021)</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">15,600 km · Last checked {v.lastUpdated}</p>

                {/* Status Pills */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                    ⚠️ Brakes — Needs Attention
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                    ✅ Battery — Good
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                    ✅ Engine — Good
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. AI Summary Card */}
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md p-6 shadow-lg mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-foreground">What our AI found</h3>
            </div>

            {isSummaryLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 bg-muted/50 rounded animate-pulse" style={{ width: `${90 - i * 10}%` }} />
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {(aiSummary || []).map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="text-sm text-foreground/90 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Powered by Llama 3 AI</span>
            </div>
          </div>

          {/* 4. Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <Link
              href="/vehicle/car-3/predictive-maintenance"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/70 backdrop-blur-md hover:bg-card/90 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Full Health Report</p>
                  <p className="text-xs text-muted-foreground">All parts checked</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/what-if-analysis"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/70 backdrop-blur-md hover:bg-card/90 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Road Trip Check</p>
                  <p className="text-xs text-muted-foreground">Is your car trip-ready?</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/appointment-booking"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/70 backdrop-blur-md hover:bg-card/90 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Book a Mechanic</p>
                  <p className="text-xs text-muted-foreground">Nearest service centre</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          </div>

          {/* 5. Data Input Panel */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-foreground mb-4">Check Your Car&apos;s Data</h3>
            <DataInputPanel />
          </section>

          {/* 6. Parts That May Need Fixing Soon */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">Parts That May Need Fixing Soon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* 6. How Your Car's Condition is Changing */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">How Your Car&apos;s Condition is Changing</h2>
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md p-4 shadow-sm">
              <TrendsChart data={trends} />
            </div>
          </section>

        </div>
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
              <p className="text-sm leading-relaxed text-foreground/90">{explanation}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Powered by Llama 3 AI</span>
          </div>
        </DialogContent>
      </Dialog>
      {/* Ask My Car floating chat */}
      <AskMyCar />
    </main>
  );
}