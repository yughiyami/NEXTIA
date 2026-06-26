// Single SQLite connection for the whole box: shared by Better Auth (its own
// tables) and Drizzle (domain tables), with sqlite-vec loaded for RAG vectors.
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "@/lib/env";
import * as schema from "./schema";

declare global {
  // Reuse across Next.js HMR reloads so we don't open many connections.
  // eslint-disable-next-line no-var
  var __nextiaSqlite: Database.Database | undefined;
}

function open(): Database.Database {
  mkdirSync(dirname(env.dbPath), { recursive: true });
  const db = new Database(env.dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  sqliteVec.load(db);
  return db;
}

export const sqlite: Database.Database =
  global.__nextiaSqlite ?? (global.__nextiaSqlite = open());

export const db = drizzle(sqlite, { schema });
