# NEXTIA

**IA local en una caja para escuelas rurales del Perú.** Un servidor con **Gemma** que
funciona sin internet: genera ejercicios y califica respuestas con retroalimentación al
instante, basándose en el currículo local. Modelo de negocio **B2G2C**.

> Hackathon NEXIA 2026 (Build with AI) — Arequipa, Perú · 26–27 jun 2026
> Track: *Evaluación Inteligente y Feedback en Tiempo Real*.

## Idea

El Estado / una ONG compra la **caja** → la instala en una escuela → los profesores obtienen
IA para **generar ejercicios** y **calificar con feedback**, todo **offline** y privado. Los
datos de los menores nunca salen de la escuela.

Inspirado en el paper *"Small Models, Big Support"* (arXiv 2506.05925v2): modelos locales
pequeños (3B–7B), RAG + CAG, capa verificadora de seguridad y profesor en el bucle.

## Arquitectura

```
Next.js (UI + API)
  ├── LangGraph TS:  GENERATE (genera ejercicios)  ·  GRADE (califica + feedback)
  ├── modelRouter:   Ollama (Gemma local)  +  Gemini (API, fallback)
  └── SQLite (better-sqlite3 + sqlite-vec):  plataforma  +  vectores RAG  (un solo archivo)
```

Todo corre en **un laptop** = "la caja". `next start` + Ollama, sin internet.

## Stack

Next.js 15 · TypeScript · Tailwind · `@langchain/langgraph` · better-sqlite3 + Drizzle +
sqlite-vec · Ollama (`gemma3:4b`, `nomic-embed-text`) · Gemini (fallback).

## Estado

🚧 En construcción durante el hackathon. Ver diseño completo en
[`docs/superpowers/specs/2026-06-26-nextia-design.md`](docs/superpowers/specs/2026-06-26-nextia-design.md).

## Setup (próximamente)

```bash
pnpm install
ollama pull gemma3:4b && ollama pull nomic-embed-text
cp .env.example .env   # GEMINI_API_KEY opcional (fallback)
pnpm dev
```
