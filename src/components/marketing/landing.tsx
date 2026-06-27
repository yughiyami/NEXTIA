import Link from "next/link";

/* NEXTIA landing — "Raíces Educativas" design system (warm Peruvian: terracotta + deep blue).
   Server component, fully static. Brand tokens live in globals.css. */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-heading text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-brand">
      {children}
    </span>
  );
}

function PrimaryLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-heading text-sm font-bold text-white shadow-[0_8px_24px_rgba(154,52,18,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-600 ${className}`}
    >
      {children}
    </Link>
  );
}

function GhostLink({
  href,
  children,
  tone = "ink",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "sand";
  className?: string;
}) {
  const tones =
    tone === "sand"
      ? "border-white/40 text-sand hover:bg-white/10"
      : "border-ink/30 text-ink hover:bg-ink/5";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 font-heading text-sm font-bold transition-colors ${tones} ${className}`}
    >
      {children}
    </Link>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-verify-100 px-3 py-1 text-xs font-semibold text-verify">
      <CheckIcon className="h-3.5 w-3.5" /> Verificado
    </span>
  );
}

/* ---------- icons (inline, no deps) ---------- */
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WifiOffIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2 4l20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12.5a10 10 0 0 1 4-2.3M2.5 9a15 15 0 0 1 4-2.4M12 20h.01M8.5 16.4a5 5 0 0 1 5.6-1M16.5 12.7a10 10 0 0 1 5 .2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BoxIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 7l9 4 9-4M12 11v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TeacherIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- data ---------- */
const PROBLEMS = [
  { stat: "Miles", text: "de escuelas rurales sin internet estable ni conexión confiable." },
  { stat: "1 docente", text: "para un aula multigrado: prepara y califica solo, para varios grados a la vez." },
  { stat: "La nube falla", text: "donde más se necesita: las herramientas de IA educativa viven online." },
];

const PIEZAS = [
  { icon: BoxIcon, t: "LLM local (Gemma 3)", d: "Corre en la caja, sin nube. Costo marginal cero por consulta." },
  { icon: ShieldIcon, t: "LangGraph + verificador", d: "RAG sobre el currículo peruano → genera → capa que verifica antes de mostrar." },
  { icon: TeacherIcon, t: "Docente en el bucle", d: "El profesor ajusta y aprueba. Siempre tiene la última palabra." },
];

const PASOS = [
  { n: "1", t: "El profesor genera", d: "Elige tema y grado. La IA crea el ejercicio alineado al currículo y lo verifica." },
  { n: "2", t: "El alumno resuelve", d: "Desde su tablet o celular en la red local del aula. Sin internet." },
  { n: "3", t: "La IA califica", d: "Puntaje y retroalimentación en español. El docente ajusta y aprueba." },
  { n: "4", t: "Feedback al instante", d: "El alumno recibe su nota y su retroalimentación de inmediato." },
];

const DIFERENCIA = [
  { t: "Los datos no salen del aula", d: "Soberanía de datos: la información de los menores se queda en la escuela." },
  { t: "El verificador evita alucinaciones", d: "Una capa de seguridad revisa cada salida del modelo antes de mostrarla." },
  { t: "El docente manda", d: "No es 'ChatGPT para tareas'. Es infraestructura con el profesor al control." },
];

const B2G2C = [
  { k: "B2G", t: "El Estado / municipio / ONG compra la caja", d: "Hardware + licencia anual de currículo y soporte." },
  { k: "→", t: "Se instala en la escuela", d: "Se enchufa en el aula y sirve la plataforma por la red local." },
  { k: "2C", t: "El valor llega a docentes y familias", d: "Un aula con IA por años, sin factura de API por consulta." },
];

export function Landing() {
  return (
    <div className="flex min-h-full flex-col bg-sand font-body text-warm-gray">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-soft-border bg-sand/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <BoxIcon className="h-6 w-6 text-brand" />
            <span className="font-heading text-lg font-extrabold tracking-tight text-ink">aru</span>
          </div>
          <nav className="hidden items-center gap-7 font-heading text-sm font-semibold text-ink/80 md:flex">
            <a href="#como-funciona" className="hover:text-brand">Cómo funciona</a>
            <a href="#la-caja" className="hover:text-brand">La caja</a>
            <a href="#gobiernos" className="hover:text-brand">Para gobiernos</a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-verify-100 px-3 py-1 text-xs font-semibold text-verify sm:inline-flex">
              <WifiOffIcon className="h-3.5 w-3.5" /> Funciona sin internet
            </span>
            <PrimaryLink href="/login" className="px-5 py-2.5">Entrar</PrimaryLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-ink-900 text-sand">
        <div className="mx-auto grid max-w-[1120px] items-center gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="space-y-6">
            <span className="font-heading text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-brand-100">
              IA local · Sin internet
            </span>
            <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-sand md:text-[3.5rem]">
              Tutoría y calificación con IA para la escuela rural del Perú.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-sand/80">
              Un servidor en una caja corre <strong className="text-sand">Gemma</strong> localmente:
              genera ejercicios y califica con retroalimentación, totalmente <strong className="text-sand">offline</strong>.
              Los datos del niño nunca salen del aula.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <PrimaryLink href="/login">Ver la demo</PrimaryLink>
              <GhostLink href="/login" tone="sand">Entrar</GhostLink>
            </div>
            <p className="pt-2 text-sm text-sand/60">
              Sin nube · Sin factura por consulta · Currículo peruano
            </p>
          </div>

          {/* La caja, glowing */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 -z-0 rounded-full bg-brand/30 blur-3xl" aria-hidden />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-600 shadow-[0_20px_60px_rgba(194,65,12,0.45)]">
                <BoxIcon className="h-20 w-20 text-white" />
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-sand/80">
                <WifiOffIcon className="h-5 w-5" />
                <span className="font-heading text-sm font-bold">La caja · corre AHORA, sin wifi</span>
              </div>
              <div className="mt-4 flex justify-center">
                <VerifiedBadge />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem strip */}
      <section className="mx-auto max-w-[1120px] px-5 py-20">
        <Eyebrow>El problema</Eyebrow>
        <h2 className="mt-2 max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-ink">
          La IA educativa no llega a donde más se necesita.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.stat}
              className="rounded-2xl border border-soft-border bg-white p-7 shadow-[0_8px_30px_rgba(87,83,78,0.06)]"
            >
              <p className="font-heading text-2xl font-extrabold text-brand">{p.stat}</p>
              <p className="mt-2 leading-relaxed text-warm-gray">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution / La caja */}
      <section id="la-caja" className="bg-white py-20">
        <div className="mx-auto max-w-[1120px] px-5">
          <Eyebrow>La solución</Eyebrow>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-ink">
            Una caja que se enchufa en el aula. Adentro, todo lo necesario.
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-warm-gray">
            Inspirado en <em>“Small Models, Big Support”</em> (arXiv 2506.05925): modelos locales
            pequeños, RAG + CAG, una capa verificadora y el profesor en el bucle.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PIEZAS.map((p) => (
              <div
                key={p.t}
                className="rounded-2xl border border-soft-border bg-sand p-7 shadow-[0_8px_30px_rgba(87,83,78,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-ink">{p.t}</h3>
                <p className="mt-1.5 leading-relaxed text-warm-gray">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona — el bucle */}
      <section id="como-funciona" className="mx-auto max-w-[1120px] px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Cómo funciona</Eyebrow>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-ink">El bucle, en cuatro pasos.</h2>
          </div>
          <VerifiedBadge />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {PASOS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-soft-border bg-white p-6 shadow-[0_8px_30px_rgba(87,83,78,0.06)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sand font-heading text-base font-extrabold">
                {s.n}
              </div>
              <h3 className="mt-4 font-heading text-base font-bold text-ink">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-warm-gray">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Diferenciador */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1120px] px-5">
          <Eyebrow>El diferenciador</Eyebrow>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-ink">
            Offline-first real. Infraestructura soberana, no un chatbot.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DIFERENCIA.map((d) => (
              <div key={d.t} className="rounded-2xl border border-soft-border bg-sand p-7">
                <CheckIcon className="h-6 w-6 text-verify" />
                <h3 className="mt-4 font-heading text-lg font-bold text-ink">{d.t}</h3>
                <p className="mt-1.5 leading-relaxed text-warm-gray">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2G2C */}
      <section id="gobiernos" className="mx-auto max-w-[1120px] px-5 py-20">
        <Eyebrow>Modelo de negocio · B2G2C</Eyebrow>
        <h2 className="mt-2 max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-ink">
          Se vende al Estado. El valor llega al aula.
        </h2>
        <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3">
          {B2G2C.map((b) => (
            <div
              key={b.t}
              className="flex flex-col rounded-2xl border border-soft-border bg-white p-7 shadow-[0_8px_30px_rgba(87,83,78,0.06)]"
            >
              <span className="font-heading text-2xl font-extrabold text-brand">{b.k}</span>
              <h3 className="mt-3 font-heading text-lg font-bold text-ink">{b.t}</h3>
              <p className="mt-1.5 leading-relaxed text-warm-gray">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ask / CTA */}
      <section className="bg-brand">
        <div className="mx-auto max-w-[1120px] px-5 py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Buscamos un piloto: 1 UGEL, 10 cajas, 1 semestre.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/85">
            Medimos mejora de aprendizaje y descarga docente. Pruébalo ahora mismo con las cuentas demo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-heading text-sm font-bold text-brand shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
            >
              Entrar a la demo
            </Link>
          </div>
          <div className="mx-auto mt-8 inline-flex flex-wrap justify-center gap-x-6 gap-y-1 rounded-2xl bg-white/10 px-5 py-3 font-body text-sm text-white/90">
            <span><strong>Cuentas demo</strong> · contraseña <code className="rounded bg-white/20 px-1.5 py-0.5">nextia123</code></span>
            <span>admin@nextia.pe</span>
            <span>rosa@nextia.pe</span>
            <span>alumno@nextia.pe</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 text-sand/70">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <BoxIcon className="h-6 w-6 text-brand-100" />
            <span className="font-heading text-lg font-extrabold tracking-tight text-sand">aru</span>
          </div>
          <p className="text-sm">
            Hackathon NEXIA 2026 · Arequipa, Perú · 26–27 jun 2026
          </p>
          <p className="text-xs text-sand/50">
            Inspirado en “Small Models, Big Support” (arXiv 2506.05925).
          </p>
        </div>
      </footer>
    </div>
  );
}
