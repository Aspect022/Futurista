import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { aggregatedData } = body;

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({
                summary: "## Executive Summary (Simulated)\n\nBased on the current fleet data, **Brake Pad wear** is the leading cause of projected downtime (increasing by 15% this month). \n\n**Recommendation:** Schedule proactive maintenance for the 5 highest-risk vehicles immediately to prevent operational disruptions."
            }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }

        const groq = new Groq({ apiKey });

        const prompt = `
      You are a Fleet Data Analyst writing an executive summary for the fleet manager.
      
      **FLEET DATA:**
      - Total Vehicles: ${aggregatedData.totalVehicles}
      - Average Health: ${aggregatedData.averageHealth}%
      - Critical Alerts: ${aggregatedData.criticalAlerts}
      - Top Failure Trend: ${aggregatedData.topFailureMode}
      
      **YOUR TASK:**
      Write a concise Executive Summary (max 3 bullet points + 1 key recommendation).
      Focus on actionable insights. Use markdown for formatting (bolding key metrics).
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
        });

        const text = completion.choices[0]?.message?.content || "Summary not available.";

        return new Response(JSON.stringify({ summary: text }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error generating report summary:", error);
        return new Response(JSON.stringify({ error: "Summary generation failed" }), { status: 500 });
    }
}
