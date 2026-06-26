// modelRouter: one interface over local (Ollama) + cloud (Gemini). The whole
// app calls llm.chat()/llm.embed() and never touches a provider directly, so
// the "local box vs cloud" choice is a single env flip with automatic fallback.
import { env } from "@/lib/env";
import { ollama } from "./ollama";
import { gemini } from "./gemini";
import { localEmbedBatch } from "./embed";
import type { ChatMessage, ChatOptions, LlmProvider } from "./types";

const providers: Record<"ollama" | "gemini", LlmProvider> = { ollama, gemini };

function primary(): LlmProvider {
  return providers[env.llmProvider];
}
function secondary(): LlmProvider {
  return env.llmProvider === "ollama" ? gemini : ollama;
}

export interface ChatResult {
  text: string;
  provider: "ollama" | "gemini";
}

/** Chat with automatic fallback to the other provider on failure. */
export async function chat(
  messages: ChatMessage[],
  opts?: ChatOptions,
): Promise<ChatResult> {
  const p = primary();
  try {
    return { text: await p.chat(messages, opts), provider: p.name };
  } catch (err) {
    const s = secondary();
    try {
      const text = await s.chat(messages, opts);
      console.warn(`[llm] ${p.name} failed, fell back to ${s.name}:`, String(err));
      return { text, provider: s.name };
    } catch {
      throw err; // surface the primary error if both fail
    }
  }
}

/** Embeddings: intenta provider primario; si falla, usa embedder local (hash). */
export async function embed(texts: string[]): Promise<number[][]> {
  try {
    return await primary().embed(texts);
  } catch {
    console.warn("[llm] provider embed failed, usando local embedder");
    return localEmbedBatch(texts);
  }
}

export async function health() {
  const [ollamaUp, geminiUp] = await Promise.all([ollama.ping(), gemini.ping()]);
  return {
    active: env.llmProvider,
    ollama: { up: ollamaUp, model: env.ollama.chatModel },
    gemini: { configured: geminiUp, model: env.gemini.chatModel },
  };
}

export const llm = { chat, embed, health };
