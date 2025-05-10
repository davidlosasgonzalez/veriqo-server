# 🚀 Visión General

**Veriqo** es un sistema especializado en la verificación factual automatizada de afirmaciones de interés público, como noticias, declaraciones políticas, eventos históricos, ciencia y tecnología. Combina inteligencia artificial avanzada con fuentes verificables y se basa en una arquitectura desacoplada mediante agentes inteligentes.

> ⚠️ Veriqo **no está diseñado** para verificar perfiles personales o contenido sin trazabilidad. Su enfoque es la verificación objetiva y documentada de afirmaciones relevantes para el conocimiento general.

## ✅ Casos ideales

- Declaraciones verificables realizadas por figuras públicas.
- Datos históricos, científicos, económicos o tecnológicos.
- Afírmaciones contenidas en noticias, reportes y artículos especializados.

## ⚠️ Casos no recomendados

- Búsqueda de información sobre personas poco conocidas.
- Afírmaciones sin posibilidad de trazabilidad o sin fuentes.
- Uso como chatbot generalista o generador de texto conversacional.

## 🔥 Características clave

| #   | Funcionalidad              | Descripción                                                                                                                                                                     |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Detección inteligente      | `ValidatorAgent` detecta afirmaciones verificables, intenta validarlas con su conocimiento interno y delega si es necesario.                                                    |
| 2   | Verificación con evidencia | `FactCheckerAgent` analiza fuentes reales y asigna un nivel de confianza (confidence) entre 0 y 1 que cuantifica la fiabilidad del veredicto basado en la evidencia encontrada. |
| 3   | Trazabilidad total         | Razonamientos, fuentes, embeddings y resultados quedan almacenados en MySQL.                                                                                                    |
| 4   | Arquitectura desacoplada   | Agentes independientes coordinados por eventos, escalables horizontalmente.                                                                                                     |
| 5   | Deduplicación semántica    | Embeddings con `text-embedding-3-small` de OpenAI para evitar duplicados y reusar facts existentes.                                                                             |
| 6   | Documentación              | Swagger UI y Markdown documentado en `/docs`, con ejemplos y estructuras completas.                                                                                             |

## 🛠️ Stack tecnológico

- **Lenguaje & Runtime:** TypeScript 5 · Node.js 18
- **Framework Web:** NestJS 11 con arquitectura modular profesional
- **Base de datos:** MySQL 5.7 con ORM TypeORM 0.3
- **Inteligencia Artificial:**

    - OpenAI (GPT-4o, embeddings `text-embedding-3-small`)
    - Anthropic Claude 3.5 (modelo por defecto del agente Validator)

- **Fuentes de verificación:**

    - Brave Search API (por defecto)
    - Google Programmable Search (fallback)
    - NewsAPI (como último recurso)

- **Throttle y control de límites:** Bottleneck 2.19 para evitar 429 en servicios externos
- **Dev Experience:** ESLint, Prettier, Zod (validaciones seguras y parsing), Swagger
- **Observabilidad:** Logger con Morgan y sistema de logs propio `AgentLog`

## 🤖 Impulsado por Agno

<div align="center">
  <a href="https://docs.agno.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://agno-public.s3.us-east-1.amazonaws.com/assets/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://agno-public.s3.us-east-1.amazonaws.com/assets/logo-light.svg">
      <img src="https://agno-public.s3.us-east-1.amazonaws.com/assets/logo-light.svg" alt="Agno">
    </picture>
  </a>
</div>

[Agno](https://github.com/agno-agi/agno) es una biblioteca ligera y potente para construir agentes inteligentes con capacidades de memoria, herramientas, rastreo, razonamiento contextual y modularidad extrema. Veriqo se apoya en Agno para coordinar y escalar de forma eficiente todos sus agentes internos de validación y verificación factual.

> Descubre más sobre Agno en su [documentación oficial](https://docs.agno.com).
