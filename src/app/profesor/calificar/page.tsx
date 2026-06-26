"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface GradeResult {
  puntaje: number;
  feedback: string;
  aciertos: string[];
  mejoras: string[];
  ejecutado?: boolean;
}

export default function CalificarPage() {
  const [enunciado, setEnunciado] = useState("");
  const [rubrica, setRubrica] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enunciado, rubrica, respuesta }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setResultado(data.resultado);
    } catch (err) {
      setError(String(err));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calificar con IA</h1>
        <p className="text-sm text-muted-foreground">
          La IA evalúa la respuesta del estudiante y da retroalimentación.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="enunciado">Enunciado de la tarea</Label>
              <Textarea id="enunciado" value={enunciado} onChange={(e) => setEnunciado(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rubrica">Rúbrica (opcional)</Label>
              <Textarea id="rubrica" value={rubrica} onChange={(e) => setRubrica(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="respuesta">Respuesta del estudiante</Label>
              <Textarea id="respuesta" value={respuesta} onChange={(e) => setRespuesta(e.target.value)} required />
            </div>
            <Button type="submit" disabled={cargando}>
              {cargando ? "Calificando..." : "Calificar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {resultado && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Resultado</CardTitle>
              <Badge variant={resultado.puntaje >= 60 ? "default" : "secondary"}>
                {resultado.puntaje}/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Retroalimentación</p>
              <p className="text-sm text-muted-foreground">{resultado.feedback}</p>
            </div>
            {resultado.aciertos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-green-600">Aciertos</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {resultado.aciertos.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {resultado.mejoras.length > 0 && (
              <div>
                <p className="text-sm font-medium text-amber-600">A mejorar</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {resultado.mejoras.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
