# 🧠 Veriqo — AI-Powered Fact-Verification Backend

> Validación factual con trazabilidad total. Agentes autónomos. Múltiples LLMs. Fuentes reales. Ready to integrate.

Veriqo es un sistema **backend modular de verificación factual automática** potenciado por IA. Desarrollado con arquitectura basada en agentes, aprovecha modelos como **GPT-4o** y **Claude Sonnet**, junto con APIs de búsqueda (Brave y Google), para analizar afirmaciones, decidir cuándo contrastarlas, buscar evidencia real y **explicar la veracidad con argumentos trazables**.

Diseñado para escalar y conectarse con frontend, sistemas de reputación, medios, plataformas de e-learning, herramientas periodísticas o flujos de datos públicos.

## 🚀 ¿Qué ofrece Veriqo?

- ✅ Detección de afirmaciones dudosas con IA.
- 🔎 Verificación basada en evidencia real online.
- 🧠 Argumentación explicativa con trazabilidad y fuentes.
- 🔗 Endpoints REST plug-and-play.
- 🧾 Auditoría completa: logs, hallazgos, reasoning, prompts.
- 🧰 Modularidad total: cada agente se integra por separado.

## ⚙️ Instalación y puesta en marcha

### Requisitos:
- Node.js 18+
- MySQL (5.7+)
- `.env` configurado (ver `.env.example`)

### Pasos rápidos:

```bash
git clone https://github.com/tu-usuario/veriqo-server.git
cd veriqo-server
npm install
npm run start:dev
```

Asegúrate de que tu base de datos esté activa y accesible.

## 📦 Comandos útiles

```bash
npm run start         # Compila y ejecuta el servidor
npm run start:dev     # Modo desarrollo con hot reload
npm run build         # Transpila el código a /dist
```

> Actualmente **no incluye tests**, pero se priorizó la arquitectura de agentes funcional.

## 🔌 Dependencias clave

- `@nestjs/core`, `@nestjs/typeorm`, `@nestjs/event-emitter`
- `openai`, `axios`, `zod`, `class-validator`
- `mysql2`, `typeorm`
- `Claude` (Anthropic API), `Brave Search`, `Google CSE`

## 📁 Estructura destacada

```
src/
├── agents/           # Agentes inteligentes (Validator, FactChecker)
├── config/           # Configuración por entorno y TypeORM
├── database/         # Entidades, seeders y lógica de persistencia
├── shared/           # Servicios comunes (IA, búsqueda, prompts, logger)
```

## 🧠 Arquitectura por agentes

### 🧪 `ValidatorAgent`

#### Finalidad:
Detectar afirmaciones incorrectas, ambiguas, exageradas o sospechosas dentro de un texto.

#### Cómo funciona:
1. Recibe texto plano.
2. Utiliza modelos LLM (GPT-4o) para identificar afirmaciones relevantes.
3. Clasifica cada afirmación por tipo de posible error (factual, ambigüedad, exageración, etc.).
4. Decide si requiere una verificación factual profunda.

#### Objetivos:
- Evitar sobrecarga en el sistema.
- Ser un primer filtro inteligente.
- Detectar patrones comunes de error.

#### Limitaciones:
- No verifica con fuentes externas.
- Puede identificar afirmaciones que son subjetivas si no se entrena el prompt cuidadosamente.

### 📚 `FactCheckerAgent`

#### Finalidad:
Verificar afirmaciones concretas con **evidencia real** de fuentes externas y argumentación detallada.

#### Cómo funciona:
1. Recibe una afirmación.
2. Genera una query de búsqueda a partir del texto.
3. Consulta Brave Search (y Google como fallback) para extraer URLs relevantes.
4. Resume y sintetiza evidencia encontrada.
5. Formula un prompt y consulta GPT-4o o Claude con contexto real.
6. Devuelve veredicto: **Verdadero / Falso / Parcial / No Verificable**, con reasoning.

#### Objetivos:
- Contrastación efectiva de información en tiempo real.
- Trazabilidad de cada verificación.
- Transparencia y justificabilidad.

#### Limitaciones:
- Depende de la calidad de resultados en buscadores.
- No puede verificar hechos demasiado nuevos sin fuentes públicas.
- Requiere prompts bien afinados para evitar respuestas genéricas.

Ambos agentes interactúan por un **EventBus desacoplado**, lo que permite orquestación y expansión futura.

## 📡 Endpoints REST disponibles

Documentación Swagger automática en `/api`

### Validator Agent

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/agents/validator` | Detecta errores o ambigüedades en un texto. |
| `GET`  | `/agents/validator/findings` | Lista de hallazgos registrados. |

#### Ejemplo de request:
```json
{
  "text": "El sol es más pequeño que la Tierra."
}
```

### Fact Checker Agent

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/agents/fact-checker/last` | Última verificación realizada. |
| `GET` | `/agents/fact-checker/facts/:claim` | Verificación puntual de una afirmación. |
| `GET` | `/agents/fact-checker/history` | Historial completo de verificaciones. |
| `GET` | `/agents/fact-checker/logs` | Logs del sistema por agente/modelo. |
| `GET` | `/agents/fact-checker/prompts` | Prompts actuales usados por el sistema. |
| `GET` | `/agents/fact-checker/sources` | Fuentes web utilizadas en verificaciones. |
| `GET` | `/agents/fact-checker/insights` | Estadísticas agregadas (veredictos, tipos). |

## 📊 Base de datos — Estructura trazable

| Tabla                      | Descripción |
|----------------------------|-------------|
| `agent_findings`           | Afirmaciones clasificadas por el validador. |
| `agent_facts`              | Datos verificados con su resultado. |
| `agent_verifications`      | Argumentación completa del modelo IA. |
| `agent_sources`            | URLs externas reales usadas como prueba. |
| `agent_prompts`            | Prompts base usados por agente. |
| `agent_logs`               | Logs técnicos con modelo, tiempo y tokens. |
| `agent_events`             | Eventos internos de flujo entre agentes. |

## 📈 ¿Por qué Veriqo marca diferencia?

- **No es solo IA conversacional.** Está pensado como herramienta operativa.
- **Todo es trazable y auditable.** Cada decisión del sistema queda registrada.
- **Diseño plug-and-play.** Puedes usar un agente sin el otro.
- **Arquitectura extensible.** Ya preparada para más agentes y análisis semántico.
- **Aplicable a medios, educación, empresas, investigación, gobierno.**

## 🧠 Palabras clave que definen este backend:

> NestJS · GPT-4o · Claude Sonnet · Brave Search · Google CSE · TypeORM · IA aplicada · Validación automática · Trazabilidad · Fact-checking programático · Backend modular · APIs verificadoras · Full Stack AI Agents · SaaS ready · Event-driven architecture · Real-time fact analysis

## 👤 Autor

**David Losas González**
Desarrollador full stack & formador técnico
💼 [linkedin.com/in/david-losas-gonzález](https://www.linkedin.com/in/david-losas-gonzález-2ba888174)
📧 david.losas.gonzalez@gmail.com

> La IA es el futuro, pero sin verificación, no es confiable. Veriqo lleva la verdad al centro del proceso.
