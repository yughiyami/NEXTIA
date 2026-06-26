import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { search } from "@/lib/rag/store";
import { chat } from "@/lib/llm/router";
import { buildTutorMessages } from "@/lib/prompts/tutor";

export const runtime = "nodejs";
export const maxDuration = 120;

const Body = z.object({
  pregunta: z.string().min(1).max(2000),
  grado: z.string().optional(),
  materia: z.string().optional(),
  historial: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "datos inválidos", detalle: parsed.error.issues }, { status: 400 });
  }

  const { pregunta, grado, materia, historial } = parsed.data;

  try {
    const query = `${pregunta} ${materia ?? ""} ${grado ?? ""}`;
    const hits = await search(query, 3);

    const contexto = hits.map((h) => h.texto).join("\n---\n");
    const fuentes = [...new Set(hits.map((h) => h.fuente ?? "").filter(Boolean))];

    const messages = buildTutorMessages({
      pregunta,
      grado,
      materia,
      contexto,
      historial,
    });

    const { text, provider } = await chat(messages, { temperature: 0.7 });

    return NextResponse.json({
      respuesta: text,
      fuentes,
      provider,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
