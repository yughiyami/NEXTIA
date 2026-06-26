import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sqlite } from "@/lib/db/client";
import { db } from "@/lib/db/client";
import { profesores, clases, alumnos } from "@/lib/db/schema";

export const runtime = "nodejs";

// Dev/demo seed: creates an admin user + sample school data. Idempotent — refuses
// if any user already exists. Call once: POST /api/seed.
export async function POST() {
  const userCount = (sqlite.prepare("SELECT count(*) AS n FROM user").get() as { n: number }).n;
  if (userCount > 0) {
    return NextResponse.json({ already: true, message: "Ya hay usuarios; no se vuelve a sembrar." });
  }

  await auth.api.signUpEmail({
    body: { email: "admin@nextia.pe", password: "nextia123", name: "Administrador", role: "admin" },
  });
  await auth.api.signUpEmail({
    body: { email: "rosa@nextia.pe", password: "nextia123", name: "Rosa Quispe", role: "profesor" },
  });

  const p = db.insert(profesores).values({ nombre: "Rosa Quispe", email: "rosa@nextia.pe", materia: "Matemática" }).run();
  const profesorId = Number(p.lastInsertRowid);
  const c = db.insert(clases).values({ nombre: "5to A", grado: "5to de primaria", profesorId }).run();
  const claseId = Number(c.lastInsertRowid);
  for (const nombre of ["Juan Mamani", "María Huamán", "Pedro Ccama", "Luz Apaza", "Diego Flores"]) {
    db.insert(alumnos).values({ nombre, grado: "5to de primaria", claseId }).run();
  }

  return NextResponse.json({
    seeded: true,
    admin: { email: "admin@nextia.pe", password: "nextia123" },
    profesor: { email: "rosa@nextia.pe", password: "nextia123" },
    clase: "5to A",
    alumnos: 5,
  });
}
