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

## ¿Qué significa `needsFactCheck: true`?

Significa que la afirmación fue considerada ambigua, potencialmente errónea o no verificable automáticamente, y que se requiere intervención del FactCheckerAgent.

## ¿Cómo puedo probar la API rápidamente?

Usa los comandos `curl` del `README.md` o importa la colección Postman incluida en `docs/postman/veriqo-api-collection.json`.

## ¿Dónde puedo explorar la API visualmente?

Puedes acceder a la documentación interactiva desde [`/api-docs`](http://localhost:3001/api-docs) con Swagger UI. También puedes usar Postman con la colección oficial incluida.

## ¿Se puede escalar a producción?

Sí. El sistema está diseñado con agentes desacoplados y lógica basada en eventos, lo que permite despliegues distribuidos, horizontal scaling y trazabilidad completa.

## ¿Puedo generar esta documentación localmente?

Sí. Aunque Veriqo está construido con NestJS (Node.js), la documentación adicional está generada con **MkDocs**, una herramienta basada en Python.

Esto no afecta al backend: es un sistema independiente, solo usado para documentar el proyecto de forma profesional.

Si quieres levantar la documentación localmente, necesitas tener Python instalado y ejecutar:

```bash
pip install mkdocs mkdocs-material
mkdocs serve
```

La documentación también se despliega automáticamente con GitHub Actions.

## ¿Qué modelos puedo cambiar?

Puedes configurar los modelos de cada agente en el archivo `.env` usando las variables `VALIDATOR_MODEL` y `FACTCHECKER_MODEL`.
