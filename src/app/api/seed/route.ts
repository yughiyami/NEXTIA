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

  const userId = (r: unknown) =>
    (r as { user?: { id?: string } })?.user?.id ?? null;

  await auth.api.signUpEmail({
    body: { email: "admin@nextia.pe", password: "nextia123", name: "Administrador", role: "admin" },
  });
  const rosa = await auth.api.signUpEmail({
    body: { email: "rosa@nextia.pe", password: "nextia123", name: "Rosa Quispe", role: "profesor" },
  });
  const juan = await auth.api.signUpEmail({
    body: { email: "alumno@nextia.pe", password: "nextia123", name: "Juan Mamani", role: "alumno" },
  });

  const p = db.insert(profesores).values({ nombre: "Rosa Quispe", email: "rosa@nextia.pe", materia: "Matemática", userId: userId(rosa) }).run();
  const profesorId = Number(p.lastInsertRowid);
  const c = db.insert(clases).values({ nombre: "5to A", grado: "5to de primaria", profesorId }).run();
  const claseId = Number(c.lastInsertRowid);

  // First alumno is linked to the alumno login account; the rest are roster-only.
  db.insert(alumnos).values({ nombre: "Juan Mamani", grado: "5to de primaria", claseId, userId: userId(juan) }).run();
  for (const nombre of ["María Huamán", "Pedro Ccama", "Luz Apaza", "Diego Flores"]) {
    db.insert(alumnos).values({ nombre, grado: "5to de primaria", claseId }).run();
  }

  return NextResponse.json({
    seeded: true,
    admin: { email: "admin@nextia.pe", password: "nextia123" },
    profesor: { email: "rosa@nextia.pe", password: "nextia123" },
    alumno: { email: "alumno@nextia.pe", password: "nextia123" },
    clase: "5to A",
    alumnos: 5,
  });
}
