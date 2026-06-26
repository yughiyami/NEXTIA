// Loads data/curriculum/*.txt into the RAG store (rag_chunks + rag_vec).
// Self-contained: talks to Ollama for embeddings directly so the box can be
// provisioned without booting the Next app. Idempotent (clears RAG first).
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";

const DB_PATH = process.env.DB_PATH ?? "data/nextia.db";
const OLLAMA = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";
const DIR = "data/curriculum";
const MAX_CHARS = 900;

async function embed(texts) {
  const res = await fetch(`${OLLAMA}/api/embed`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`ollama embed ${res.status}: ${await res.text()}`);
  return (await res.json()).embeddings;
}

function parseFile(text) {
  const meta = { materia: null, grado: null };
  const lines = text.split("\n");
  let i = 0;
  for (; i < lines.length; i++) {
    const m = lines[i].match(/^(MATERIA|GRADO|TEMA):\s*(.+)$/i);
    if (m) {
      const k = m[1].toUpperCase();
      if (k === "MATERIA") meta.materia = m[2].trim();
      else if (k === "GRADO") meta.grado = m[2].trim();
    } else if (lines[i].trim() === "" && (meta.materia || meta.grado)) {
      i++;
      break;
    }
  }
  const body = lines.slice(i).join("\n").trim();
  // chunk by paragraph, packing up to MAX_CHARS
  const paras = body.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  const chunks = [];
  let buf = "";
  for (const p of paras) {
    if ((buf + " " + p).length > MAX_CHARS && buf) {
      chunks.push(buf.trim());
      buf = p;
    } else {
      buf = buf ? `${buf} ${p}` : p;
    }
  }
  if (buf) chunks.push(buf.trim());
  return { meta, chunks };
}

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
sqliteVec.load(db);

db.exec("DELETE FROM rag_vec; DELETE FROM rag_chunks;");
const insC = db.prepare("INSERT INTO rag_chunks (fuente, materia, grado, texto) VALUES (?, ?, ?, ?)");
const insV = db.prepare("INSERT INTO rag_vec (rowid, embedding) VALUES (?, ?)");

const files = readdirSync(DIR).filter((f) => f.endsWith(".txt"));
let total = 0;
for (const f of files) {
  const { meta, chunks } = parseFile(readFileSync(join(DIR, f), "utf8"));
  const vecs = await embed(chunks);
  const tx = db.transaction(() => {
    chunks.forEach((c, idx) => {
      const info = insC.run(f, meta.materia, meta.grado, c);
      insV.run(BigInt(info.lastInsertRowid), JSON.stringify(vecs[idx]));
    });
  });
  tx();
  total += chunks.length;
  console.log(`  ${f}: ${chunks.length} chunks (${meta.materia} / ${meta.grado})`);
}
console.log(`Ingesta completa: ${total} chunks de ${files.length} archivos.`);
db.close();
