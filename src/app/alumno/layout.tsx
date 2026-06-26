import Link from "next/link";
import { requireRole } from "@/lib/session";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AlumnoLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("alumno");
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r bg-muted/30 p-4 flex flex-col gap-1">
        <div className="px-2 pb-4">
          <p className="text-lg font-semibold">NEXTIA</p>
          <p className="text-xs text-muted-foreground">Tutor inteligente</p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link
            href="/alumno/chat"
            className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            Tutor IA
          </Link>
        </nav>
        <div className="mt-auto border-t pt-3">
          <p className="px-2 text-sm font-medium">{user.name}</p>
          <p className="px-2 text-xs text-muted-foreground">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
