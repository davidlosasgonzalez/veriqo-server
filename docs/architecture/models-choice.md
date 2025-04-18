# 🤖 Modelos LLM y Decisiones Técnicas

Este documento detalla las decisiones clave relacionadas con los modelos de lenguaje utilizados en Veriqo, así como su rol dentro del sistema de verificación factual.

## 🧠 Modelos utilizados

| Agente           | Modelo LLM             | Proveedor | Finalidad principal                                 |
| ---------------- | ---------------------- | --------- | --------------------------------------------------- |
| ValidatorAgent   | Claude 3.5 Sonnet      | Anthropic | Evaluar afirmaciones, detectar ambigüedad o errores |
| FactCheckerAgent | GPT-4o                 | OpenAI    | Sintetizar evidencia y emitir veredicto factual     |
| Embeddings       | text-embedding-3-small | OpenAI    | Normalización semántica y detección de duplicados   |

> 🧪 Estos modelos han sido seleccionados tras experimentación comparativa, priorizando velocidad, coste y rendimiento contextual.

## 🔍 Criterios de selección

Las decisiones técnicas se han basado en los siguientes factores:

- **Calidad de comprensión contextual:** Fundamental para distinguir ambigüedad o falsedad sutil.
- **Velocidad de respuesta:** El sistema requiere baja latencia para flujos síncronos (`waitForFact: true`).
- **Coste por token:** Se ha priorizado Claude 3.5 para análisis rápidos por su balance entre precio y calidad.
- **Compatibilidad con Node.js:** Todos los proveedores ofrecen APIs HTTP estables, integradas mediante `AiRouterService`.

## 🧩 Sistema de ruteo inteligente (`AiRouterService`)

Veriqo implementa un servicio centralizado que permite:

- Seleccionar dinámicamente el modelo según el agente (`FACTCHECKER_MODEL`, `VALIDATOR_MODEL` en `.env`).
- Cambiar de proveedor sin modificar lógica interna.
- Añadir nuevos modelos de forma modular (ej. local LLMs futuros).

```ts
// Ejemplo simplificado de selección de modelo
const model = env.VALIDATOR_MODEL === 'claude' ? 'claude-3-5-sonnet' : 'gpt-4o';
```

## ♻️ Posibilidades futuras

- Soporte experimental para **modelos locales** con Ollama o LM Studio (descartado por rendimiento actual).
- Alternativas a embeddings de OpenAI mediante `open-source` (ej. `BGE-small`, `E5-base`).
- Autoselección de modelo óptimo según tipo de afirmación (clasificación previa).

### 🔄 Experimentos descartados

Durante el desarrollo se probaron modelos locales como **Mistral-7B**, **DeepSeek**, y otros modelos de Ollama, pero se descartaron temporalmente debido a:

- **Latencias elevadas** (superiores a 30 segundos por respuesta).
- **Consumo de recursos excesivo** en entornos no GPU.
- **Limitaciones de contexto** para análisis complejos.

> Estos modelos podrían retomarse en el futuro si mejoran su rendimiento o se incorpora hardware especializado.

## 🛡️ Consideraciones de seguridad

- Ningún prompt enviado a modelos externos contiene datos personales sensibles.
- Toda la interacción con LLMs es **asíncrona y trazable**.
- Las respuestas generadas se almacenan con `timestamp` y fuentes usadas para auditoría completa.
