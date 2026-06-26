export type ChatRole = "system" | "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  /** Ask the model to emit a single JSON object. */
  json?: boolean;
}

export interface LlmProvider {
  readonly name: "ollama" | "gemini";
  chat(messages: ChatMessage[], opts?: ChatOptions): Promise<string>;
  embed(texts: string[]): Promise<number[][]>;
  /** Cheap reachability check (used for fallback + health). */
  ping(): Promise<boolean>;
}
