# 🤖 Modelos LLM y Decisiones Técnicas – Veriqo

Este documento resume las decisiones arquitectónicas y operativas que sustentan el uso de modelos de lenguaje (LLM) en el sistema Veriqo.

## 🧠 Modelos utilizados en Veriqo

| Agente           | Modelo LLM             | Proveedor | Finalidad principal                                        |
| ---------------- | ---------------------- | --------- | ---------------------------------------------------------- |
| ValidatorAgent   | Claude 3.5 Sonnet      | Anthropic | Evaluación contextual, detección de ambigüedades o errores |
| FactCheckerAgent | GPT-4o                 | OpenAI    | Síntesis de evidencia y emisión de veredictos factuales    |
| Embeddings       | text-embedding-3-small | OpenAI    | Normalización semántica y deduplicación de afirmaciones    |

> 🧪 Esta combinación fue definida tras pruebas comparativas, priorizando latencia baja, coste por token y calidad contextual.

## 🔍 Criterios técnicos de selección

Las decisiones han sido guiadas por:

- **Comprensión contextual avanzada**: imprescindible para evaluar veracidad, contradicción o ambigüedad.
- **Rendimiento / latencia**: se exige rapidez para mantener la experiencia del usuario fluida.
- **Coste eficiente**: Claude 3.5 se elige por su buen balance coste/calidad para tareas de validación inicial.
- **Integración limpia con Node.js**: todos los modelos se consumen vía API HTTP desde `AiRouterService`.

## 🧹 Sistema de ruteo inteligente (`AiRouterService`)

Veriqo centraliza la selección y consumo de modelos mediante un servicio inteligente:

- Permite cambiar el modelo por agente desde `.env` (`LLM_VALIDATOR_MODEL`, `LLM_FACTCHECKER_MODEL`).
- Aísla la lógica de cada agente respecto a la implementación del modelo.
- Facilita la extensión futura hacia nuevos modelos o proveedores.

## ♻️ Posibilidades de evolución

- Soporte para **modelos locales** mediante Ollama o LM Studio (en pausa por ahora).
- Embeddings alternativos open source (`bge-small`, `e5-base`, etc.).
- Clasificación previa para elegir automáticamente el mejor modelo según el tipo de afirmación.

### ↺ Modelos descartados en pruebas

Durante el desarrollo se evaluaron localmente:

- **Mistral-7B**, **DeepSeek**, **TinyLlama**, etc.

Fueron descartados temporalmente por:

- Latencia elevada (>30s incluso en CPU moderna).
- Altos requisitos de memoria sin aceleración GPU.
- Rendimiento pobre en prompts complejos sin fine-tuning.

> ⚠️ El equipo de desarrollo utiliza un portátil con 16 GB de RAM y sin GPU dedicada. Por ese motivo, los modelos locales provocaban una degradación importante de latencia, por lo que se priorizó el uso de APIs externas. Sin embargo, otros desarrolladores con hardware más potente pueden experimentar mejores resultados con modelos locales.

## 🛡️ Consideraciones de seguridad y trazabilidad

- No se envía información sensible en prompts a modelos externos.
- Todas las llamadas son asíncronas y registradas con trazabilidad completa.
- Todas las respuestas generadas por los agentes se registran con trazabilidad completa en `agent_logs`, incluyendo el modelo, prompt, resultado, tokens y tiempo de ejecución.

## 📁 Archivos relacionados

- `src/shared/ai/ai-router.service.ts`
- `.env` (`LLM_*`)
- `src/agents/*/*.agent.service.ts`
- `src/database/entities/agent-log.entity.ts`
