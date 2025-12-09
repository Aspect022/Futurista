"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedNavbar } from "@/components/navbar";
import {
  Car,
  TrendingUp,
  Wrench,
  MapPin,
  Battery,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2
} from "lucide-react";
import Image from "next/image";
import { ServiceCenterMap } from "@/components/service-center-map";
import { EmptyState } from "@/components/empty-state";

export default function NewDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const vehicles = [
    { id: "car-1", name: "Skoda Superb", year: 2023, mileage: 12500, health: 92 },
    { id: "car-2", name: "Toyota Fortuner", year: 2024, mileage: 8900, health: 78 },
    { id: "car-3", name: "Toyota Innova", year: 2023, mileage: 15600, health: 48 },
  ];

  const healthStats = {
    overall: 72,
    brakeHealth: 85,
    engineHealth: 92,
    batteryHealth: 78,
    tireHealth: 88,
  };

  const upcomingMaintenance = [
    { id: 1, task: "Oil Change", dueIn: 1200, priority: "medium" },
    { id: 2, task: "Brake Inspection", dueIn: 500, priority: "high" },
    { id: 3, task: "Tire Rotation", dueIn: 2500, priority: "low" },
  ];

  const tripHistory = [
    { id: 1, origin: "Bangalore", destination: "Goa", date: "2025-10-15", status: "completed" },
    { id: 2, origin: "Mumbai", destination: "Pune", date: "2025-10-20", status: "planned" },
  ];

  return (
    <main className="min-h-dvh bg-background text-foreground relative">
      {/* Subtle animated background */}
      {/* Video Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/Generated/Videos/Dashboard-Background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <UnifiedNavbar includeFleetScore={true} fleetHealth={healthStats.overall} />

      <div className="pt-16 min-h-dvh bg-transparent py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Fleet Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your vehicles and predictive maintenance</p>
              </div>
              <Button
                onClick={() => router.push('/appointment-booking')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 btn-scale shadow-lg shadow-primary/20"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Schedule Service
              </Button>
            </div>
          </header>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Overview
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="trip-analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Trip Analysis
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="service-centers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Service Centers
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Health Score Card */}
                <Card className="lg:col-span-1 bg-card/60 backdrop-blur-md border-primary/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Gauge className="h-5 w-5 text-blue-400" />
                      Fleet Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            className="stroke-muted"
                            strokeWidth="3"
                            fill="none"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            className="stroke-blue-500"
                            strokeWidth="3"
                            strokeDasharray={`${healthStats.overall} ${(100 - healthStats.overall)}`}
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-foreground">{healthStats.overall}%</span>
                          <span className="text-xs text-muted-foreground">Overall</span>
                        </div>
                      </div>
                      <p className="mt-4 text-center text-sm text-muted-foreground">
                        {healthStats.overall >= 80
                          ? "Excellent condition"
                          : healthStats.overall >= 60
                            ? "Good condition"
                            : "Needs attention"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Component Health Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="bg-card/60 backdrop-blur-md border-primary/10 hover:bg-card/80 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-blue-400" />
                        Brake Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{healthStats.brakeHealth}%</span>
                        <span className="text-xs text-muted-foreground">Good</span>
                      </div>
                      <div className="mt-2 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${healthStats.brakeHealth}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 backdrop-blur-md border-primary/10 hover:bg-card/80 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Battery className="h-4 w-4 text-blue-400" />
                        Battery Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{healthStats.batteryHealth}%</span>
                        <span className="text-xs text-muted-foreground">
                          {healthStats.batteryHealth >= 80 ? "Good" : "Needs attention"}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${healthStats.batteryHealth >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${healthStats.batteryHealth}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 backdrop-blur-md border-primary/10 hover:bg-card/80 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                        Engine Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{healthStats.engineHealth}%</span>
                        <span className="text-xs text-muted-foreground">Excellent</span>
                      </div>
                      <div className="mt-2 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${healthStats.engineHealth}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 backdrop-blur-md border-primary/10 hover:bg-card/80 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-blue-400" />
                        Tire Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{healthStats.tireHealth}%</span>
                        <span className="text-xs text-muted-foreground">Good</span>
                      </div>
                      <div className="mt-2 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${healthStats.tireHealth}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Upcoming Maintenance */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Upcoming Maintenance</h2>
                  <Button variant="outline" size="sm" className="text-foreground border">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingMaintenance.slice(0, 3).map((task) => (
                    <Card key={task.id} className="bg-card border border-input hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{task.task}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Due in {task.dueIn} km
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'high'
                            ? 'bg-red-900 text-red-200'
                            : task.priority === 'medium'
                              ? 'bg-yellow-900 text-yellow-200'
                              : 'bg-green-900 text-green-200'
                            }`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Trips */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recent Trips</h2>
                  <Button variant="outline" size="sm" className="border-input text-foreground hover:bg-accent">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tripHistory.map((trip) => (
                    <Card key={trip.id} className="bg-card border border-input hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{trip.origin} → {trip.destination}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{trip.date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${trip.status === 'completed'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-blue-900 text-blue-200'
                            }`}>
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Your Vehicles</h2>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Vehicle</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="border border-black/10 hover:border-black/30 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Car className="h-5 w-5 text-blue-400" />
                          {vehicle.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Year</span>
                            <span className="text-foreground">{vehicle.year}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mileage</span>
                            <span className="text-foreground">{vehicle.mileage.toLocaleString()} km</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Health</span>
                            <span className={vehicle.health >= 80 ? "text-green-600" : vehicle.health >= 60 ? "text-yellow-600" : "text-red-600"}>
                              {vehicle.health}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/vehicle/${vehicle.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => router.push(`/vehicle/${vehicle.id}/what-if-analysis`)}
                          >
                            Analyze
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Trip Analysis Tab */}
            <TabsContent value="trip-analysis">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Trip Planner & Analysis</h2>
                </div>

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
                        <label className="block text-sm font-medium mb-1 text-foreground">Origin</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-input rounded-md bg-input text-foreground"
                          placeholder="Enter starting city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Destination</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-input rounded-md bg-input text-foreground"
                          placeholder="Enter destination city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Departure Date</label>
                        <input
                          type="date"
                          className="w-full p-2 border border-input rounded-md bg-input text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Passengers</label>
                        <select className="w-full p-2 border border-input rounded-md bg-input text-foreground">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-foreground">Estimated Distance (km)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-input rounded-md bg-input text-foreground"
                          placeholder="Enter estimated distance"
                        />
                      </div>
                    </div>
                    <Button className="mt-4 w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      <MapPin className="h-4 w-4 mr-2" />
                      Analyze Trip Safety
                    </Button>
                  </CardContent>
                </Card>

                {/* Trip Analysis Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Trip Safety Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                          <p className="font-medium text-yellow-400">CAUTION - Recommendations before you go</p>
                        </div>
                      </div>

                      <h3 className="font-medium mb-2 text-foreground">Predicted Trip Impact</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                          <span className="text-foreground">Brake Pads</span>
                          <span className="text-red-500 dark:text-red-400">Predicted wear: -0.6mm. Remaining life after trip: 12,400 km.</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                          <span className="text-foreground">Tire Tread</span>
                          <span className="text-foreground">Predicted wear: -0.2mm. Remaining life after trip: 25,000 km.</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                          <span className="text-foreground">Battery Health</span>
                          <span className="text-foreground">Predicted impact: -0.5% State of Health.</span>
                        </div>
                      </div>

                      <h3 className="font-medium mt-4 mb-2 text-foreground">Pre-Trip Checklist</h3>
                      <div className="space-y-3">
                        <div className="flex items-start p-3 bg-red-900/20 rounded-md border-l-4 border-red-500">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-400">CRITICAL</p>
                            <p className="text-sm text-red-300">Your brake pad thickness is critically low (2.8mm). For a 500km highway trip with 4 passengers, replacement is required for safety.</p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-yellow-900/20 rounded-md border-l-4 border-yellow-500">
                          <Clock className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-400">RECOMMENDED</p>
                            <p className="text-sm text-yellow-300">A tire pressure check is recommended before departure.</p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-green-900/20 rounded-md border-l-4 border-green-500">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-400">GOOD TO GO</p>
                            <p className="text-sm text-green-300">Engine health is optimal for this trip.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 backdrop-blur-md border-primary/10 hover:bg-card/80 transition-all duration-300">
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

            {/* Maintenance Tab */}
            <TabsContent value="maintenance">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Maintenance Schedule</h2>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Schedule</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 bg-card/60 backdrop-blur-md border-primary/20 shadow-xl">
                    <CardHeader>
                      <CardTitle>Upcoming Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingMaintenance.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-4 border border-input rounded-lg bg-card/50">
                            <div>
                              <h3 className="font-medium text-foreground">{task.task}</h3>
                              <p className="text-sm text-muted-foreground">Due in {task.dueIn} km</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'high'
                                ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                                : task.priority === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                  : 'bg-green-500/20 text-green-600 dark:text-green-400'
                                }`}>
                                {task.priority.toUpperCase()}
                              </span>
                              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Schedule</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden">
                      <CardHeader>
                        <CardTitle>Quick Reference</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="relative w-full aspect-square">
                          <Image
                            src="/Generated/Images/Vehicle-Maintenance-Icons.png"
                            alt="Maintenance Icons"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-xl">
                      <CardHeader>
                        <CardTitle>Maintenance History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-green-500/10 rounded-md border border-green-500/30">
                            <p className="font-medium text-green-600 dark:text-green-400">Oil Change</p>
                            <p className="text-sm text-green-600/80 dark:text-green-300">Completed on 2025-09-15</p>
                          </div>
                          <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/30">
                            <p className="font-medium text-blue-600 dark:text-blue-400">Brake Inspection</p>
                            <p className="text-sm text-blue-600/80 dark:text-blue-300">Scheduled for 2025-10-20</p>
                          </div>
                          <div className="p-3 bg-muted rounded-md border border-input">
                            <p className="font-medium text-muted-foreground">Tire Rotation</p>
                            <p className="text-sm text-muted-foreground">Last performed: 2025-07-10</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Service Centers Tab */}
            <TabsContent value="service-centers">
              <div className="space-y-6">
                <ServiceCenterMap />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-xl">
                    <CardHeader>
                      <CardTitle>Preferred Centers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Bangalore Main Hub</h4>
                            <p className="text-sm text-muted-foreground">Whitefield - 2.5km away</p>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">Book</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-xl">
                    <CardHeader>
                      <CardTitle>Past Visits</CardTitle>
                    </CardHeader>
                    {/* Example of Empty State */}
                    <CardContent>
                      <EmptyState
                        title="No recent visits"
                        description="You haven't visited a service center in the last 6 months."
                        className="py-4"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}