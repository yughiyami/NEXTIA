// Shared safety/pedagogy verifier (the paper's "Verifier LLM" layer). Used as a
// node by both graphs. Fails open with a flag so a verifier outage never blocks
// the teacher, but the UI can show it ran or not.
import { chat } from "@/lib/llm/router";
import { parseJsonLoose } from "@/lib/json";
import { verifierSystem, verifierUser } from "@/lib/prompts/es";

export interface VerifyResult {
  aprobado: boolean;
  razon: string;
  problemas: string[];
  ejecutado: boolean;
}

export async function verify(contenido: string): Promise<VerifyResult> {
  try {
    const { text } = await chat(
      [
        { role: "system", content: verifierSystem },
        { role: "user", content: verifierUser(contenido) },
      ],
      { temperature: 0, json: true },
    );
    const r = parseJsonLoose<Omit<VerifyResult, "ejecutado">>(text);
    return {
      aprobado: Boolean(r.aprobado),
      razon: r.razon ?? "",
      problemas: r.problemas ?? [],
      ejecutado: true,
    };
  } catch (e) {
    return { aprobado: true, razon: `verificador no disponible: ${String(e)}`, problemas: [], ejecutado: false };
  }
}
