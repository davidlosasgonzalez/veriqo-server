# 🧠 Veriqo · AI Fact‑Checking Backend

**Veriqo** es un backend modular de verificación factual impulsado por Inteligencia Artificial. Su arquitectura combina modelos avanzados de lenguaje (LLMs), búsquedas en tiempo real y un bus de eventos escalable para validar de forma automática afirmaciones con alta precisión y trazabilidad.

## ✨ ¿Qué es Veriqo?

Veriqo automatiza la detección de afirmaciones incorrectas, engañosas o ambiguas mediante dos agentes autónomos:

- **ValidatorAgent**: analiza afirmaciones y detecta inconsistencias o errores potenciales.
- **FactCheckerAgent**: verifica afirmaciones consultando fuentes externas (Google, Brave, NewsAPI) y genera razonamientos explicativos.

Gracias a su arquitectura orientada a eventos y modularización por agente, Veriqo es fácilmente extensible, altamente trazable y escalable horizontalmente.

## ⚙️ Instalación rápida

```bash
git clone https://github.com/davidlosasgonzalez/veriqo-server
cd veriqo-server
npm install
cp env.example .env
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3001/api`

## ⚡️ Demo desde terminal

### Validar una afirmación

```bash
curl -X POST http://localhost:3001/api/validators/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Las emisiones de CO2 de los trenes de alta velocidad son mayores que las de los aviones en trayectos largos."
}'
```

### Validar afirmaciones variadas

```bash
curl -X POST http://localhost:3001/api/validators/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Las vacunas de ARNm modifican el ADN humano.\nGrecia salió del euro en 2015.\nLa Antártida tiene reservas de litio mayores que Bolivia."
}'
```

> 🔎 El ValidatorAgent puede detectar múltiples afirmaciones en un solo bloque de texto.
> El límite de caracteres se controla mediante la variable `VALIDATOR_MAX_INPUT_CHARS` (por defecto: 3000).

### Obtener una validación por ID

```bash
curl http://localhost:3001/api/validators/findings/:findingId
```

## 📚 Documentación

Consulta la documentación modular organizada por bloques funcionales:

- 📖 [Visión general](docs/overview.md)
- 🧹 [Arquitectura de agentes](docs/architecture/agents.md)
- 🧠 [Modelos LLM y criterios de elección](docs/architecture/models-choice.md)
- ⚙️ [Prerrequisitos e instalación](docs/setup/prerequisites.md)
- 🗒️ [Variables de entorno](docs/setup/env-variables.md)
- 📚 [Base de datos](docs/database/database-schema.md)
- 🔍 [API – ValidatorAgent](docs/api/validators.md)
- 🧪 [API – FactCheckerAgent](docs/api/facts.md)
- 🗺️ [API – Core (logs, prompts, stats)](docs/api/core.md)
- ↺ [Flujo Validator → FactChecker](docs/flows/validation-to-factcheck.md)
- ❓ [FAQ – Preguntas frecuentes](docs/faq.md)

## 📈 Estado del proyecto

**Beta** – El sistema está completamente funcional y modularizado. Listo para pruebas reales y despliegues controlados.

> Pueden introducirse mejoras o ajustes antes de su versión estable `1.0.0`.

## 📄 Licencia y autoría

Licencia **MIT**.

Creado y mantenido por **David Losas González**\
📨 [david.losas.gonzalez@gmail.com](mailto:david.losas.gonzalez@gmail.com)\
🔗 [LinkedIn](https://www.linkedin.com/in/david-losas-gonzález-2ba888174)
