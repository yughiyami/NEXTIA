---
page: diapos
deviceType: DESKTOP
---
A web **slide deck** ("diapos") for the aru pitch — the 90-second pitch + 8-min demo guion
from `docs/pitch-nextia.md`. A full-screen, keyboard-navigable deck (←/→), one slide per
viewport, big bold type, designed to project on stage. All copy in **Spanish (es-PE)**.
Route: `/diapos`. Brand name is **aru** (not NEXTIA). Font: **Geist**.

**DESIGN SYSTEM (REQUIRED — match exactly):**
Warm, optimistic, human education product for rural Peru. Spanish (es-PE) copy.
Colors: primary terracotta `#C2410C` (accents), ink deep blue `#1E3A8A` (headings),
page bg warm off-white `#FFFBF5`, dark slides deep navy `#172554` with off-white text and
terracotta accents, success green `#15803D` for "Verificado ✓", soft borders `#F0E7DC`.
Typography: **Geist** everywhere — bold/extrabold big headings, clean body at 1.6 line
height, small UPPERCASE terracotta eyebrows. Generous roundness, soft warm low shadows,
roomy spacing, max width ~1120px. Hopeful, trustworthy, sovereign, offline-proud.

**Slides (one per screen, ~10):**
1. **Portada** — aru wordmark, tagline "IA local en una caja para la escuela rural del
   Perú", "Hackathon NEXIA 2026 · Arequipa", green pill "Funciona sin internet".
2. **Una línea** — big statement: servidor-en-una-caja con IA local (Gemma) que lleva
   tutoría y calificación a escuelas rurales — sin internet.
3. **Problema** — escuelas sin internet, aula multigrado, IA en la nube inservible donde
   más se necesita.
4. **Solución / la caja** — LLM local (Gemma 3), LangGraph + verificador, base de datos del
   colegio, plataforma por LAN. Diagram.
5. **El bucle** — 4 pasos: generar (verificado) → resolver → calificar (docente ajusta) →
   feedback al instante.
6. **Diferenciador** — offline-first real; datos no salen del aula; verificador; docente
   manda. "No es ChatGPT para tareas — es infraestructura soberana."
7. **Negocio — B2G2C** — el Estado compra la caja → escuela → docentes y familias.
   Hardware + licencia anual; costo marginal cero por consulta.
8. **Demo guion** — apaga wifi → profesor genera → alumno resuelve → calificar con IA →
   alumno ve nota. Plan B: asignación sembrada "Suma de fracciones" 5to A.
9. **Ask** — piloto: 1 UGEL, 10 cajas, 1 semestre. Medir aprendizaje y descarga docente.
10. **Cierre** — "Sin internet. Modelo local. Currículo peruano. El docente manda. Esto es
    una caja, en cada aula rural." aru wordmark.

**Integration:** port to React at `src/app/diapos/page.tsx` (client component for keyboard
nav), reuse the brand tokens already in `globals.css`. Public route (no auth).
