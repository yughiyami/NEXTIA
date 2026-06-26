import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listEntregasPendientes } from "@/lib/data/teach";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function CalificarPage() {
  const user = await requireRole("profesor", "admin");
  const rows = listEntregasPendientes(user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Calificar entregas</h1>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Asignación</TableHead>
                <TableHead>Respuesta</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No hay entregas pendientes.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">
                    {e.alumnoNombre ?? "Alumno"}
                  </TableCell>
                  <TableCell>{e.asignacionTitulo}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {e.respuesta}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/profesor/calificar/${e.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Calificar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
