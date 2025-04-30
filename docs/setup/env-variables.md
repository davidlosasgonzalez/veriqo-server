# ⚙️ Variables de entorno – Veriqo

Este documento detalla todas las variables de entorno utilizadas en el sistema Veriqo, explicando su finalidad y cómo deben configurarse correctamente.

## 📁 Archivo base

El proyecto incluye un archivo de ejemplo que puedes copiar para comenzar:

```bash
cp env.example .env
```

Luego edítalo y completa los campos con tus claves y credenciales reales.

## 🧾 Estructura del archivo `.env`

```env
# Configuración de la base de datos.
DB_TYPE=mysql # mysql | postgres | sqlite | mariadb | oracle | mssql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=veriqo

# Claves de API para servicios externos.
OPENAI_API_KEY=
CLAUDE_API_KEY=
BRAVE_API_KEY=
GOOGLE_CLOUD_API_KEY=
GOOGLE_CX_ID=
NEWS_API_KEY=

# Configuración del servidor.
PORT=3001
NODE_ENV=development

# Modelos LLM y embeddings.
LLM_VALIDATOR_PROVIDER=anthropic
LLM_FACTCHECKER_PROVIDER=openai
LLM_VALIDATOR_MODEL=claude-3-5-sonnet-20241022
LLM_FACTCHECKER_MODEL=gpt-4o
LLM_EMBEDDING_MODEL=text-embedding-3-small
VALIDATOR_MAX_INPUT_CHARS=3000
EMBEDDING_SIMILARITY_THRESHOLD=0.80
```

## 🧠 Explicación de variables clave

| Variable                         | Descripción                                                                |
| -------------------------------- | -------------------------------------------------------------------------- |
| `DB_TYPE`, `DB_HOST`, etc.       | Configuración de la base de datos relacional usada por Veriqo.             |
| `OPENAI_API_KEY`, etc.           | Claves de acceso a APIs de modelos LLM y motores de búsqueda externos.     |
| `PORT`                           | Puerto local donde se ejecuta el servidor NestJS.                          |
| `NODE_ENV`                       | Entorno de ejecución: `development`, `staging`, `production`.              |
| `LLM_VALIDATOR_MODEL`            | Modelo usado por el ValidatorAgent.                                        |
| `LLM_FACTCHECKER_MODEL`          | Modelo usado por el FactCheckerAgent.                                      |
| `LLM_EMBEDDING_MODEL`            | Modelo usado para generar embeddings semánticos.                           |
| `EMBEDDING_SIMILARITY_THRESHOLD` | Umbral decimal (0.0-1.0) para considerar dos embeddings como equivalentes. |
| `VALIDATOR_MAX_INPUT_CHARS`      | Límite de caracteres que acepta el validador por prompt.                   |

## ✅ Buenas prácticas

- 🔒 **No subas nunca el archivo `.env` a GitHub.**
- 🧪 Usa entornos separados: `.env.local`, `.env.staging`, `.env.production`.
- ✅ Las variables se validan al iniciar el sistema con Zod (`env.config.ts`).

## 🔗 Archivos relacionados

- `src/config/env/env.config.ts` → validación de las variables.
- `env.example` → plantilla editable en la raíz del proyecto.
