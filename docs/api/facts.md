# 📡 API – FactCheckerAgent

Esta sección documenta los endpoints del agente de verificación factual (`FactCheckerAgent`), responsable de validar afirmaciones mediante búsqueda externa y razonamiento con modelos LLM.

## 🧾 Endpoints disponibles

| Método | Ruta                       | Descripción                                                   |
| ------ | -------------------------- | ------------------------------------------------------------- |
| `POST` | `/facts/verify`            | Verifica una afirmación usando búsqueda externa y modelo LLM. |
| `GET`  | `/facts/verifications/:id` | Recupera una verificación factual previa por su ID.           |

## ⚙️ Comportamiento

- Las verificaciones incluyen nivel de confianza, fuentes utilizadas y razonamiento generado.
- Cada resultado se asocia a un `AgentFact` y queda registrado con trazabilidad completa.
- Las respuestas siguen la estructura `{ status, message, data }`.

## 📁 Archivos relacionados

- `src/agents/fact-checker/fact-checker-agent.controller.ts`
- `src/agents/fact-checker/fact-checker-agent.service.ts`
- `src/domain/entities/agent-verification.entity.ts`
- `src/domain/entities/agent-reasoning.entity.ts`
