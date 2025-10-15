"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedNavbar } from "@/components/navbar";
import { 
  Calendar, 
  TrendingUp, 
  MapPin, 
  Package, 
  Car, 
  AlertTriangle,
  Activity,
  BarChart3,
  Users,
  CheckCircle,
  Clock
} from "lucide-react";

// Data interfaces
interface FailureEvent {
  id: string;
  vin: string;
  model: 'Toyota Innova' | 'Toyota Fortuner' | 'Skoda Superb';
  component: 'Brake Pads' | 'Battery' | 'Engine' | 'Transmission' | 'Air Filter' | 'Tire' | 'Suspension' | 'Brake Discs';
  failure_date: string; // "YYYY-MM-DD"
  mileage_at_failure: number;
  production_batch: string; // e.g., "BP-2024-Q1"
  location: string; // e.g., "Mumbai"
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Monitoring' | 'Investigation Opened' | 'Resolved' | 'Pending';
}

interface AggregatedReport {
  component: string;
  model: string;
  failure_count: number;
  failure_rate: number;
  avg_mileage_at_failure: number;
  avg_age_at_failure: number;
  severity: string;
  status: string;
  production_batch: string;
}

// Mock data for the entire fleet
const generateMockData = (): FailureEvent[] => {
  const models: Array<'Toyota Innova' | 'Toyota Fortuner' | 'Skoda Superb'> = ['Toyota Innova', 'Toyota Fortuner', 'Skoda Superb'];
  const components: Array<FailureEvent['component']> = ['Brake Pads', 'Battery', 'Engine', 'Transmission', 'Air Filter', 'Tire', 'Suspension', 'Brake Discs'];
  const locations: string[] = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
  const productionBatches: string[] = ['BP-2024-Q1', 'BP-2024-Q2', 'BP-2024-Q3', 'BP-2025-Q1', 'BP-2025-Q2'];
  const severities: Array<FailureEvent['severity']> = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: Array<FailureEvent['status']> = ['Monitoring', 'Investigation Opened', 'Resolved', 'Pending'];

  const events: FailureEvent[] = [];
  const now = new Date();
  
  for (let i = 0; i < 120; i++) {
    const model = models[Math.floor(Math.random() * models.length)];
    const component = components[Math.floor(Math.random() * components.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const batch = productionBatches[Math.floor(Math.random() * productionBatches.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Random date in the last 180 days
    const failureDate = new Date(now);
    failureDate.setDate(now.getDate() - Math.floor(Math.random() * 180));
    
    // Random mileage between 5000 and 150000
    const mileage = Math.floor(Math.random() * 145000) + 5000;
    
    events.push({
      id: `failure-${i}`,
      vin: `VIN-${Math.floor(Math.random() * 1000000)}`,
      model,
      component,
      failure_date: failureDate.toISOString().split('T')[0],
      mileage_at_failure: mileage,
      production_batch: batch,
      location,
      severity,
      status
    });
  }
  
  return events;
};

const mockData = generateMockData();

export default function FleetQualityReportsPage() {
  const [dateRange, setDateRange] = useState<string>('Last 90 Days');
  const [filteredData, setFilteredData] = useState<AggregatedReport[]>([]);
  const [kpiData, setKpiData] = useState({
    totalIncidents: 0,
    topFailingComponent: '',
    mostAffectedModel: '',
    openInvestigations: 0
  });

  // Filter and aggregate data based on date range
  useEffect(() => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case 'Last 30 Days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'Last 90 Days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case 'Last 180 Days':
        startDate = new Date(now.setDate(now.getDate() - 180));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 90));
    }

    // Filter events by date
    const filteredEvents = mockData.filter(event => {
      const eventDate = new Date(event.failure_date);
      return eventDate >= startDate;
    });

    // Aggregate data
    const aggregatedMap = new Map<string, AggregatedReport>();
    
    filteredEvents.forEach(event => {
      const key = `${event.component}-${event.model}`;
      if (!aggregatedMap.has(key)) {
        aggregatedMap.set(key, {
          component: event.component,
          model: event.model,
          failure_count: 0,
          failure_rate: 0,
          avg_mileage_at_failure: 0,
          avg_age_at_failure: 0,
          severity: event.severity,
          status: event.status,
          production_batch: event.production_batch
        });
      }

      const item = aggregatedMap.get(key)!;
      item.failure_count += 1;
      item.avg_mileage_at_failure = (item.avg_mileage_at_failure * (item.failure_count - 1) + event.mileage_at_failure) / item.failure_count;
      
      // Calculate age at failure (simplified - assuming 1 year = 15000 km)
      const ageInYears = event.mileage_at_failure / 15000;
      item.avg_age_at_failure = (item.avg_age_at_failure * (item.failure_count - 1) + ageInYears) / item.failure_count;
    });

    // Calculate failure rates (assuming total vehicles per model)
    const totalVehiclesByModel = {
      'Toyota Innova': 1000,
      'Toyota Fortuner': 800,
      'Skoda Superb': 600
    };

    const aggregatedArray = Array.from(aggregatedMap.values());
    aggregatedArray.forEach(item => {
      const totalForModel = totalVehiclesByModel[item.model as keyof typeof totalVehiclesByModel] || 1000;
      item.failure_rate = parseFloat(((item.failure_count / totalForModel) * 100).toFixed(2));
    });

    setFilteredData(aggregatedArray);

    // Calculate KPIs
    const totalIncidents = filteredEvents.length;
    
    // Find top failing component
    const componentCounts = new Map<string, number>();
    filteredEvents.forEach(event => {
      componentCounts.set(event.component, (componentCounts.get(event.component) || 0) + 1);
    });
    let topFailingComponent = '';
    let maxCount = 0;
    componentCounts.forEach((count, component) => {
      if (count > maxCount) {
        maxCount = count;
        topFailingComponent = component;
      }
    });

    // Find most affected model
    const modelCounts = new Map<string, number>();
    filteredEvents.forEach(event => {
      modelCounts.set(event.model, (modelCounts.get(event.model) || 0) + 1);
    });
    let mostAffectedModel = '';
    let maxModelCount = 0;
    modelCounts.forEach((count, model) => {
      if (count > maxModelCount) {
        maxModelCount = count;
        mostAffectedModel = model;
      }
    });

    // Count open investigations
    const openInvestigations = filteredEvents.filter(event => 
      event.status === 'Investigation Opened'
    ).length;

    setKpiData({
      totalIncidents,
      topFailingComponent,
      mostAffectedModel,
      openInvestigations
    });
  }, [dateRange]);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  // Get failure trends for the chart
  const getTrendData = () => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case 'Last 30 Days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'Last 90 Days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case 'Last 180 Days':
        startDate = new Date(now.setDate(now.getDate() - 180));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 90));
    }

    // Group events by week
    const weeklyData: Record<string, number> = {};
    
    const filteredEvents = mockData.filter(event => {
      const eventDate = new Date(event.failure_date);
      return eventDate >= startDate;
    });

    filteredEvents.forEach(event => {
      const eventDate = new Date(event.failure_date);
      const weekStart = new Date(eventDate);
      weekStart.setDate(eventDate.getDate() - eventDate.getDay()); // Start of the week
      const weekKey = weekStart.toISOString().split('T')[0];
      
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
    });

    return Object.entries(weeklyData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const trendData = getTrendData();

  return (
    <main className="min-h-dvh bg-background text-foreground py-8 px-4">
      <UnifiedNavbar />
      <div className="max-w-7xl mx-auto pt-16">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Fleet Quality & Failure Analysis</h1>
              <p className="text-muted-foreground mt-2">Comprehensive analytics for engineering and quality teams</p>
            </div>
            
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex gap-2">
                {['Last 30 Days', 'Last 90 Days', 'Last 180 Days'].map((range) => (
                  <Button
                    key={range}
                    size="sm"
                    variant={dateRange === range ? "default" : "outline"}
                    className={`${dateRange === range ? 'bg-primary text-primary-foreground' : 'text-foreground border border-input hover:bg-accent'}`}
                    onClick={() => handleDateRangeChange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border border-input">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Incidents</CardTitle>
              <Activity className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.totalIncidents}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all models</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-input">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Failing Component</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.topFailingComponent || 'N/A'}</div>
              <p className="text-xs text-muted-foreground mt-1">Most reported failures</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-input">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Affected Model</CardTitle>
              <Car className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.mostAffectedModel || 'N/A'}</div>
              <p className="text-xs text-muted-foreground mt-1">Highest incident count</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-input">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Investigations</CardTitle>
              <Clock className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.openInvestigations}</div>
              <p className="text-xs text-muted-foreground mt-1">Active CAPA processes</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Failure Trends Chart */}
          <Card className="bg-card border border-input">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Failure Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-x-auto">
                <div className="min-w-max">
                  {trendData.length > 0 ? (
                    <div className="space-y-2 py-2">
                      {trendData.map((dataPoint, index) => (
                        <div key={index} className="flex items-center min-w-max">
                          <span className="text-xs text-gray-400 w-20 whitespace-nowrap">{dataPoint.date}</span>
                          <div className="flex-1 ml-2 min-w-[200px]">
                            <div 
                              className="h-6 bg-blue-500 rounded" 
                              style={{ width: `${Math.min((dataPoint.count / Math.max(...trendData.map(d => d.count)) * 100), 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white ml-2 whitespace-nowrap">{dataPoint.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-10">No data available for the selected range</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Batch Chart */}
          <Card className="bg-card border border-input">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Package className="h-5 w-5" />
                Failures by Production Batch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-x-auto">
                <div className="min-w-max">
                  {filteredData.length > 0 ? (
                    <div className="space-y-2 py-2">
                      {filteredData.slice(0, 8).map((item, index) => (
                        <div key={index} className="flex items-center min-w-max">
                          <span className="text-xs text-gray-400 w-24 whitespace-nowrap truncate">{item.production_batch}</span>
                          <div className="flex-1 ml-2 min-w-[200px]">
                            <div 
                              className="h-6 bg-green-500 rounded" 
                              style={{ width: `${Math.min((item.failure_count / Math.max(...filteredData.map(d => d.failure_count)) * 100), 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white ml-2 whitespace-nowrap">{item.failure_count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-10">No data available for the selected range</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Hotspots Map Placeholder */}
        <Card className="bg-card border border-input mb-8">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map showing failure locations</p>
                <p className="text-sm text-muted-foreground mt-2">This would show clustering of failures by region</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Failure Analysis Table */}
        <Card className="bg-card border border-input">
          <CardHeader>
            <CardTitle className="text-foreground">Failure Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 text-left text-gray-400">
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Failures</th>
                    <th className="py-3 px-4">Failure Rate</th>
                    <th className="py-3 px-4">Avg. Mileage</th>
                    <th className="py-3 px-4">Avg. Age</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-3 px-4 font-medium text-white">{item.component}</td>
                        <td className="py-3 px-4 text-gray-300">{item.model}</td>
                        <td className="py-3 px-4 text-white">{item.failure_count}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-white">{item.failure_rate}%</span>
                            {item.failure_rate > 5 && (
                              <span className="ml-2 bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded">HIGH</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{item.avg_mileage_at_failure.toLocaleString()} km</td>
                        <td className="py-3 px-4 text-gray-300">{item.avg_age_at_failure.toFixed(1)} yrs</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={
                              item.status === 'Investigation Opened' 
                                ? 'border-red-500 text-red-400' 
                                : item.status === 'Resolved' 
                                  ? 'border-green-500 text-green-400' 
                                  : item.status === 'Monitoring' 
                                    ? 'border-yellow-500 text-yellow-400' 
                                    : 'border-gray-500 text-gray-400'
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                        No failure data available for the selected date range
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}