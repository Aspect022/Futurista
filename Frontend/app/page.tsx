import { UnifiedNavbar } from "@/components/navbar"
import { LandingHero } from "@/components/landing-hero"

export default function Page() {
  return (
    <main className="min-h-dvh bg-white text-black">
      <UnifiedNavbar />
      <LandingHero />
      {/* Details / Stats section below the fold */}
      <section aria-labelledby="stats-title" className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <h2 id="stats-title" className="text-2xl md:text-3xl font-semibold mb-6 text-balance">
          Why predictive maintenance matters
        </h2>
        <p className="text-gray-600 max-w-2xl mb-10">
          Futurista's proactive insights reduce unplanned downtime and keep vehicles moving. Here are a few headline results from
          teams using a predictive approach.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-xl border border-black/10 p-5">
            <p className="text-3xl font-semibold">92%</p>
            <p className="text-gray-600 mt-1">failure events forecast accuracy</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <p className="text-3xl font-semibold">-48%</p>
            <p className="text-gray-600 mt-1">reduction in average downtime</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <p className="text-3xl font-semibold">+34%</p>
            <p className="text-gray-600 mt-1">improvement in fleet uptime</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <p className="text-3xl font-semibold">3x</p>
            <p className="text-gray-600 mt-1">faster issue triage and resolution</p>
          </div>
        </div>
      </section>
    </main>
  )
}
