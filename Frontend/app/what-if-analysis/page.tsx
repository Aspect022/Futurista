"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const cars = [
  { id: "car-1", name: "Skoda Superb", year: 2023, mileage: 12500 },
  { id: "car-2", name: "Toyota Fortuner", year: 2024, mileage: 8900 },
  { id: "car-3", name: "Toyota Innova", year: 2023, mileage: 15600 },
];

export default function WhatIfAnalysisIntro() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-black p-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">What-If Analysis</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how your driving style impacts your vehicle's health. Select a vehicle to analyze.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div 
              key={car.id} 
              className="bg-white rounded-2xl border border-black/10 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{car.name}</h2>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>Year: {car.year}</div>
                <div>Mileage: {car.mileage.toLocaleString()} km</div>
              </div>
              <Button 
                className="w-full"
                onClick={() => router.push(`/vehicle/${car.id}/what-if-analysis`)}
              >
                Analyze This Vehicle
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard-new" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}