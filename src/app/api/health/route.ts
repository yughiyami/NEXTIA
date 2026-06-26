import { NextResponse } from "next/server";
import { llm } from "@/lib/llm/router";

export const runtime = "nodejs";

// Proves the box's AI is alive: provider status + a tiny real generation.
export async function GET() {
  const health = await llm.health();
  let sample: { text: string; provider: string } | null = null;
  let error: string | null = null;
  try {
    sample = await llm.chat(
      [
        { role: "system", content: "Responde en español, una sola frase corta." },
        { role: "user", content: "Saluda a un profesor rural del Perú." },
      ],
      { temperature: 0.3 },
    );
  } catch (e) {
    error = String(e);
  }
  return NextResponse.json({ ok: !error, health, sample, error });
}
