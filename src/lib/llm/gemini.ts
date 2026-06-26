// Cloud provider = dev + fallback when Ollama isn't available.
import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/env";
import type { ChatMessage, ChatOptions, LlmProvider } from "./types";

let client: GoogleGenAI | null = null;
function ai(): GoogleGenAI {
  if (!env.gemini.apiKey) throw new Error("GEMINI_API_KEY not set");
  return (client ??= new GoogleGenAI({ apiKey: env.gemini.apiKey }));
}

// Gemini has no separate "system" role in this API shape — fold system text
// into a leading user turn and map assistant -> model.
function toContents(messages: ChatMessage[]) {
  const system = messages.filter((m) => m.role === "system").map((m) => m.content);
  const rest = messages.filter((m) => m.role !== "system");
  const contents = rest.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  if (system.length && contents.length) {
    contents[0].parts[0].text = `${system.join("\n")}\n\n${contents[0].parts[0].text}`;
  }
  return contents;
}

export const gemini: LlmProvider = {
  name: "gemini",

  async chat(messages: ChatMessage[], opts: ChatOptions = {}) {
    const res = await ai().models.generateContent({
      model: env.gemini.chatModel,
      contents: toContents(messages),
      config: {
        temperature: opts.temperature ?? 0.4,
        responseMimeType: opts.json ? "application/json" : undefined,
      },
    });
    return res.text ?? "";
  },

  async embed(texts: string[]) {
    const res = await ai().models.embedContent({
      model: env.gemini.embedModel,
      contents: texts,
    });
    return (res.embeddings ?? []).map((e) => e.values ?? []);
  },

  async ping() {
    return Boolean(env.gemini.apiKey);
  },
};
