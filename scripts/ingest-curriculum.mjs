// Loads data/curriculum/*.txt into the RAG store (rag_chunks + rag_vec).
// Self-contained: talks to Ollama/Gemini for embeddings via the LLM router.
// Idempotent (clears RAG first). Falls back to local embedder if no ML model
// is available.
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";

const DB_PATH = process.env.DB_PATH ?? "data/nextia.db";
const DIR = "data/curriculum";
const MAX_CHARS = 900;

// Pure-JS embedder (hash-based, 768-dim, no ML model required)
const DIM = 768;
const SEED = 42;

function hashWord(w) {
  let h = SEED;
  for (let i = 0; i < w.length; i++) h = ((h << 5) - h + w.charCodeAt(i)) | 0;
  return h;
}

function wordToPosition(word) {
  return Math.abs(hashWord(word)) % DIM;
}

function localEmbed(text) {
  const vec = new Float64Array(DIM);
  const words = text
    .toLowerCase()
    .replace(/[^a-záéíóúñü0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const freq = {};
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  const maxFreq = Math.max(...Object.values(freq), 1);

  for (const [word, count] of Object.entries(freq)) {
    const pos = wordToPosition(word);
    vec[pos] += count / maxFreq;
    for (let d = 1; d <= 3; d++) {
      const left = (pos - d + DIM) % DIM;
      const right = (pos + d) % DIM;
      const spread = 1 / (d + 1);
      vec[left] += (count / maxFreq) * spread;
      vec[right] += (count / maxFreq) * spread;
    }
  }

  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) for (let i = 0; i < DIM; i++) vec[i] /= norm;

  return Array.from(vec);
}

async function embed(texts) {
  // Try Ollama first
  const OLLAMA = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";
  try {
    const res = await fetch(`${OLLAMA}/api/embed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
    });
    if (res.ok) return (await res.json()).embeddings;
  } catch {}
  // Fallback to local hash-based embedder
  console.warn("  ⚠ Usando embedder local (hash) — sin modelo ML");
  return texts.map(localEmbed);
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
  console.log(`  Procesando ${f}: ${chunks.length} chunks`);
  const vecs = await embed(chunks);
  const tx = db.transaction(() => {
    chunks.forEach((c, idx) => {
      const info = insC.run(f, meta.materia, meta.grado, c);
      insV.run(BigInt(info.lastInsertRowid), JSON.stringify(vecs[idx]));
    });
  });
  tx();
  total += chunks.length;
}
console.log(`Ingesta completa: ${total} chunks de ${files.length} archivos.`);
db.close();
