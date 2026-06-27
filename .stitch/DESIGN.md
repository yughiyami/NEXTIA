# NEXTIA — Design System

Warm, optimistic, human. "Educación con IA para la escuela rural del Perú."
Not a cold SaaS dashboard — a hopeful, trustworthy public-good product. Terracotta
warmth (earth, Andes, human) + deep blue ink (trust, sovereignty, infrastructure).

---

## 1. Brand personality

- **Hopeful & human** — kids, teachers, rural classrooms. Never sterile.
- **Trustworthy & sovereign** — "los datos no salen del aula." Solid, grounded.
- **Offline-proud** — the differentiator. Lean into "funciona sin internet."
- Language: **Spanish (es-PE)**. Warm, direct, plain. No corporate jargon.

## 2. Color tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--brand` (terracotta) | `#C2410C` | Primary actions, accents, highlights |
| `--brand-600` | `#9A3412` | Hover / pressed |
| `--brand-100` | `#FFEDD5` | Soft fills, badge backgrounds |
| `--ink` (deep blue) | `#1E3A8A` | Headings, dark sections, secondary CTA |
| `--ink-900` | `#172554` | Darkest section backgrounds |
| `--sand` | `#FFFBF5` | Page background (warm off-white) |
| `--card` | `#FFFFFF` | Cards |
| `--muted-text` | `#57534E` | Secondary text (warm gray) |
| `--success` | `#15803D` | "Verificado ✓" badge, offline-ok states |
| `--border` | `#F0E7DC` | Hairline borders on sand |

Dark sections (hero band / footer): bg `--ink-900`, text `#FFFBF5`, accent terracotta.

## 3. Typography

- **Headings:** geometric/humanist sans, bold, tight tracking. Big and confident.
  H1 clamp(2.5rem, 5vw, 4rem), weight 800. H2 ~2rem weight 700.
- **Body:** clean sans, 1.05–1.15rem, line-height 1.6, color `--muted-text`.
- **Eyebrow/labels:** uppercase, letter-spacing 0.08em, 0.8rem, terracotta.
- One font family (**Geist** — the app's existing font) across the board — keep it tight.
  (Stitch's auto system proposed Montserrat/Be Vietnam Pro; we standardize on Geist to
  match the rest of the aru app.)

## 4. Shape & spacing

- **Roundness:** generous. Cards `rounded-2xl` (16px), buttons `rounded-xl` (12px),
  pills/badges fully round.
- **Shadows:** soft, warm, low (`0 8px 30px rgba(154,52,18,0.08)`). No harsh black.
- **Spacing:** roomy. Section padding `py-20` to `py-28`. Max content width ~1120px.
- **Grid:** generous gaps (`gap-6`/`gap-8`), 3-col feature grids on desktop, 1-col mobile.

## 5. Components

- **Primary button:** terracotta bg, white text, `rounded-xl`, `px-6 py-3`, bold,
  soft shadow, slight lift on hover.
- **Secondary button:** deep-blue outline or ghost, terracotta text on light.
- **Badge:** pill, `--brand-100` bg + terracotta text; success variant green.
- **Card:** white, `rounded-2xl`, `--border` hairline, soft shadow, `p-6`/`p-8`.
- **Section eyebrow:** small uppercase terracotta label above each H2.
- **Stat block:** big terracotta number + small warm-gray caption.

## 6. Design System Notes for Stitch Generation (COPY THIS BLOCK INTO PROMPTS)

> **DESIGN SYSTEM (REQUIRED — match exactly):**
> Warm, optimistic, human education product for rural Peru. Spanish (es-PE) copy.
> Colors: primary **terracotta `#C2410C`** (CTAs, accents), ink **deep blue `#1E3A8A`**
> (headings, dark bands), page background warm off-white `#FFFBF5`, cards white,
> secondary text warm gray `#57534E`, success green `#15803D`, soft borders `#F0E7DC`.
> Dark hero/footer bands use deep navy `#172554` with off-white text and terracotta accents.
> Typography: bold geometric sans headings (weight 800, big, tight tracking), clean body
> at 1.6 line-height, small UPPERCASE terracotta eyebrows above section titles.
> Shape: generous roundness (cards rounded-2xl/16px, buttons rounded-xl/12px, fully-round
> pills), soft warm low shadows (never harsh black), roomy spacing (py-20+ sections,
> max width ~1120px). Buttons: terracotta primary with white text + soft lift on hover;
> ghost/outline secondary in deep blue. Badges are pills (terracotta-on-cream, or
> green for "Verificado ✓"). Feeling: hopeful, trustworthy, sovereign, offline-proud —
> NOT a cold SaaS dashboard. Mobile-first responsive, accessible contrast.
