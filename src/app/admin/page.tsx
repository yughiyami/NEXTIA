import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { counts } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export default function AdminOverview() {
  const c = counts();
  const items = [
    { label: "Profesores", n: c.profesores, href: "/admin/profesores" },
    { label: "Clases", n: c.clases, href: "/admin/clases" },
    { label: "Alumnos", n: c.alumnos, href: "/admin/alumnos" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Resumen</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de la escuela en la caja aru — todo local, sin internet.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((i) => (
          <Link key={i.href} href={i.href}>
            <Card className="transition-colors hover:bg-accent/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{i.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{i.n}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
