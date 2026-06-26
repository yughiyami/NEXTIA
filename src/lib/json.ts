// LLMs wrap JSON in prose or ```json fences. Pull out the first balanced object.
export function parseJsonLoose<T = unknown>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : raw;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`No JSON object in model output: ${raw.slice(0, 200)}`);
  }
  return JSON.parse(body.slice(start, end + 1)) as T;
}
