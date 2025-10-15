"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cars = [
  { id: "car-1", name: "Skoda Superb" },
  { id: "car-2", name: "Fortuner" },
  { id: "car-3", name: "Innova" },
];

type CarListProps = {
  selectedCar: string;
  setSelectedCar: (carId: string) => void;
};

export default function CarList({ selectedCar, setSelectedCar }: CarListProps) {
  return (
    <div className="grid gap-3">
      <h2 className="sr-only">Vehicles</h2>
      <ul className="grid gap-2">
        {cars.map((car) => (
          <li key={car.id}>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between border-transparent bg-white/80 backdrop-blur text-black hover:bg-white",
                selectedCar === car.id && "bg-black text-white hover:bg-black"
              )}
              onClick={() => setSelectedCar(car.id)}
              aria-pressed={selectedCar === car.id}
            >
              <span>{car.name}</span>
              {selectedCar === car.id ? (
                <span className="h-2 w-2 rounded-full bg-white" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-black/20" />
              )}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
