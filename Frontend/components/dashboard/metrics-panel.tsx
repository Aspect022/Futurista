"use client";

import { useState } from "react";

type Metric = {
  label: string;
  value: number; // 0..100
  unit?: string;
};

const initialMetrics: Metric[] = [
  { label: "Brake wear", value: 38, unit: "%" },
  { label: "Oil level", value: 72, unit: "%" },
  { label: "Tire pressure (avg)", value: 90, unit: "%" },
  { label: "Battery health", value: 64, unit: "%" },
];

export default function MetricsPanel() {
  const [metrics] = useState<Metric[]>(initialMetrics);

  return (
    <div className="grid gap-2">
      <h2 className="sr-only">Live features</h2>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {metrics.map((m) => (
          <li
            key={m.label}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/80 px-3 py-1.5 text-xs text-black backdrop-blur"
          >
            {m.label.toLowerCase().includes("brake") ? (
              <img
                src="/images/car-broken.svg"
                alt="alert"
                className="h-3.5 w-3.5"
              />
            ) : (
              <img
                src="/images/car-good.svg"
                alt="ok"
                className="h-3.5 w-3.5"
              />
            )}
            <span className="font-medium">{m.label}:</span> {m.value}
            {m.unit || ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
