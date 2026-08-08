import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { randomUUID } from "crypto";

export const getExtensionBuildInfo = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    // No backend real, buscaríamos no banco.
    // Como a Factory é local/seed, vamos ler o manifest.json real se o caminho existir
    
    // Mapeamento simples para o sandbox (usando SEED_EXTENSIONS como base)
    const paths: Record<string, string> = {
      "ext-01": "extensions/ext-01/integrated/MR Ext Sem Limites",
      "ext-04": "extensions/ext-04/integrated/metodo4-v17",
      "ext-03": "extensions/ext-03/integrated/ext3-v26",
      "ext-04-new": "extensions/ext-04/integrated/MR Sem Limites 4.1.2",
      "ext-05": "extensions/ext-05/integrated/LV-CORE-REPLACEMENT-v17.0",
    };

    const sourcePath = paths[data.id];
    if (!sourcePath) return { error: "Extension path not found" };

    try {
      const manifestRaw = await fs.readFile(path.join(process.cwd(), sourcePath, "manifest.json"), "utf-8");
      const manifest = JSON.parse(manifestRaw);
      
      // Simular metadados de build que seriam gerados pelo sistema de build
      // Em uma implementação real, isso seria lido de um arquivo build-report.json gerado no zip
      return {
        manifestVersion: manifest.version,
        sourceDir: sourcePath,
        // Mocking professional build data for UI demonstration as requested
        buildId: `BUILD-${manifest.version}-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        uuid: randomUUID(),
        sha256: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855", // Mock hash
        status: {
          manifestSynced: true,
          zipSynced: true,
          factorySynced: true,
          buildValid: true
        }
      };
    } catch (err) {
      return { error: `Failed to read manifest: ${err}` };
    }
  });
