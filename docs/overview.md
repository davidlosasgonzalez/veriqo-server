# 🚀 Visión General

## 🌐 Contexto y alcance

Veriqo es un sistema especializado en la verificación factual automatizada de afirmaciones de interés público, tales como noticias, declaraciones políticas, eventos históricos, ciencia y tecnología, utilizando inteligencia artificial avanzada combinada con fuentes verificables. No está diseñado para búsquedas personales o para verificar perfiles individuales poco conocidos.

### ✅ Casos ideales

- Declaraciones públicas verificables.
- Datos históricos, científicos o tecnológicos.
- Artículos periodísticos y contenido educativo.

### ⚠️ Casos no recomendados

- Perfiles individuales poco conocidos.
- Contenido sin fuentes trazables.
- Chatbots conversacionales.

## 🔥 Características clave

| #   | Funcionalidad              | Descripción                                                                                                  |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Detección inteligente      | `ValidatorAgent` encuentra afirmaciones verificables y filtra irrelevancias.                                 |
| 2   | Verificación con evidencia | `FactCheckerAgent` consulta fuentes reales y emite veredictos (`true`, `false`, `possibly_true`, `unknown`). |
| 3   | Trazabilidad total         | Hallazgos, razonamiento, fuentes y métricas se persisten en MySQL.                                           |
| 4   | Arquitectura desacoplada   | Agentes conectados mediante un EventBus, escalables de forma independiente.                                  |
| 5   | Normalización semántica    | Embeddings (`text‑embedding‑3‑small`) evitan duplicados y reutilizan facts.                                  |
| 6   | Documentación viva         | Swagger UI expone documentación interactiva en `/api-docs`.                                                  |

## 🛠️ Stack tecnológico

- **Lenguaje & Runtime:** TypeScript 5 · Node.js 18
- **Framework Web:** NestJS 11 (Arquitectura modular y Dependency Injection)
- **Persistencia de Datos:** MySQL 5.7 con TypeORM 0.3
- **IA & Embeddings:** OpenAI (GPT-4o, text-embedding-3-small) · Anthropic (Claude 3.5 Sonnet)
- **Fuentes de Búsqueda:** Brave Search API · Google Custom Search API · NewsAPI
- **Observabilidad y Documentación:** Swagger (OpenAPI) · Logger HTTP con Morgan
- **Calidad del Código:** ESLint · Prettier · Zod (parsing robusto y validación segura)
- **Arquitectura de Agentes:** [Agno](https://docs.agno.com) — biblioteca especializada para construir agentes autónomos con memoria, herramientas y capacidades avanzadas de razonamiento.

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

[Agno](https://github.com/agno-agi/agno) es una librería ligera y de alto rendimiento diseñada para construir agentes inteligentes con capacidades avanzadas de memoria, conocimiento, razonamiento y herramientas integradas. Gracias a Agno, Veriqo es capaz de gestionar agentes altamente desacoplados, inteligentes y escalables, asegurando una respuesta rápida y precisa para todas las verificaciones factuales realizadas.

> Para más información sobre cómo construir agentes avanzados con Agno, visita la [documentación oficial de Agno](https://docs.agno.com).
