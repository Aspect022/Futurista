import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { componentName, predictionData, vehicleModel } = body;

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({
                explanation: "This is a simulated explanation. In a real scenario, AI would explain specifically why the " + componentName + " is at risk based on your car's data."
            }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }

        const groq = new Groq({ apiKey });

        const prompt = `
      You are an expert mechanic explaining complex predictive maintenance data to a car owner.
      
      **Topic:** Predicted failure of ${componentName} for a ${vehicleModel}.
      **Technical Data:**
      - Risk Level: ${predictionData.risk}
      - Days to Failure: ${predictionData.daysToFailure}
      - Trend: ${predictionData.trend}
      
      **YOUR TASK:**
      Write a Short, Simple, and Helpful explanation (max 2 sentences).
      1. Explain WHY it might be failing (common reasons).
      2. Explain WHAT to look/listen for.
      
      Do not use technical jargon. Be reassuring but clear about urgency.
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
        });

        const text = completion.choices[0]?.message?.content || "No explanation available.";

        return new Response(JSON.stringify({ explanation: text }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error in predictive explanation:", error);
        return new Response(JSON.stringify({ error: "Explanation failed" }), { status: 500 });
    }
}
