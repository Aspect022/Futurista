"use client";

import { UnifiedNavbar } from "@/components/navbar"
import { LandingHero } from "@/components/landing-hero"
import { StaggerContainer, StaggerItem, FadeInOnScroll, AnimatedCard } from "@/components/scroll-animation"

export default function Page() {
  const stats = [
    { value: "92%", label: "failure events forecast accuracy" },
    { value: "-48%", label: "reduction in average downtime" },
    { value: "+34%", label: "improvement in fleet uptime" },
    { value: "3x", label: "faster issue triage and resolution" },
  ];

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <UnifiedNavbar />
      <LandingHero />

      {/* Details / Stats section below the fold */}
      <section aria-labelledby="stats-title" className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <FadeInOnScroll>
          <h2 id="stats-title" className="text-2xl md:text-4xl font-semibold mb-4 text-balance text-foreground">
            Why predictive maintenance matters
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12 text-lg">
            Futurista&apos;s proactive insights reduce unplanned downtime and keep vehicles moving. Here are a few headline results from
            teams using a predictive approach.
          </p>
        </FadeInOnScroll>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <AnimatedCard className="rounded-2xl border border-input bg-card p-6 h-full transition-colors">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6">
          <FadeInOnScroll className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Intelligent Fleet Management
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powered by advanced AI agents that continuously monitor, analyze, and predict vehicle health.
            </p>
          </FadeInOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <AnimatedCard className="p-8 rounded-2xl bg-card border border-input h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Real-time Analytics</h3>
                <p className="text-muted-foreground">
                  Monitor your entire fleet with live dashboards and instant alerts for potential issues.
                </p>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-8 rounded-2xl bg-card border border-input h-full">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Predictive Diagnostics</h3>
                <p className="text-muted-foreground">
                  AI-powered predictions identify failures before they happen, reducing unexpected breakdowns.
                </p>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-8 rounded-2xl bg-card border border-input h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Scheduling</h3>
                <p className="text-muted-foreground">
                  Automated maintenance scheduling that optimizes for minimal downtime and maximum efficiency.
                </p>
              </AnimatedCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <FadeInOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Ready to Transform Your Fleet?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Join the future of predictive maintenance. Start monitoring your vehicles smarter today.
            </p>
            <a
              href="/dashboard-new"
              className="inline-flex items-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
            >
              Get Started
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-input py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Futurista. Predictive maintenance for the modern fleet.
          </p>
        </div>
      </footer>
    </main>
  )
}
