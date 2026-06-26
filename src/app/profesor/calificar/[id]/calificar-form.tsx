"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/submit-button";
import { calificarEntrega } from "../../actions";

interface GradeResp {
  resultado: {
    puntaje: number;
    feedback: string;
    aciertos?: string[];
    mejoras?: string[];
  } | null;
  verificacion: { aprobado: boolean; razon?: string } | null;
  provider?: string;
  error?: string;
}

export function CalificarForm({
  entregaId,
  enunciado,
  rubricaJson,
  respuesta,
}: {
  entregaId: number;
  enunciado: string;
  rubricaJson: string | null;
  respuesta: string;
}) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [puntaje, setPuntaje] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [verif, setVerif] = useState<GradeResp["verificacion"]>(null);
  const [provider, setProvider] = useState<string | undefined>();

  async function calificarIA() {
    setCargando(true);
    setError(null);
    try {
      const r = await fetch("/api/grade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enunciado, rubrica: rubricaJson ?? "", respuesta }),
      });
      const data: GradeResp = await r.json();
      if (!r.ok) {
        setError(data?.error ?? "No se pudo calificar.");
        return;
      }
      setPuntaje(data.resultado?.puntaje ?? 0);
      setFeedback(data.resultado?.feedback ?? "");
      setVerif(data.verificacion);
      setProvider(data.provider);
    } catch (e) {
      setError(String(e));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button type="button" onClick={calificarIA} disabled={cargando}>
          {cargando ? "Calificando..." : "Calificar con IA"}
        </Button>
        {verif && (
          <Badge variant={verif.aprobado ? "default" : "destructive"}>
            {verif.aprobado ? "Feedback verificado ✓" : "Feedback a revisar ⚠"}
          </Badge>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {verif && !verif.aprobado && verif.razon && (
        <p className="text-sm text-destructive">Verificador: {verif.razon}</p>
      )}

      <form action={calificarEntrega} className="space-y-3">
        <input type="hidden" name="entregaId" value={entregaId} />
        <input type="hidden" name="verificado" value={verif?.aprobado ? "1" : "0"} />
        <div className="max-w-32 space-y-1">
          <Label htmlFor="puntaje">Puntaje (0-100)</Label>
          <Input
            id="puntaje"
            name="puntaje"
            type="number"
            min={0}
            max={100}
            value={puntaje}
            onChange={(e) => setPuntaje(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="feedback">Retroalimentación</Label>
          <Textarea
            id="feedback"
            name="feedback"
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Genera con IA o escribe tú la retroalimentación…"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="override" value="1" />
          Ajusté la nota o el feedback de la IA
        </label>
        {provider && (
          <p className="text-xs text-muted-foreground">
            Sugerido por: {provider}
          </p>
        )}
        <SubmitButton>Guardar nota</SubmitButton>
      </form>
    </div>
  );
}
