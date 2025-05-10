# 📡 API – ValidatorAgent

Esta sección documenta los endpoints disponibles del agente de validación (`ValidatorAgent`), responsable de analizar texto, detectar afirmaciones factuales y evaluar su validez.

## 📾 Endpoints disponibles

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
- La normalización y análisis de afirmaciones se realiza mediante `VerifyClaimOrchestratorService`.

## 🧹 Detalles técnicos

- Los hallazgos (`Finding`) incluyen embeddings, categoría y necesidad de verificación.
- El sistema puede relacionar cada hallazgo con un `Fact` existente si ya fue verificado previamente.
- El controlador se encuentra en `ValidatorAgentController` y hace uso de queries CQRS y servicios internos desacoplados.

## 📁 Archivos relacionados

- `src/agents/validator-agent/presentation/rest/controllers/validator-agent.controller.ts`
- `src/agents/validator-agent/application/services/verify-claim-orchestrator.service.ts`
- `src/agents/validator-agent/application/queries/finding/*`
- `src/shared/application/queries/fact/get-fact-by-id.query.ts`
- `src/shared/presentation/dto/fact.dto.ts`, `finding.dto.ts`
- `src/shared/types/http-response.type.ts`
