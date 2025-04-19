# 🧠 Veriqo · AI Fact‑Checking Backend

**Veriqo** es un backend modular de verificación factual impulsado por Inteligencia Artificial. Su arquitectura combina modelos avanzados de lenguaje (LLMs), búsquedas activas en tiempo real y un bus de eventos escalable para ofrecer validaciones precisas y rápidas de cualquier afirmación.

## 🚀 ¿Qué es Veriqo?

**Veriqo** automatiza el proceso de detección de afirmaciones incorrectas, ambiguas o engañosas mediante dos agentes inteligentes:

- **ValidatorAgent**: Detecta inconsistencias o errores potenciales en afirmaciones.
- **FactCheckerAgent**: Verifica dichas afirmaciones consultando fuentes externas en tiempo real.

Gracias a su estructura modular y orientada a eventos, **Veriqo** ofrece una integración sencilla, escalabilidad horizontal y una trazabilidad completa en todas las validaciones realizadas.

## 🛠️ Instalación rápida

Sigue estos pasos para instalar Veriqo en tu entorno local:

```bash
git clone https://github.com/david-losas/veriqo-server.git
cd veriqo-server
npm install
cp env.example .env
npm run start:dev
```

La aplicación estará disponible en: `http://localhost:3001/api`

## ⚡ Demo rápida

Prueba la potencia de Veriqo rápidamente desde tu terminal:

### Validar una afirmación

```bash
curl -X POST http://localhost:3001/api/validators/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt":"El sol es una estrella.","waitForFact":true}'
```

## ⚡ Demo rápida

Prueba la potencia de Veriqo rápidamente desde tu terminal:

### Validar una afirmación

```bash
curl -X POST http://localhost:3001/api/validators/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt":"El sol es una estrella.","waitForFact":true}'
```

> ℹ️ Nota importante: El ValidatorAgent es capaz de detectar y analizar múltiples afirmaciones dentro de un mismo texto.
> El límite máximo de caracteres permitidos se define mediante la variable de entorno VALIDATOR_MAX_INPUT_CHARS (por defecto se recomienda un máximo de 3.000 caracteres).
> Para asegurar una evaluación óptima, evita incluir afirmaciones ambiguas o mal estructuradas en el mismo bloque de texto.

### Validar múltiples afirmaciones

```bash
curl -X POST http://localhost:3001/api/validators/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "La Segunda Guerra Mundial terminó en 1945.
               La población mundial actual ha superado los 20 mil millones de personas.
               El Quijote fue escrito por William Shakespeare.",
    "waitForFact": true
}'
```

### Obtener la última verificación factual

```bash
curl http://localhost:3001/api/facts/verifications/last
```

## 📚 Documentación

Explora en profundidad la documentación organizada del proyecto:

- 📖 [Visión general](overview.md)
- 🧩 [Arquitectura de Agentes](architecture/agents.md)
- 🤖 [Modelos LLM y decisiones técnicas](architecture/models-choice.md)
- 🚧 [Prerrequisitos e instalación](setup/prerequisites.md)
- ⚙️ [Variables de entorno](setup/env-variables.md)
- 📡 [API - ValidatorAgent](api/validators.md)
- 📡 [API - FactCheckerAgent](api/facts.md)
- 📡 [API - Core](api/core.md)
- 🔄 [Flujo Validator → FactChecker](flows/validation-to-factcheck.md)
- ❓ [Preguntas frecuentes (FAQ)](faq.md)

## 📈 Estado del proyecto

**Alpha** – Proyecto en desarrollo activo. Podrían producirse cambios importantes en funcionalidades o interfaces.

## 📄 Licencia & Autor

Este proyecto está licenciado bajo la licencia **MIT**.

**Autor:** David Losas González

**LinkedIn:** [https://www.linkedin.com/in/david-losas-gonzález-2ba888174](https://www.linkedin.com/in/david-losas-gonzález-2ba888174)

✉️ [david.losas.gonzalez@gmail.com](mailto:david.losas.gonzalez@gmail.com)
