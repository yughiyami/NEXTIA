// Central env access. Keep all process.env reads here so the rest of the app
// depends on typed config, not raw strings.

export const env = {
  dbPath: process.env.DB_PATH ?? "data/nextia.db",

  // LLM routing: "ollama" (local, "the box") or "gemini" (cloud fallback/dev).
  llmProvider: (process.env.LLM_PROVIDER ?? "ollama") as "ollama" | "gemini",

  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    chatModel: process.env.OLLAMA_CHAT_MODEL ?? "gemma3:4b",
    embedModel: process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text",
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? "",
    chatModel: process.env.GEMINI_CHAT_MODEL ?? "gemini-2.5-flash",
    embedModel: process.env.GEMINI_EMBED_MODEL ?? "text-embedding-004",
  },

  // nomic-embed-text and text-embedding-004 are both 768-dim — keep the vector
  // table fixed at this size regardless of active provider.
  embedDim: 768,

  auth: {
    secret: process.env.BETTER_AUTH_SECRET ?? "dev-insecure-secret-change-me",
    url: process.env.BETTER_AUTH_URL ?? "http://localhost:3010",
    // Extra origins to trust (comma-separated), e.g. the box's LAN IP.
    extraTrustedOrigins: (process.env.TRUSTED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  },
};
