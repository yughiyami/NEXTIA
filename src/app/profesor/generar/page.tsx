"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Ejercicio {
  pregunta: string;
  respuesta_esperada: string;
  puntaje: number;
}

interface Draft {
  titulo: string;
  enunciado: string;
  ejercicios: Ejercicio[];
  rubrica: { criterio: string; puntos: number }[];
}

export default function GenerarPage() {
  const [materia, setMateria] = useState("");
  const [grado, setGrado] = useState("");
  const [tema, setTema] = useState("");
  const [cargando, setCargando] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setDraft(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ materia, grado, tema, n: 3 }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setDraft(data.draft);
    } catch (err) {
      setError(String(err));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Generar Ejercicios con IA</h1>
        <p className="text-sm text-muted-foreground">
          La IA buscará en el currículo y generará ejercicios alineados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parámetros</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="materia">Materia</Label>
                <Input id="materia" value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Matemática" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="grado">Grado</Label>
                <Input id="grado" value={grado} onChange={(e) => setGrado(e.target.value)} placeholder="5to" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="tema">Tema</Label>
              <Input id="tema" value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Fracciones" required />
            </div>
            <Button type="submit" disabled={cargando}>
              {cargando ? "Generando..." : "Generar Ejercicios"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {draft && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{draft.titulo}</CardTitle>
                <Badge variant="outline">IA Generado</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Enunciado</p>
                <p className="text-sm text-muted-foreground">{draft.enunciado}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Ejercicios</p>
                {draft.ejercicios.map((ex, i) => (
                  <Card key={i} className="mt-2 bg-muted/20">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium">
                        {i + 1}. {ex.pregunta}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Respuesta: {ex.respuesta_esperada} ({ex.puntaje} pts)
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <p className="text-sm font-medium">Rúbrica</p>
                <div className="mt-1 space-y-1">
                  {draft.rubrica.map((r, i) => (
                    <div key={i} className="flex justify-between rounded-md bg-muted/20 px-3 py-2 text-sm">
                      <span>{r.criterio}</span>
                      <span className="font-medium">{r.puntos} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
