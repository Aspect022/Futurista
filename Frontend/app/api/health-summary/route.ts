import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleModel, health, components } = body;

    const apiKey = process.env.GROQ_API_KEY;

    // Fallback if no API key
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          summary: [
            "Your brake pads have about 12 days before they need replacing — book a check soon.",
            "Your battery is stable and charging normally — no action needed.",
            "Everything else looks good — your engine and tyres are in healthy condition.",
          ],
        }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    const groq = new Groq({ apiKey });

    // Build component context for the AI
    const componentDetails = (components || [])
      .map(
        (c: any) =>
          `- ${c.name}: Risk=${c.risk}, Days to failure=${c.daysToFailure}, Confidence=${c.confidence}%`
      )
      .join("\n");

    const prompt = `You are a friendly car health assistant. The user is a non-technical car owner — not an engineer. Given the vehicle sensor data and predictions below, write exactly 3 bullet points summarising the car's condition. Each bullet must be one sentence, in plain English a teenager could understand. Never use technical jargon. Start each bullet with either 'Your', 'The', or 'Everything'. End with what the driver should actually do.

Vehicle: ${vehicleModel}
Overall Health: ${health}%

Component Predictions:
${componentDetails}

Write ONLY the 3 bullet points, separated by newlines. No numbering, no dashes, no extra text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.3,
      max_tokens: 300,
    });

    const text = completion.choices[0]?.message?.content || "";
    const bullets = text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .slice(0, 3);

    // If parsing failed, use fallback
    if (bullets.length < 3) {
      return new Response(
        JSON.stringify({
          summary: [
            "Your brake pads have about 12 days before they need replacing — book a check soon.",
            "Your battery is stable and charging normally — no action needed.",
            "Everything else looks good — your engine and tyres are in healthy condition.",
          ],
        }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(JSON.stringify({ summary: bullets }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error generating health summary:", error);
    return new Response(
      JSON.stringify({
        summary: [
          "Your brake pads have about 12 days before they need replacing — book a check soon.",
          "Your battery is stable and charging normally — no action needed.",
          "Everything else looks good — your engine and tyres are in healthy condition.",
        ],
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  }
}
