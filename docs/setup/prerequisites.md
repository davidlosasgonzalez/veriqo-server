# 🛠️ Prerrequisitos y Setup de Veriqo

Este documento describe claramente los pasos y requisitos previos para instalar y ejecutar Veriqo correctamente en tu entorno local.

## 📌 Requisitos previos

Antes de comenzar la instalación de Veriqo, verifica que tu entorno cumpla con lo siguiente:

| Tecnología | Versión recomendada | Descripción                     |
| ---------- | ------------------- | ------------------------------- |
| Node.js    | 18.x o superior     | Entorno de ejecución JavaScript |
| npm        | 9.x o superior      | Gestor de paquetes Node.js      |
| MySQL      | 5.7 o superior      | Base de datos relacional        |
| Git        | 2.x o superior      | Sistema de control de versiones |

> 💡 Puedes comprobar la versión de Node.js y npm con:
>
> ```bash
> node -v
> npm -v
> ```

## 🚀 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/davidlosasgonzalez/veriqo-server
cd veriqo-server
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp env.example .env
```

Edita `.env` y añade tus claves API y credenciales. Para más información, consulta la sección [Variables de entorno](./env-variables.md).

### 4. Inicializar la base de datos

Asegúrate de que MySQL esté en ejecución y crea la base de datos:

```sql
CREATE DATABASE veriqo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Iniciar la aplicación

```bash
npm run start:dev
```

La API estará disponible en:

```
http://localhost:3001/api
```

## 📚 Siguientes pasos

- 📖 [Variables de entorno](./env-variables.md)
- 🧩 [Arquitectura de Agentes](../architecture/agents.md)
- 🔄 [Flujo Validator → FactChecker](../flows/validation-to-factcheck.md)

> Para comandos de prueba `curl`, visita el [`README.md`](../../README.md).
