← Volver a [README.md](../README.md)

# 🔄 Flujo Validator → FactChecker

Este documento describe el flujo completo que ocurre cuando una afirmación es analizada por el ValidatorAgent y, si es necesario, verificada por el FactCheckerAgent mediante fuentes externas.

## 🧠 Paso 1 – Análisis inicial (ValidatorAgent)

1. El usuario envía un texto al endpoint `POST /validators/analyze`.
2. `ValidatorAgent` detecta afirmaciones factuales en el texto y determina si alguna necesita verificación externa.
3. Si encuentra una afirmación dudosa, emite un evento `FACTUAL_CHECK_REQUIRED` con los detalles del hallazgo.

## 🌐 Paso 2 – Verificación factual (FactCheckerAgent)

1. `FactCheckerAgent` escucha el evento `FACTUAL_CHECK_REQUIRED`.
2. Ejecuta búsquedas en Brave, Google CSE y NewsAPI.
3. Utiliza GPT‑4o para sintetizar la información obtenida y generar una respuesta factual.
4. Emite el evento `FACTUAL_VERIFICATION_RESULT` con:
    - Estado (`true`, `false`, `possibly_true`, `unknown`)
    - Fuentes consultadas y utilizadas
    - Timestamp de verificación

## 🔁 Paso 3 – Respuesta final

- Si la solicitud original tenía `waitForFact: true`, el ValidatorAgent espera el resultado del FactCheckerAgent antes de devolver la respuesta final.
- Si no, la verificación ocurre en segundo plano y se puede consultar luego desde `/facts/verifications/last` o `/facts/verifications/:id`.

## 🧾 Resumen del flujo de eventos

```mermaid
sequenceDiagram
    participant User
    participant ValidatorAgent
    participant FactCheckerAgent

    User->>ValidatorAgent: POST /validators/analyze
    ValidatorAgent->>ValidatorAgent: Detectar y clasificar afirmaciones
    alt Afirmación requiere verificación externa
        ValidatorAgent-->>FactCheckerAgent: Emitir FACTUAL_CHECK_REQUIRED
        FactCheckerAgent->>FactCheckerAgent: Consultar fuentes externas
        FactCheckerAgent-->>ValidatorAgent: Emitir FACTUAL_VERIFICATION_RESULT
        ValidatorAgent-->>User: Responder con resultado factual
    else Afirmación clara
        ValidatorAgent-->>User: Responder con validación directa
    end
```

> 📌 Este diseño basado en eventos desacopla los agentes, mejora la escalabilidad y permite trazabilidad completa de cada paso del proceso.
