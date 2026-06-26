"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import * as data from "@/lib/data/admin";

function str(fd: FormData, k: string) {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
}
function num(fd: FormData, k: string) {
  const v = str(fd, k);
  return v ? Number(v) : undefined;
}

export async function addProfesor(fd: FormData) {
  await requireRole("admin");
  const nombre = str(fd, "nombre");
  if (!nombre) return;
  data.createProfesor({ nombre, email: str(fd, "email") || undefined, materia: str(fd, "materia") || undefined });
  revalidatePath("/admin/profesores");
}
export async function removeProfesor(fd: FormData) {
  await requireRole("admin");
  const id = num(fd, "id");
  if (id) data.deleteProfesor(id);
  revalidatePath("/admin/profesores");
}

export async function addClase(fd: FormData) {
  await requireRole("admin");
  const nombre = str(fd, "nombre");
  if (!nombre) return;
  data.createClase({ nombre, grado: str(fd, "grado") || undefined, profesorId: num(fd, "profesorId") });
  revalidatePath("/admin/clases");
}
export async function removeClase(fd: FormData) {
  await requireRole("admin");
  const id = num(fd, "id");
  if (id) data.deleteClase(id);
  revalidatePath("/admin/clases");
}

export async function addAlumno(fd: FormData) {
  await requireRole("admin");
  const nombre = str(fd, "nombre");
  if (!nombre) return;
  data.createAlumno({ nombre, grado: str(fd, "grado") || undefined, claseId: num(fd, "claseId") });
  revalidatePath("/admin/alumnos");
}
export async function removeAlumno(fd: FormData) {
  await requireRole("admin");
  const id = num(fd, "id");
  if (id) data.deleteAlumno(id);
  revalidatePath("/admin/alumnos");
}
