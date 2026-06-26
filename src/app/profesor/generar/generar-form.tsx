"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/submit-button";
import { guardarAsignacion } from "../actions";

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
interface Verif {
  aprobado: boolean;
  razon?: string;
  problemas?: string[];
}
interface ApiResp {
  draft: Draft | null;
  verificacion: Verif | null;
  provider?: string;
  fuentes?: string[];
}
type Clase = { id: number; nombre: string };

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";

/** Flatten the structured draft into the assignment text the alumno reads. */
function componerEnunciado(d: Draft) {
  const ejercicios = (d.ejercicios ?? []).map(
    (e, i) => `${i + 1}. ${e.pregunta} (${e.puntaje} pts)`,
  );
  return [d.enunciado, "", ...ejercicios].join("\n").trim();
}

export function GenerarForm({ clases }: { clases: Clase[] }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [meta, setMeta] = useState({ materia: "", grado: "" });

  async function generar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResp(null);
    setCargando(true);
    const fd = new FormData(e.currentTarget);
    const materia = String(fd.get("materia") || "");
    const grado = String(fd.get("grado") || "");
    setMeta({ materia, grado });
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          materia,
          grado,
          tema: String(fd.get("tema") || ""),
          n: Number(fd.get("n") || 3),
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data?.error ?? "No se pudo generar el ejercicio.");
        return;
      }
      setResp(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setCargando(false);
    }
  }

  const draft = resp?.draft ?? null;
  const verif = resp?.verificacion ?? null;
  const enunciado = draft ? componerEnunciado(draft) : "";
  const rubricaJson = draft ? JSON.stringify(draft.rubrica ?? []) : "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parámetros</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={generar}
            className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end"
          >
            <div className="space-y-1">
              <Label htmlFor="materia">Materia</Label>
              <Input id="materia" name="materia" required defaultValue="Matemática" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="grado">Grado</Label>
              <Input
                id="grado"
                name="grado"
                required
                defaultValue="5to de primaria"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tema">Tema</Label>
              <Input id="tema" name="tema" required placeholder="Ej. fracciones" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="n"># ejercicios</Label>
              <Input
                id="n"
                name="n"
                type="number"
                min={1}
                max={10}
                defaultValue={3}
              />
            </div>
            <Button type="submit" disabled={cargando}>
              {cargando ? "Generando..." : "Generar"}
            </Button>
          </form>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {cargando && (
            <p className="mt-3 text-sm text-muted-foreground">
              El modelo local (Gemma) está trabajando…
            </p>
          )}
        </CardContent>
      </Card>

      {draft && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{draft.titulo}</CardTitle>
            {verif && (
              <Badge variant={verif.aprobado ? "default" : "destructive"}>
                {verif.aprobado ? "Verificado ✓" : "Revisar ⚠"}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="whitespace-pre-wrap font-sans text-sm">{enunciado}</pre>

            {draft.rubrica?.length > 0 && (
              <div className="text-sm">
                <p className="font-medium">Rúbrica</p>
                <ul className="list-disc pl-5">
                  {draft.rubrica.map((r, i) => (
                    <li key={i}>
                      {r.criterio} — {r.puntos} pts
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {verif && !verif.aprobado && verif.razon && (
              <p className="text-sm text-destructive">
                Verificador: {verif.razon}
              </p>
            )}

            {resp?.provider && (
              <p className="text-xs text-muted-foreground">
                Generado por: {resp.provider}
                {resp.fuentes?.length
                  ? ` · Fuentes: ${resp.fuentes.join(", ")}`
                  : ""}
              </p>
            )}

            <form
              action={guardarAsignacion}
              className="grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-[1fr_auto] sm:items-end"
            >
              <input type="hidden" name="titulo" value={draft.titulo} />
              <input type="hidden" name="enunciado" value={enunciado} />
              <input type="hidden" name="rubricaJson" value={rubricaJson} />
              <input type="hidden" name="materia" value={meta.materia} />
              <input type="hidden" name="grado" value={meta.grado} />
              <div className="space-y-1">
                <Label htmlFor="claseId">Asignar a clase</Label>
                <select
                  id="claseId"
                  name="claseId"
                  className={selectClass}
                  defaultValue={clases[0]?.id ?? ""}
                >
                  {clases.length === 0 && (
                    <option value="">— Sin clases —</option>
                  )}
                  {clases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <SubmitButton>Guardar como asignación</SubmitButton>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
