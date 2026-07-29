# obsidian-config-helper

Herramienta de desarrollo y validación tipada para plugins de Obsidian. Permite definir la configuración de metadatos mediante esquemas de **Zod** con autocompletado e inferencia de TypeScript, además de generar automáticamente los archivos `manifest.json` y `versions.json`.

> [!IMPORTANT]
> Esta herramienta fue creada con ayuda de una *Inteligencia Artificial*.

---

## ✨ Características

- 🛡️ **Validación Estricta con Zod**: Valida campos obligatorios, formato SemVer, reglas de formato para el ID y límites de caracteres en tiempo de desarrollo.
- 💡 **Autocompletado Total**: Inferencia estricta de tipos de TypeScript gracias al helper `defineConfig(...)`.
- 📜 **Generación de Manifiestos**: Crea y mantiene actualizados automáticamente `manifest.json` y `versions.json`.
- 🖥️ **CLI Integrada**: Ejecutable `obsidian-manifests` accesible mediante `npx` o scripts de `package.json`.
- 🔌 **Soporte para `fundingUrl`**: Compatible con URLs únicas o mapas de plataformas de financiamiento (GitHub Sponsors, Buy Me a Coffee, etc.).
- 🚀 **Integración con Vite/Rollup**: Función síncrona `generateManifests` para integrarla fácilmente en hooks de empaquetadores.

---

## 📦 Instalación

Instala el paquete en tus dependencias de desarrollo directamente desde GitHub:

```bash
pnpm add -D github:RepolloDev/obsidian-config-helper
```

O usando `npm` / `yarn`:

```bash
npm install --save-dev github:RepolloDev/obsidian-config-helper
```

---

## 🚀 Guía de Uso

### 1. Crear el Archivo de Configuración (`plugin.config.mts`)

Crea un archivo `plugin.config.mts` en la raíz de tu código fuente:

```typescript
import { defineConfig } from "obsidian-config-helper";

export default defineConfig({
  id: "my-obsidian-plugin",
  name: "My Obsidian Plugin",
  version: "1.0.0",
  minAppVersion: "0.15.0",
  description: "Una descripción concisa de las características de mi plugin.",
  author: "RepolloDev",
  authorUrl: "https://github.com/RepolloDev",
  isDesktopOnly: false,
  fundingUrl: {
    "GitHub Sponsors": "https://github.com/sponsors/RepolloDev",
    "Buy Me a Coffee": "https://buymeacoffee.com/RepolloDev"
  },
  versions: {
    "1.0.0": "0.15.0"
  }
});
```

---

### 2. Generación de Manifiestos vía CLI

Puedes ejecutar la herramienta desde la línea de comandos:

```bash
# Genera manifest.json y versions.json en el directorio actual (.)
npx obsidian-manifests

# Genera los archivos en un directorio relativo específico (por ejemplo, el directorio superior '..')
npx obsidian-manifests ..
```

---

### 3. Integración en `vite.config.mts`

Ejecuta la generación automáticamente al iniciar la compilación con Vite:

```typescript
import { generateManifests } from "obsidian-config-helper";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "generate-obsidian-manifests",
      buildStart() {
        // Genera los manifiestos en el directorio especificado
        generateManifests(__dirname, "..");
      }
    }
  ]
});
```

---

## 📋 Especificación del Esquema

El helper `defineConfig` valida y acepta todas las propiedades oficiales de Obsidian:

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Sí** | ID único (solo minúsculas, números y guiones). |
| `name` | `string` | **Sí** | Nombre visible del plugin. |
| `version` | `string` | **Sí** | Versión según SemVer (ej. `1.0.0`). |
| `minAppVersion` | `string` | **Sí** | Versión mínima de Obsidian (ej. `0.15.0`). |
| `description` | `string` | **Sí** | Descripción (máximo 250 caracteres). |
| `author` | `string` | **Sí** | Nombre del creador/desarrollador. |
| `authorUrl` | `string` | No | Enlace al sitio o perfil del autor. |
| `isDesktopOnly` | `boolean` | No | Desactiva el soporte móvil si es `true`. Default `false`. |
| `fundingUrl` | `string \| Record<string, string>` | No | Enlace de donaciones o mapa de servicios. |
| `versions` | `Record<string, string>` | No | Mapa para `versions.json`. Se auto-genera si se omite. |
