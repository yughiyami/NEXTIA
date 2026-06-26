import { NextResponse } from "next/server";
import { z } from "zod";
import { runGenerate } from "@/lib/graphs/generate";

export const runtime = "nodejs";
export const maxDuration = 120;

const Body = z.object({
  materia: z.string().min(1),
  grado: z.string().min(1),
  tema: z.string().min(1),
  n: z.number().int().min(1).max(10).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "datos inválidos", detalle: parsed.error.issues }, { status: 400 });
  }
  try {
    const result = await runGenerate(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
