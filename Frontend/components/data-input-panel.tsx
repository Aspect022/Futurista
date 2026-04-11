"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Gauge, Wrench } from "lucide-react";

interface SensorConfig {
  label: string;
  key: string;
  min: number;
  max: number;
  defaultValue: number;
  unit: string;
  step: number;
}

const SENSORS: SensorConfig[] = [
  { label: "Engine RPM",            key: "rpm",            min: 500,  max: 8000, defaultValue: 3200, unit: "RPM", step: 100 },
  { label: "Brake Pad Thickness",   key: "brakePad",       min: 1,    max: 12,   defaultValue: 4,    unit: "mm",  step: 0.5 },
  { label: "Battery Voltage",       key: "batteryVoltage", min: 10,   max: 15,   defaultValue: 12.4, unit: "V",   step: 0.1 },
  { label: "Oil Temperature",       key: "oilTemp",        min: 60,   max: 130,  defaultValue: 95,   unit: "°C",  step: 1   },
  { label: "Tyre Pressure",         key: "tyrePressure",   min: 20,   max: 40,   defaultValue: 28,   unit: "PSI", step: 1   },
];

interface AnalysisResult {
  healthPercent: number;
  brakeStatus: { risk: string; days: number };
  batteryStatus: string;
  warnings: string[];
}

interface DataInputPanelProps {
  onAnalyse?: (result: AnalysisResult) => void;
}

export function DataInputPanel({ onAnalyse }: DataInputPanelProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(SENSORS.map((s) => [s.key, s.defaultValue]))
  );
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleChange = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const calculateHealth = useCallback((vals: Record<string, number>) => {
    const rpmScore       = vals.rpm <= 4000 ? 100 : vals.rpm <= 6000 ? 70 : 30;
    const brakeScore     = ((vals.brakePad - 1) / (12 - 1)) * 100;
    const batteryScore   = vals.batteryVoltage >= 11.5 ? ((vals.batteryVoltage - 10) / 5) * 100 : 20;
    const oilScore       = vals.oilTemp <= 105 ? 100 : vals.oilTemp <= 115 ? 60 : 20;
    const tyreScore      = vals.tyrePressure >= 28 && vals.tyrePressure <= 35 ? 100 : 50;
    return Math.round((rpmScore + brakeScore + batteryScore + oilScore + tyreScore) / 5);
  }, []);

  const liveHealth = calculateHealth(values);
  const healthColor = liveHealth >= 70 ? "#22c55e" : liveHealth >= 50 ? "#eab308" : "#ef4444";

  const handleAnalyse = () => {
    setIsAnalysing(true);
    setTimeout(() => {
      const warnings: string[] = [];

      let brakeRisk: string;
      let brakeDays: number;
      if (values.brakePad <= 3) {
        brakeRisk = "Critical"; brakeDays = 7;
      } else if (values.brakePad <= 6) {
        brakeRisk = "High"; brakeDays = 14;
      } else {
        brakeRisk = "Normal"; brakeDays = 60;
      }

      const batteryStatus = values.batteryVoltage < 11.5 ? "Needs Attention" : "Good";

      if (values.oilTemp > 115) {
        toast.warning("Oil is running hot", { description: "Avoid long drives today — your oil temperature is above safe levels.", duration: 6000 });
        warnings.push("Oil temperature is high");
      }
      if (values.rpm > 6000) {
        toast.warning("Engine was over-revved", { description: "Engine RPM above 6,000 detected — get it checked if this persists.", duration: 6000 });
        warnings.push("Engine RPM too high");
      }

      const analysisResult: AnalysisResult = {
        healthPercent: liveHealth,
        brakeStatus: { risk: brakeRisk, days: brakeDays },
        batteryStatus,
        warnings,
      };

      setResult(analysisResult);
      setIsAnalysing(false);
      onAnalyse?.(analysisResult);

      toast.success("Analysis complete", {
        description: `Your car's health is ${liveHealth}%. ${brakeRisk === "Critical" ? "Brakes need immediate attention!" : ""}`,
        duration: 5000,
      });
    }, 1200);
  };

  const circumference = 2 * Math.PI * 36;

  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Gauge className="h-5 w-5 text-blue-500" />
        <h3 className="text-base font-semibold text-foreground">Check Your Car&apos;s Data</h3>
      </div>

      {/* Live Health Ring */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" className="text-muted" strokeWidth="7" />
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke={healthColor}
              strokeWidth="7"
              strokeDasharray={`${(liveHealth / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">{liveHealth}%</span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {SENSORS.map((sensor) => (
          <div key={sensor.key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">{sensor.label}</label>
              <span className="text-sm font-mono text-muted-foreground">
                {values[sensor.key]} {sensor.unit}
              </span>
            </div>
            <input
              type="range"
              min={sensor.min}
              max={sensor.max}
              step={sensor.step}
              value={values[sensor.key]}
              onChange={(e) => handleChange(sensor.key, parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 bg-muted"
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-xs text-muted-foreground">{sensor.min} {sensor.unit}</span>
              <span className="text-xs text-muted-foreground">{sensor.max} {sensor.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analyse Button */}
      <button
        onClick={handleAnalyse}
        disabled={isAnalysing}
        className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-colors"
      >
        {isAnalysing ? (
          <>
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analysing...
          </>
        ) : (
          <>
            <Wrench className="h-4 w-4" />
            Analyse Now
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Brakes</span>
            <span className={`text-sm font-medium ${
              result.brakeStatus.risk === "Critical" ? "text-red-500" :
              result.brakeStatus.risk === "High" ? "text-amber-500" :
              "text-green-500"
            }`}>
              {result.brakeStatus.risk} — {result.brakeStatus.days} days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Battery</span>
            <span className={`text-sm font-medium ${result.batteryStatus === "Good" ? "text-green-500" : "text-amber-500"}`}>
              {result.batteryStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
