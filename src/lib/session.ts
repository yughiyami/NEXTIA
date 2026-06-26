import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Role = "admin" | "profesor" | "alumno";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Returns the user or redirects to /login. */
export async function requireUser() {
  const s = await getSession();
  if (!s?.user) redirect("/login");
  return s.user;
}

/** Requires one of the given roles, else redirects. */
export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  const role = (user as { role?: string }).role ?? "alumno";
  if (!roles.includes(role as Role)) redirect("/login?denegado=1");
  return user as typeof user & { role: Role };
}
