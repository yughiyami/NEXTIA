import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmitButton } from "@/components/admin/submit-button";
import { listProfesores } from "@/lib/data/admin";
import { addProfesor, removeProfesor } from "../actions";

export const dynamic = "force-dynamic";

export default function ProfesoresPage() {
  const rows = listProfesores();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profesores</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agregar profesor</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addProfesor} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
            <div className="space-y-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required placeholder="Ej. Rosa Quispe" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" placeholder="opcional" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="materia">Materia</Label>
              <Input id="materia" name="materia" placeholder="Ej. Matemática" />
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
                <TableHead>Correo</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Sin profesores aún.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.email ?? "—"}</TableCell>
                  <TableCell>{p.materia ?? "—"}</TableCell>
                  <TableCell>
                    <form action={removeProfesor}>
                      <input type="hidden" name="id" value={p.id} />
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
