"use client";

type HealthScoreProps = {
  selectedCar?: string;
}

export default function HealthScore({ selectedCar = "car-1" }: HealthScoreProps) {
  // Car-specific scores
  let score = 82;
  if (selectedCar === "car-1") {
    score = 88; // Skoda Superb
  } else if (selectedCar === "car-2") {
    score = 92; // Fortuner
  } else if (selectedCar === "car-3") {
    score = 58; // Innova - lower health
  }

  const label =
    score >= 85 ? "Excellent" : score >= 70 ? "Good" : "Needs attention";
  const statusIcon =
    score >= 85 ? "/images/car-good.svg" : "/images/car-broken.svg";

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl border border-black/10 bg-white/90 px-4 py-3 shadow-sm">
      <div className="relative h-10 w-10">
        <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="16"
            className="stroke-black/10"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            className="stroke-black"
            strokeWidth="4"
            strokeDasharray={`${score * 1.005} 200`}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xs font-medium text-black">
          {score}
        </span>
      </div>
      <div className="grid leading-tight">
        <span className="text-xs text-black/60">Health score</span>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-black">
          <img src={statusIcon} alt={label} className="h-4 w-4" />
          {label}
        </span>
      </div>
    </div>
  );
}
