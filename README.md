# 🧠 Veriqo · AI Fact‑Checking Backend

Veriqo es un **backend modular de verificación factual automática** impulsado por IA. Combina un bus de eventos, modelos LLM de última generación y recuperación activa de fuentes (Brave Search, Google CSE, NewsAPI) para contrastar afirmaciones en tiempo real y exponer veredictos trazables vía API REST.

## ⚠️ Estado del proyecto

Veriqo nació **tras un flechazo con el mundo de los Agentes IA** y la curiosidad que me despertó el proyecto open‑source **[Agno](https://github.com/agno-agi/agno)**. Algunas ideas sobre razonamiento, memoria y uso de herramientas provienen de explorar su código y documentación.

Veriqo se encuentra en **fase activa de desarrollo**. Las funcionalidades principales de verificación factual ya están operativas, pero faltan componentes críticos por lo que se puede esperar algún error:

- **Testing automatizado** (unitarios + e2e) – será la **próxima prioridad** tras estabilizar la API.
- **Frontend de prueba** – se está construyendo un cliente **React + Next.js + Redux Toolkit**, escrito en **TypeScript**, para interactuar con los agentes vía REST sin usar Postman.
- Las migraciones TypeORM están provisionalmente deshabilitadas para acelerar la iteración inicial.

> **Nota**: Sé que los _controllers_ y _services_ aún **no están modularizados** y que **faltan las suites de _testing_ y las migraciones**. El motivo es simple: **quería centrarme en dominar la orquestación de agentes IA y múltiples LLMs**. A cambio, entrego una **documentación extensa y bien organizada** para un primer proyecto.

## Contexto y alcance

Veriqo verifica **afirmaciones de interés público** (noticias, política, ciencia, tecnología). No está optimizado para búsquedas privadas ni perfiles individuales.

### ✅ Casos donde sobresale

- Declaraciones públicas verificables.
- Datos históricos, científicos o tecnológicos.
- Artículos periodísticos y material educativo.

### ⚠️ Casos donde no es adecuado

- Perfiles individuales poco conocidos.
- Contenido sin fuentes trazables.
- Uso como chatbot conversacional.

Requiere conexión a Internet: LLM en la nube y APIs de búsqueda externas. Los modelos locales como Mistral 7B se descartaron por latencia y conocimiento desfasado.

## Características clave

| #   | Funcionalidad              | Descripción                                                                                             |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Detección inteligente      | `ValidatorAgent` encuentra afirmaciones verificables y filtra irrelevancias.                            |
| 2   | Verificación con evidencia | `FactCheckerAgent` consulta fuentes reales y emite veredictos `true / false / possibly_true / unknown`. |
| 3   | Trazabilidad total         | Hallazgos, reasoning, fuentes y métricas se persisten en MySQL.                                         |
| 4   | Arquitectura desacoplada   | Agentes conectados por EventBus, escalables de forma independiente.                                     |
| 5   | Normalización semántica    | Embeddings (`text‑embedding‑3‑small`) evitan duplicados y reutilizan facts.                             |
| 6   | Documentación viva         | Swagger UI expone una documentación interactiva en **`/api-docs`** por defecto.                         |

## Arquitectura de agentes + Modelos

### ValidatorAgent

- **Modelo LLM:** Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`).
- Analiza texto, detecta afirmaciones problemáticas.
- Decide si lanzar verificación factual y emite `FACTUAL_CHECK_REQUIRED`.
- Usa embeddings de OpenAI para normalizar claims.

### FactCheckerAgent

- **Modelo LLM:** GPT‑4o (`gpt-4o`).
- Escucha `FACTUAL_CHECK_REQUIRED`, lanza búsquedas externas y sintetiza evidencia.
- Devuelve veredicto con fuentes a través de `FACTUAL_VERIFICATION_RESULT`.

> 🚫 **Embeddings:** Se emplea `text‑embedding‑3‑small` de OpenAI; Claude no garantiza consistencia numérica.

#### Elección de modelos LLM – razones de diseño

| Agente           | Modelo por defecto       | Por qué se eligió                                                               | Alternativas probadas                                                                     |
| ---------------- | ------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ValidatorAgent   | Claude 3.5 Sonnet        | Coste bajo, gran capacidad de clasificación y extracción contextual.            | GPT‑4o Mini (mejor aún, más caro) · GPT‑3.5‑turbo (rápido pero menor calidad).            |
| FactCheckerAgent | GPT‑4o                   | Necesita razonamientos extensos, control de JSON y manejo de múltiples fuentes. | Claude Sonnet (más barato, razonamiento aceptable) · GPT‑4o Mini (balance coste/calidad). |
| Embeddings       | `text‑embedding‑3‑small` | Vectores compactos, consistentes y baratos.                                     | `text‑embedding‑3‑large` (mejor pero más caro).                                           |

> 🚫 **Por qué no Claude para embeddings:** Claude puede emular vectores, pero no garantiza dimensiones fijas ni coherencia numérica, lo que rompe la deduplicación y comparación semántica.

##### Cambiar de modelo

Los modelos de cada agente son **configurables** mediante variables de entorno, por lo que puedes mezclar proveedores según tus necesidades:

```env
# Ejemplos
VALIDATOR_MODEL=claude-3-5-sonnet-20241022   # o gpt-4o, gpt-4o-mini, gpt-3.5-turbo
FACTCHECKER_MODEL=gpt-4o                     # o claude-3-5-sonnet-20241022
```

**Recomendaciones prácticas**

| Escenario                              | ValidatorAgent | FactCheckerAgent | Motivo                                                          |
| -------------------------------------- | -------------- | ---------------- | --------------------------------------------------------------- |
| Presupuesto ajustado                   | Claude Sonnet  | Claude Sonnet    | Baja latencia y coste mínimo; suficiente para casos simples.    |
| Equilibrio coste / precisión (default) | Claude Sonnet  | GPT‑4o           | Sonnet filtra y clasifica; GPT‑4o razona con múltiples fuentes. |
| Máxima precisión lingüística           | GPT‑4o Mini    | GPT‑4o           | Mayor coherencia textual y justificación, coste superior.       |

##### Experimentos con modelos locales

Durante el desarrollo se evaluaron modelos instalados localmente mediante **Ollama**:

- **Mistral 7B** y **DeepSeek** funcionaban, pero la **latencia** en un equipo sin GPU dedicada era inaceptable (decenas de segundos por petición).
- El consumo de memoria superaba los 8‑10 GB, bloqueando otros servicios.
- Su conocimiento estático y desactualizado perjudicaba la verificación factual.

Por estos motivos se optó por servicios en la nube (OpenAI y Anthropic). No obstante, el sistema es agnóstico: basta con cambiar `VALIDATOR_MODEL` y `FACTCHECKER_MODEL` para apuntar ambos agentes al mismo proveedor si aparece un nuevo modelo compatible.

> 📌 **Consejo:** mantén `text‑embedding-3-small` como embeddings; cambiarlo requiere recalcular todo el índice vectorial y puede afectar la detección de duplicados.

## Tecnologías usadas

Veriqo combina herramientas de back‑end sólidas con servicios de IA en la nube:

- **Lenguaje & Runtime :** TypeScript 5 · Node.js 18
- **Framework :** NestJS 11 (arquitectura modular y DI)
- **Persistencia :** TypeORM 0.3 + MySQL 5.7
- **IA & Embeddings :** OpenAI (GPT‑4o, text‑embedding‑3‑small) · Anthropic (Claude 3.5 Sonnet)
- **Búsqueda externa :** Brave Search API · Google Custom Search API · NewsAPI
- **Observabilidad :** Swagger (OpenAPI) · Logger HTTP con Morgan · Tablas `agent_logs`
- **Calidad de código :** ESLint · Prettier · Zod para parsing seguro

### Dependencias principales

| Capa             | Tecnología                                          |
| ---------------- | --------------------------------------------------- |
| Framework        | NestJS 11                                           |
| Persistencia     | TypeORM 0.3 + MySQL 5.7+                            |
| Agentes IA       | GPT‑4o (OpenAI), Claude 3.5 Sonnet (Anthropic)      |
| Embeddings       | `text‑embedding‑3‑small` (OpenAI)                   |
| Búsqueda externa | Brave Search API, Google Custom Search API, NewsAPI |
| Observabilidad   | Swagger, logger avanzado                            |

## Instalación

### Requisitos previos

- Node.js ≥ 18
- MySQL 5.7+
- Conexión a Internet

### Pasos rápidos

```bash
git clone https://github.com/david-losas/veriqo-server.git
cd veriqo-server
npm install
cp env.example env # Rellena tus claves
npm run start:dev
```

- API base: **http://localhost:3001/api**
- Documentación Swagger: **http://localhost:3001/api-docs**

## Variables de entorno `.env`

```env
OPENAI_API_KEY=
NEWS_API_KEY=
CLAUDE_API_KEY=
BRAVE_API_KEY=
GOOGLE_CLOUD_API_KEY=
GOOGLE_CX_ID=
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=veriqo
PORT=3001
VALIDATOR_MODEL=claude-3-5-sonnet-20241022
FACTCHECKER_MODEL=gpt-4o
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_MODEL_PROVIDER=openai
FACT_CHECK_CACHE_DAYS=180
EMBEDDING_SIMILARITY_THRESHOLD=80
```

### Explicación de variables clave

- **Claves de API** – OPENAI, NEWS_API, CLAUDE, BRAVE, GOOGLE (CSE) y CX ID.
- **Base de datos** – `DB_TYPE`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- **Servidor** – `PORT` (3001 por defecto).
- **Modelos** – `VALIDATOR_MODEL`, `FACTCHECKER_MODEL`, embeddings y proveedor.
- **Otros** – `FACT_CHECK_CACHE_DAYS`, `EMBEDDING_SIMILARITY_THRESHOLD`.

## Base de datos y trazabilidad

| Tabla                 | Propósito                         |
| --------------------- | --------------------------------- |
| `agent_findings`      | Hallazgos del ValidatorAgent.     |
| `agent_facts`         | Resultado factual consolidado.    |
| `agent_verifications` | Reasoning + fuentes.              |
| `agent_sources`       | URLs de evidencia.                |
| `agent_logs`          | Registro técnico de cada llamada. |
| `agent_events`        | Flujo de eventos.                 |

## Documentación Swagger

La configuración por defecto genera un documento OpenAPI usando `@nestjs/swagger` y lo sirve en **`/api-docs`**:

```ts
const config = new DocumentBuilder();
setTitle('Veriqo API');
setDescription('Backend de verificación factual automática.');
setVersion('1.0');
addTag('veriqo');
build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

> Puedes modificar título, descripción o ruta cambiando estos parámetros en `main.ts`.

## Endpoints REST

La API tiene un prefijo global **`/api`**. Se incluye una colección de Postman para pruebas.

A continuación se muestran los endpoints definitivos agrupados por dominio.

### Validator Agent

| Método | Ruta                           | Descripción                                                    |
| ------ | ------------------------------ | -------------------------------------------------------------- |
| `POST` | `/agents/validator`            | Analiza un texto y detecta afirmaciones factuales.             |
| `GET`  | `/agents/validator/findings`   | Devuelve todos los hallazgos detectados por el ValidatorAgent. |
| `GET`  | `/agents/validator/:findingId` | Recupera un hallazgo concreto por su ID.                       |

#### Ejemplo de **petición** y **respuesta** — `POST /agents/validator`

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

#### Parámetro `waitForFact`

Este parámetro opcional permite controlar si el `ValidatorAgent` debe esperar a que el `FactCheckerAgent` complete la verificación factual antes de devolver la respuesta. Esto es útil cuando se desea obtener directamente el resultado final sin hacer múltiples llamadas.

- `waitForFact: true` — El `ValidatorAgent` esperará una cantidad limitada de tiempo (timeout interno) hasta que la verificación factual termine. Ideal para clientes que necesitan una respuesta inmediata y completa (claim + veredicto).
- `waitForFact: false` — Se devuelve el hallazgo inicial sin esperar el resultado factual. Útil para análisis en batch o interfaces que pueden consultar después.

> ⚠️ Si no se especifica, el valor por defecto es `false`.

#### Ejemplo de **respuesta** — `GET /agents/validator/:findingId`

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

#### Ejemplo de **respuesta** — `GET /agents/validator/findings`

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
        },
        {
            "id": "81dd1244-ce26-49a0-9636-75d9027663a2",
            "claim": "Trump ha puesto aranceles a un montón de países en 2025",
            "category": "factual_error",
            "summary": "Afirmación sobre acciones futuras que no pueden verificarse en el presente"
        }
    ]
}
```

### Fact Checker Agent

| Método | Ruta                                                 | Descripción                                                        |
| ------ | ---------------------------------------------------- | ------------------------------------------------------------------ |
| `POST` | `/agents/fact-checker`                               | Verifica una afirmación concreta usando fuentes reales.            |
| `GET`  | `/agents/fact-checker/last`                          | Devuelve la última verificación realizada.                         |
| `GET`  | `/agents/fact-checker/history`                       | Devuelve el historial completo de verificaciones.                  |
| `GET`  | `/agents/fact-checker/facts/:claim`                  | Recupera la verificación asociada a un claim concreto (si existe). |
| `GET`  | `/agents/fact-checker/verifications/:verificationId` | Recupera una verificación concreta por ID.                         |

#### Ejemplo de **petición** y **respuesta** — `POST /agents/fact-checker`

```json
{
    "claim": "EEUU y Reino Unido desarrollan tecnología hipersónica para misiles"
}
```

```json
{
    "status": "ok",
    "message": "Verificación completada.",
    "data": {
        "claim": "EEUU y Reino Unido desarrollan tecnología hipersónica para misiles",
        "status": "possibly_true",
        "sources": ["https://..."],
        "checkedAt": "2025-04-17T00:59:06.130Z",
        "reasoning": "Las fuentes confirman que tanto EE.UU. como Reino Unido...",
        "sources_retrieved": ["https://..."],
        "sources_used": ["https://..."]
    }
}
```

#### Ejemplo de **respuesta** — `GET /agents/fact-checker/verifications/:verificationId`

```json
{
    "status": "ok",
    "message": "Verificación encontrada.",
    "data": {
        "id": "56a67625-ed7c-414f-b23e-d44dc76f8642",
        "claim": "Trump ha puesto aranceles a un montón de países en 2025",
        "result": "unknown",
        "reasoning": "La fuente proporcionada no menciona aranceles de Trump en 2025.",
        "sourcesUsed": ["https://..."],
        "checkedAt": "2025-04-17T00:14:35.173Z"
    }
}
```

_Campos clave_

- **`result`** — `true`, `false`, `possibly_true` o `unknown`.
- **`reasoning`** — Explicación resumida basada en las fuentes.
- **`sourcesUsed`** — URLs consideradas evidencia directa.

#### Ejemplo de respuesta — `GET /agents/fact-checker/verifications/:verificationId`

```json
{
    "status": "ok",
    "message": "Verificación encontrada.",
    "data": {
        "id": "56a67625-ed7c-414f-b23e-d44dc76f8642",
        "claim": "Trump ha puesto aranceles a un montón de países en 2025",
        "result": "unknown",
        "reasoning": "La fuente proporcionada no menciona aranceles de Trump en 2025.",
        "sourcesUsed": ["https:/..."],
        "checkedAt": "2025-04-17T00:14:35.173Z"
    }
}
```

_Campos clave_

- **`result`** — `true`, `false`, `possibly_true` o `unknown`.
- **`reasoning`** — Explicación resumida basada en las fuentes.
- **`sourcesUsed`** — URLs consideradas evidencia directa.

#### Ejemplo de respuesta — `GET /agents/fact-checker/facts/:claim`

```json
{
    "status": "ok",
    "message": "Verificación encontrada.",
    "data": {
        "id": "f05caa18-c6c6-47d6-ac18-01aa9de2c476",
        "claim": "Trump ha puesto aranceles a un montón de países en 2025",
        "normalizedClaim": "trump ha puesto aranceles a un montón de países en 2025",
        "status": "unknown",
        "sources": ["https:/..."],
        "createdAt": "2025-04-17T00:14:36.395Z",
        "updatedAt": "2025-04-17T00:14:36.395Z",
        "reasoning": "La fuente proporcionada no contiene información relevante…",
        "sources_retrieved": ["https:/..."],
        "sources_used": ["https:/..."]
    }
}
```

_Nota:_ el array **`embedding`** contiene 1.536 valores _float_; aquí sólo se muestran los primeros para mantener el ejemplo legible.

#### Ejemplo de respuesta — `GET /agents/fact-checker/last`

````json
{
    "status": "ok",
    "message": "Última verificación obtenida.",
    "data": {
        "claim": "En 2024 el precio del aceite en España se ha disparado",
        "status": "true",
        "sources": [
            "https:/...",
        ],
        "checkedAt": "2025-04-17T00:53:12.807Z",
        "reasoning": "Varias fuentes confirman que el precio del aceite en España...",
        "sources_retrieved": [
            "https:/...",
        ],
        "sources_used": [
            "https:/...",
        ],
        "findingId": "a40d7b98-9ba3-4753-9aa1-a52c21da2008"
    }
}
```json
{
    "status": "ok",
    "message": "Última verificación obtenida.",
    "data": {
        "claim": "En 2024 el precio del aceite en España se ha disparado",
        "status": "unknown",
        "sources": [
            "https:/...",
        ],
        "checkedAt": "2025-04-17T00:44:00.108Z",
        "reasoning": "Las fuentes proporcionadas no ofrecen información directa ni clara sobre el precio del aceite en España en 2024. Las menciones se centran en otros productos y aspectos económicos (torrijas, carne, huevos, etc.).",
        "sources_retrieved": [
            "https:/...",
        ],
        "sources_used": [],
        "findingId": "a40d7b98-9ba3-4753-9aa1-a52c21da2008"
    }
}
````

#### Ejemplo de respuesta — `GET /agents/fact-checker/history`

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
            "sourcesUsed": ["https:/..."],
            "…": "..."
        },
        {
            "id": "13ea6a39-4b7f-411a-9b47-1bbf93e5d2f9",
            "checkedAt": "2025-04-16T23:56:00Z",
            "claim": "David Losas es desarrollador web",
            "result": "possibly_true",
            "sources": 5,
            "reasoning": "Varias biografías públicas señalan que trabaja como desarrollador web…",
            "sourcesUsed": ["https:/..."],
            "…": "..."
        },
        {
            "id": "9b6d0f0e-2a82-4203-b9c8-671ad1e1d21b",
            "checkedAt": "2025-04-16T23:43:00Z",
            "claim": "David Losas colabora en OSS con TypeScript",
            "result": "unknown",
            "sources": 0,
            "reasoning": "No se encontraron pruebas públicas recientes que confirmen o desmientan con certeza.",
            "sourcesUsed": ["https:/..."],
            "…": "..."
        }
    ]
}
```

_Ejemplo simplificado: se muestran los campos principales y algunos valores acortados con «…» para indicar que la respuesta real incluye propiedades adicionales (por ejemplo, `tokensInput`, `elapsedMs`, etc.)._

### Core (diagnóstico global)

| Método | Ruta                | Descripción                                                |
| ------ | ------------------- | ---------------------------------------------------------- |
| `GET`  | `/core/logs`        | Devuelve todos los logs registrados por los agentes.       |
| `GET`  | `/core/prompts`     | Devuelve los prompts configurados por agente.              |
| `GET`  | `/core/events`      | Devuelve todos los eventos emitidos por el bus de agentes. |
| `GET`  | `/core/log-summary` | Resumen del uso de motores de búsqueda y resultados.       |
| `GET`  | `/core/metrics`     | Métricas globales de cobertura factual y categorías.       |

#### Ejemplo de respuesta — `GET /core/metrics`

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

#### Ejemplo de respuesta — `GET /core/log-summary`

```json
{
    "status": "ok",
    "message": "Resumen de logs.",
    "data": {
        "totalLogs": 42,
        "engines": {
            "brave": 25,
            "google": 10,
            "newsapi": 4,
            "fallback": 2,
            "unknown": 1
        },
        "averageResults": {
            "brave": 12,
            "google": 8,
            "newsapi": 5,
            "fallback": 3,
            "unknown": 0
        }
    }
}
```

_Campos clave_

- **`engines`** — Número de llamadas a cada motor de búsqueda.
- **`averageResults`** — Media de resultados útiles devueltos por motor.

#### Ejemplo de respuesta — `GET /core/logs`

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

_Campos clave_

- **`agentName`** — Agente que generó el log.
- **`model`** — Modelo o combinación usada para la operación.
- **`engineUsed`** — Motor de búsqueda invocado (puede ser `null`).
- **`tokensInput` / `tokensOutput`** — Tokens consumidos (si se ha activado el conteo).
- **`totalResults`** — Número de resultados que devolvió el motor.
- **`createdAt`** — Timestamp ISO.

#### Ejemplo de respuesta — `GET /core/events`

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

_Campos clave_

- **`emitterAgent`** — Agente que originó el evento.
- **`type`** — Tipo de evento (`factual_check_required`, `factual_verification_result`, etc.).
- **`payloadSummary`** — Resumen abreviado del contenido real del payload (el JSON completo puede incluir reasoning, sources, etc.).
- **`status`** — Estado interno del evento (`pending`, `processed`, `failed`).
- **`createdAt`** — Timestamp ISO.

#### Ejemplo de respuesta — `GET /core/prompts`

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

_Nota:_ se muestran solo los campos esenciales y el **prompt** se ha truncado para brevedad; la respuesta completa incluye `id`, `createdAt` y `updatedAt`.

## Guía de desarrollo la documentación Swagger interactiva en* **`/api-docs`** *para probar cada endpoint.\*

## Guía de desarrollo y scripts

| Script              | Propósito                                                     |
| ------------------- | ------------------------------------------------------------- |
| `npm run start`     | Ejecuta la build optimizada (`dist/main.js`).                 |
| `npm run start:dev` | Modo desarrollo con hot‑reload gracias a **Nest CLI**.        |
| `npm run build`     | Transpila TypeScript a `/dist`.                               |
| `npm run format`    | Ejecuta **Prettier** para formatear el código fuente.         |
| `npm run lint`      | Linter **ESLint** con reglas de Import y Prettier integradas. |

> 🔧 Las migraciones TypeORM y pruebas con Jest están planeadas pero **deshabilitadas** en la primera versión estable para centrar el esfuerzo en la arquitectura de agentes.

### Dependencias destacadas

| Tipo           | Paquete               | Nota                                  |
| -------------- | --------------------- | ------------------------------------- |
| Core           | `@nestjs/core`        | Framework principal.                  |
| IA             | `openai`              | Acceso a GPT‑4o y embeddings.         |
| IA             | `axios`               | HTTP cliente para Brave y Google CSE. |
| ORM            | `typeorm`             | Persistencia MySQL.                   |
| BDD            | `mysql2`              | Driver MySQL.                         |
| Validación     | `class-validator`     | DTO validation.                       |
| Transformación | `class-transformer`   | Serialización limpia.                 |
| Esquemas       | `zod`                 | Parsing seguro de respuestas IA.      |
| Dev            | `typescript`          | TS moderno.                           |
| Dev            | `@nestjs/cli`         | CLI con scaffolding y hot‑reload.     |
| Dev            | `eslint` + `prettier` | Calidad de código.                    |

## Licencia

Distribuido bajo los términos de la [Licencia MIT](LICENSE), lo que permite su uso, modificación y distribución con la debida atribución.

## Autor

**David Losas González**

- LinkedIn: <https://www.linkedin.com/in/david-losas-gonzález-2ba888174>
- Email: <david.losas.gonzalez@gmail.com>
