"""
Fine-tuning LoRA para NEXTIA-Tutor usando Unsloth + Gemma 3 4B.

Uso:
    pip install unsloth torch transformers datasets trl
    python scripts/finetune.py

Requiere GPU con al menos 6 GB VRAM (o CPU con suficiente RAM para QLoRA 4-bit).
"""

import sys
import json
import torch
from datasets import Dataset
from unsloth import FastLanguageModel
from transformers import TrainingArguments
from trl import SFTTrainer

MODEL_NAME = "unsloth/gemma-3-4b-it-bnb-4bit"
DATASET_PATH = "data/dataset.jsonl"
OUTPUT_DIR = "models/nextia-tutor-lora"
MAX_SEQ_LENGTH = 1024
LORA_RANK = 16
LORA_ALPHA = 32
LORA_DROPOUT = 0
EPOCHS = 3
BATCH_SIZE = 2
GRAD_ACCUM = 4
LEARNING_RATE = 2e-4


def load_dataset(path: str) -> Dataset:
    data = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                data.append(json.loads(line))
    return Dataset.from_list(data)


def formatting_func(example):
    """Convierte cada ejemplo en un solo texto con formato chat."""
    messages = example["messages"]
    text = ""
    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        if role == "system":
            text += f"<|system|>\n{content}\n"
        elif role == "user":
            text += f"<|user|>\n{content}\n"
        elif role == "assistant":
            text += f"<|assistant|>\n{content}\n"
    text += "<|assistant|>\n"
    return text


def main():
    print("=" * 60)
    print("NEXTIA-Tutor Fine-tuning (LoRA)")
    print("=" * 60)

    # 1. Cargar modelo con QLoRA
    print(f"\n[1/4] Cargando modelo: {MODEL_NAME}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=MODEL_NAME,
        max_seq_length=MAX_SEQ_LENGTH,
        dtype=None,
        load_in_4bit=True,
        device_map="auto",
    )

    # 2. Configurar LoRA
    print("[2/4] Configurando LoRA...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=LORA_RANK,
        lora_alpha=LORA_ALPHA,
        lora_dropout=LORA_DROPOUT,
        target_modules=[
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj",
        ],
        use_rslora=True,
        use_gradient_checkpointing="unsloth",
    )

    # 3. Cargar dataset
    print(f"[3/4] Cargando dataset: {DATASET_PATH}")
    dataset = load_dataset(DATASET_PATH)
    print(f"     Ejemplos: {len(dataset)}")

    # 4. Entrenar
    print("[4/4] Iniciando entrenamiento...")
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="messages",
        formatting_func=formatting_func,
        args=TrainingArguments(
            output_dir=OUTPUT_DIR,
            per_device_train_batch_size=BATCH_SIZE,
            gradient_accumulation_steps=GRAD_ACCUM,
            num_train_epochs=EPOCHS,
            learning_rate=LEARNING_RATE,
            fp16=torch.cuda.is_available(),
            logging_steps=1,
            save_strategy="epoch",
            optim="adamw_8bit",
            weight_decay=0.01,
            lr_scheduler_type="cosine",
            warmup_ratio=0.1,
            report_to="none",
        ),
    )
    trainer.train()

    # 5. Guardar
    print(f"\n✅ Fine-tuning completado. Guardando en {OUTPUT_DIR}")
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    # 6. Convertir a GGUF para Ollama
    print("\n💡 Para usar en Ollama:")
    print(f"    1. Convierte a GGUF: python scripts/convert_to_gguf.py")
    print(f"    2. Crea el modelo:    ollama create nextia-tutor -f training/Modelfile")

    print("\n✅ ¡Listo! NEXTIA-Tutor entrenado exitosamente.")


if __name__ == "__main__":
    main()
