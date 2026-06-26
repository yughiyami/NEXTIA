// Creates domain tables + the sqlite-vec RAG table on the shared box DB.
// Better Auth owns user/session/account/verification (via its CLI migrate);
// this owns everything else. Idempotent (IF NOT EXISTS).
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";

const DB_PATH = process.env.DB_PATH ?? "data/nextia.db";
const EMBED_DIM = 768;

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
sqliteVec.load(db);

db.exec(`
CREATE TABLE IF NOT EXISTS profesores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  nombre TEXT NOT NULL,
  email TEXT,
  materia TEXT,
  creado_en INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS clases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  grado TEXT,
  profesor_id INTEGER REFERENCES profesores(id),
  creado_en INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS alumnos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  nombre TEXT NOT NULL,
  grado TEXT,
  clase_id INTEGER REFERENCES clases(id),
  creado_en INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS asignaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clase_id INTEGER REFERENCES clases(id),
  titulo TEXT NOT NULL,
  enunciado TEXT NOT NULL,
  rubrica_json TEXT,
  materia TEXT,
  grado TEXT,
  creado_por TEXT,
  creado_en INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS entregas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asignacion_id INTEGER NOT NULL REFERENCES asignaciones(id),
  alumno_id INTEGER REFERENCES alumnos(id),
  respuesta TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  creado_en INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS notas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entrega_id INTEGER NOT NULL REFERENCES entregas(id),
  puntaje INTEGER,
  feedback TEXT,
  verificado INTEGER DEFAULT 0,
  override_profesor INTEGER DEFAULT 0,
  creado_en INTEGER NOT NULL DEFAULT (unixepoch())
);

-- RAG: content rows + a sqlite-vec virtual table keyed by the same rowid.
CREATE TABLE IF NOT EXISTS rag_chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fuente TEXT,
  materia TEXT,
  grado TEXT,
  texto TEXT NOT NULL
);
`);

db.exec(
  `CREATE VIRTUAL TABLE IF NOT EXISTS rag_vec USING vec0(embedding float[${EMBED_DIM}]);`,
);

const tables = db
  .prepare("select name from sqlite_master where type in ('table','virtual') order by name")
  .all()
  .map((r) => r.name);
console.log("DB ready at", DB_PATH);
console.log("tables:", tables.join(", "));
db.close();
