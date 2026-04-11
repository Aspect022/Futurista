import { notFound } from "next/navigation"
import { CAR_DATA } from "@/lib/mock-data";
import { PredictiveMaintenanceClient } from "./PredictiveMaintenanceClient";

function getCarData(carId: string) {
  return CAR_DATA[carId] || CAR_DATA["car-1"];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) return notFound()

  const { vehicle: v, predictedComponents, trends } = getCarData(resolvedParams.id)

  return (
    <PredictiveMaintenanceClient
      v={v}
      predictedComponents={predictedComponents}
      trends={trends}
    />
  )
}
