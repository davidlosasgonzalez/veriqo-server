# ❓ Preguntas Frecuentes (FAQ)

## ¿Qué hace exactamente Veriqo?

Veriqo es un backend modular de verificación factual automática. Detecta afirmaciones verificables en un texto, decide si requieren verificación externa y, si es el caso, lanza una verificación automática usando modelos LLM y motores de búsqueda activos (Brave, Google, NewsAPI).

## ¿Necesito claves API para usarlo?

Sí. El sistema requiere configuración de claves API para operar correctamente:

- OpenAI (GPT-4o y embeddings)
- Anthropic Claude (usado por el ValidatorAgent)
- Brave Search API
- Google Custom Search API
- NewsAPI

Puedes configurarlas en el archivo `.env`. Consulta [Variables de entorno](../setup/env-variables.md).

## ¿Dónde se almacena la información?

Toda la trazabilidad se guarda en una base de datos MySQL:

- Prompts usados
- Logs de ejecución
- Hallazgos detectados
- Razonamientos generados
- Verificaciones externas

Todo gestionado mediante TypeORM con entidades fuertemente tipadas.

## ¿Cuál es la diferencia entre ValidatorAgent y FactCheckerAgent?

- **ValidatorAgent** analiza texto, detecta afirmaciones y decide si pueden ser validadas internamente o necesitan evidencia externa.
- **FactCheckerAgent** entra en acción cuando se requiere verificación externa. Consulta APIs de búsqueda, evalúa las fuentes y genera un razonamiento con GPT-4o.

Ambos agentes están desacoplados y se comunican mediante eventos (`EventBus`).

## ¿Cómo puedo probar la API rápidamente?

- Usa los comandos `curl` incluidos en el [`README.md`](../../README.md)
- O importa la colección de Postman ubicada en `docs/postman/veriqo-api-collection.json`

## ¿Dónde puedo explorar la API visualmente?

Puedes usar Swagger UI accediendo a:

```
http://localhost:3001/api-docs
```

Allí encontrarás documentados todos los endpoints, modelos y ejemplos de respuesta.

## ¿Veriqo se puede escalar a producción?

Sí. Está diseñado para funcionar en entornos distribuidos. Gracias a su arquitectura desacoplada y basada en eventos, es posible:

- Desplegar agentes en módulos o instancias independientes
- Realizar horizontal scaling sin afectar el rendimiento
- Lograr trazabilidad completa de todas las decisiones tomadas por el sistema

## ¿Puedo usar otros modelos LLM?

Sí. Veriqo permite configurar los modelos de cada agente desde `.env`:

```env
LLM_VALIDATOR_MODEL=claude-3-5-sonnet-20241022
LLM_FACTCHECKER_MODEL=gpt-4o
```

Para garantizar validación estricta y evitar errores en tiempo de ejecución, todos los modelos permitidos deben estar registrados en el enum `LlmModel`:

```
src/shared/domain/enums/llm-model.enum.ts
```

Esto permite usar `z.nativeEnum(LlmModel)` en `env.config.ts`, con soporte completo de validación y autocompletado TypeScript.

## ¿Veriqo está listo para producción?

El sistema está actualmente en **versión beta**. Es funcional, modular y está siendo probado en entornos reales. Algunas características pueden cambiar o ajustarse antes del lanzamiento estable `1.0.0`. Sin embargo, su arquitectura ya es robusta y lista para despliegues controlados.
