"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import { createEntrega, getAlumnoByUserId, yaEntrego } from "@/lib/data/learn";

export async function enviarRespuesta(fd: FormData) {
  const user = await requireRole("alumno");
  const alumno = getAlumnoByUserId(user.id);
  if (!alumno) return;
  const asignacionId = Number(fd.get("asignacionId"));
  const respuesta = String(fd.get("respuesta") ?? "").trim();
  if (!asignacionId || !respuesta) return;
  // Idempotent: one submission per assignment per alumno.
  if (yaEntrego(asignacionId, alumno.id)) return;
  createEntrega({ asignacionId, alumnoId: alumno.id, respuesta });
  revalidatePath("/alumno");
}
