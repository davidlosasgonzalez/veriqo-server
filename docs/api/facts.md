# 📡 API – Core

Todos los endpoints están prefijados con `/api`.

## 🧾 Endpoints disponibles

| Método | Ruta                   | Descripción                                                                       |
| ------ | ---------------------- | --------------------------------------------------------------------------------- |
| `GET`  | `/core/logs`           | Devuelve todos los logs generados por los agentes.                                |
| `GET`  | `/core/prompts`        | Recupera los prompts configurados para cada agente.                               |
| `GET`  | `/core/prompts/:agent` | Recupera el prompt de un agente específico.                                       |
| `GET`  | `/core/stats`          | Métricas de verificación factual (totalFindings, coverage, needsFactCheck, etc.). |
| `GET`  | `/core/metrics`        | Métricas técnicas (uptime, memoryUsage, env, timestamp).                          |

## 📥 Ejemplos de uso

### `GET /core/logs`

```json
{
    "status": "ok",
    "message": "Logs recuperados correctamente.",
    "data": [
        // Array de logs con detalles de cada llamada
    ]
}
```

### `GET /core/prompts`

```json
{
    "status": "ok",
    "message": "Prompts cargados correctamente.",
    "data": [
        {
            "agent": "ValidatorAgent",
            "prompt": "Detecta afirmaciones factuales en el siguiente texto...",
            "purpose": "Análisis inicial",
            "createdAt": "2025-04-10T13:22:11.000Z",
            "updatedAt": "2025-04-12T17:45:08.000Z"
        }
    ]
}
```

### `GET /core/prompts/:agent`

```json
{
    "status": "ok",
    "message": "Prompt cargado correctamente.",
    "data": {
        "agent": "FactCheckerAgent",
        "prompt": "Verifica la siguiente afirmación usando fuentes verificables...",
        "purpose": "Verificación factual"
    }
}
```

### `GET /core/stats`

```json
{
    "status": "ok",
    "message": "Métricas globales de verificación factual.",
    "data": {
        "totalFindings": 7,
        "needsFactCheck": 2,
        "verifiedClaims": 5,
        "pending": 2,
        "factualCoverage": "71.43%",
        "byCategory": {
            "factual_error": 4,
            "other": 1,
            "ambiguity": 1,
            "style": 1
        }
    }
}
```

### `GET /core/metrics`

```json
{
    "status": "ok",
    "message": "Métricas obtenidas correctamente.",
    "data": {
        "uptime": 2330.5835542,
        "timestamp": "2025-04-18T15:03:57.734Z",
        "memoryUsage": {
            "rss": 103264256,
            "heapTotal": 58654720,
            "heapUsed": 55636704,
            "external": 4119572,
            "arrayBuffers": 562263
        },
        "env": "development"
    }
}
```

> 📌 Estos endpoints permiten consultar métricas clave, auditar procesos internos y acceder a la configuración de los agentes en tiempo real.
