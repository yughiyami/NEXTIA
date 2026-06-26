// Embeddings ligeros para RAG cuando no hay modelo de embeddings disponible.
// Usa un enfoque basado en hash + frecuencia de términos para generar
// vectores determinísticos sin necesidad de GPU ni descargar modelos.

import { env } from "@/lib/env";

const DIM = env.embedDim; // 768
const SEED = 42;

function hashWord(w: string): number {
  let h = SEED;
  for (let i = 0; i < w.length; i++) {
    h = ((h << 5) - h + w.charCodeAt(i)) | 0;
  }
  return h;
}

// Vocabulario simulado: proyecta palabras a posiciones en el vector
function wordToPosition(word: string): number {
  const h = Math.abs(hashWord(word));
  return h % DIM;
}

// Genera un embedding determinístico para un texto
export function localEmbed(text: string): number[] {
  const vec = new Float64Array(DIM);
  const words = text
    .toLowerCase()
    .replace(/[^a-záéíóúñü0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] ?? 0) + 1;
  }

  const maxFreq = Math.max(...Object.values(freq), 1);

  for (const [word, count] of Object.entries(freq)) {
    const pos = wordToPosition(word);
    // TF-IDF-like weighting
    vec[pos] += count / maxFreq;
    // Spread to nearby positions for fuzzy matching
    for (let d = 1; d <= 3; d++) {
      const left = (pos - d + DIM) % DIM;
      const right = (pos + d) % DIM;
      const spread = 1 / (d + 1);
      vec[left] += (count / maxFreq) * spread;
      vec[right] += (count / maxFreq) * spread;
    }
  }

  // Normalizar L2
  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < DIM; i++) vec[i] /= norm;
  }

  return Array.from(vec);
}

// Para múltiples textos
export function localEmbedBatch(texts: string[]): number[][] {
  return texts.map(localEmbed);
}
