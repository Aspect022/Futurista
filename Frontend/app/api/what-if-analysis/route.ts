import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { vehicleData, userQuestion } = body;

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({
                analysis: "Simulation mode: This feature requires a live AI connection. In a real scenario, the AI would simulate the outcome of your question based on vehicle physics.",
                safety_score: 85
            }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }

        const groq = new Groq({ apiKey });

        const systemPrompt = `You are an advanced vehicle physics simulator. Your goal is to answer "What if" questions about driving scenarios.
    Analyze the user's hypothetical scenario against the provided vehicle data.
    
    Return a JSON object with:
    1. "analysis": A clear, short paragraph explaining the likely outcome. Focus on safety and component wear.
    2. "safety_score": A number from 0-100 (0=Catastrophic, 100=Perfectly Safe).`;

        const userPrompt = `
      **VEHICLE DATA:**
      - Model: ${vehicleData.model}
      - Mileage: ${vehicleData.mileage} km
      - Health: ${vehicleData.health}%
      - Tires: ${vehicleData.tireCondition}
      - Brakes: ${vehicleData.brakeCondition}
      
      **USER SCENARIO:**
      "${userQuestion}"
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0]?.message?.content || "{}";
        const jsonResponse = JSON.parse(text);

        return new Response(JSON.stringify(jsonResponse), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error in what-if analysis:", error);
        return new Response(JSON.stringify({ error: "Analysis failed" }), { status: 500 });
    }
}
