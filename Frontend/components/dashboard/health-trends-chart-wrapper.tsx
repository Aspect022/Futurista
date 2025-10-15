"use client";

import { useState, useEffect } from "react";
import HealthTrendsChart from "./health-trends-chart";

type HealthTrendsChartWrapperProps = {
  selectedCar: string;
};

export function HealthTrendsChartWrapper({ selectedCar }: HealthTrendsChartWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-sm w-64 h-64"></div>;
  }

  return <HealthTrendsChart selectedCar={selectedCar} />;
}