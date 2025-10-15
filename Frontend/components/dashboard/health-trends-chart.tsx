import { useState } from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type HealthTrendData = {
  date: string;
  healthScore: number;
};

type HealthTrendProps = {
  selectedCar: string;
};

const generateTrendData = (selectedCar: string): HealthTrendData[] => {
  // Different trends based on car selection
  if (selectedCar === "car-1") {
    // Skoda Superb - generally stable but slight decline
    return [
      { date: "Oct 1", healthScore: 92 },
      { date: "Oct 3", healthScore: 91 },
      { date: "Oct 5", healthScore: 90 },
      { date: "Oct 7", healthScore: 89 },
      { date: "Oct 9", healthScore: 89 },
      { date: "Oct 11", healthScore: 88 },
      { date: "Oct 13", healthScore: 88 },
    ];
  } else if (selectedCar === "car-2") {
    // Fortuner - stable but improving
    return [
      { date: "Oct 1", healthScore: 88 },
      { date: "Oct 3", healthScore: 89 },
      { date: "Oct 5", healthScore: 90 },
      { date: "Oct 7", healthScore: 90 },
      { date: "Oct 9", healthScore: 91 },
      { date: "Oct 11", healthScore: 91 },
      { date: "Oct 13", healthScore: 92 },
    ];
  } else {
    // Innova - declining trend
    return [
      { date: "Oct 1", healthScore: 85 },
      { date: "Oct 3", healthScore: 84 },
      { date: "Oct 5", healthScore: 83 },
      { date: "Oct 7", healthScore: 82 },
      { date: "Oct 9", healthScore: 81 },
      { date: "Oct 11", healthScore: 80 },
      { date: "Oct 13", healthScore: 78 },
    ];
  }
};

export default function HealthTrendsChart({ selectedCar }: HealthTrendProps) {
  const data = generateTrendData(selectedCar);
  
  // Calculate trend
  const latestValue = data[data.length - 1].healthScore;
  const previousValue = data[data.length - 2].healthScore;
  const trend = latestValue - previousValue;

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-sm w-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">Health Score Trend</h3>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[70, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="healthScore" 
              stroke="#000" 
              strokeWidth={2} 
              dot={{ fill: '#000', strokeWidth: 0, r: 3 }} 
              activeDot={{ r: 5, stroke: '#000' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-3 border-t border-black/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-black/60">Current</span>
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : trend < 0 ? (
              <TrendingDown className="h-3 w-3 text-red-600" />
            ) : (
              <Minus className="h-3 w-3 text-gray-500" />
            )}
            <span className={`text-xs ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        </div>
        <div className="text-lg font-semibold mt-1">{latestValue}%</div>
      </div>
    </div>
  );
}