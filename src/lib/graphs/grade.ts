// GRADE flow (LangGraph): retrieve curriculum → grade open answer + feedback →
// verify feedback safety. Single pass (grading is deterministic-ish).
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { chat } from "@/lib/llm/router";
import { parseJsonLoose } from "@/lib/json";
import { search } from "@/lib/rag/store";
import { gradeSystem, gradeUser } from "@/lib/prompts/es";
import { verify, type VerifyResult } from "./verifier";

export interface GradeResult {
  puntaje: number;
  feedback: string;
  aciertos: string[];
  mejoras: string[];
}

const S = Annotation.Root({
  enunciado: Annotation<string>(),
  rubrica: Annotation<string>(),
  respuesta: Annotation<string>(),
  contexto: Annotation<string>(),
  resultado: Annotation<GradeResult | null>(),
  verificacion: Annotation<VerifyResult | null>(),
  provider: Annotation<string>(),
});

async function retrieve(state: typeof S.State) {
  const hits = await search(state.enunciado, 3);
  return { contexto: hits.map((h) => h.texto).join("\n---\n") };
}

async function grade(state: typeof S.State) {
  const { text, provider } = await chat(
    [
      { role: "system", content: gradeSystem },
      {
        role: "user",
        content: gradeUser({
          enunciado: state.enunciado,
          rubrica: state.rubrica,
          respuesta: state.respuesta,
          contexto: state.contexto,
        }),
      },
    ],
    { temperature: 0.2, json: true },
  );
  const r = parseJsonLoose<GradeResult>(text);
  // Clamp score to a sane range regardless of model quirks.
  r.puntaje = Math.max(0, Math.min(100, Math.round(Number(r.puntaje) || 0)));
  return { resultado: r, provider };
}

async function verifyNode(state: typeof S.State) {
  return { verificacion: await verify(state.resultado?.feedback ?? "") };
}

const graph = new StateGraph(S)
  .addNode("retrieve", retrieve)
  .addNode("grade", grade)
  .addNode("verify", verifyNode)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "grade")
  .addEdge("grade", "verify")
  .addEdge("verify", END)
  .compile();

export interface GradeArgs {
  enunciado: string;
  rubrica?: string;
  respuesta: string;
}

export async function runGrade(args: GradeArgs) {
  const out = await graph.invoke({
    enunciado: args.enunciado,
    rubrica: args.rubrica ?? "",
    respuesta: args.respuesta,
  });
  return {
    resultado: out.resultado,
    verificacion: out.verificacion,
    provider: out.provider,
  };
}
