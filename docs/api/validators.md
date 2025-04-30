# 📡 API – ValidatorAgent

Esta sección documenta los endpoints disponibles del agente de validación (`ValidatorAgent`), responsable de analizar texto, detectar afirmaciones factuales y evaluar su validez.

## 🧾 Endpoints disponibles

| Método | Ruta                                     | Descripción                                                   |
| ------ | ---------------------------------------- | ------------------------------------------------------------- |
| `POST` | `/validators/analyze`                    | Analiza texto libre, detecta y evalúa afirmaciones factuales. |
| `GET`  | `/validators/findings`                   | Lista todos los hallazgos detectados.                         |
| `GET`  | `/validators/findings/:id`               | Recupera un hallazgo específico por su ID.                    |
| `GET`  | `/validators/findings/by-claim?text=...` | Busca si ya existe un hallazgo para una afirmación dada.      |
| `GET`  | `/validators/facts/:id`                  | Recupera un fact verificado por su ID.                        |

## ⚙️ Comportamiento

- Las rutas devuelven objetos enriquecidos con trazabilidad factual.
- Todos los endpoints responden con un objeto `{ status, message, data }`.
- La normalización y análisis de afirmaciones se realiza mediante `ValidatorAgentService`.

## 🧩 Detalles técnicos

- Los hallazgos (`AgentFinding`) incluyen embeddings, categoría y necesidad de verificación.
- El sistema puede relacionar cada hallazgo con un `AgentFact` existente.
- Los métodos están implementados en el `ValidatorAgentController`, y consumen servicios internos para razonamiento y recuperación de información.

## 📁 Archivos relacionados

- `src/agents/validator/validator-agent.controller.ts`
- `src/agents/validator/validator-agent.service.ts`
- `src/agents/fact-checker/dto/agent-fact.dto.ts`
- `src/domain/entities/agent-finding.entity.ts`
