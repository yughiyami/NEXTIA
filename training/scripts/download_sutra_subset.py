"""
Descarga un subconjunto del dataset Sutra 10B (pedagogical pretraining)
y lo convierte al formato chat para fine-tuning.

Uso:
    pip install datasets
    python scripts/download_sutra_subset.py

Esto descargará SOLO 1000 ejemplos (aproximadamente 1-2 MB).
Para descargar más, cambia el valor de MAX_SAMPLES.
"""

import json
import sys
from pathlib import Path

try:
    from datasets import load_dataset
except ImportError:
    print("Error: necesitas instalar 'datasets': pip install datasets")
    sys.exit(1)

SUTRA_DATASET = "sutra-ai/sutra-10b-pretrain"
MAX_SAMPLES = 1000
OUTPUT_PATH = "data/sutra_subset.jsonl"

SYSTEM_PROMPT = (
    "Eres NEXTIA-Tutor, un asistente pedagógico paciente para "
    "estudiantes peruanos de escuela rural. Explicas con lenguaje "
    "sencillo y ejemplos de la vida cotidiana."
)


def convert_sutra_to_chat(entry: dict) -> dict | None:
    """Convierte una entrada de Sutra a formato chat."""
    try:
        content = entry.get("text", "") or entry.get("content", "") or ""
        if not content or len(content) < 50:
            return None

        return {
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Explícame sobre: {content[:200]}...",
                },
                {
                    "role": "assistant",
                    "content": content[:1024],
                },
            ]
        }
    except Exception:
        return None


def main():
    print("=" * 60)
    print("Descarga de subconjunto Sutra 10B")
    print("=" * 60)

    print(f"\nDataset: {SUTRA_DATASET}")
    print(f"Muestras: {MAX_SAMPLES}")

    print("\n[1/2] Descargando desde Hugging Face...")
    try:
        dataset = load_dataset(SUTRA_DATASET, split="train", streaming=True)
    except Exception as e:
        print(f"Error descargando el dataset: {e}")
        print("\nUsando dataset local de respaldo (training/data/dataset.jsonl)")
        print("El fine-tuning funcionará igual con los datos de ejemplo.")
        return

    print(f"[2/2] Convirtiendo y guardando {MAX_SAMPLES} ejemplos...")

    output_path = Path(OUTPUT_PATH)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    count = 0
    with open(output_path, "w", encoding="utf-8") as f:
        for i, entry in enumerate(dataset):
            if i >= MAX_SAMPLES:
                break
            converted = convert_sutra_to_chat(entry)
            if converted:
                f.write(json.dumps(converted, ensure_ascii=False) + "\n")
                count += 1

            if (i + 1) % 100 == 0:
                print(f"  Procesados: {i + 1} / {MAX_SAMPLES} (guardados: {count})")

    print(f"\n✅ Guardados {count} ejemplos en {OUTPUT_PATH}")
    print(f"   Tamaño: {output_path.stat().st_size / 1024:.1f} KB")
    print("\n   Luego ejecuta: python scripts/finetune.py")


if __name__ == "__main__":
    main()
