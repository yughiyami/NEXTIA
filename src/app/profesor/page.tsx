import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db/client";
import { clases, alumnos, asignaciones } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfesorResumen() {
  const s = await getSession();
  const totalClases = db.select({ n: count() }).from(clases).all()[0]?.n ?? 0;
  const totalAlumnos = db.select({ n: count() }).from(alumnos).all()[0]?.n ?? 0;
  const totalAsignaciones = db.select({ n: count() }).from(asignaciones).all()[0]?.n ?? 0;

  const items = [
    { label: "Clases", n: totalClases, href: "#" },
    { label: "Alumnos", n: totalAlumnos, href: "#" },
    { label: "Asignaciones", n: totalAsignaciones, href: "/profesor/generar" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bienvenido, {s?.user?.name}</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus clases, genera ejercicios con IA y califica respuestas.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((i) => (
          <Link key={i.label} href={i.href}>
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
