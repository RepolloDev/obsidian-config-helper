// src/index.ts
import fs from "fs";
import path from "path";
import { createJiti } from "jiti";
import { z } from "zod";
var obsidianPluginConfigSchema = z.object({
  id: z.string().min(1, "El ID del plugin es requerido").regex(
    /^[a-z0-9-]+$/,
    "El ID s\xF3lo debe contener letras min\xFAsculas, n\xFAmeros y guiones"
  ),
  name: z.string().min(1, "El nombre del plugin es requerido"),
  version: z.string().min(1, "La versi\xF3n es requerida").regex(
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/,
    "La versi\xF3n debe seguir el formato SemVer (ej. 1.0.0)"
  ),
  minAppVersion: z.string().min(1, "La versi\xF3n m\xEDnima de Obsidian es requerida").regex(
    /^\d+\.\d+\.\d+$/,
    "minAppVersion debe seguir el formato X.Y.Z (ej. 0.15.0)"
  ),
  description: z.string().min(1, "La descripci\xF3n es requerida").max(250, "La descripci\xF3n no debe exceder 250 caracteres"),
  author: z.string().min(1, "El nombre del autor es requerido"),
  authorUrl: z.string().url("El authorUrl debe ser una URL v\xE1lida").or(z.literal("")).optional(),
  isDesktopOnly: z.boolean().default(false),
  fundingUrl: z.string().url("El fundingUrl debe ser una URL v\xE1lida").or(z.record(z.string(), z.string().url("Las URLs de financiaci\xF3n deben ser v\xE1lidas"))).or(z.literal("")).optional(),
  versions: z.record(z.string(), z.string()).optional()
});
function defineConfig(config) {
  return obsidianPluginConfigSchema.parse(config);
}
function loadPluginConfig(pluginDir) {
  const configPath = path.resolve(pluginDir, "plugin.config.mts");
  if (!fs.existsSync(configPath)) {
    throw new Error(`\u274C No se encontr\xF3 el archivo de configuraci\xF3n en ${configPath}`);
  }
  const parentPath = typeof __filename !== "undefined" ? __filename : process.cwd();
  const jiti = createJiti(parentPath);
  const loaded = jiti(configPath).default;
  return obsidianPluginConfigSchema.parse(loaded);
}
function generateManifests(pluginDir, targetDir) {
  const outputDir = targetDir ? path.resolve(pluginDir, targetDir) : path.resolve(pluginDir, ".");
  const config = loadPluginConfig(pluginDir);
  const { versions, ...manifestData } = config;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const manifestPath = path.resolve(outputDir, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(manifestData, null, 2)}
`
  );
  console.log(`\u2705 manifest.json generado exitosamente en: ${manifestPath}`);
  const versionsPath = path.resolve(outputDir, "versions.json");
  const versionsData = versions || {
    [manifestData.version]: manifestData.minAppVersion
  };
  fs.writeFileSync(
    versionsPath,
    `${JSON.stringify(versionsData, null, 2)}
`
  );
  console.log(`\u2705 versions.json generado exitosamente en: ${versionsPath}`);
  return { config, manifestData, versionsData };
}
export {
  defineConfig,
  generateManifests,
  loadPluginConfig,
  obsidianPluginConfigSchema
};
