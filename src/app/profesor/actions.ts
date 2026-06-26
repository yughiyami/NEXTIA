"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { createAsignacion, saveNota } from "@/lib/data/teach";

function str(fd: FormData, k: string) {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
}
function num(fd: FormData, k: string) {
  const v = str(fd, k);
  return v ? Number(v) : undefined;
}

export async function guardarAsignacion(fd: FormData) {
  const user = await requireRole("profesor", "admin");
  const titulo = str(fd, "titulo");
  const enunciado = str(fd, "enunciado");
  if (!titulo || !enunciado) return;
  createAsignacion({
    claseId: num(fd, "claseId"),
    titulo,
    enunciado,
    rubricaJson: str(fd, "rubricaJson") || undefined,
    materia: str(fd, "materia") || undefined,
    grado: str(fd, "grado") || undefined,
    creadoPor: user.id,
  });
  revalidatePath("/profesor");
  redirect("/profesor");
}

export async function calificarEntrega(fd: FormData) {
  await requireRole("profesor", "admin");
  const entregaId = num(fd, "entregaId");
  if (!entregaId) return;
  const puntaje = Math.max(0, Math.min(100, num(fd, "puntaje") ?? 0));
  saveNota({
    entregaId,
    puntaje,
    feedback: str(fd, "feedback"),
    verificado: str(fd, "verificado") === "1",
    overrideProfesor: str(fd, "override") === "1",
  });
  revalidatePath("/profesor/calificar");
  redirect("/profesor/calificar");
}
