#!/usr/bin/env node
import path from "node:path";
import { generateManifests } from "../dist/index.mjs";

const args = process.argv.slice(2);
let targetDir;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--outDir" || args[i] === "-o") {
    targetDir = args[i + 1];
    break;
  } else if (!args[i].startsWith("-")) {
    targetDir = args[i];
    break;
  }
}

const pluginDir = process.cwd();
try {
  generateManifests(pluginDir, targetDir);
} catch (error) {
  console.error("❌ Error al generar manifiestos:", error);
  process.exit(1);
}
