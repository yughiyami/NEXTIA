import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// Route by role. Only the admin surface exists so far; profesor/alumno come next.
export default async function Home() {
  const s = await getSession();
  if (!s?.user) redirect("/login");
  const role = (s.user as { role?: string }).role ?? "alumno";
  if (role === "admin") redirect("/admin");
  // TODO: /profesor and /alumno surfaces (step 4b)
  redirect("/admin");
}
