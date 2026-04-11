import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, vehicleData } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          answer:
            "I'm having trouble connecting right now. Try again in a moment, or book a mechanic check for peace of mind.",
        }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `You are the AI assistant for a Toyota Innova 2021 with 48% health. The driver is a non-technical car owner. Answer their question in 2-3 sentences maximum. Be warm, clear, and use everyday language. Never say 'telemetry', 'variance', 'anomaly', or any technical term. If you don't know something, say 'I'd recommend asking your mechanic about that.'

Current vehicle status:
- Overall health: 48%
- Brake pads: High risk, ~12 days until they need replacing
- Air filter: High risk, ~18 days
- Engine: Medium risk, stable
- Transmission: High risk, ~25 days
- Battery: Stable, no issues`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      model: "llama3-70b-8192",
      temperature: 0.4,
      max_tokens: 200,
    });

    const answer =
      completion.choices[0]?.message?.content ||
      "I'm having trouble processing that. Could you try asking in a different way?";

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in ask-car:", error);
    return new Response(
      JSON.stringify({
        answer:
          "I'm having trouble connecting right now. Try again in a moment, or book a mechanic check for peace of mind.",
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  }
}
