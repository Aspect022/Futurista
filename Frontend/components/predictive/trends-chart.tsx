"use client"

import { useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

type TrendPoint = { day: number; value: number }
type TrendsData = {
  brake: TrendPoint[]
  battery: TrendPoint[]
  engine: TrendPoint[]
}

export function TrendsChart({ data }: { data: TrendsData }) {
  const [tab, setTab] = useState<"brake" | "battery" | "engine">("brake")

  const chartData = data[tab]

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="bg-black/5 text-black/60">
          <TabsTrigger
            value="brake"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-black/70"
          >
            Brake
          </TabsTrigger>
          <TabsTrigger
            value="battery"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-black/70"
          >
            Battery
          </TabsTrigger>
          <TabsTrigger
            value="engine"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-black/70"
          >
            Engine
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <div className="h-72 w-full">
            <ChartContainer
              config={{
                // Provide label/color for the single series key used by the chart
                value: { label: "Health", color: "#111111" },
              }}
              className="h-full w-full"
            >
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#EAEAEA" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#111111" tick={{ fill: "#111111", fontSize: 12 }} />
                <YAxis stroke="#111111" tick={{ fill: "#111111", fontSize: 12 }} />
                <Tooltip content={<ChartTooltipContent />} />
                {/* Neutral grayscale lines */}
                <Line type="monotone" dataKey="value" stroke="#111111" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
