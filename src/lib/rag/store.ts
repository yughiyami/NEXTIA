// RAG store over the shared sqlite-vec connection. Content lives in rag_chunks;
// vectors in the rag_vec virtual table keyed by the same rowid.
import { sqlite } from "@/lib/db/client";
import { embed } from "@/lib/llm/router";

export interface RagHit {
  id: number;
  fuente: string | null;
  materia: string | null;
  grado: string | null;
  texto: string;
  distance: number;
}

const insertChunk = sqlite.prepare(
  "INSERT INTO rag_chunks (fuente, materia, grado, texto) VALUES (?, ?, ?, ?)",
);
const insertVec = sqlite.prepare(
  "INSERT INTO rag_vec (rowid, embedding) VALUES (?, ?)",
);
// sqlite-vec needs a literal LIMIT or a `k = ?` constraint for KNN — a bound
// LIMIT ? fails at prepare time, so use the k constraint.
const knn = sqlite.prepare(`
  SELECT c.id, c.fuente, c.materia, c.grado, c.texto, v.distance
  FROM rag_vec v
  JOIN rag_chunks c ON c.id = v.rowid
  WHERE v.embedding MATCH ? AND k = ? ORDER BY v.distance
`);

export interface ChunkMeta {
  fuente?: string;
  materia?: string;
  grado?: string;
}

/** Embed + persist one chunk. Returns its rowid. */
export async function addChunk(texto: string, meta: ChunkMeta = {}): Promise<number> {
  const [vec] = await embed([texto]);
  const info = insertChunk.run(meta.fuente ?? null, meta.materia ?? null, meta.grado ?? null, texto);
  const id = Number(info.lastInsertRowid);
  // vec0 requires the rowid bound as a true INTEGER → use BigInt.
  insertVec.run(BigInt(id), JSON.stringify(vec));
  return id;
}

/** Semantic search. Returns up to k closest chunks (lower distance = closer). */
export async function search(query: string, k = 3): Promise<RagHit[]> {
  const [vec] = await embed([query]);
  return knn.all(JSON.stringify(vec), k) as RagHit[];
}

export function chunkCount(): number {
  return (sqlite.prepare("SELECT count(*) AS n FROM rag_chunks").get() as { n: number }).n;
}
