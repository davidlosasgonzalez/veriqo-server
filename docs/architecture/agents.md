# 📀 Arquitectura de Agentes

Este documento describe en detalle los dos agentes clave que sustentan la verificación factual automatizada en **Veriqo**: el **ValidatorAgent** y el **FactCheckerAgent**.

## 🤖 ValidatorAgent

- **Modelo LLM:** Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`)
- **Responsabilidad principal:** Detectar afirmaciones que requieren verificación factual externa.
- **Eventos emitidos:** `FACTUAL_CHECK_REQUIRED`

### ⚖️ Parámetros clave:

- **`waitForFact`** (boolean):

    - `true`: Si el ValidatorAgent detecta que la afirmación requiere verificación externa, espera a que el FactCheckerAgent complete el proceso y devuelva un veredicto final antes de responder. Esto garantiza que el resultado devuelto al usuario ya incluye la verificación factual completa en caso de ser necesaria.
    - `false`: Retorna únicamente el análisis preliminar, lo que resulta útil para flujos por lotes o asincrónicos donde la verificación puede completarse posteriormente.

    > ⚠️ Este parámetro no está en uso. Formaba parte de una implementación anterior que funcionaba correctamente, pero quedó pendiente de reimplementación tras la modularización del sistema. Se ha mantenido porque se planea reutilizarlo en el futuro para permitir respuestas asincrónicas coordinadas entre agentes.

- **`needsFactCheck`**: Indica si la afirmación detectada debe ser confirmada externamente.
- **`needsFactCheckReason`**: Justificación breve para delegar al FactCheckerAgent.

### ↺ Flujo operativo:

1. Recibe petición `POST /validators/analyze` con el parámetro `prompt`.
2. Utiliza embeddings (OpenAI `text-embedding-3-small`) para normalizar y detectar afirmaciones clave.
3. Clasifica la afirmación:

    - **Sin errores detectados**: Responde inmediatamente con `data: []`.
    - **Ambigüedad o error factual**: Retorna detalles claros y establece `needsFactCheck: true`.

4. Si `waitForFact: true` y `needsFactCheck: true`, activa un timeout mientras espera respuesta del FactCheckerAgent.

## 🌐 FactCheckerAgent

- **Modelo LLM:** GPT‑4o (`gpt-4o`)
- **Responsabilidad principal:** Consultar fuentes externas y verificar la exactitud de las afirmaciones recibidas.
- **Eventos atendidos:** `FACTUAL_CHECK_REQUIRED`
- **Eventos emitidos:** `FACTUAL_VERIFICATION_RESULT`

### 📌 APIs externas utilizadas:

- **Brave Search API**: Alta privacidad y resultados actuales.
- **Google Custom Search API**: Cobertura amplia con resultados precisos.
- **NewsAPI**: Noticias recientes y fuentes periodísticas acreditadas.

### 📡 Parámetros clave en la respuesta:

- **`status`** (`true`, `false`, `possibly_true`, `unknown`): Estado de la verificación.
- **`sourcesRetrieval`**: URLs de todas las fuentes consultadas durante la búsqueda.
- **`sourcesUsed`**: URLs específicas utilizadas como evidencia directa.
- **`checkedAt`**: Timestamp ISO 8601 cuando se realizó la verificación.

### 🛠️ Proceso interno:

1. Escucha eventos del tipo `FACTUAL_CHECK_REQUIRED`.
2. Ejecuta búsqueda simultánea en APIs externas.
3. Sintetiza los resultados mediante GPT-4o:

    - Evalúa relevancia semántica de resultados obtenidos.
    - Genera un JSON claro con conclusiones y fuentes utilizadas.

4. Publica el evento `FACTUAL_VERIFICATION_RESULT`, devolviendo la información sintetizada para su uso inmediato.

### 🌟 Ejemplo de respuesta factual:

```json
{
    "claim": "El presidente actual de España es Pedro Sánchez.",
    "status": "true",
    "sourcesRetrieval": [
        "https://es.wikipedia.org/wiki/Pedro_Sánchez",
        "https://elpais.com/...",
        "https://newsapi.org/..."
    ],
    "sourcesUsed": [
        "https://es.wikipedia.org/wiki/Pedro_Sánchez",
        "https://elpais.com/..."
    ],
    "checkedAt": "2025-04-12T14:36:05.814Z"
}
```

## 📈 Escalabilidad y Trazabilidad

- Ambos agentes pueden desplegarse horizontalmente en múltiples instancias sin estado gracias a la arquitectura basada en eventos (`EventBus`).
- Todas las verificaciones y análisis son registrados con precisión en MySQL, incluyendo:

    - Estado de verificación, fuentes utilizadas, logs de eventos y métricas de rendimiento.

- Esto permite un debugging sencillo y una auditoría completa del proceso factual.
