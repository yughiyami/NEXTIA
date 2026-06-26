import { requireRole } from "@/lib/session";
import { getProfesorByUserId, listClasesDeProfesor } from "@/lib/data/teach";
import { listClases } from "@/lib/data/admin";
import { GenerarForm } from "./generar-form";

export const dynamic = "force-dynamic";

export default async function GenerarPage() {
  const user = await requireRole("profesor", "admin");
  const prof = getProfesorByUserId(user.id, user.email);
  // Profesor sees their own classes; admin (no profesor row) sees all.
  const clases = prof ? listClasesDeProfesor(prof.id) : listClases();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Generar ejercicio</h1>
      <p className="text-sm text-muted-foreground">
        La IA local (Gemma) crea ejercicios alineados al currículo y los verifica
        antes de que los uses.
      </p>
      <GenerarForm clases={clases.map((c) => ({ id: c.id, nombre: c.nombre }))} />
    </div>
  );
}
