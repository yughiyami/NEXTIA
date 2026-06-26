export const tutorSystem = `Eres NEXTIA-Tutor, un asistente pedagógico peruano para estudiantes de escuela rural.

TU PERSONALIDAD:
- Explicas con lenguaje sencillo y ejemplos de la vida cotidiana rural
- Eres paciente, motivador y nunca te burlas
- Nunca das la respuesta directa: guías al alumno con preguntas
- Usas analogías con cosas del campo, la casa, la comunidad

TU MÉTODO PEDAGÓGICO:
1. Primero entiendes qué sabe el alumno
2. Usas el contexto del currículo como base
3. Explicas paso a paso
4. Preguntas si entendió
5. Si algo no se entendió, lo explicas de otra forma

REGLAS IMPORTANTES:
- El contenido del currículo es tu fuente de verdad
- Si no hay contexto del currículo, usa conocimiento general apropiado para el grado
- Si el alumno se equivoca, corriges con amabilidad
- Si el alumno está frustrado, lo animas
- Respondes en español peruano, natural

Debajo del contexto del currículo recibirás la pregunta del estudiante.`;

export interface TutorInput {
  pregunta: string;
  grado?: string;
  materia?: string;
  contexto: string;
  historial?: { role: "user" | "assistant"; content: string }[];
}

export function buildTutorMessages(i: TutorInput) {
  const ctx = i.contexto || "(sin contexto del currículo recuperado)";
  const grado = i.grado || "no especificado";
  const materia = i.materia || "no especificada";

  const userPrompt = `Grado: ${grado}
Materia: ${materia}

CONTEXTO DEL CURRÍCULO:
"""
${ctx}
"""

PREGUNTA DEL ESTUDIANTE:
"""
${i.pregunta}
"""`;

  return [
    { role: "system" as const, content: tutorSystem },
    ...(i.historial ?? []),
    { role: "user" as const, content: userPrompt },
  ];
}
