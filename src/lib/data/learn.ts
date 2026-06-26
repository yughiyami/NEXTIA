// Drizzle data-access for the ALUMNO surface: their class assignments, their
// own submissions, and the grades they received.
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { alumnos, asignaciones, entregas, notas } from "@/lib/db/schema";

/** The alumno row linked to a logged-in user (set by the seed). */
export function getAlumnoByUserId(userId: string) {
  return db.select().from(alumnos).where(eq(alumnos.userId, userId)).get() ?? null;
}

/**
 * Assignments for a class, each annotated with this alumno's own submission
 * and grade (if any) so the UI can show pendiente / entregada / calificada.
 */
export function listAsignacionesDeClase(claseId: number, alumnoId: number) {
  const filas = db
    .select()
    .from(asignaciones)
    .where(eq(asignaciones.claseId, claseId))
    .orderBy(desc(asignaciones.id))
    .all();
  return filas.map((a) => {
    const entrega =
      db
        .select()
        .from(entregas)
        .where(
          and(eq(entregas.asignacionId, a.id), eq(entregas.alumnoId, alumnoId)),
        )
        .get() ?? null;
    const nota = entrega
      ? db.select().from(notas).where(eq(notas.entregaId, entrega.id)).get() ??
        null
      : null;
    return { ...a, entrega, nota };
  });
}

export function yaEntrego(asignacionId: number, alumnoId: number) {
  return !!db
    .select({ id: entregas.id })
    .from(entregas)
    .where(
      and(
        eq(entregas.asignacionId, asignacionId),
        eq(entregas.alumnoId, alumnoId),
      ),
    )
    .get();
}

export function createEntrega(v: {
  asignacionId: number;
  alumnoId: number;
  respuesta: string;
}) {
  return db.insert(entregas).values(v).run();
}
