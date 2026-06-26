// Drizzle data-access for the PROFESOR surface: assignments (asignaciones),
// pending submissions (entregas), and grades (notas).
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  profesores,
  clases,
  alumnos,
  asignaciones,
  entregas,
  notas,
} from "@/lib/db/schema";

/**
 * Resolve the profesor row for a logged-in user. Prefers the explicit
 * userId link; falls back to email (the seed sets profesores.email), so the
 * surface works even if the link was never written.
 */
export function getProfesorByUserId(userId: string, email?: string | null) {
  const byId = db
    .select()
    .from(profesores)
    .where(eq(profesores.userId, userId))
    .get();
  if (byId) return byId;
  if (email) {
    return (
      db.select().from(profesores).where(eq(profesores.email, email)).get() ??
      null
    );
  }
  return null;
}

export function listClasesDeProfesor(profesorId: number) {
  return db
    .select()
    .from(clases)
    .where(eq(clases.profesorId, profesorId))
    .orderBy(desc(clases.id))
    .all();
}

export function createAsignacion(v: {
  claseId?: number;
  titulo: string;
  enunciado: string;
  rubricaJson?: string;
  materia?: string;
  grado?: string;
  creadoPor: string;
}) {
  return db.insert(asignaciones).values(v).run();
}

export function listAsignacionesDeProfesor(creadoPor: string) {
  return db
    .select({
      id: asignaciones.id,
      titulo: asignaciones.titulo,
      materia: asignaciones.materia,
      grado: asignaciones.grado,
      claseNombre: clases.nombre,
      creadoEn: asignaciones.creadoEn,
      entregas: sql<number>`(select count(*) from entregas e where e.asignacion_id = ${asignaciones.id})`,
      pendientes: sql<number>`(select count(*) from entregas e where e.asignacion_id = ${asignaciones.id} and e.estado = 'pendiente')`,
    })
    .from(asignaciones)
    .leftJoin(clases, eq(asignaciones.claseId, clases.id))
    .where(eq(asignaciones.creadoPor, creadoPor))
    .orderBy(desc(asignaciones.id))
    .all();
}

export function listEntregasPendientes(creadoPor: string) {
  return db
    .select({
      id: entregas.id,
      respuesta: entregas.respuesta,
      estado: entregas.estado,
      asignacionTitulo: asignaciones.titulo,
      alumnoNombre: alumnos.nombre,
    })
    .from(entregas)
    .innerJoin(asignaciones, eq(entregas.asignacionId, asignaciones.id))
    .leftJoin(alumnos, eq(entregas.alumnoId, alumnos.id))
    .where(
      and(eq(asignaciones.creadoPor, creadoPor), eq(entregas.estado, "pendiente")),
    )
    .orderBy(desc(entregas.id))
    .all();
}

export function getEntregaParaCalificar(entregaId: number) {
  return db
    .select({
      id: entregas.id,
      respuesta: entregas.respuesta,
      estado: entregas.estado,
      alumnoNombre: alumnos.nombre,
      asignacionTitulo: asignaciones.titulo,
      enunciado: asignaciones.enunciado,
      rubricaJson: asignaciones.rubricaJson,
      creadoPor: asignaciones.creadoPor,
    })
    .from(entregas)
    .innerJoin(asignaciones, eq(entregas.asignacionId, asignaciones.id))
    .leftJoin(alumnos, eq(entregas.alumnoId, alumnos.id))
    .where(eq(entregas.id, entregaId))
    .get();
}

/** Save a grade and mark the submission as graded, atomically. */
export function saveNota(v: {
  entregaId: number;
  puntaje: number;
  feedback: string;
  verificado: boolean;
  overrideProfesor: boolean;
}) {
  return db.transaction((tx) => {
    tx.insert(notas).values(v).run();
    tx.update(entregas)
      .set({ estado: "calificada" })
      .where(eq(entregas.id, v.entregaId))
      .run();
  });
}

export function profesorResumen(profesorId: number, creadoPor: string) {
  const count = (q: { get(): { n: number } | undefined }) => q.get()?.n ?? 0;
  const clasesN = count(
    db
      .select({ n: sql<number>`count(*)` })
      .from(clases)
      .where(eq(clases.profesorId, profesorId)),
  );
  const asignacionesN = count(
    db
      .select({ n: sql<number>`count(*)` })
      .from(asignaciones)
      .where(eq(asignaciones.creadoPor, creadoPor)),
  );
  const pendientesN = count(
    db
      .select({ n: sql<number>`count(*)` })
      .from(entregas)
      .innerJoin(asignaciones, eq(entregas.asignacionId, asignaciones.id))
      .where(
        and(
          eq(asignaciones.creadoPor, creadoPor),
          eq(entregas.estado, "pendiente"),
        ),
      ),
  );
  return { clases: clasesN, asignaciones: asignacionesN, pendientes: pendientesN };
}
