"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedNavbar } from "@/components/navbar";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Car
} from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock car data
const carData = {
  "car-1": {
    id: "car-1",
    model: "Skoda Superb",
    vin: "TMBJF2NP0N1234567",
  },
  "car-2": {
    id: "car-2",
    model: "Toyota Fortuner",
    vin: "2T1BURHE0JC012345",
  },
  "car-3": {
    id: "car-3",
    model: "Toyota Innova",
    vin: "MP1JY2E2XPA123456",
  },
};

// Baseline predictions for 'Normal' driving style
const baselinePredictions = {
  "Brake Pads": 90,
  "Battery": 730,
  "Engine": 1825,
  "Transmission": 1460,
};

// Function to calculate degradation curve based on driving style
const generateDegradationCurve = (component: string, drivingStyle: number) => {
  // Base values for normal driving (style = 50)
  const baselineLifespan = baselinePredictions[component as keyof typeof baselinePredictions] || 365;

  // Calculate lifespan based on driving style
  // More aggressive driving reduces lifespan
  const styleFactor = (drivingStyle - 50) / 10; // -2.5 to 2.5 range
  const newLifespan = Math.max(30, baselineLifespan - (styleFactor * (baselineLifespan * 0.02)));

  // Generate 7 points for the degradation curve
  const curve = [];
  for (let i = 0; i < 7; i++) {
    const day = i * 10;
    // Calculate degradation percentage based on day and driving style
    const degradation = Math.min(100, (day / newLifespan) * 100);
    curve.push({
      day,
      health: 100 - degradation
    });
  }

  return curve;
};

const getDrivingStyleLabel = (value: number) => {
  if (value < 20) return "Calm";
  if (value < 40) return "Efficient";
  if (value < 60) return "Normal";
  if (value < 80) return "Spirited";
  return "Aggressive";
};

const getImpactColor = (impact: number) => {
  return impact >= 0 ? "text-green-600" : "text-red-600";
};

const getImpactIcon = (impact: number) => {
  return impact >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
};

export default function WhatIfAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [drivingStyle, setDrivingStyle] = useState<number[]>([50]); // Normal by default
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [carInfo, setCarInfo] = useState<any>(null);

  // AI What-If Analysis State
  const [userQuestion, setUserQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ analysis: string; safety_score: number } | null>(null);

  const handleAiAnalysis = async () => {
    if (!userQuestion.trim() || !carInfo) return;

    setIsAnalyzing(true);
    setAiResponse(null);

    try {
      const response = await fetch("/api/what-if-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleData: {
            model: carInfo.model,
            mileage: 45000,
            health: 92,
            tireCondition: "Good (4.0mm)",
            brakeCondition: "Worn (3.1mm)"
          },
          userQuestion
        })
      });

      const data = await response.json();
      setAiResponse(data);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Resolve params Promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  // Get car info based on ID
  useEffect(() => {
    if (!resolvedParams) return;

    const car = carData[resolvedParams.id as keyof typeof carData];
    if (car) {
      setCarInfo(car);
    } else {
      router.push("/dashboard-new");
    }
  }, [resolvedParams, router]);

  // Calculate predictions when driving style changes
  useEffect(() => {
    if (!carInfo) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const styleValue = drivingStyle[0];
      const newPredictions = Object.keys(baselinePredictions).map(component => {
        // Calculate new lifespan based on driving style
        const baselineLifespan = baselinePredictions[component as keyof typeof baselinePredictions];
        const styleFactor = (styleValue - 50) / 10; // -2.5 to 2.5 range
        const newLifespan = Math.max(30, baselineLifespan - (styleFactor * (baselineLifespan * 0.02)));

        return {
          component,
          lifespan_days: Math.round(newLifespan),
          impact: Math.round(newLifespan - baselineLifespan),
        };
      });

      setPredictions(newPredictions);
      setLoading(false);
    }, 500); // Simulate API call
  }, [drivingStyle, carInfo]);

  // Handle trip analysis form submission
  const handleTripAnalysis = async () => {
    if (!carInfo) return;

    // Get form values
    const origin = (document.getElementById('origin') as HTMLInputElement)?.value;
    const destination = (document.getElementById('destination') as HTMLInputElement)?.value;
    const departureDate = (document.getElementById('departure-date') as HTMLInputElement)?.value;
    const passengers = (document.getElementById('passengers') as HTMLSelectElement)?.value;
    const distance = (document.getElementById('distance') as HTMLInputElement)?.value;

    // Validate form
    if (!origin || !destination || !departureDate || !distance) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare vehicle data (mock data for now)
    const vehicleData = {
      model: carInfo.model,
      mileage: 45000, // Mock mileage
      brakePadThickness: 3.1, // Mock brake pad thickness
      batteryHealth: 92, // Mock battery health
      engineHealth: 95, // Mock engine health
      tireTreadDepth: 4.0, // Mock tire tread depth
    };

    // Prepare trip parameters
    const tripParameters = {
      origin,
      destination,
      distance: parseInt(distance),
      departureDate,
      passengers: parseInt(passengers),
      terrain: "Mix of highway and winding ghat sections (mountain roads)", // Default terrain
    };

    // Show loading state
    setLoading(true);

    try {
      // In a real implementation, you would call your API here:
      // const response = await fetch('/api/trip-analysis', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     vehicleData,
      //     tripParameters,
      //   }),
      // });
      // 
      // const result = await response.json();

      // For now, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message or update UI with results
      alert('Trip analysis complete! Check the results below.');
    } catch (error) {
      console.error('Error analyzing trip:', error);
      alert('Failed to analyze trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!resolvedParams || !carInfo) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <UnifiedNavbar />

      <div className="pt-16 min-h-dvh bg-background">
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb className="text-muted-foreground">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard-new" className="text-muted-foreground hover:text-foreground">
                    My Car
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/vehicle/${carInfo.id}`} className="text-muted-foreground hover:text-foreground">
                    Vehicle
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">Road Trip Check</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Road Trip Safety Check</h1>
                <p className="text-muted-foreground mt-2">Planning a trip? Let&apos;s make sure your car can handle it.</p>
              </div>
            </div>

            {/* Vehicle info row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Car</div>
                <div className="text-sm font-medium text-foreground">{carInfo.model}</div>
              </div>
              <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="text-sm font-medium text-foreground">48% Health — Needs Attention</div>
              </div>
            </div>
          </header>

          {/* Analysis Tabs */}
          <Tabs defaultValue="driving-style" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="driving-style" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Driving Style Analysis
              </TabsTrigger>
              <TabsTrigger value="trip-planner" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Trip Planner
              </TabsTrigger>
            </TabsList>

            {/* AI Scenario Simulator Code Block */}
            <TabsContent value="driving-style">
              <div className="mb-10">
                {/* AI Chat Interface */}
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      AI Scenario Simulator
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ask "What If" questions to predict vehicle behavior in specific scenarios.
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Chat Output Area */}
                      {aiResponse && (
                        <div className="mb-4 p-4 rounded-lg bg-muted/50 border border-border animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              AI Analysis
                              <span className={`text-xs px-2 py-0.5 rounded-full ${aiResponse.safety_score > 80 ? 'bg-green-100 text-green-700' :
                                aiResponse.safety_score > 50 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                Safety Score: {aiResponse.safety_score}/100
                              </span>
                            </h3>
                          </div>
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            {aiResponse.analysis}
                          </p>
                        </div>
                      )}

                      {/* Input Area */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="E.g., What if I drive 500km on rough terrain with my current tires?"
                          className="flex-1 p-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAiAnalysis()}
                        />
                        <Button
                          onClick={handleAiAnalysis}
                          disabled={isAnalyzing || !userQuestion.trim()}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isAnalyzing ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            'Simulate'
                          )}
                        </Button>
                      </div>

                      {/* Suggested Queries */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["What if I ignore the brake warning?", "Impact of towing a heavy trailer?", "Driving in 45°C heat?"].map((q) => (
                          <button
                            key={q}
                            onClick={() => { setUserQuestion(q); }}
                            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Driving Style Slider (Legacy) - Keeping it below for reference */}
              <div className="mb-10 opacity-70 hover:opacity-100 transition-opacity">
                {/* ... existing slider code ... */}
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-muted-foreground">Manual Driving Style Adjustment</h2>
                    <div className="text-sm font-medium mt-2 md:mt-0 text-muted-foreground">
                      {getDrivingStyleLabel(drivingStyle[0])}
                    </div>
                  </div>
                  <Slider
                    value={drivingStyle}
                    onValueChange={setDrivingStyle}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Trip Planner Tab */}
            <TabsContent value="trip-planner">
              <div className="mb-6">
                {/* Trip Planner Form */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Plan Your Trip
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Origin</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter starting city"
                          id="origin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Destination</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter destination city"
                          id="destination"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Departure Date</label>
                        <input
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          id="departure-date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Passengers</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md" id="passengers">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Estimated Distance (km)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter estimated distance"
                          id="distance"
                        />
                      </div>
                    </div>
                    <Button className="mt-4 w-full md:w-auto" onClick={handleTripAnalysis}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Analyze Trip Safety
                    </Button>
                  </CardContent>
                </Card>

                {/* Trip Analysis Results (Placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Trip Safety Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                          <p className="font-medium text-yellow-800">CAUTION - Recommendations before you go</p>
                        </div>
                      </div>

                      <h3 className="font-medium mb-2">Predicted Trip Impact</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                          <span>Brake Pads</span>
                          <span className="text-red-600">Predicted wear: -0.6mm. Remaining life after trip: 12,400 km.</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span>Tire Tread</span>
                          <span>Predicted wear: -0.2mm. Remaining life after trip: 25,000 km.</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span>Battery Health</span>
                          <span>Predicted impact: -0.5% State of Health.</span>
                        </div>
                      </div>

                      <h3 className="font-medium mt-4 mb-2">Pre-Trip Checklist</h3>
                      <div className="space-y-3">
                        <div className="flex items-start p-3 bg-red-50 rounded-md border-l-4 border-red-500">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">CRITICAL</p>
                            <p className="text-sm text-red-700">Your brake pad thickness is critically low (2.8mm). For a 500km highway trip with 4 passengers, replacement is required for safety.</p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
                          <Clock className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800">RECOMMENDED</p>
                            <p className="text-sm text-yellow-700">A tire pressure check is recommended before departure.</p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-green-50 rounded-md border-l-4 border-green-500">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">GOOD TO GO</p>
                            <p className="text-sm text-green-700">Engine health is optimal for this trip.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button className="w-full" variant="outline">
                          <Wrench className="h-4 w-4 mr-2" />
                          Schedule Brake Service
                        </Button>
                        <Button className="w-full" variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Tire Pressure Check
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Car className="h-4 w-4 mr-2" />
                          View Vehicle Details
                        </Button>
                        <Button className="w-full" variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          Save Trip for Later
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}