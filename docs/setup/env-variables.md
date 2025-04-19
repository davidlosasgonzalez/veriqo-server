# ⚙️ Variables de entorno

Este documento detalla todas las variables de entorno requeridas por Veriqo, explicando su propósito y cómo deben configurarse correctamente en el archivo `.env`.

## 📁 Archivo base

El proyecto incluye un archivo de ejemplo:

```bash
cp env.example .env
```

Completa el archivo `.env` con tus claves y credenciales reales:

```env
# Claves de APIs externas
OPENAI_API_KEY=your_openai_key
NEWS_API_KEY=your_newsapi_key
CLAUDE_API_KEY=your_claude_key
BRAVE_API_KEY=your_brave_api_key
GOOGLE_CLOUD_API_KEY=your_google_api_key
GOOGLE_CX_ID=your_custom_search_id

# Base de datos MySQL
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=veriqo

# Servidor
PORT=3001

# Modelos LLM
VALIDATOR_MODEL=claude-3-5-sonnet-20241022
FACTCHECKER_MODEL=gpt-4o

# Embeddings
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_MODEL_PROVIDER=openai

# Otros parámetros
FACT_CHECK_CACHE_DAYS=180         # Días que se cachean resultados de facts
EMBEDDING_SIMILARITY_THRESHOLD=80 # Umbral % para detectar duplicados semánticos
WAIT_FOR_FACT_TIMEOUT_MS=10000    # Timeout para esperar verificación factual
```

## 🧠 Explicación de variables clave

| Variable                         | Descripción                                                             |
| -------------------------------- | ----------------------------------------------------------------------- |
| `OPENAI_API_KEY`, etc.           | Claves para acceder a proveedores de IA y búsquedas externas.           |
| `DB_HOST`, `DB_USER`, etc.       | Configuración de conexión a la base de datos MySQL.                     |
| `PORT`                           | Puerto en el que corre el servidor NestJS.                              |
| `VALIDATOR_MODEL`, etc.          | Modelos predeterminados para cada agente.                               |
| `EMBEDDING_MODEL`, etc.          | Embeddings para normalización semántica.                                |
| `FACT_CHECK_CACHE_DAYS`          | Tiempo de caché de respuestas factual para evitar consultas frecuentes. |
| `EMBEDDING_SIMILARITY_THRESHOLD` | Umbral de similitud para descartar claims duplicados.                   |
| `WAIT_FOR_FACT_TIMEOUT_MS`       | Tiempo máximo que espera el ValidatorAgent por el FactCheckerAgent.     |

## ✅ Buenas prácticas

- No subas el archivo `.env` a GitHub.
- Usa `.env.local`, `.env.staging` o `.env.production` si trabajas con múltiples entornos.
- Todas las variables están validadas al arrancar el sistema mediante Zod (`env.config.ts`).

## 📁 Código relacionado

- `src/config/env/env.config.ts`
- `env.example` (en la raíz del proyecto)
