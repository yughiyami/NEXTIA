import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getEntregaParaCalificar } from "@/lib/data/teach";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalificarForm } from "./calificar-form";

export const dynamic = "force-dynamic";

export default async function CalificarEntregaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireRole("profesor", "admin");
  const entrega = getEntregaParaCalificar(Number(id));
  if (!entrega) notFound();
  // Only the assignment's author (or an admin) may grade it.
  if (entrega.creadoPor !== user.id && user.role !== "admin") notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/profesor/calificar"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Volver a entregas
      </Link>
      <h1 className="text-2xl font-semibold">Calificar entrega</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {entrega.asignacionTitulo} · {entrega.alumnoNombre ?? "Alumno"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Enunciado</p>
            <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
              {entrega.enunciado}
            </pre>
          </div>
          <div>
            <p className="text-sm font-medium">Respuesta del alumno</p>
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {entrega.respuesta}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calificación</CardTitle>
        </CardHeader>
        <CardContent>
          <CalificarForm
            entregaId={entrega.id}
            enunciado={entrega.enunciado}
            rubricaJson={entrega.rubricaJson}
            respuesta={entrega.respuesta}
          />
        </CardContent>
      </Card>
    </div>
  );
}
