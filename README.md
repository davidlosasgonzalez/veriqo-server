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

La API tiene un prefijo global `/api`. Se incluye una colección de Postman para pruebas.

A continuación se muestran los endpoints definitivos agrupados por dominio.

### 📁 Validators

| Método | Endpoint                   | Descripción                                                    |
| ------ | -------------------------- | -------------------------------------------------------------- |
| `POST` | `/validators/analyze`      | Analiza un texto y detecta afirmaciones factuales.             |
| `GET`  | `/validators/findings`     | Devuelve todos los hallazgos detectados por el ValidatorAgent. |
| `GET`  | `/validators/findings/:id` | Recupera un hallazgo concreto por su ID.                       |

#### Ejemplo — `POST /validators/analyze`

**Sobre `waitForFact`:**

Este parámetro opcional permite decidir si el `ValidatorAgent` debe esperar a que el `FactCheckerAgent` complete su verificación antes de devolver la respuesta. Es especialmente útil para aplicaciones en las que se desea obtener una respuesta final en una sola llamada.

| Opción                         | Descripción                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `waitForFact: true`            | El `ValidatorAgent` espera (con timeout) a que el `FactCheckerAgent` termine y devuelve una respuesta enriquecida si se requiere verificación factual. |
| `waitForFact: false` (default) | Devuelve solo el análisis inicial. Ideal para procesar múltiples afirmaciones en batch.                                                                |

> **Recomendación:** Usa `waitForFact: true` cuando quieras obtener la verificación completa de una afirmación en una única llamada HTTP.

#### Ejemplo — `POST /validators/analyze`

Afirmación válida (no se detecta ningún error factual):

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

Afirmación que requiere verificación factual externa (`needsFactCheck: true`):

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

Afirmación con error factual claro detectado por el modelo:

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

| Método | Endpoint                               | Descripción                                                        |
| ------ | -------------------------------------- | ------------------------------------------------------------------ |
| `POST` | `/facts/verify`                        | Verifica una afirmación concreta usando fuentes reales.            |
| `POST` | `/facts/claim`                         | Recupera la verificación asociada a un claim concreto (si existe). |
| `GET`  | `/facts/verifications/last`            | Devuelve la última verificación realizada.                         |
| `GET`  | `/facts/verifications/:id`             | Recupera una verificación concreta por ID.                         |
| `GET`  | `/facts/verifications/:factId/history` | Devuelve el historial completo de verificaciones.                  |

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
| `GET`  | `/core/stats`          | Métricas globales de verificación factual (claims, resultados, categorías). |
| `GET`  | `/core/metrics`        | Métricas globales de cobertura factual y categorías.                        |

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
            "tokensInput": 0,
            "tokensOutput": 0,
            "searchQuery": null,
            "engineUsed": "brave",
            "totalResults": 10,
            "createdAt": "2025-04-18T14:50:54.152Z"
        },
        {
            "agentName": "FactCheckerAgent",
            "model": "news+brave+google+claude",
            "inputPrompt": "David Losas colabora activamente...",
            "outputResult": "{ \"claim\": \"David Losas...\", \"status\": \"unknown\", ... }",
            "tokensInput": 0,
            "tokensOutput": 0,
            "searchQuery": null,
            "engineUsed": "brave",
            "totalResults": 10,
            "createdAt": "2025-04-18T14:50:54.152Z"
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
            "purpose": "principal",
            "createdAt": "2025-04-18T12:05:02.091Z",
            "updatedAt": "2025-04-18T12:05:02.091Z"
        },
        {
            "agent": "fact_checker_agent",
            "prompt": "Eres un agente verificador experto. Tu misión es analizar si una afirmación…",
            "purpose": "principal",
            "createdAt": "2025-04-18T12:05:02.091Z",
            "updatedAt": "2025-04-18T12:05:02.091Z"
        },
        {
            "agent": "validator_agent",
            "prompt": "Eres un agente de validación experto. Tu misión es analizar textos y detectar afirmaciones…",
            "purpose": "principal",
            "createdAt": "2025-04-18T12:05:02.091Z",
            "updatedAt": "2025-04-18T12:05:02.091Z"
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

## Guía de desarrollo la documentación Swagger interactiva en* **`/api-docs`** *para probar cada endpoint.

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
