// Local provider = "the box". Talks to Ollama over HTTP, no SDK needed.
import { env } from "@/lib/env";
import type { ChatMessage, ChatOptions, LlmProvider } from "./types";

async function post<T>(path: string, body: unknown, timeoutMs = 120_000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${env.ollama.baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`ollama ${path} ${res.status}: ${await res.text()}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export const ollama: LlmProvider = {
  name: "ollama",

  async chat(messages: ChatMessage[], opts: ChatOptions = {}) {
    const data = await post<{ message?: { content?: string } }>("/api/chat", {
      model: env.ollama.chatModel,
      messages,
      stream: false,
      format: opts.json ? "json" : undefined,
      options: { temperature: opts.temperature ?? 0.4 },
    });
    return data.message?.content ?? "";
  },

  async embed(texts: string[]) {
    const data = await post<{ embeddings: number[][] }>("/api/embed", {
      model: env.ollama.embedModel,
      input: texts,
    });
    return data.embeddings;
  },

  async ping() {
    try {
      const res = await fetch(`${env.ollama.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
