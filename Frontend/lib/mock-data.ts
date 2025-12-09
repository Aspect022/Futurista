
export interface VehicleData {
    id: string;
    model: string;
    vin: string;
    lastUpdated: string;
    health: number;
    riskLevel: "Low" | "Medium" | "High";
    nextFailure: string;
    daysToFailure: number;
}

export interface ComponentPrediction {
    name: string;
    risk: "Low" | "Medium" | "High" | "Normal" | "Critical";
    daysToFailure: number;
    confidence: number;
    trend: number[];
}

export interface TrendData {
    day: number;
    value: number;
}

export interface VehicleFullData {
    vehicle: VehicleData;
    predictedComponents: ComponentPrediction[];
    trends: {
        brake: TrendData[];
        battery: TrendData[];
        engine: TrendData[];
    };
}

export const CAR_DATA: Record<string, VehicleFullData> = {
    "car-1": {
        vehicle: {
            id: "car-1",
            model: "Skoda Superb",
            vin: "TMBJF2NP0N1234567",
            lastUpdated: "2025-10-14 12:32 UTC",
            health: 92,
            riskLevel: "Low",
            nextFailure: "Air Filter",
            daysToFailure: 120,
        },
        predictedComponents: [
            {
                name: "Air Filter",
                risk: "Low",
                daysToFailure: 120,
                confidence: 94,
                trend: [90, 91, 91, 92, 92, 92, 92],
            },
            {
                name: "Brake Pads",
                risk: "Normal",
                daysToFailure: 95,
                confidence: 91,
                trend: [88, 89, 89, 90, 90, 91, 91],
            },
            {
                name: "Engine",
                risk: "Normal",
                daysToFailure: 200,
                confidence: 85,
                trend: [92, 92, 92, 92, 92, 92, 92],
            },
            {
                name: "Transmission",
                risk: "Low",
                daysToFailure: 130,
                confidence: 82,
                trend: [89, 89, 90, 90, 90, 91, 91],
            },
        ],
        trends: {
            brake: [
                { day: 0, value: 88 },
                { day: 5, value: 89 },
                { day: 10, value: 89 },
                { day: 15, value: 90 },
                { day: 20, value: 90 },
                { day: 25, value: 91 },
            ],
            battery: [
                { day: 0, value: 93 },
                { day: 5, value: 93 },
                { day: 10, value: 93 },
                { day: 15, value: 94 },
                { day: 20, value: 94 },
                { day: 25, value: 94 },
            ],
            engine: [
                { day: 0, value: 92 },
                { day: 5, value: 92 },
                { day: 10, value: 92 },
                { day: 15, value: 92 },
                { day: 20, value: 92 },
                { day: 25, value: 92 },
            ],
        },
    },
    "car-2": {
        vehicle: {
            id: "car-2",
            model: "Toyota Fortuner",
            vin: "2T1BURHE0JC012345",
            lastUpdated: "2025-10-14 12:32 UTC",
            health: 78,
            riskLevel: "Medium",
            nextFailure: "Brake Pads",
            daysToFailure: 32,
        },
        predictedComponents: [
            {
                name: "Brake Pads",
                risk: "Medium",
                daysToFailure: 32,
                confidence: 87,
                trend: [85, 84, 83, 82, 81, 80, 79],
            },
            {
                name: "Air Filter",
                risk: "Low",
                daysToFailure: 55,
                confidence: 89,
                trend: [78, 78, 78, 79, 79, 80, 80],
            },
            {
                name: "Engine",
                risk: "Normal",
                daysToFailure: 150,
                confidence: 83,
                trend: [80, 80, 80, 80, 80, 80, 80],
            },
            {
                name: "Transmission",
                risk: "Low",
                daysToFailure: 90,
                confidence: 81,
                trend: [78, 78, 79, 79, 80, 80, 80],
            },
        ],
        trends: {
            brake: [
                { day: 0, value: 85 },
                { day: 5, value: 84 },
                { day: 10, value: 83 },
                { day: 15, value: 82 },
                { day: 20, value: 81 },
                { day: 25, value: 80 },
            ],
            battery: [
                { day: 0, value: 84 },
                { day: 5, value: 84 },
                { day: 10, value: 84 },
                { day: 15, value: 84 },
                { day: 20, value: 85 },
                { day: 25, value: 85 },
            ],
            engine: [
                { day: 0, value: 80 },
                { day: 5, value: 80 },
                { day: 10, value: 80 },
                { day: 15, value: 80 },
                { day: 20, value: 80 },
                { day: 25, value: 80 },
            ],
        },
    },
    "car-3": {
        vehicle: {
            id: "car-3",
            model: "Toyota Innova",
            vin: "MP1JY2E2XPA123456",
            lastUpdated: "2025-10-14 12:32 UTC",
            health: 48,
            riskLevel: "High",
            nextFailure: "Brake Pads",
            daysToFailure: 12,
        },
        predictedComponents: [
            {
                name: "Brake Pads",
                risk: "High",
                daysToFailure: 12,
                confidence: 95,
                trend: [75, 72, 69, 65, 60, 55, 50],
            },
            {
                name: "Air Filter",
                risk: "High",
                daysToFailure: 18,
                confidence: 91,
                trend: [65, 62, 59, 56, 53, 51, 49],
            },
            {
                name: "Engine",
                risk: "Medium",
                daysToFailure: 65,
                confidence: 79,
                trend: [65, 64, 63, 62, 61, 60, 59],
            },
            {
                name: "Transmission",
                risk: "High",
                daysToFailure: 25,
                confidence: 83,
                trend: [60, 58, 56, 54, 52, 51, 50],
            },
        ],
        trends: {
            brake: [
                { day: 0, value: 75 },
                { day: 5, value: 72 },
                { day: 10, value: 69 },
                { day: 15, value: 65 },
                { day: 20, value: 60 },
                { day: 25, value: 55 },
            ],
            battery: [
                { day: 0, value: 68 },
                { day: 5, value: 67 },
                { day: 10, value: 66 },
                { day: 15, value: 65 },
                { day: 20, value: 64 },
                { day: 25, value: 63 },
            ],
            engine: [
                { day: 0, value: 65 },
                { day: 5, value: 64 },
                { day: 10, value: 63 },
                { day: 15, value: 62 },
                { day: 20, value: 61 },
                { day: 25, value: 60 },
            ],
        },
    },
};

export const ANOMALIES = [
    {
        ts: "2025-10-14 12:20",
        metric: "Brake temp deviation",
        severity: "high",
        description: "High brake temperature deviation detected",
    },
    {
        ts: "2025-10-14 11:50",
        metric: "Battery voltage variance",
        severity: "medium",
        description: "Voltage variance above baseline",
    },
    {
        ts: "2025-10-14 10:05",
        metric: "Engine vibration spike",
        severity: "low",
        description: "Transient vibration spike observed",
    },
];
