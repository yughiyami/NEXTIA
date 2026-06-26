import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmitButton } from "@/components/admin/submit-button";
import { listAlumnos, listClases } from "@/lib/data/admin";
import { addAlumno, removeAlumno } from "../actions";

export const dynamic = "force-dynamic";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";

export default function AlumnosPage() {
  const rows = listAlumnos();
  const clases = listClases();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Alumnos</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agregar alumno</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addAlumno} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
            <div className="space-y-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required placeholder="Ej. Juan Mamani" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="grado">Grado</Label>
              <Input id="grado" name="grado" placeholder="Ej. 5to de primaria" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="claseId">Clase</Label>
              <select id="claseId" name="claseId" className={selectClass} defaultValue="">
                <option value="">— Sin asignar —</option>
                {clases.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <SubmitButton>Agregar</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Clase</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Sin alumnos aún.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell className="font-medium">{a.nombre}</TableCell>
                  <TableCell>{a.grado ?? "—"}</TableCell>
                  <TableCell>{a.claseNombre ?? "—"}</TableCell>
                  <TableCell>
                    <form action={removeAlumno}>
                      <input type="hidden" name="id" value={a.id} />
                      <SubmitButton variant="ghost" size="sm">Eliminar</SubmitButton>
                    </form>
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
