# NEXTIA — Site Vision

## 1. Vision

Public-facing surface for **NEXTIA** — "IA local en una caja para escuelas rurales del
Perú." The marketing landing sells the B2G2C story to judges, government/NGO buyers, and
educators: offline AI (Gemma) that generates exercises and grades with feedback, where the
child's data never leaves the school. The app itself (admin/profesor/alumno) lives behind
`/login`; these pages are the storefront + pitch.

Audience: hackathon judges (today), then UGEL/municipio/ONG decision-makers and teachers.
Tone: hopeful, trustworthy, sovereign, offline-proud. Language: **Spanish (es-PE)**.

## 2. Stitch Project

- **Project ID:** `2804362959394964426`
- **Resource:** `projects/2804362959394964426`
- Metadata persisted in `.stitch/metadata.json`.

## 3. Integration model

This is a **Next.js App Router** app, NOT a static `site/public/` site. Stitch output is a
staging reference: generated HTML lands in `.stitch/designs/{page}.html`, then is **ported
to React** under `src/app/(marketing)/` using the existing shadcn/Tailwind tokens. The raw
HTML is the design source of truth; the React port is production.

- Landing route: `/` (logged-out visitors). Logged-in users auto-route to their dashboard.
- Design tokens from `.stitch/DESIGN.md` (warm Peruvian: terracotta + deep blue).

## 4. Sitemap

- [x] `index` (landing `/`) — hero, problem, solution/the box, how-it-works loop, B2G2C,
      differentiator, offline proof, CTA → /login. **DONE** — ported to
      `src/components/marketing/landing.tsx`, rendered at `/` for logged-out users.
      Brand: aru, Geist font, Raíces Educativas palette.
- [ ] `diapos` (pitch deck) — web slide deck from `docs/pitch-nextia.md` (next). **NEXT**

## 5. Roadmap

1. **Landing** (`/`) — the pitch storefront. ← current
2. **Diapos / pitch deck** — web slides for the 90s pitch + 8-min demo guion.
3. Polish: mobile pass, "Verificado ✓" motif, contacto / ask section.

## 6. Creative Freedom (idea backlog)

- `/como-funciona` — deep dive on the LangGraph generate/grade loop + verifier.
- `/la-caja` — hardware/box story, offline-first, "los datos no salen del aula."
- `/para-gobiernos` — B2G procurement page (piloto: 1 UGEL, 10 cajas, 1 semestre).
- Demo accounts callout block (admin/profesor/alumno @nextia.pe).
