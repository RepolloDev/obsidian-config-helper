import fs from "fs";
import path from "path";
import { createJiti } from "jiti";
import { z } from "zod";

export const obsidianPluginConfigSchema = z.object({
  id: z
    .string()
    .min(1, "El ID del plugin es requerido")
    .regex(
      /^[a-z0-9-]+$/,
      "El ID sólo debe contener letras minúsculas, números y guiones",
    ),
  name: z.string().min(1, "El nombre del plugin es requerido"),
  version: z
    .string()
    .min(1, "La versión es requerida")
    .regex(
      /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/,
      "La versión debe seguir el formato SemVer (ej. 1.0.0)",
    ),
  minAppVersion: z
    .string()
    .min(1, "La versión mínima de Obsidian es requerida")
    .regex(
      /^\d+\.\d+\.\d+$/,
      "minAppVersion debe seguir el formato X.Y.Z (ej. 0.15.0)",
    ),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(250, "La descripción no debe exceder 250 caracteres"),
  author: z.string().min(1, "El nombre del autor es requerido"),
  authorUrl: z
    .string()
    .url("El authorUrl debe ser una URL válida")
    .or(z.literal(""))
    .optional(),
  isDesktopOnly: z.boolean().default(false),
  fundingUrl: z
    .string()
    .url("El fundingUrl debe ser una URL válida")
    .or(z.record(z.string(), z.string().url("Las URLs de financiación deben ser válidas")))
    .or(z.literal(""))
    .optional(),
  versions: z.record(z.string(), z.string()).optional(),
});

export type ObsidianPluginConfig = z.infer<typeof obsidianPluginConfigSchema>;

/**
 * Helper tipado para definir la configuración del plugin con autocompletado e inferencia estricta.
 */
export function defineConfig(config: ObsidianPluginConfig): ObsidianPluginConfig {
  return obsidianPluginConfigSchema.parse(config);
}

/**
 * Carga de forma síncrona el archivo plugin.config.mts del proyecto.
 */
export function loadPluginConfig(pluginDir: string): ObsidianPluginConfig {
  const configPath = path.resolve(pluginDir, "plugin.config.mts");
  if (!fs.existsSync(configPath)) {
    throw new Error(`❌ No se encontró el archivo de configuración en ${configPath}`);
  }
  const parentPath = typeof __filename !== "undefined" ? __filename : process.cwd();
  const jiti = createJiti(parentPath);
  const loaded = jiti(configPath).default as ObsidianPluginConfig;
  return obsidianPluginConfigSchema.parse(loaded);
}

/**
 * Genera manifest.json y versions.json en la raíz del proyecto o en el directorio especificado.
 */
export function generateManifests(pluginDir: string, targetDir?: string) {
  const outputDir = targetDir
    ? path.resolve(pluginDir, targetDir)
    : path.resolve(pluginDir, ".");

  const config = loadPluginConfig(pluginDir);
  const { versions, ...manifestData } = config;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Generar / Actualizar manifest.json
  const manifestPath = path.resolve(outputDir, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(manifestData, null, 2)}\n`,
  );
  console.log(`✅ manifest.json generado exitosamente en: ${manifestPath}`);

  // 2. Generar / Actualizar versions.json
  const versionsPath = path.resolve(outputDir, "versions.json");
  const versionsData = versions || {
    [manifestData.version]: manifestData.minAppVersion,
  };
  fs.writeFileSync(
    versionsPath,
    `${JSON.stringify(versionsData, null, 2)}\n`,
  );
  console.log(`✅ versions.json generado exitosamente en: ${versionsPath}`);

  return { config, manifestData, versionsData };
}
