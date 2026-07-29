import { z } from 'zod';

declare const obsidianPluginConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    minAppVersion: z.ZodString;
    description: z.ZodString;
    author: z.ZodString;
    authorUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    isDesktopOnly: z.ZodDefault<z.ZodBoolean>;
    fundingUrl: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>, z.ZodLiteral<"">]>>;
    versions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    version: string;
    minAppVersion: string;
    description: string;
    author: string;
    isDesktopOnly: boolean;
    authorUrl?: string | undefined;
    fundingUrl?: string | Record<string, string> | undefined;
    versions?: Record<string, string> | undefined;
}, {
    id: string;
    name: string;
    version: string;
    minAppVersion: string;
    description: string;
    author: string;
    authorUrl?: string | undefined;
    isDesktopOnly?: boolean | undefined;
    fundingUrl?: string | Record<string, string> | undefined;
    versions?: Record<string, string> | undefined;
}>;
type ObsidianPluginConfig = z.infer<typeof obsidianPluginConfigSchema>;
/**
 * Helper tipado para definir la configuración del plugin con autocompletado e inferencia estricta.
 */
declare function defineConfig(config: ObsidianPluginConfig): ObsidianPluginConfig;
/**
 * Carga de forma síncrona el archivo plugin.config.mts del proyecto.
 */
declare function loadPluginConfig(pluginDir: string): ObsidianPluginConfig;
/**
 * Genera manifest.json y versions.json en la raíz del proyecto o en el directorio especificado.
 */
declare function generateManifests(pluginDir: string, targetDir?: string): {
    config: {
        id: string;
        name: string;
        version: string;
        minAppVersion: string;
        description: string;
        author: string;
        isDesktopOnly: boolean;
        authorUrl?: string | undefined;
        fundingUrl?: string | Record<string, string> | undefined;
        versions?: Record<string, string> | undefined;
    };
    manifestData: {
        id: string;
        name: string;
        version: string;
        minAppVersion: string;
        description: string;
        author: string;
        isDesktopOnly: boolean;
        authorUrl?: string | undefined;
        fundingUrl?: string | Record<string, string> | undefined;
    };
    versionsData: Record<string, string>;
};

export { type ObsidianPluginConfig, defineConfig, generateManifests, loadPluginConfig, obsidianPluginConfigSchema };
