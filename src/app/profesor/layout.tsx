import Link from "next/link";
import { requireRole } from "@/lib/session";
import { LogoutButton } from "@/components/admin/logout-button";

const nav = [
  { href: "/profesor", label: "Resumen" },
  { href: "/profesor/generar", label: "Generar ejercicio" },
  { href: "/profesor/calificar", label: "Calificar" },
];

export default async function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("profesor", "admin");
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col gap-1 border-r bg-muted/30 p-4">
        <div className="px-2 pb-4">
          <p className="text-lg font-semibold">NEXTIA</p>
          <p className="text-xs text-muted-foreground">Panel del profesor</p>
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
