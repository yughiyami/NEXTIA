import { requireRole } from "@/lib/session";
import { getAlumnoByUserId, listAsignacionesDeClase } from "@/lib/data/learn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/submit-button";
import { enviarRespuesta } from "./actions";

export const dynamic = "force-dynamic";

export default async function AlumnoHome() {
  const user = await requireRole("alumno");
  const alumno = getAlumnoByUserId(user.id);

  if (!alumno) {
    return (
      <p className="text-sm text-muted-foreground">
        Tu cuenta aún no está vinculada a un alumno. Avísale a tu profesor.
      </p>
    );
  }
  if (!alumno.claseId) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no estás asignado a una clase.
      </p>
    );
  }

  const asigs = listAsignacionesDeClase(alumno.claseId, alumno.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mis tareas</h1>

      {asigs.length === 0 && (
        <p className="text-sm text-muted-foreground">Aún no hay tareas.</p>
      )}

      {asigs.map((a) => (
        <Card key={a.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{a.titulo}</CardTitle>
            {a.nota ? (
              <Badge>Calificada</Badge>
            ) : a.entrega ? (
              <Badge variant="secondary">Entregada</Badge>
            ) : (
              <Badge variant="outline">Pendiente</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
              {a.enunciado}
            </pre>

            {a.nota ? (
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <p className="font-medium">Nota: {a.nota.puntaje}/100</p>
                {a.nota.feedback && (
                  <p className="mt-1 whitespace-pre-wrap">{a.nota.feedback}</p>
                )}
              </div>
            ) : a.entrega ? (
              <p className="text-sm text-muted-foreground">
                Respuesta enviada. Espera la calificación de tu profesor.
              </p>
            ) : (
              <form action={enviarRespuesta} className="space-y-2">
                <input type="hidden" name="asignacionId" value={a.id} />
                <Textarea
                  name="respuesta"
                  rows={4}
                  required
                  placeholder="Escribe tu respuesta…"
                />
                <SubmitButton>Enviar respuesta</SubmitButton>
              </form>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
