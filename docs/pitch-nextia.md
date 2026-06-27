# NEXTIA — Pitch (NEXIA 2026, Arequipa)

## Cuentas demo (seed)

| Rol      | Correo              | Contraseña | Entra a    |
|----------|---------------------|------------|------------|
| Admin    | admin@nextia.pe     | nextia123  | /admin     |
| Profesor | rosa@nextia.pe      | nextia123  | /profesor  |
| Alumno   | alumno@nextia.pe    | nextia123  | /alumno    |

Servidor: `http://localhost:3010` (LAN: misma IP del box, puerto 3010).

---

## El pitch (90 segundos)

**Una línea:** NEXTIA es un servidor-en-una-caja con IA local (Gemma) que
lleva tutoría y calificación con inteligencia artificial a escuelas rurales del
Perú — **sin internet**.

**Problema.** Miles de escuelas rurales no tienen internet estable ni docentes
suficientes. Las herramientas de IA educativa viven en la nube → inservibles
donde más se necesitan. Un profesor de multigrado prepara y califica solo,
para 30 niños de varios grados.

**Solución.** Una caja física que se enchufa en el aula. Adentro:
- LLM local (Gemma 3) — corre sin nube.
- Flujo LangGraph (paper *Small Models, Big Support*, arXiv 2506.05925): RAG
  sobre el currículo peruano → generación → **verificador** de seguridad →
  docente-en-el-bucle.
- Base de datos del colegio (profesores, clases, alumnos, notas).
- Plataforma web servida por LAN — alumnos entran desde cualquier dispositivo.

**Cómo funciona (el bucle):**
1. Profesor genera un ejercicio alineado al currículo. La IA lo crea y lo
   **verifica** antes de mostrarlo.
2. Alumno lo resuelve desde su tablet/celular en la red local.
3. IA califica y da retroalimentación en español; el profesor ajusta y aprueba.
4. Alumno recibe su nota y feedback al instante.

**Negocio — B2G2C.** Vendemos la caja al Estado / municipio / ONG (B2G), que
la despliega en la escuela; el valor llega a docentes y familias (2C). Ingreso:
hardware + licencia anual de currículo y soporte. Una caja = un aula conectada
a IA por años, costo marginal cero por consulta (no hay factura de API).

**Diferenciador.** Offline-first real. No es "ChatGPT para tareas" — es
infraestructura soberana: los datos del niño no salen del aula, el verificador
evita alucinaciones, y el docente siempre tiene la última palabra.

**Ask.** Buscamos piloto con 1 UGEL / municipio (10 cajas, 1 semestre) para
medir mejora de aprendizaje y descarga docente.

---

## Guion de demo (8 min)

> Tono: "esto corre AHORA en esta laptop, sin wifi." Apaga el wifi al inicio.

1. **(0:30) Gancho.** Apaga wifi. "Todo lo que verán corre local. Cero nube."
2. **(1:00) Profesor.** Login `rosa@nextia.pe`. Resumen → "Generar ejercicio".
   - Materia Matemática, grado 5to, tema *fracciones*, 1–2 ejercicios → Generar.
   - Mostrar: ejercicio creado + badge **Verificado ✓** + fuentes del currículo.
   - "Guardar como asignación" → clase 5to A.
3. **(2:30) Alumno.** Login `alumno@nextia.pe`. Ve la tarea → escribe respuesta
   → Enviar.
4. **(1:30) Calificar.** Volver a profesor → Calificar → abrir la entrega →
   "Calificar con IA" → muestra puntaje + feedback en español + verificado.
   Ajustar nota si quiere (override docente) → Guardar.
5. **(1:00) Cierre alumno.** Login alumno → ve **Calificada**, nota y feedback.
6. **(1:00) Remate.** "Sin internet. Modelo local. Currículo peruano. El
   docente manda. Esto es una caja, en cada aula rural." → Ask.

**Plan B (si falla la generación en vivo):** ya hay una asignación sembrada
("Suma de fracciones" en 5to A) — califícala en vivo y muestra el feedback al
alumno. Demo sigue sin generar desde cero.
