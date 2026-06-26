// Domain tables (Drizzle). Better Auth manages its own tables (user, session,
// account, verification) via its CLI migrate on the SAME sqlite file, so they
// are intentionally NOT defined here. RAG vectors live in a sqlite-vec virtual
// table managed by lib/rag/store.ts (also not a Drizzle table).
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const now = sql`(unixepoch())`;

export const profesores = sqliteTable("profesores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id"), // optional link to Better Auth user.id
  nombre: text("nombre").notNull(),
  email: text("email"),
  materia: text("materia"),
  creadoEn: integer("creado_en").notNull().default(now),
});

export const clases = sqliteTable("clases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  grado: text("grado"),
  profesorId: integer("profesor_id").references(() => profesores.id),
  creadoEn: integer("creado_en").notNull().default(now),
});

export const alumnos = sqliteTable("alumnos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id"), // optional link to Better Auth user.id
  nombre: text("nombre").notNull(),
  grado: text("grado"),
  claseId: integer("clase_id").references(() => clases.id),
  creadoEn: integer("creado_en").notNull().default(now),
});

export const asignaciones = sqliteTable("asignaciones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  claseId: integer("clase_id").references(() => clases.id),
  titulo: text("titulo").notNull(),
  enunciado: text("enunciado").notNull(),
  rubricaJson: text("rubrica_json"), // JSON string: criteria + points
  materia: text("materia"),
  grado: text("grado"),
  creadoPor: text("creado_por"), // user.id
  creadoEn: integer("creado_en").notNull().default(now),
});

export const entregas = sqliteTable("entregas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  asignacionId: integer("asignacion_id")
    .notNull()
    .references(() => asignaciones.id),
  alumnoId: integer("alumno_id").references(() => alumnos.id),
  respuesta: text("respuesta").notNull(),
  estado: text("estado").notNull().default("pendiente"), // pendiente|calificada
  creadoEn: integer("creado_en").notNull().default(now),
});

export const notas = sqliteTable("notas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entregaId: integer("entrega_id")
    .notNull()
    .references(() => entregas.id),
  puntaje: integer("puntaje"), // 0-100
  feedback: text("feedback"),
  verificado: integer("verificado", { mode: "boolean" }).default(false),
  overrideProfesor: integer("override_profesor", { mode: "boolean" }).default(
    false,
  ),
  creadoEn: integer("creado_en").notNull().default(now),
});

export type Profesor = typeof profesores.$inferSelect;
export type Alumno = typeof alumnos.$inferSelect;
export type Clase = typeof clases.$inferSelect;
export type Asignacion = typeof asignaciones.$inferSelect;
export type Entrega = typeof entregas.$inferSelect;
export type Nota = typeof notas.$inferSelect;
