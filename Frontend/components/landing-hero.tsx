"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export function LandingHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-labelledby="hero-title"
      role="region"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/Generated/Videos/Hero-Background.mp4" type="video/mp4" />
        </video>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-4 md:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <motion.h1
            id="hero-title"
            initial={prefersReducedMotion ? false : { y: 20, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-balance text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl"
          >
            Breakdown <span className="text-primary-foreground/90">→</span>{" "}
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Breakthrough
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { y: 20, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mt-6 text-lg text-gray-200 md:text-xl max-w-2xl mx-auto"
          >
            Futurista uses AI to check your car&apos;s engine data and tell you
            — in plain English — what needs fixing and when.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { y: 20, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="mt-8"
          >
            <Link
              href="/dashboard-new"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Check My Car Now — It&apos;s Free
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
