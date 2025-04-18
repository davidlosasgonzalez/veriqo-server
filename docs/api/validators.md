← Volver a [README.md](../README.md)

# 📡 API – ValidatorAgent

Todos los endpoints están prefijados con `/api`.

## 🧾 Endpoints disponibles

| Método | Ruta                       | Descripción                                            |
| ------ | -------------------------- | ------------------------------------------------------ |
| `POST` | `/validators/analyze`      | Analiza un texto para detectar afirmaciones factuales. |
| `GET`  | `/validators/findings`     | Recupera todos los hallazgos detectados.               |
| `GET`  | `/validators/findings/:id` | Recupera un hallazgo concreto por su ID.               |

## ⚙️ Parámetros comunes

- `waitForFact` (solo en `analyze`): Si es `true`, espera la verificación del FactCheckerAgent antes de responder.

## 📥 Ejemplos de uso

### `POST /validators/analyze`

**Request:**

```json
{
    "prompt": "¿Shakespeare escribió 37 obras de teatro?",
    "waitForFact": true
}
```

**Respuestas posibles:**

✅ **Afirmación válida (sin errores):**

```json
{
    "status": "ok",
    "message": "Afirmación validada correctamente.",
    "data": []
}
```

⚠️ **Requiere verificación externa:**

```json
{
    "status": "ok",
    "message": "Afirmación validada correctamente.",
    "data": [
        {
            "id": "e3b0c442-98fc-1fc0-a1fa-2b749c65e123",
            "claim": "Shakespeare escribió 37 obras de teatro",
            "normalizedClaim": "william shakespeare escribió treinta y siete obras de teatro",
            "category": "factual_error",
            "summary": "Número de obras atribuidas requiere comprobación.",
            "explanation": "La cifra exacta de obras de Shakespeare es debatida y puede variar según criterios de autoría.",
            "suggestion": "Verificar fuentes académicas para conteo oficial de obras.",
            "keywords": ["Shakespeare", "obras de teatro", "autoría"],
            "needsFactCheck": true,
            "needsFactCheckReason": "La cifra exacta es discutida en la literatura académica.",
            "createdAt": "2025-04-18T16:00:00.000Z"
        }
    ]
}
```

❌ **Error factual detectado:**

```json
{
    "status": "ok",
    "message": "Texto analizado correctamente.",
    "data": [
        {
            "id": "acbd18db-4cc2-f85c-94a8-7c5af914826e",
            "claim": "La Tierra es plana",
            "category": "factual_error",
            "summary": "La afirmación contradice la evidencia científica establecida.",
            "explanation": "La Tierra es un esferoide oblato, no plana.",
            "keywords": ["Tierra", "plana", "geodesia"],
            "needsFactCheck": false
        }
    ]
}
```

### `GET /validators/findings`

```json
{
    "status": "ok",
    "message": "Hallazgos recuperados correctamente.",
    "data": [
        // Array de objetos simplificados
    ]
}
```

### `GET /validators/findings/:id`

```json
{
    "status": "ok",
    "message": "Hallazgo recuperado.",
    "data": {
        // Objeto completo del finding
    }
}
```

> 📌 Todos los objetos devueltos incluyen trazabilidad completa del análisis realizado por ValidatorAgent.
