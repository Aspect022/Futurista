"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function ThreeDScenePlaceholder() {
  const ref = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [prefersReducedMotion ? 0 : -10, prefersReducedMotion ? 0 : 10])
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [prefersReducedMotion ? 0 : -1.5, prefersReducedMotion ? 0 : 1.5],
  )

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate }}
      className="relative rounded-2xl border border-white/10 bg-[#0F1620] p-3 md:p-4"
      aria-label="Vehicle health visualization"
    >
      {/* Integration notes:
         - Replace the inner <div role="img"> with a <Canvas> from @react-three/fiber or a Spline scene.
         - Keep container padding and rounded corners for visual consistency.
         - For canvas images/textures, set image.crossOrigin = "anonymous" to avoid CORS issues when drawing to <canvas>.
         - Consider scenes:
           Left: "Breakdown" (heatmap over tires/brakes, warning chips)
           Right: "Breakthrough" (cool tones, green checks, stability lines)
      */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Breakdown */}
        <div className="relative rounded-xl border border-white/10 bg-[#121A24] p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-[radial-gradient(40%_60%_at_30%_20%,rgba(255,92,92,0.18),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#FFB86B]">Breakdown</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-[#E6EEF6]/80">
              Simulated
            </span>
          </div>

          <div role="img" aria-label="Vehicle alert visualization" className="mt-4">
            <div className="h-32 rounded-lg border border-white/10 bg-gradient-to-b from-[#1A2430] to-[#0F1620] flex items-center justify-center">
              <div className="flex items-center gap-2 text-[#FF5C5C]">
                <div className="size-2 rounded-full bg-[#FF5C5C]" />
                <p className="text-sm">Anomaly on Front-Left Brake</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakthrough */}
        <div className="relative rounded-xl border border-white/10 bg-[#121A24] p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-[radial-gradient(40%_60%_at_70%_20%,rgba(0,209,191,0.18),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: "#00D1BF" }}>
              Breakthrough
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-[#E6EEF6]/80">
              Forecast
            </span>
          </div>

          <div role="img" aria-label="Vehicle healthy visualization" className="mt-4">
            <div className="h-32 rounded-lg border border-white/10 bg-gradient-to-b from-[#1A2430] to-[#0F1620] flex items-center justify-center">
              <div className="flex items-center gap-2" style={{ color: "#00D1BF" }}>
                <div className="size-2 rounded-full" style={{ backgroundColor: "#00D1BF" }} />
                <p className="text-sm">Stable • No Issues Forecasted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend / helper */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#98A0AD]">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: "#00D1BF" }} aria-hidden="true" />
          Healthy
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#FF5C5C]" aria-hidden="true" />
          Alert
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#FFB86B]" aria-hidden="true" />
          Watch
        </span>
      </div>
    </motion.div>
  )
}
