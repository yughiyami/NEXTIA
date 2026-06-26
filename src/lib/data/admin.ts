// Drizzle data-access for the admin platform (profesores / alumnos / clases).
import { eq, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { profesores, alumnos, clases } from "@/lib/db/schema";

// --- Profesores ---
export function listProfesores() {
  return db.select().from(profesores).orderBy(desc(profesores.id)).all();
}
export function createProfesor(v: { nombre: string; email?: string; materia?: string }) {
  return db.insert(profesores).values(v).run();
}
export function deleteProfesor(id: number) {
  return db.delete(profesores).where(eq(profesores.id, id)).run();
}

// --- Clases (joined with profesor name) ---
export function listClases() {
  return db
    .select({
      id: clases.id,
      nombre: clases.nombre,
      grado: clases.grado,
      profesorId: clases.profesorId,
      profesorNombre: profesores.nombre,
    })
    .from(clases)
    .leftJoin(profesores, eq(clases.profesorId, profesores.id))
    .orderBy(desc(clases.id))
    .all();
}
export function createClase(v: { nombre: string; grado?: string; profesorId?: number }) {
  return db.insert(clases).values(v).run();
}
export function deleteClase(id: number) {
  return db.delete(clases).where(eq(clases.id, id)).run();
}

// --- Alumnos (joined with clase name) ---
export function listAlumnos() {
  return db
    .select({
      id: alumnos.id,
      nombre: alumnos.nombre,
      grado: alumnos.grado,
      claseId: alumnos.claseId,
      claseNombre: clases.nombre,
    })
    .from(alumnos)
    .leftJoin(clases, eq(alumnos.claseId, clases.id))
    .orderBy(desc(alumnos.id))
    .all();
}
export function createAlumno(v: { nombre: string; grado?: string; claseId?: number }) {
  return db.insert(alumnos).values(v).run();
}
export function deleteAlumno(id: number) {
  return db.delete(alumnos).where(eq(alumnos.id, id)).run();
}

// --- Counts for the overview ---
export function counts() {
  const one = (t: typeof profesores | typeof alumnos | typeof clases) =>
    (db.select({ n: sql<number>`count(*)` }).from(t).get()?.n ?? 0);
  return { profesores: one(profesores), alumnos: one(alumnos), clases: one(clases) };
}
