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

### Obtener la última verificación factual

```bash
curl http://localhost:3001/api/facts/verifications/last
```

## 📚 Documentación

Explora en profundidad la documentación organizada del proyecto:

- 📖 [Visión general](docs/overview.md)
- 🧩 [Arquitectura de Agentes](docs/architecture/agents.md)
- 🤖 [Modelos LLM y decisiones técnicas](docs/architecture/models-choice.md)
- 🚧 [Prerrequisitos e instalación](docs/setup/prerequisites.md)
- ⚙️ [Variables de entorno](docs/setup/env-variables.md)
- 📡 [API - ValidatorAgent](docs/api/validators.md)
- 📡 [API - FactCheckerAgent](docs/api/facts.md)
- 📡 [API - Core](docs/api/core.md)
- 🔄 [Flujo Validator → FactChecker](docs/flows/validation-to-factcheck.md)
- ❓ [Preguntas frecuentes (FAQ)](docs/faq.md)

## 📈 Estado del proyecto

**Alpha** – Proyecto en desarrollo activo. Podrían producirse cambios importantes en funcionalidades o interfaces.

## 📄 Licencia & Autor

Este proyecto está licenciado bajo la licencia **MIT**.

**Autor:** David Losas González

**LinkedIn:** [https://www.linkedin.com/in/david-losas-gonzález-2ba888174](https://www.linkedin.com/in/david-losas-gonzález-2ba888174)

✉️ [david.losas.gonzalez@gmail.com](mailto:david.losas.gonzalez@gmail.com)
