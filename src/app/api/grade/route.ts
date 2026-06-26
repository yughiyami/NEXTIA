import { NextResponse } from "next/server";
import { z } from "zod";
import { runGrade } from "@/lib/graphs/grade";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 120;

const Body = z.object({
  enunciado: z.string().min(1),
  rubrica: z.string().optional(),
  respuesta: z.string().min(1),
});

export async function POST(req: Request) {
  const s = await getSession();
  if (!s?.user) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "datos inválidos", detalle: parsed.error.issues }, { status: 400 });
  }
  try {
    const result = await runGrade(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
