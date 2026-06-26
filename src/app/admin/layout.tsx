import Link from "next/link";
import { requireRole } from "@/lib/session";
import { LogoutButton } from "@/components/admin/logout-button";

const nav = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/profesores", label: "Profesores" },
  { href: "/admin/clases", label: "Clases" },
  { href: "/admin/alumnos", label: "Alumnos" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin");
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r bg-muted/30 p-4 flex flex-col gap-1">
        <div className="px-2 pb-4">
          <p className="text-lg font-semibold">NEXTIA</p>
          <p className="text-xs text-muted-foreground">Panel de administración</p>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t pt-3">
          <p className="px-2 text-sm font-medium">{user.name}</p>
          <p className="px-2 text-xs text-muted-foreground">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
