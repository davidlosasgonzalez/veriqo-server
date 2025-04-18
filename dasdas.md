🧠 Veriqo · AI Fact‑Checking Backend

Veriqo es un **backend modular de verificación factual automática** impulsado por IA. Combina un bus de eventos, modelos LLM de última generación y recuperación activa de fuentes (Brave Search, Google CSE, NewsAPI) para contrastar afirmaciones en tiempo real y exponer veredictos trazables vía API REST.

...

## Endpoints REST

La API tiene un prefijo global \`\`. Se incluye una colección de Postman para pruebas.

A continuación se muestran los endpoints definitivos agrupados por dominio.

### 📁 Validators

| Método | Endpoint                   | Descripción                                                    |
| ------ | -------------------------- | -------------------------------------------------------------- |
| `POST` | `/validators/analyze`      | Analiza un texto y detecta afirmaciones factuales.             |
| `GET`  | `/validators/findings`     | Devuelve todos los hallazgos detectados por el ValidatorAgent. |
| `GET`  | `/validators/findings/:id` | Recupera un hallazgo concreto por su ID.                       |

#### Ejemplo — `POST /validators/analyze`

**🔍 Sobre `waitForFact`:**

Este parámetro opcional permite decidir si el `ValidatorAgent` debe esperar a que el `FactCheckerAgent` complete su verificación antes de devolver la respuesta. Es especialmente útil para aplicaciones en las que se desea obtener una respuesta final en una sola llamada.

| Opción                         | Descripción                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `waitForFact: true`            | El `ValidatorAgent` espera (con timeout) a que el `FactCheckerAgent` termine y devuelve una respuesta enriquecida si se requiere verificación factual. |
| `waitForFact: false` (default) | Devuelve solo el análisis inicial. Ideal para procesar múltiples afirmaciones en batch.                                                                |

> ✅ **Recomendación:** Usa `waitForFact: true` cuando quieras obtener la verificación completa de una afirmación en una única llamada HTTP.

✅ Afirmación válida (no se detecta ningún error factual):

```json
{
    "prompt": "Einstein desarrolló dos teorías de la relatividad distintas: la Teoría de la Relatividad Especial (1905) y la Teoría de la Relatividad General (1915).",
    "waitForFact": true
}
```

```json
{
    "status": "ok",
    "message": "Afirmación validada correctamente.",
    "data": []
}
```

⚠️ Afirmación que requiere verificación factual externa (`needsFactCheck: true`):

```json
{
    "prompt": "Trump ha subido los aranceles a varios países en el año 2025.",
    "waitForFact": true
}
```

```json
{
    "status": "ok",
    "message": "Afirmación validada correctamente.",
    "data": [
        {
            "id": "264d9e98-f2df-4819-bf17-53f13445f7bf",
            "claim": "Trump ha subido los aranceles a varios países en el año 2025",
            "normalizedClaim": "donald trump aumentó tarifas arancelarias a múltiples países durante 2025",
            "category": "factual_error",
            "summary": "Afirmación sobre eventos futuros que requieren verificación",
            "explanation": "La afirmación se refiere a eventos que supuestamente ocurrirán en 2025, un período futuro que no puede ser verificado con el conocimiento actual del modelo",
            "suggestion": "Especificar si es una propuesta o plan, y verificar la fecha correcta de la acción",
            "keywords": [
                "Trump",
                "aranceles",
                "2025",
                "política comercial",
                "tarifas"
            ],
            "synonyms": {
                "aranceles": [
                    "tarifas",
                    "impuestos comerciales",
                    "tasas aduaneras"
                ],
                "subido": ["aumentado", "incrementado", "elevado"]
            },
            "namedEntities": ["Donald Trump"],
            "locations": [],
            "searchQuery": "Trump aranceles países 2025",
            "siteSuggestions": [
                "www.ustr.gov",
                "www.treasury.gov",
                "www.whitehouse.gov"
            ],
            "needsFactCheck": true,
            "needsFactCheckReason": "La afirmación se refiere a eventos en 2025, un período futuro que requiere verificación externa para confirmar si es un hecho real, una propuesta o una predicción",
            "relatedFactId": null,
            "createdAt": "2025-04-18T14:50:47.992Z",
            "updatedAt": "2025-04-18T14:50:47.992Z"
        }
    ]
}
```

🧪 Afirmación con error factual claro detectado por el modelo:

```json
{
    "prompt": "Newton descubrió la gravedad",
    "waitForFact": true
}
```

```json
{
    "status": "ok",
    "message": "Texto analizado correctamente.",
    "data": [
        {
            "id": "1731bd03-c789-4ea2-ac45-5c91baea83c7",
            "claim": "Newton descubrió la gravedad",
            "category": "factual_error",
            "summary": "La gravedad no fue 'descubierta' por Newton, era un fenómeno ya conocido",
            "explanation": "Newton no descubrió la gravedad, ya que era un fenómeno observable...",
            "keywords": [
                "Newton",
                "gravedad",
                "gravitación universal",
                "física",
                "descubrimiento"
            ],
            "synonyms": {
                "Newton": ["Isaac Newton", "Sir Isaac Newton"],
                "gravedad": ["gravitación", "fuerza gravitatoria"]
            },
            "namedEntities": ["Isaac Newton"],
            "locations": [],
            "searchQuery": "",
            "siteSuggestions": [],
            "factSourcesUsed": [],
            "needsFactCheck": false,
            "needsFactCheckReason": ""
        }
    ]
}
```

#### Ejemplo — `GET /validators/findings/:id`

```json
{
    "status": "ok",
    "message": "Hallazgo recuperado.",
    "data": {
        "id": "1731bd03-c789-4ea2-ac45-5c91baea83c7",
        "claim": "Newton descubrió la gravedad",
        "category": "factual_error",
        "summary": "La gravedad no fue 'descubierta' por Newton, era un fenómeno ya conocido",
        "explanation": "Newton no descubrió la gravedad, ya que era un fenómeno observable...",
        "keywords": [
            "Newton",
            "gravedad",
            "gravitación universal",
            "física",
            "descubrimiento"
        ],
        "synonyms": {
            "Newton": ["Isaac Newton", "Sir Isaac Newton"],
            "gravedad": ["gravitación", "fuerza gravitatoria"]
        },
        "namedEntities": ["Isaac Newton"],
        "locations": [],
        "searchQuery": "",
        "siteSuggestions": [],
        "factSourcesUsed": [],
        "needsFactCheck": false,
        "needsFactCheckReason": ""
    }
}
```

#### Ejemplo — `GET /validators/findings`

```json
{
    "status": "ok",
    "message": "Hallazgos encontrados correctamente.",
    "data": [
        {
            "id": "1731bd03-c789-4ea2-ac45-5c91baea83c7",
            "claim": "Newton descubrió la gravedad",
            "category": "factual_error",
            "summary": "La gravedad no fue 'descubierta' por Newton, era un fenómeno ya conocido"
        },
        {
            "id": "a40d7b98-9ba3-4753-9aa1-a52c21da2008",
            "claim": "En 2024 el precio del aceite en España se ha disparado",
            "category": "factual_error",
            "summary": "Afirmación sobre precios actuales que requiere verificación"
        }
    ]
}
```

### 📁 Facts

#### Ejemplo — `POST /facts/verify`

```json
{
    "claim": "David Losas González es programador"
}
```

```json
{
    "status": "ok",
    "message": "Verificación completada.",
    "data": {
        "claim": "David Losas González es programador",
        "status": "possibly_true",
        "sources": ["https://..."],
        "checkedAt": "2025-04-18T10:15:00.000Z",
        "reasoning": "Varias fuentes públicas sugieren que trabaja como desarrollador web, aunque no hay confirmación oficial actualizada.",
        "sources_retrieved": ["https://..."],
        "sources_used": ["https://..."]
    }
}
```

#### Ejemplo — `GET /facts/verifications/:id`

```json
{
    "status": "ok",
    "message": "Verificación encontrada.",
    "data": {
        "id": "24a268a4-c7fd-454f-9a2a-a1f47662db7b",
        "claim": "David Losas colabora en OSS con TypeScript",
        "result": "unknown",
        "reasoning": "No se encontraron pruebas públicas recientes que confirmen o desmientan con certeza.",
        "sourcesUsed": [],
        "checkedAt": "2025-04-17T23:43:00.000Z"
    }
}
```

| Método | Endpoint                               | Descripción                                                        |
| ------ | -------------------------------------- | ------------------------------------------------------------------ |
| `POST` | `/facts/verify`                        | Verifica una afirmación concreta usando fuentes reales.            |
| `POST` | `/facts/claim`                         | Recupera la verificación asociada a un claim concreto (si existe). |
| `GET`  | `/facts/verifications/last`            | Devuelve la última verificación realizada.                         |
| `GET`  | `/facts/verifications/:id`             | Recupera una verificación concreta por ID.                         |
| `GET`  | `/facts/verifications/:factId/history` | Devuelve el historial completo de verificaciones.                  |

#### Ejemplo — `GET /facts/claim`

```json
{
    "claim": "Trump ha puesto aranceles a un montón de países en 2025"
}
```

```json
{
    "status": "ok",
    "message": "Verificación encontrada.",
    "data": {
        "id": "f05caa18-c6c6-47d6-ac18-01aa9de2c476",
        "claim": "Trump ha puesto aranceles a un montón de países en 2025",
        "normalizedClaim": "trump ha puesto aranceles a un montón de países en 2025",
        "status": "unknown",
        "sources": ["https://..."],
        "createdAt": "2025-04-17T00:14:36.395Z",
        "updatedAt": "2025-04-17T00:14:36.395Z",
        "reasoning": "La fuente proporcionada no contiene información relevante…",
        "sources_retrieved": ["https://..."],
        "sources_used": ["https://..."]
    }
}
```

#### Ejemplo — `GET /facts/verifications/last`

```json
{
    "status": "ok",
    "message": "Última verificación obtenida.",
    "data": {
        "claim": "En 2024 el precio del aceite en España se ha disparado",
        "status": "true",
        "sources": ["https://..."],
        "checkedAt": "2025-04-17T00:53:12.807Z",
        "reasoning": "Varias fuentes confirman que el precio del aceite en España...",
        "sources_retrieved": ["https://..."],
        "sources_used": ["https://..."],
        "findingId": "a40d7b98-9ba3-4753-9aa1-a52c21da2008"
    }
}
```

#### Ejemplo — `GET /facts/verifications/:factId/history`

```json
{
    "status": "ok",
    "message": "Historial recuperado correctamente.",
    "data": [
        {
            "id": "56a67625-ed7c-414f-b23e-d44dc76f8642",
            "checkedAt": "2025-04-17T00:14:00Z",
            "claim": "Trump ha puesto aranceles en 2025",
            "result": "unknown",
            "sources": 1,
            "reasoning": "La evidencia encontrada no menciona aranceles de 2025…",
            "sourcesUsed": ["https://..."]
        }
    ]
}
```

### 📁 Core

| Método | Endpoint               | Descripción                                                                 |
| ------ | ---------------------- | --------------------------------------------------------------------------- |
| `GET`  | `/core/logs`           | Devuelve todos los logs registrados por los agentes.                        |
| `GET`  | `/core/prompts`        | Devuelve los prompts configurados por agente.                               |
| `GET`  | `/core/prompts/:agent` | Devuelve el prompt asignado a un agente concreto.                           |
| `GET`  | `/core/events`         | Devuelve todos los eventos emitidos por el bus de agentes.                  |
| `GET`  | `/core/stats`          | Métricas globales de verificación factual (claims, resultados, categorías). |
| `GET`  | `/core/metrics`        | Métricas técnicas de ejecución del backend (uso de memoria, uptime, etc.).  |

#### Ejemplo — `GET /core/events`

```json
{
    "status": "ok",
    "message": "Eventos recuperados correctamente.",
    "data": [
        {
            "emitterAgent": "ValidatorAgent",
            "type": "factual_check_required",
            "payloadSummary": "Claim 'Trump ha puesto aranceles...' requiere verificación.",
            "status": "processed",
            "createdAt": "2025-04-17T00:14:30.173Z"
        },
        {
            "emitterAgent": "FactCheckerAgent",
            "type": "factual_verification_result",
            "payloadSummary": "Claim 'Trump ha puesto aranceles...' verificado (status: unknown).",
            "status": "pending",
            "createdAt": "2025-04-17T00:14:36.420Z"
        }
    ]
}
```

#### Ejemplo — `GET /core/logs`

```json
{
    "status": "ok",
    "message": "Logs recuperados correctamente.",
    "data": [
        {
            "agentName": "ValidatorAgent",
            "model": "claude-sonnet",
            "inputPrompt": "El sol es más grande que la Tierra.",
            "outputResult": "{ \"status\": \"ok\", ... }",
            "engineUsed": null,
            "tokensInput": 0,
            "tokensOutput": 0,
            "createdAt": "2025-04-16T23:43:49.015Z"
        },
        {
            "agentName": "FactCheckerAgent",
            "model": "news+brave+google+claude",
            "inputPrompt": "David Losas colabora activamente...",
            "outputResult": "{ \"claim\": \"David Losas...\", \"status\": \"unknown\", ... }",
            "engineUsed": "brave",
            "totalResults": 10,
            "createdAt": "2025-04-16T23:43:34.014Z"
        }
    ]
}
```

#### Ejemplo — `GET /core/prompts`

```json
{
    "status": "ok",
    "message": "Prompts cargados correctamente.",
    "data": [
        {
            "agent": "embedding_service",
            "prompt": "Eres un sistema que convierte frases en embeddings numéricos…",
            "purpose": "principal"
        },
        {
            "agent": "fact_checker_agent",
            "prompt": "Eres un agente verificador experto. Tu misión es analizar si una afirmación…",
            "purpose": "principal"
        },
        {
            "agent": "validator_agent",
            "prompt": "Eres un agente de validación experto. Tu misión es analizar textos y detectar afirmaciones…",
            "purpose": "principal"
        }
    ]
}
```

#### Ejemplo — `GET /core/prompts/:agent`

```json
{
    "status": "ok",
    "message": "Prompt cargado correctamente.",
    "data": {
        "agent": "validator_agent",
        "prompt": "Eres un agente de validación experto. Tu misión es analizar textos y detectar afirmaciones…",
        "purpose": "principal"
    }
}
```

| Método | Endpoint               | Descripción                                                |
| ------ | ---------------------- | ---------------------------------------------------------- |
| `GET`  | `/core/logs`           | Devuelve todos los logs registrados por los agentes.       |
| `GET`  | `/core/prompts`        | Devuelve los prompts configurados por agente.              |
| `GET`  | `/core/prompts/:agent` | Devuelve el prompt asignado a un agente concreto.          |
| `GET`  | `/core/events`         | Devuelve todos los eventos emitidos por el bus de agentes. |
| `GET`  | `/core/metrics`        | Métricas globales de cobertura factual y categorías.       |

#### Ejemplo — `GET /core/stats`

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

#### Ejemplo — `GET /core/metrics`

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

```json
{
    "status": "ok",
    "message": "Métricas globales de verificación factual.",
    "data": {
        "totalFindings": 18,
        "needsFactCheck": 13,
        "verifiedClaims": 12,
        "pending": 1,
        "factualCoverage": "92.31%",
        "byCategory": {
            "factual_error": 13,
            "contradiction": 0,
            "ambiguity": 2,
            "reasoning": 2,
            "style": 0,
            "other": 1
        }
    }
}
```

...

_(El resto del README se mantiene sin cambios salvo la sección de endpoints, que ahora refleja los nombres y rutas actualizadas profesionalmente con todos los ejemplos adaptados.)_
