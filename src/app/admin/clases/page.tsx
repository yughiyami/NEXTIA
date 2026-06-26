import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmitButton } from "@/components/admin/submit-button";
import { listClases, listProfesores } from "@/lib/data/admin";
import { addClase, removeClase } from "../actions";

export const dynamic = "force-dynamic";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";

export default function ClasesPage() {
  const rows = listClases();
  const profes = listProfesores();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Clases</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agregar clase</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addClase} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
            <div className="space-y-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required placeholder="Ej. 5to A" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="grado">Grado</Label>
              <Input id="grado" name="grado" placeholder="Ej. 5to de primaria" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="profesorId">Profesor</Label>
              <select id="profesorId" name="profesorId" className={selectClass} defaultValue="">
                <option value="">— Sin asignar —</option>
                {profes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
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
                <TableHead>Profesor</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Sin clases aún.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell className="font-medium">{c.nombre}</TableCell>
                  <TableCell>{c.grado ?? "—"}</TableCell>
                  <TableCell>{c.profesorNombre ?? "—"}</TableCell>
                  <TableCell>
                    <form action={removeClase}>
                      <input type="hidden" name="id" value={c.id} />
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
