import { requireRole } from "@/lib/session";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AlumnoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("alumno");
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div>
          <p className="font-semibold">aru</p>
          <p className="text-xs text-muted-foreground">Hola, {user.name}</p>
        </div>
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-3xl p-6">{children}</main>
    </div>
  );
}
