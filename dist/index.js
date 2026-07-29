"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  defineConfig: () => defineConfig,
  generateManifests: () => generateManifests,
  loadPluginConfig: () => loadPluginConfig,
  obsidianPluginConfigSchema: () => obsidianPluginConfigSchema
});
module.exports = __toCommonJS(index_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_jiti = require("jiti");
var import_zod = require("zod");
var obsidianPluginConfigSchema = import_zod.z.object({
  id: import_zod.z.string().min(1, "El ID del plugin es requerido").regex(
    /^[a-z0-9-]+$/,
    "El ID s\xF3lo debe contener letras min\xFAsculas, n\xFAmeros y guiones"
  ),
  name: import_zod.z.string().min(1, "El nombre del plugin es requerido"),
  version: import_zod.z.string().min(1, "La versi\xF3n es requerida").regex(
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/,
    "La versi\xF3n debe seguir el formato SemVer (ej. 1.0.0)"
  ),
  minAppVersion: import_zod.z.string().min(1, "La versi\xF3n m\xEDnima de Obsidian es requerida").regex(
    /^\d+\.\d+\.\d+$/,
    "minAppVersion debe seguir el formato X.Y.Z (ej. 0.15.0)"
  ),
  description: import_zod.z.string().min(1, "La descripci\xF3n es requerida").max(250, "La descripci\xF3n no debe exceder 250 caracteres"),
  author: import_zod.z.string().min(1, "El nombre del autor es requerido"),
  authorUrl: import_zod.z.string().url("El authorUrl debe ser una URL v\xE1lida").or(import_zod.z.literal("")).optional(),
  isDesktopOnly: import_zod.z.boolean().default(false),
  fundingUrl: import_zod.z.string().url("El fundingUrl debe ser una URL v\xE1lida").or(import_zod.z.record(import_zod.z.string(), import_zod.z.string().url("Las URLs de financiaci\xF3n deben ser v\xE1lidas"))).or(import_zod.z.literal("")).optional(),
  versions: import_zod.z.record(import_zod.z.string(), import_zod.z.string()).optional()
});
function defineConfig(config) {
  return obsidianPluginConfigSchema.parse(config);
}
function loadPluginConfig(pluginDir) {
  const configPath = import_path.default.resolve(pluginDir, "plugin.config.mts");
  if (!import_fs.default.existsSync(configPath)) {
    throw new Error(`\u274C No se encontr\xF3 el archivo de configuraci\xF3n en ${configPath}`);
  }
  const parentPath = typeof __filename !== "undefined" ? __filename : process.cwd();
  const jiti = (0, import_jiti.createJiti)(parentPath);
  const loaded = jiti(configPath).default;
  return obsidianPluginConfigSchema.parse(loaded);
}
function generateManifests(pluginDir, targetDir) {
  const outputDir = targetDir ? import_path.default.resolve(pluginDir, targetDir) : import_path.default.resolve(pluginDir, ".");
  const config = loadPluginConfig(pluginDir);
  const { versions, ...manifestData } = config;
  if (!import_fs.default.existsSync(outputDir)) {
    import_fs.default.mkdirSync(outputDir, { recursive: true });
  }
  const manifestPath = import_path.default.resolve(outputDir, "manifest.json");
  import_fs.default.writeFileSync(
    manifestPath,
    `${JSON.stringify(manifestData, null, 2)}
`
  );
  console.log(`\u2705 manifest.json generado exitosamente en: ${manifestPath}`);
  const versionsPath = import_path.default.resolve(outputDir, "versions.json");
  const versionsData = versions || {
    [manifestData.version]: manifestData.minAppVersion
  };
  import_fs.default.writeFileSync(
    versionsPath,
    `${JSON.stringify(versionsData, null, 2)}
`
  );
  console.log(`\u2705 versions.json generado exitosamente en: ${versionsPath}`);
  return { config, manifestData, versionsData };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineConfig,
  generateManifests,
  loadPluginConfig,
  obsidianPluginConfigSchema
});
