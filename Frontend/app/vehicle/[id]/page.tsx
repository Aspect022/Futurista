"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Car, 
  Edit3, 
  TrendingUp, 
  Battery, 
  Gauge, 
  AlertTriangle,
  CheckCircle,
  Wrench,
  MapPin
} from "lucide-react";
import { UnifiedNavbar } from "@/components/navbar";
import ThreeDView from "@/components/dashboard/three-d-view";

// Mock vehicle data
const vehicleData = {
  "car-1": {
    id: "car-1",
    name: "Skoda Superb",
    year: 2023,
    mileage: 12500,
    health: 92,
    vin: "TMBJF2NP0N1234567",
    lastService: "2025-09-15",
    nextService: "2026-03-15",
    engineHours: 850,
    oilChangeDue: "2026-01-15",
  },
  "car-2": {
    id: "car-2",
    name: "Toyota Fortuner",
    year: 2024,
    mileage: 8900,
    health: 78,
    vin: "2T1BURHE0JC012345",
    lastService: "2025-10-01",
    nextService: "2026-04-01",
    engineHours: 620,
    oilChangeDue: "2026-02-01",
  },
  "car-3": {
    id: "car-3",
    name: "Toyota Innova",
    year: 2023,
    mileage: 15600,
    health: 48,
    vin: "MP1JY2E2XPA123456",
    lastService: "2025-08-20",
    nextService: "2026-02-20",
    engineHours: 1200,
    oilChangeDue: "2025-12-20",
  },
};

// Mock health data for charts
const healthData = [
  { date: "Oct 1", health: 92, brake: 88, battery: 95, engine: 90 },
  { date: "Oct 3", health: 91, brake: 87, battery: 94, engine: 89 },
  { date: "Oct 5", health: 90, brake: 86, battery: 94, engine: 89 },
  { date: "Oct 7", health: 89, brake: 85, battery: 93, engine: 88 },
  { date: "Oct 9", health: 89, brake: 84, battery: 93, engine: 88 },
  { date: "Oct 11", health: 88, brake: 84, battery: 92, engine: 87 },
  { date: "Oct 13", health: 88, brake: 83, battery: 91, engine: 87 },
];

export default function VehicleDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [selectedCar, setSelectedCar] = useState(params.id);

  useEffect(() => {
    const car = vehicleData[params.id as keyof typeof vehicleData];
    if (car) {
      setVehicle(car);
      setEditedName(car.name);
      setSelectedCar(params.id);
    } else {
      router.push("/dashboard-new");
    }
  }, [params.id, router]);

  const handleSaveName = () => {
    // In a real app, you would save this to your backend
    console.log("Saving new vehicle name:", editedName);
    setIsEditingName(false);
    // Update the vehicle name in state
    setVehicle({ ...vehicle, name: editedName });
  };

  if (!vehicle) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Fixed Navigation */}
      <UnifiedNavbar />

      <div className="pt-16 min-h-dvh bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Vehicle Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl md:text-3xl font-bold bg-background text-foreground border-input"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSaveName}
                      className="border-input text-foreground hover:bg-accent"
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setIsEditingName(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{vehicle.name}</h1>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingName(true)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-muted-foreground mt-1">Vehicle details and health monitoring</p>
              </div>
              
              {/* Health Score */}
              <div className="bg-card rounded-xl border border-input p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        className="stroke-gray-700"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        className="stroke-green-500"
                        strokeWidth="4"
                        strokeDasharray={`${vehicle.health * 1.005} 200`}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <span className="absolute inset-0 grid place-items-center text-xs font-medium text-foreground">
                      {vehicle.health}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Health Score</div>
                    <div className="text-sm font-medium text-foreground">
                      {vehicle.health >= 85 ? "Excellent" : vehicle.health >= 70 ? "Good" : "Needs Attention"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 3D View */}
            <div className="lg:col-span-2 space-y-6">
              {/* 3D Car Viewer */}
              <Card className="bg-card border border-input shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Car className="h-5 w-5" />
                    3D Vehicle View
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px] w-full relative">
                    <Suspense fallback={
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                          <p className="text-muted-foreground">Loading 3D model...</p>
                        </div>
                      </div>
                    }>
                      <ThreeDView selectedCar={selectedCar} />
                    </Suspense>
                  </div>
                </CardContent>
              </Card>

              {/* Health Trends Chart */}
              <Card className="bg-card border border-input shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <TrendingUp className="h-5 w-5" />
                    Health Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthData}>
                        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis 
                          domain={[70, 100]} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
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
                          dataKey="health" 
                          stroke="#10b981" 
                          strokeWidth={2} 
                          dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }} 
                          activeDot={{ r: 5, stroke: '#10b981' }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="brake" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }} 
                          activeDot={{ r: 5, stroke: '#3b82f6' }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="battery" 
                          stroke="#8b5cf6" 
                          strokeWidth={2} 
                          dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }} 
                          activeDot={{ r: 5, stroke: '#8b5cf6' }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="engine" 
                          stroke="#ef4444" 
                          strokeWidth={2} 
                          dot={{ fill: '#ef4444', strokeWidth: 0, r: 3 }} 
                          activeDot={{ r: 5, stroke: '#ef4444' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Vehicle Info and Actions */}
            <div className="space-y-6">
              {/* Vehicle Information */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Gauge className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Year</div>
                      <div className="font-medium text-foreground">{vehicle.year}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Mileage</div>
                      <div className="font-medium text-foreground">{vehicle.mileage.toLocaleString()} km</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">VIN</div>
                      <div className="font-medium text-foreground text-sm">{vehicle.vin}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Engine Hours</div>
                      <div className="font-medium text-foreground">{vehicle.engineHours} hrs</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-input">
                    <div className="text-xs text-muted-foreground mb-1">Last Service</div>
                    <div className="font-medium text-foreground">{vehicle.lastService}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Next Service</div>
                    <div className="font-medium text-foreground">{vehicle.nextService}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Oil Change Due</div>
                    <div className="font-medium text-foreground">{vehicle.oilChangeDue}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border border-input shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Wrench className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => router.push(`/vehicle/${vehicle.id}/what-if-analysis`)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    What-If Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => router.push(`/appointment-booking`)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Schedule Service
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border border-input text-foreground hover:bg-accent"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Run Diagnostics
                  </Button>
                </CardContent>
              </Card>

              {/* Component Health */}
              <Card className="bg-card border border-input shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Battery className="h-5 w-5" />
                    Component Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Brake System</span>
                      <span className="font-medium text-foreground">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: "88%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Battery</span>
                      <span className="font-medium text-foreground">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Engine</span>
                      <span className="font-medium text-foreground">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Transmission</span>
                      <span className="font-medium text-foreground">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              onClick={() => router.push(`/vehicle/${vehicle.id}/predictive-maintenance`)}
            >
              View Detailed Maintenance Report
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border border-input text-foreground hover:bg-accent px-8 py-3"
              onClick={() => router.push(`/appointment-booking`)}
            >
              <Wrench className="h-5 w-5 mr-2" />
              Schedule Service Appointment
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}