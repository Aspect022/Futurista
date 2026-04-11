"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UnifiedNavbar } from "@/components/navbar";
import { ArrowLeft } from "lucide-react";

export default function WhatIfAnalysisIntro() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <UnifiedNavbar />
      <div className="pt-20 max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/dashboard-new"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Car
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Road Trip Safety Check</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Planning a trip? Let&apos;s make sure your car can handle it.
          </p>
        </div>

        {/* Auto-selected vehicle — skip the picker */}
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">48%</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground">Toyota Innova</h2>
                <p className="text-sm text-muted-foreground">2023 · 15,600 km</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800">
                ⚠️ Your car has some parts that need attention. The trip analysis will factor this in.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = "/vehicle/car-3/what-if-analysis";
              }}
            >
              Analyse My Trip
            </Button>
          </div>

          <div className="text-center">
            <Link href="/dashboard-new" className="text-primary hover:underline text-sm">
              ← Back to My Car
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}