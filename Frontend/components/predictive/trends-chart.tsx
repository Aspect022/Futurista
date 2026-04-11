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
    <div className="rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-sm">
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="bg-muted text-muted-foreground">
          <TabsTrigger
            value="brake"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
          >
            Brake
          </TabsTrigger>
          <TabsTrigger
            value="battery"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
          >
            Battery
          </TabsTrigger>
          <TabsTrigger
            value="engine"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
          >
            Engine
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <div className="h-72 w-full">
            <ChartContainer
              config={{
                value: { label: "Health", color: "hsl(var(--foreground))" },
              }}
              className="h-full w-full"
            >
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
