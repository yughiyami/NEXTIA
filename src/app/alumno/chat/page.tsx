"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Mensaje {
  role: "user" | "assistant";
  content: string;
  fuentes?: string[];
  provider?: string;
}

const PREGUNTAS_SUGERIDAS = [
  "¿Qué son las fracciones?",
  "¿Cómo se suman fracciones?",
  "¿Qué es la fotosíntesis?",
  "¿Qué son los adverbios?",
  "¿Cuáles son los números primos?",
  "¿Cómo se mide el área de un rectángulo?",
];

export default function ChatPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy NEXTIA-Tutor, tu asistente de aprendizaje. Pregúntame sobre cualquier tema de tu escuela y te ayudaré a entenderlo mejor. ¿Qué quisieras aprender hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || cargando) return;

    const pregunta = input.trim();
    setInput("");
    setMensajes((prev) => [...prev, { role: "user", content: pregunta }]);
    setCargando(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pregunta,
          historial: mensajes
            .filter((m) => m.role !== "assistant" || m !== mensajes[mensajes.length - 1])
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setMensajes((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.respuesta,
          fuentes: data.fuentes,
          provider: data.provider,
        },
      ]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, tuve un problema al procesar tu pregunta. ¿Puedes intentarlo de nuevo?",
        },
      ]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b bg-muted/30 p-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-xl font-semibold">Tutor IA</h1>
          <p className="text-sm text-muted-foreground">
            Pregunta lo que quieras aprender. Funciona sin internet.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {mensajes.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {PREGUNTAS_SUGERIDAS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    const form = document.querySelector("form");
                    form?.requestSubmit();
                  }}
                  className="rounded-full border bg-muted/30 px-3 py-1.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          {mensajes.map((m, i) => (
            <Card key={i} className={m.role === "user" ? "bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">
                    {m.role === "user" ? "Tú" : "NEXTIA-Tutor"}
                  </CardTitle>
                  {m.provider && (
                    <Badge variant="outline" className="text-[10px]">
                      {m.provider}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                {m.fuentes && m.fuentes.length > 0 && (
                  <div className="mt-3 border-t pt-2 text-xs text-muted-foreground">
                    <p className="font-medium">Fuentes del currículo:</p>
                    {m.fuentes.map((f, j) => (
                      <p key={j}>📖 {f}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {cargando && (
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  NEXTIA-Tutor está pensando...
                </div>
              </CardContent>
            </Card>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t bg-background p-4">
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            disabled={cargando}
            className="flex-1"
          />
          <Button type="submit" disabled={cargando || !input.trim()}>
            {cargando ? "..." : "Preguntar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
