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
      {/* Sky background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="h-full w-full bg-[linear-gradient(180deg,#60A5FA_0%,#93C5FD_35%,#93C5FD_65%,#FFFFFF_100%)]" />
      </div>

      {/* Clouds layer (subtle, decorative) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
      >
        <Cloud className="top-14 left-6" delay={0.2} scale={0.9} />
        <Cloud className="top-20 right-16" delay={0.8} scale={0.8} />
        <Cloud className="left-[62%] top-[28vh]" delay={0.5} scale={1} />
      </div>

      {/* Headline - centered and cleaner */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 grid place-items-center">
        <motion.h1
          id="hero-title"
          initial={prefersReducedMotion ? false : { y: 16, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-balance text-white text-6xl md:text-8xl font-semibold tracking-tight leading-[1.1] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] md:drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]"
        >
          Breakdown <span aria-hidden="true">→</span> Breakthrough
        </motion.h1>
      </div>

      {/* Road */}
      <div className="absolute inset-x-0 bottom-0 z-0">
        {/* Horizon line */}
        <div className="h-[1px] w-full bg-black/70" />
        <div className="relative h-[35vh] bg-black">
          {/* Lane markers */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-around px-6 md:px-20">
            <span
              className="h-1 w-16 md:w-24 rounded-full bg-white"
              aria-hidden="true"
            />
            <span
              className="h-1 w-16 md:w-24 rounded-full bg-white"
              aria-hidden="true"
            />
            <span
              className="h-1 w-16 md:w-24 rounded-full bg-white"
              aria-hidden="true"
            />
          </div>

          {/* Place cars inside the road container so they sit on the road */}
          <div className="absolute inset-0 z-[2]">
            {/* Left: breakdown car higher on road and larger */}
            <div className="absolute left-[6%] md:left-[10%] -top-8 flex items-end gap-4">
              <div
                aria-label="Driver standing by car with hood open"
                className="h-14 w-2 rounded-full bg-white/95"
              />
              <Image
                src="/images/car-broken.svg"
                alt="Car with hood open — breakdown"
                width={300}
                height={150}
                priority
                className="drop-shadow-[0_0_0_2px_#000000]"
              />
            </div>

            {/* Right: car driving away — larger and slightly higher */}
            <div className="absolute right-[8%] md:right-[12%] top-2">
              <Image
                src="/images/car-good.svg"
                alt="Car driving away — breakthrough"
                width={280}
                height={140}
                priority
                className="drop-shadow-[0_0_0_2px_#000000]"
              />
            </div>
          </div>
        </div>

        {/* Enhanced landscape elements: trees and bushes */}
        {/* Left side trees */}
        <div className="absolute left-0 top-[-140px] w-16 h-32">
          <div className="absolute bottom-0 left-6 w-3 h-16 bg-amber-900 rounded-full"></div>
          <div className="absolute bottom-16 left-0 w-16 h-16 bg-green-700 rounded-full"></div>
        </div>
        <div className="absolute left-[8%] top-[-160px] w-16 h-36">
          <div className="absolute bottom-0 left-8 w-4 h-20 bg-amber-900 rounded-full"></div>
          <div className="absolute bottom-20 left-2 w-16 h-16 bg-green-700 rounded-full"></div>
        </div>
        
        {/* Right side trees */}
        <div className="absolute right-[15%] top-[-150px] w-16 h-36">
          <div className="absolute bottom-0 left-8 w-4 h-18 bg-amber-900 rounded-full"></div>
          <div className="absolute bottom-18 left-2 w-16 h-16 bg-green-700 rounded-full"></div>
        </div>
        <div className="absolute right-4 top-[-120px] w-16 h-32">
          <div className="absolute bottom-0 left-6 w-3 h-14 bg-amber-900 rounded-full"></div>
          <div className="absolute bottom-14 left-0 w-16 h-16 bg-green-700 rounded-full"></div>
        </div>
        
        {/* Bushes */}
        <div className="absolute left-[5%] top-[-80px] w-8 h-8 bg-green-600 rounded-full"></div>
        <div className="absolute right-[25%] top-[-70px] w-10 h-8 bg-green-600 rounded-full"></div>
        <div className="absolute right-[5%] top-[-90px] w-8 h-8 bg-green-600 rounded-full"></div>
      </div>

      {/* Spacer to ensure content clears the absolute road area on small screens */}
      <div className="h-[35vh]" aria-hidden="true" />
    </section>
  );
}
