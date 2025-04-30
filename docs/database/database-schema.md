# 🗄️ Esquema de Base de Datos – Veriqo

Este documento describe todas las tablas principales utilizadas por el sistema Veriqo, explicando su propósito, columnas clave y relaciones entre entidades.

## 📊 Tablas principales

### `agent_facts`

Registra los hechos verificados por el sistema, generados por agentes o a partir de verificaciones externas.

| Columna      | Tipo      | Descripción                                                |
| ------------ | --------- | ---------------------------------------------------------- |
| `id`         | UUID      | Identificador único del fact.                              |
| `status`     | Enum      | Estado del fact: `validated`, `rejected`, `fact_checking`. |
| `category`   | Enum      | Categoría semántica (`factual`, `opinion`, `other`).       |
| `created_at` | Timestamp | Fecha de creación.                                         |
| `updated_at` | Timestamp | Fecha de última actualización.                             |

🔁 Relación:

- Uno a muchos con `agent_findings`, `agent_verifications` y `agent_reasonings`.

### `agent_findings`

Almacena las afirmaciones detectadas por el `ValidatorAgent` y sus embeddings.

| Columna                   | Tipo             | Descripción                                         |
| ------------------------- | ---------------- | --------------------------------------------------- |
| `id`                      | UUID             | Identificador único del hallazgo.                   |
| `claim`                   | Texto            | Afirmación detectada.                               |
| `embedding`               | JSON             | Vector semántico de la afirmación.                  |
| `needs_fact_check_reason` | Texto (nullable) | Justificación de por qué requiere revisión factual. |
| `related_fact_id`         | UUID             | Clave foránea hacia el fact correspondiente.        |
| `created_at`              | Timestamp        | Fecha de creación.                                  |
| `updated_at`              | Timestamp        | Fecha de última modificación.                       |

🔁 Relación:

- Muchos a uno con `agent_facts`.
- Uno a uno con `agent_finding_search_contexts`.

### `agent_finding_search_contexts`

Define el contexto de búsqueda asociado a un `AgentFinding`, útil para enriquecer verificaciones.

| Columna            | Tipo      | Descripción                                              |
| ------------------ | --------- | -------------------------------------------------------- |
| `id`               | UUID      | Identificador único del contexto.                        |
| `search_query`     | JSON      | Consulta estructurada generada automáticamente.          |
| `site_suggestions` | Array     | Sitios recomendados para enfocar la búsqueda (opcional). |
| `finding_id`       | UUID      | Relación 1:1 con `agent_findings`.                       |
| `created_at`       | Timestamp | Fecha de creación.                                       |
| `updated_at`       | Timestamp | Fecha de última modificación.                            |

### `agent_verification`

Contiene los resultados de verificaciones externas realizadas por el `FactCheckerAgent`.

| Columna             | Tipo      | Descripción                                            |
| ------------------- | --------- | ------------------------------------------------------ |
| `id`                | UUID      | Identificador único.                                   |
| `engine_used`       | Enum      | Motor de búsqueda utilizado (`google`, `brave`, etc.). |
| `confidence`        | Float     | Nivel de confianza en la verificación.                 |
| `sources_retrieved` | JSON      | Fuentes recuperadas durante la búsqueda.               |
| `sources_used`      | JSON      | Fuentes efectivamente utilizadas.                      |
| `is_outdated`       | Boolean   | Indica si la verificación está desactualizada.         |
| `reasoning_id`      | UUID      | Relación 1:1 con el razonamiento generado.             |
| `fact_id`           | UUID      | Fact asociado.                                         |
| `created_at`        | Timestamp | Fecha de creación.                                     |
| `updated_at`        | Timestamp | Fecha de modificación.                                 |

### `agent_reasoning`

Representa el razonamiento generado por el sistema para justificar un fact.

| Columna           | Tipo      | Descripción                                           |
| ----------------- | --------- | ----------------------------------------------------- |
| `id`              | UUID      | Identificador del razonamiento.                       |
| `summary`         | Texto     | Resumen breve del razonamiento.                       |
| `content`         | Texto     | Razonamiento completo.                                |
| `verification_id` | UUID      | Verificación que lo originó (si aplica).              |
| `fact_id`         | UUID      | Fact al que pertenece (si fue generado internamente). |
| `created_at`      | Timestamp | Fecha de creación.                                    |
| `updated_at`      | Timestamp | Fecha de última modificación.                         |

### `agent_prompt`

Define fragmentos de prompt que utilizan los agentes para distintas funcionalidades.

| Columna      | Tipo      | Descripción                                           |
| ------------ | --------- | ----------------------------------------------------- |
| `id`         | UUID      | Identificador del prompt.                             |
| `agent`      | Texto     | Nombre del agente asociado.                           |
| `type`       | Texto     | Tipo de funcionalidad (ej: validation, reasoning...). |
| `role`       | Enum      | Rol del mensaje (`system`, `user`, etc.).             |
| `content`    | Texto     | Contenido del prompt.                                 |
| `created_at` | Timestamp | Fecha de creación.                                    |
| `updated_at` | Timestamp | Fecha de modificación.                                |

### `agent_logs`

Registra cada ejecución de modelo por parte de los agentes para trazabilidad y auditoría.

| Columna         | Tipo      | Descripción                       |
| --------------- | --------- | --------------------------------- |
| `id`            | UUID      | Identificador único del log.      |
| `agent_name`    | Texto     | Agente que generó el log.         |
| `model`         | Texto     | Modelo utilizado.                 |
| `input_prompt`  | Texto     | Prompt enviado.                   |
| `output_result` | Texto     | Resultado recibido.               |
| `tokens_input`  | Entero    | Tokens enviados al modelo.        |
| `tokens_output` | Entero    | Tokens generados en la respuesta. |
| `elapsed_time`  | Float     | Duración en segundos.             |
| `prompt_id`     | UUID      | Prompt asociado (opcional).       |
| `created_at`    | Timestamp | Fecha del log.                    |

## 📚 Consideraciones

- Todas las entidades usan UUIDs para identificación.
- Los campos de auditoría (`created_at`, `updated_at`) están presentes en todas las tablas.
- La base de datos es relacional y compatible con MySQL o PostgreSQL.
- Las relaciones están bien normalizadas y respetan la trazabilidad factual de extremo a extremo.
