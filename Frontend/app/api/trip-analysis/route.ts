import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract trip parameters from the request body
    const {
      vehicleData,
      tripParameters
    } = body;
    
    // Construct the prompt for Gemini API
    const prompt = `
      You are an AI model for a vehicle predictive maintenance platform.
      Your task is to act as a trip safety analyzer.
      
      **VEHICLE DATA:**
      - Model: ${vehicleData.model}
      - Current Mileage: ${vehicleData.mileage} km
      - Brake Pad Thickness: ${vehicleData.brakePadThickness} mm (Replacement recommended at 2.5mm)
      - Battery State of Health: ${vehicleData.batteryHealth}%
      - Engine Health Score: ${vehicleData.engineHealth}%
      - Tire Tread Depth: ${vehicleData.tireTreadDepth} mm (Replacement recommended at 3.0mm)
      
      **TRIP PARAMETERS:**
      - Origin: ${tripParameters.origin}
      - Destination: ${tripParameters.destination}
      - Estimated Distance: ${tripParameters.distance} km
      - Terrain Type: ${tripParameters.terrain || 'Mixed conditions'}
      - Passengers: ${tripParameters.passengers}
      
      **YOUR TASK:**
      Analyze the trip's impact on the vehicle. Provide a safety recommendation and predict component wear.
      
      Return the response as a single, minified JSON object with no markdown formatting. The JSON object must have the following structure:
      {
        "trip_safety_status": "CAUTION", // GO, CAUTION, or ACTION_REQUIRED
        "predicted_impact": [
          { "component": "Brake Pads", "wear": "0.7mm", "remaining_life_km": 1500 },
          { "component": "Tire Tread", "wear": "0.3mm", "remaining_life_km": 12000 }
        ],
        "recommendations": [
          { "severity": "CRITICAL", "recommendation": "Brake pad thickness will be below the safety margin after this trip. Replacement is strongly recommended before departure." },
          { "severity": "RECOMMENDED", "recommendation": "Ensure tire pressure is set for a full passenger load before starting your journey." },
          { "severity": "INFO", "recommendation": "Your battery and engine are in excellent condition for this trip." }
        ]
      }
    `;
    
    // For now, return mock data since we don't have the actual Gemini API key
    // In production, you would call the Gemini API here
    const mockResponse = {
      trip_safety_status: "CAUTION",
      predicted_impact: [
        { component: "Brake Pads", wear: "0.6mm", remaining_life_km: 12400 },
        { component: "Tire Tread", wear: "0.2mm", remaining_life_km: 25000 },
        { component: "Battery Health", wear: "0.5% State of Health", remaining_life_km: null }
      ],
      recommendations: [
        { 
          severity: "CRITICAL", 
          recommendation: "Your brake pad thickness is critically low (2.8mm). For a 500km highway trip with 4 passengers, replacement is required for safety." 
        },
        { 
          severity: "RECOMMENDED", 
          recommendation: "A tire pressure check is recommended before departure." 
        },
        { 
          severity: "INFO", 
          recommendation: "Engine health is optimal for this trip." 
        }
      ]
    };
    
    return new Response(JSON.stringify(mockResponse), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing trip analysis request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process trip analysis request" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}