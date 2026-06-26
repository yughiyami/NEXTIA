import Link from "next/link";
import { requireRole } from "@/lib/session";
import {
  getProfesorByUserId,
  listAsignacionesDeProfesor,
  profesorResumen,
} from "@/lib/data/teach";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function ProfesorHome() {
  const user = await requireRole("profesor", "admin");
  const prof = getProfesorByUserId(user.id, user.email);
  const resumen = prof
    ? profesorResumen(prof.id, user.id)
    : { clases: 0, asignaciones: 0, pendientes: 0 };
  const asigs = listAsignacionesDeProfesor(user.id);

  const tarjetas = [
    { label: "Mis clases", value: resumen.clases },
    { label: "Asignaciones", value: resumen.asignaciones },
    { label: "Entregas pendientes", value: resumen.pendientes },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Resumen</h1>
        <Link href="/profesor/generar" className={buttonVariants()}>
          Generar ejercicio
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <Card key={t.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {t.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{t.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mis asignaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Clase</TableHead>
                <TableHead className="text-right">Entregas</TableHead>
                <TableHead className="text-right">Pendientes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asigs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    Aún no has creado asignaciones. Genera una con IA.
                  </TableCell>
                </TableRow>
              )}
              {asigs.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.titulo}</TableCell>
                  <TableCell>{a.materia ?? "—"}</TableCell>
                  <TableCell>{a.claseNombre ?? "—"}</TableCell>
                  <TableCell className="text-right">{a.entregas}</TableCell>
                  <TableCell className="text-right">{a.pendientes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
