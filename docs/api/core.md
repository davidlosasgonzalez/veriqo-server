# 📁 API – Core

Esta sección documenta los endpoints del módulo `Core`, que permiten acceder a la trazabilidad del sistema, métricas técnicas y configuración de prompts para los agentes.

## 📾 Endpoints disponibles

| Método | Ruta            | Descripción                                                               |
| ------ | --------------- | ------------------------------------------------------------------------- |
| `GET`  | `/core/logs`    | Devuelve todos los logs registrados por los agentes.                      |
| `GET`  | `/core/prompts` | Recupera todos los prompts configurados en el sistema.                    |
| `GET`  | `/core/stats`   | Devuelve métricas globales de verificación factual.                       |
| `GET`  | `/core/metrics` | Devuelve métricas técnicas del servidor (memoria, uptime, entorno, etc.). |

## ⚙️ Comportamiento

- Las respuestas están normalizadas en el formato `{ status, message, data }`.
- El controlador no modifica datos; es de lectura exclusivamente.
- Los endpoints permiten auditar actividad, analizar el comportamiento factual y supervisar recursos del sistema.

## 📁 Archivos relacionados

- `src/agents/core/core.controller.ts`
- `src/agents/core/core.service.ts`
- `src/domain/entities/agent-log.entity.ts`
- `src/domain/entities/agent-prompt.entity.ts`
