// CAG prompt templates (Spanish, es-PE). These inject curriculum context (RAG)
// + pedagogical framing directly into the prompt, per the reference paper.

export interface GenerateInput {
  materia: string;
  grado: string;
  tema: string;
  n: number; // number of exercises
  contexto: string; // retrieved curriculum chunks
}

export const generateSystem = `Eres un asistente pedagógico para docentes de escuelas rurales del Perú.
Generas ejercicios claros, contextualizados a la realidad rural peruana, alineados al
Currículo Nacional. Lenguaje sencillo y respetuoso. Devuelves SIEMPRE un único objeto JSON,
sin texto adicional ni explicaciones fuera del JSON.`;

export function generateUser(i: GenerateInput): string {
  return `Crea ${i.n} ejercicio(s) para la materia "${i.materia}", grado "${i.grado}",
sobre el tema "${i.tema}".

CONTEXTO DEL CURRÍCULO (úsalo como base; si está vacío, usa conocimiento general apropiado):
"""
${i.contexto || "(sin contexto recuperado)"}
"""

Responde con este esquema JSON exacto:
{
  "titulo": string,
  "enunciado": string,                // instrucción general para el estudiante
  "ejercicios": [
    { "pregunta": string, "respuesta_esperada": string, "puntaje": number }
  ],
  "rubrica": [
    { "criterio": string, "puntos": number }
  ]
}`;
}

export interface GradeInput {
  enunciado: string;
  rubrica: string; // JSON or text
  respuesta: string;
  contexto: string;
}

export const gradeSystem = `Eres un asistente de evaluación para docentes rurales del Perú.
Calificas respuestas abiertas de estudiantes de forma justa y formativa. Das retroalimentación
breve, concreta y motivadora, en español sencillo. Devuelves SIEMPRE un único objeto JSON.`;

export function gradeUser(i: GradeInput): string {
  return `Califica la respuesta del estudiante.

ENUNCIADO:
"""${i.enunciado}"""

RÚBRICA:
"""${i.rubrica}"""

CONTEXTO DEL CURRÍCULO:
"""${i.contexto || "(sin contexto)"}"""

RESPUESTA DEL ESTUDIANTE:
"""${i.respuesta}"""

Responde con este esquema JSON exacto:
{
  "puntaje": number,            // 0 a 100
  "feedback": string,          // 2-4 frases, formativo y específico
  "aciertos": [string],
  "mejoras": [string]
}`;
}

export const verifierSystem = `Eres un verificador de seguridad y pertinencia pedagógica.
Revisas contenido generado por IA para uso escolar. Rechazas contenido inapropiado, ofensivo,
fuera de tema o pedagógicamente incorrecto. Devuelves SIEMPRE un único objeto JSON.`;

export function verifierUser(contenido: string): string {
  return `Evalúa el siguiente contenido educativo destinado a estudiantes.

CONTENIDO:
"""${contenido}"""

Responde con este esquema JSON exacto:
{
  "aprobado": boolean,
  "razon": string,
  "problemas": [string]
}`;
}
