# NEXTIA — Design Spec

**Date:** 2026-06-26
**Event:** Hackathon NEXIA 2026 (Build with AI) — Arequipa, Perú · 26–27 jun 2026
**Team contact (git):** issacysofia@gmail.com
**Repo:** https://github.com/yughiyami/NEXTIA

---

## 1. One-liner

Local **Gemma** AI server-in-a-box for rural Peruvian schools. A government/NGO buys the
box, installs it in a school, and it gives teachers offline AI **exercise generation** and
**auto-grading + feedback** — no reliable internet required. Business model: **B2G2C**.

## 2. Problem & context

Rural Peru: weak/no internet, few teachers per student, little personalized feedback.
Cloud LLM tools fail there (cost, connectivity, data privacy of minors). Inspiration paper:
*"Small Models, Big Support: A Local LLM Framework for Educator-Centric Content Creation and
Assessment with RAG and CAG"* (arXiv 2506.05925v2) — small local models (3B–7B) that support
**teachers**, RAG + CAG, a verifier LLM safety layer, teacher-in-the-loop refinement.

Reference projects studied: **OptiLearn** (offline-first laptop-as-server LMS, LAN access,
multilingual — pitch/box framing) and **localmind** (Next.js + Node agent modules +
modelRouter + subject-organized RAG corpus — structural skeleton).

## 3. Hackathon fit

- **Track:** Evaluación Inteligente y Feedback en Tiempo Real (+ Propuesta Libre).
- **Judging (6 criteria):** Innovación, Uso de IA, Viabilidad, Modelo de negocio /
  sostenibilidad, Calidad del prototipo, Calidad del pitch.
- **Deliverable:** working MVP + 8-min pitch, demo Sat 27 ~10:30.
- Differentiator vs cloud edtech: **offline, local, private, sovereign** + a real B2G2C
  go-to-market (sell the box to the State / regional gov).

## 4. Scope (MVP, ruthless YAGNI)

In scope:
1. **GENERATE** flow — teacher picks topic/level → AI generates exercises grounded in the
   local Peru curriculum (RAG) + style/rubric (CAG) → verifier → teacher edits → assign.
2. **GRADE** flow — student open answer + rubric → AI grades + gives feedback → verifier →
   teacher overrides → save grade.
3. **Platform** — real CRUD for `profesores`, `alumnos`, `clases`, `asignaciones`,
   `entregas`, `notas`. Three surfaces: Admin/Director, Profesor, Alumno.
4. **Offline demo** — runs fully on the laptop ("the box") via local Ollama Gemma.

Out of scope (roadmap / pitch slides): physical hardware box, multi-school gov console,
LAN/mDNS auto-discovery, TTS/STT, fine-tuning, full auth/RBAC, billing.

## 5. Architecture

Single **Next.js** app (App Router, TypeScript, Tailwind). One repo = "the box":
`next start` + Ollama on one laptop = the whole product.

```
Next.js (UI + route handlers / server actions)
   │
   ├── LangGraph TS — two graphs (paper's flow)
   │     ├── GENERATE: topic → retrieve(RAG) → CAG(rúbrica/objetivos)
   │     │             → Gemma genera ejercicios → verifier LLM → out
   │     └── GRADE:    respuesta + rúbrica → retrieve → Gemma califica + feedback
   │                   → verifier LLM → out
   │
   ├── modelRouter — LLM provider abstraction (one interface, swappable)
   │     ├── Ollama  (local: gemma3:4b / qwen3:4b)   ← "the box" / partner's local work
   │     └── Gemini  (API, dev + fallback)            ← env GEMINI_API_KEY
   │
   └── ONE SQLite file (better-sqlite3 + sqlite-vec)
         ├── platform tables: profesores, alumnos, clases, asignaciones, entregas, notas
         └── rag_chunks(text, embedding) — curriculum chunks, embedded via
             Ollama nomic-embed-text (Gemini embeddings fallback)
```

**Key design choice:** one SQLite file holds **both** platform data and RAG vectors → clean
"everything lives in the box, nothing leaves the school" story; trivial backup/restore.

### 5.1 Modules & boundaries

| Module | Purpose | Depends on |
|---|---|---|
| `lib/llm/modelRouter.ts` | Uniform `generate()/chat()` over Ollama + Gemini; env-selected | provider SDKs |
| `lib/llm/providers/{ollama,gemini}.ts` | Provider impls | — |
| `lib/rag/store.ts` | Embed, upsert, kNN search over `rag_chunks` (sqlite-vec) | db, modelRouter (embeddings) |
| `lib/rag/ingest.ts` | Chunk + embed curriculum `.txt` into store | store |
| `lib/graphs/generate.ts` | LangGraph GENERATE graph | rag, modelRouter, prompts |
| `lib/graphs/grade.ts` | LangGraph GRADE graph | rag, modelRouter, prompts |
| `lib/graphs/verifier.ts` | Shared verifier node (safety/pedagogy/relevance) | modelRouter |
| `lib/prompts/*.ts` | CAG prompt templates (es-PE) | — |
| `lib/db/{schema,client,seed}.ts` | better-sqlite3 + Drizzle schema, seed | better-sqlite3 |
| `app/api/*` | Route handlers calling graphs + CRUD | graphs, db |
| `app/(admin|profesor|alumno)/*` | UI surfaces (Spanish) | api |

Each unit testable in isolation: a graph is a pure `invoke(input) → output`; the router hides
the provider; the store hides the vector math.

## 6. Data model (SQLite)

- `profesores(id, nombre, email, materia)`
- `alumnos(id, nombre, grado, clase_id)`
- `clases(id, nombre, grado, profesor_id)`
- `asignaciones(id, clase_id, titulo, enunciado, rubrica_json, creado_por, creado_en)`
- `entregas(id, asignacion_id, alumno_id, respuesta, estado, creado_en)`
- `notas(id, entrega_id, puntaje, feedback, verificado, override_profesor, creado_en)`
- `rag_chunks(id, fuente, texto, embedding)` (+ sqlite-vec index)

## 7. Data flow

GENERATE: profesor form → `POST /api/generate` → GENERATE graph (retrieve curriculum →
CAG prompt → Gemma → verifier) → preview → save as `asignacion`.

GRADE: alumno submits `entrega` → `POST /api/grade` → GRADE graph (retrieve → grade prompt →
Gemma → verifier) → `nota` (feedback + puntaje) → profesor can override.

## 8. Error handling

- modelRouter: if Ollama unreachable → fall back to Gemini (and surface which provider ran).
- RAG: if no chunk over similarity threshold → proceed CAG-only, flag "sin contexto".
- Verifier: if it flags output → block + ask regeneration (teacher-in-the-loop).
- All LLM calls timeout-guarded; UI shows streaming + graceful failure.

## 9. Testing

- Unit: modelRouter provider switch (mock), rag store kNN, graph nodes with stubbed LLM.
- Smoke: ingest sample curriculum → generate → grade end-to-end against local Ollama.
- Demo rehearsal: full offline run (wifi off) before pitch.

## 10. Build order (de-risks "both flows + CRUD" in 24h)

1. Scaffold Next.js + Tailwind + modelRouter + Ollama hello-world (provable AI fast).
2. RAG ingest + GENERATE graph (hero #1) + minimal profesor page.
3. GRADE graph (hero #2) + alumno page.
4. SQLite schema + seed + Admin/Profesor CRUD + wiring.
5. Polish, Spanish copy, offline rehearsal, pitch deck.

## 11. Tech stack

Next.js 15 (App Router, TS) · Tailwind · `@langchain/langgraph` + `@langchain/core` ·
better-sqlite3 + Drizzle + sqlite-vec · Ollama (`gemma3:4b`, `nomic-embed-text`) ·
`@google/genai` (Gemini fallback).

## 12. Roadmap (pitch slide, not built)

Hardware box (mini-PC) · gov multi-school admin console · LAN/mDNS student access · offline
sync between box and ministry · TTS/STT for low-literacy · fine-tuned es-PE rural model.
