# ❓ Preguntas Frecuentes (FAQ)

## ¿Qué hace exactamente Veriqo?

Veriqo es un backend de verificación factual automática. Detecta afirmaciones en textos, evalúa si son verificables y, si es necesario, lanza una verificación externa usando modelos LLM y búsquedas activas en Internet.

## ¿Necesito claves API para usarlo?

Sí. Necesitarás claves para:

- OpenAI (modelos y embeddings)
- Anthropic (Claude)
- Brave Search API
- Google Custom Search API
- NewsAPI

Estas se configuran en el archivo `.env`. Consulta [Variables de entorno](../setup/env-variables.md).

## ¿Dónde se almacena la información?

Toda la trazabilidad (prompts, hallazgos, verificaciones, métricas) se guarda en una base de datos MySQL usando TypeORM.

## ¿Qué diferencia hay entre ValidatorAgent y FactCheckerAgent?

- **ValidatorAgent** detecta afirmaciones relevantes y decide si requieren verificación factual.
- **FactCheckerAgent** realiza la verificación consultando fuentes externas y devolviendo evidencia.

## ¿Cómo puedo probar la API rápidamente?

Usa los comandos `curl` del `README.md` o importa la colección Postman incluida en `docs/postman/veriqo-api-collection.json`.

## ¿Dónde puedo explorar la API visualmente?

Puedes acceder a la documentación interactiva desde [`/api-docs`](http://localhost:3001/api-docs) con Swagger UI. También puedes usar Postman con la colección oficial incluida.

## ¿Se puede escalar a producción?

Sí. El sistema está diseñado con agentes desacoplados y lógica basada en eventos, lo que permite despliegues distribuidos, horizontal scaling y trazabilidad completa.

## ¿Qué modelos puedo cambiar?

Puedes configurar los modelos de cada agente en el archivo `.env` usando las variables `LLM_VALIDATOR_MODEL` y `LLM_FACTCHECKER_MODEL`.

Para garantizar un tipado estricto y validación en tiempo de desarrollo, los modelos disponibles deben añadirse explícitamente en el enum `LlmModel`, ubicado en:

```
src/shared/types/enums/llm-model.types.ts
```

Esto permite que el validador de entorno (`env.config.ts`) use `z.nativeEnum(LlmModel)` con soporte completo de tipos.

Puedes configurar los modelos de cada agente en el archivo `.env` usando las variables `LLM_VALIDATOR_MODEL` y `LLM_FACTCHECKER_MODEL`.
