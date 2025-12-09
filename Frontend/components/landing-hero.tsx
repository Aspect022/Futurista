"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

// Small decorative cloud (respects reduced motion)
function Cloud({
  className = "",
  delay = 0,
  scale = 1,
}: {
  className?: string;
  delay?: number;
  scale?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute ${className}`}
      initial={{ opacity: 0 }}
      animate={
        prefersReducedMotion
          ? { opacity: 0.8 }
          : { opacity: 0.9, x: [0, 12, 0], opacity: [0.8, 0.95, 0.8] }
      }
      transition={{
        duration: 14,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay,
      }}
      style={{ transformOrigin: "center" }}
    >
      <div className="relative" style={{ transform: `scale(${scale})` }}>
        {/* three overlapping puffs */}
        <span className="absolute left-0 top-2 h-6 w-12 rounded-full bg-white/95 shadow-[0_1px_0_#0000001a]" />
        <span className="absolute left-7 top-0 h-8 w-10 rounded-full bg-white/95 shadow-[0_1px_0_#0000001a]" />
        <span className="absolute left-14 top-3 h-6 w-12 rounded-full bg-white/95 shadow-[0_1px_0_#0000001a]" />
        {/* base */}
        <span className="relative block h-6 w-28 rounded-full bg-white/95 shadow-[0_1px_0_#0000001a]" />
      </div>
    </motion.div>
  );
}

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
            Experience the future of fleet management with AI-driven predictive
            maintenance that keeps your vehicles on the road.
          </motion.p>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
