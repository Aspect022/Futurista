import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Car, Gauge, Battery } from "lucide-react";
import { Droplets, Wind } from "lucide-react";

type CarStats = {
  id: string;
  name: string;
  tier: string;
  engine: string;
  year: number;
  mileage: number;
  healthScore: number;
  lastService: string;
  nextService: string;
  oilChange: string;
  brakeHealth: number;
  batteryHealth: number;
  tireHealth: number;
};

type StatsPopupProps = {
  selectedCar: string;
  isOpen: boolean;
  onClose: () => void;
};

const carData: Record<string, CarStats> = {
  "car-1": {
    id: "car-1",
    name: "Skoda Superb",
    tier: "Premium",
    engine: "2.0 TDI",
    year: 2023,
    mileage: 12500,
    healthScore: 88,
    lastService: "2025-09-15",
    nextService: "2026-03-15",
    oilChange: "2026-01-15",
    brakeHealth: 85,
    batteryHealth: 91,
    tireHealth: 78,
  },
  "car-2": {
    id: "car-2",
    name: "Toyota Fortuner",
    tier: "SUV Elite",
    engine: "2.8L Turbo Diesel",
    year: 2024,
    mileage: 8900,
    healthScore: 92,
    lastService: "2025-10-01",
    nextService: "2026-04-01",
    oilChange: "2026-02-01",
    brakeHealth: 88,
    batteryHealth: 95,
    tireHealth: 85,
  },
  "car-3": {
    id: "car-3",
    name: "Toyota Innova",
    tier: "MPV Pro",
    engine: "2.4L Diesel",
    year: 2023,
    mileage: 15600,
    healthScore: 78,
    lastService: "2025-08-20",
    nextService: "2026-02-20",
    oilChange: "2025-12-20",
    brakeHealth: 72,
    batteryHealth: 84,
    tireHealth: 70,
  },
};

export function StatsPopup({ selectedCar, isOpen, onClose }: StatsPopupProps) {
  const [currentCar, setCurrentCar] = useState<CarStats>(carData[selectedCar] || carData["car-1"]);

  useEffect(() => {
    setCurrentCar(carData[selectedCar] || carData["car-1"]);
  }, [selectedCar]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl border border-black/10 w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {currentCar.name}
                </h3>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/10">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Gauge className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Health Score</div>
                    <div className="font-medium">{currentCar.healthScore}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/10">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Droplets className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Oil Change</div>
                    <div className="font-medium">{currentCar.oilChange}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/10">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Wind className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Tire Health</div>
                    <div className="font-medium">{currentCar.tireHealth}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/10">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Battery className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Battery</div>
                    <div className="font-medium">{currentCar.batteryHealth}%</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-black/60">Mileage</span>
                  <span className="font-medium">{currentCar.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Engine</span>
                  <span className="font-medium">{currentCar.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Tier</span>
                  <span className="font-medium">{currentCar.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Last Service</span>
                  <span className="font-medium">{currentCar.lastService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Next Service</span>
                  <span className="font-medium">{currentCar.nextService}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10">
                <button className="w-full py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-colors">
                  View Detailed Report
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}