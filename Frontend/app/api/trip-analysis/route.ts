import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract trip parameters from the request body
    const {
      vehicleData,
      tripParameters
    } = body;
    
    const apiKey = process.env.GROQ_API_KEY;

    // Fallback to mock data if no API key is present
    if (!apiKey) {
      console.warn("GROQ_API_KEY not found, using mock data");
      return new Response(JSON.stringify(getMockData()), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const groq = new Groq({ apiKey });

    // Construct the prompt for Groq API
    const systemPrompt = `You are an AI model for a vehicle predictive maintenance platform.Your task is to act as a trip safety analyzer.Analyze the vehicle data and trip parameters to provide specific safety recommendations and predict component wear.`;
    
    const userPrompt = `
  ** VEHICLE DATA:**
    - Model: ${ vehicleData.model }
- Current Mileage: ${ vehicleData.mileage } km
  - Brake Pad Thickness: ${ vehicleData.brakePadThickness } mm(Replacement recommended at 2.5mm)
    - Battery State of Health: ${ vehicleData.batteryHealth }%
      - Engine Health Score: ${ vehicleData.engineHealth }%
        - Tire Tread Depth: ${ vehicleData.tireTreadDepth } mm(Replacement recommended at 3.0mm)

          ** TRIP PARAMETERS:**
            - Origin: ${ tripParameters.origin }
- Destination: ${ tripParameters.destination }
- Estimated Distance: ${ tripParameters.distance } km
  - Terrain Type: ${ tripParameters.terrain || 'Mixed conditions' }
- Passengers: ${ tripParameters.passengers }
      
      ** YOUR TASK:**
  Analyze the trip's impact on the vehicle. 
      
      Return ONLY a raw JSON object(no markdown, no code blocks) with this structure:
{
  "trip_safety_status": "CAUTION", // GO, CAUTION, or ACTION_REQUIRED
    "predicted_impact": [
      { "component": "Brake Pads", "wear": "0.7mm", "remaining_life_km": 1500 },
      { "component": "Tire Tread", "wear": "0.3mm", "remaining_life_km": 12000 }
    ],
      "recommendations": [
        { "severity": "CRITICAL", "recommendation": "..." },
        { "severity": "RECOMMENDED", "recommendation": "..." },
        { "severity": "INFO", "recommendation": "..." }
      ]
}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama3-70b-8192",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || "{}";
    
    // Clean and parse JSON
    const jsonResponse = JSON.parse(text);
    
    return new Response(JSON.stringify(jsonResponse), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing trip analysis request:", error);
    // Fallback to mock data on error
    return new Response(JSON.stringify(getMockData()), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
}

function getMockData() {
  return {
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
}