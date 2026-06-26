// GENERATE flow (LangGraph): retrieve curriculum → generate exercises (CAG) →
// verify → loop back if rejected (teacher-in-the-loop, bounded retries).
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { chat } from "@/lib/llm/router";
import { parseJsonLoose } from "@/lib/json";
import { search } from "@/lib/rag/store";
import { generateSystem, generateUser } from "@/lib/prompts/es";
import { verify, type VerifyResult } from "./verifier";

export interface Ejercicio {
  pregunta: string;
  respuesta_esperada: string;
  puntaje: number;
}
export interface GeneratedDraft {
  titulo: string;
  enunciado: string;
  ejercicios: Ejercicio[];
  rubrica: { criterio: string; puntos: number }[];
}

const MAX_INTENTOS = 2;

const S = Annotation.Root({
  materia: Annotation<string>(),
  grado: Annotation<string>(),
  tema: Annotation<string>(),
  n: Annotation<number>(),
  contexto: Annotation<string>(),
  fuentes: Annotation<string[]>(),
  draft: Annotation<GeneratedDraft | null>(),
  verificacion: Annotation<VerifyResult | null>(),
  intentos: Annotation<number>(),
  provider: Annotation<string>(),
});

async function retrieve(state: typeof S.State) {
  const hits = await search(`${state.tema} ${state.materia}`, 3);
  return {
    contexto: hits.map((h) => h.texto).join("\n---\n"),
    fuentes: [...new Set(hits.map((h) => h.fuente ?? "").filter(Boolean))],
  };
}

async function generate(state: typeof S.State) {
  const { text, provider } = await chat(
    [
      { role: "system", content: generateSystem },
      {
        role: "user",
        content: generateUser({
          materia: state.materia,
          grado: state.grado,
          tema: state.tema,
          n: state.n,
          contexto: state.contexto,
        }),
      },
    ],
    { temperature: 0.5, json: true },
  );
  return {
    draft: parseJsonLoose<GeneratedDraft>(text),
    provider,
    intentos: (state.intentos ?? 0) + 1,
  };
}

async function verifyNode(state: typeof S.State) {
  return { verificacion: await verify(JSON.stringify(state.draft)) };
}

function afterVerify(state: typeof S.State): "generate" | typeof END {
  if (state.verificacion?.aprobado) return END;
  if ((state.intentos ?? 0) >= MAX_INTENTOS) return END;
  return "generate";
}

const graph = new StateGraph(S)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addNode("verify", verifyNode)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "verify")
  .addConditionalEdges("verify", afterVerify, ["generate", END])
  .compile();

export interface GenerateArgs {
  materia: string;
  grado: string;
  tema: string;
  n?: number;
}

export async function runGenerate(args: GenerateArgs) {
  const out = await graph.invoke({
    materia: args.materia,
    grado: args.grado,
    tema: args.tema,
    n: args.n ?? 3,
    intentos: 0,
  });
  return {
    draft: out.draft,
    verificacion: out.verificacion,
    provider: out.provider,
    fuentes: out.fuentes ?? [],
  };
}
