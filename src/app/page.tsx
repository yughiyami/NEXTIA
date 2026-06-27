import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Landing } from "@/components/marketing/landing";

export const dynamic = "force-dynamic";

// Logged-in users go to their role dashboard; everyone else sees the public landing.
export default async function Home() {
  const s = await getSession();
  if (s?.user) {
    const role = (s.user as { role?: string }).role ?? "alumno";
    if (role === "admin") redirect("/admin");
    if (role === "profesor") redirect("/profesor");
    redirect("/alumno");
  }
  return <Landing />;
}
