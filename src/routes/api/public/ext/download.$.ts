import { createFileRoute } from "@tanstack/react-router";
import fs from "fs";
import path from "path";

/**
 * Rota unificada para download de extensões.
 * Tenta buscar primeiro em /extensions/ e depois em /public/
 */
export const Route = createFileRoute("/api/public/ext/download/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(request.url);
        // Tenta pegar do params (TanStack Router) ou extrair do final do path
        let fileName = (params as any)._splat || "";
        
        if (!fileName) {
          const parts = url.pathname.split("/");
          fileName = parts[parts.length - 1];
        }

        console.log(`[Download] Arquivo solicitado: ${fileName}`);
        
        if (!fileName || fileName.includes("..")) {
          return new Response("Nome de arquivo inválido", { status: 400 });
        }

        const projectRoot = process.cwd();
        // Aumentamos a lista de diretórios de busca e garantimos que a raiz do projeto e public sejam verificadas
        const searchDirs = [
          path.resolve(projectRoot),
          path.resolve(projectRoot, "public"),
          path.resolve(projectRoot, "public/extensions"),
          path.resolve(projectRoot, "public/extensions/ext-08/integrated"),
          path.resolve(projectRoot, "public/extensions/ext-07/integrated"),
        ];

        let foundPath = "";
        for (const dir of searchDirs) {
          if (!fs.existsSync(dir)) continue;
          const tryPath = path.resolve(dir, fileName);
          if (fs.existsSync(tryPath) && !fs.statSync(tryPath).isDirectory()) {
            foundPath = tryPath;
            break;
          }
        }

        // Busca insensível a maiúsculas se não encontrou exato
        if (!foundPath) {
          for (const dir of searchDirs) {
            if (!fs.existsSync(dir)) continue;
            const files = fs.readdirSync(dir);
            const match = files.find(f => f.toLowerCase() === fileName.toLowerCase());
            if (match) {
              const tryMatchPath = path.resolve(dir, match);
              if (!fs.statSync(tryMatchPath).isDirectory()) {
                foundPath = tryMatchPath;
                break;
              }
            }
          }
        }

        if (!foundPath) {
          console.error(`[Download] Não encontrado em nenhum diretório: ${fileName}`);
          return new Response("Arquivo não encontrado", { status: 404 });
        }

        try {
          const stats = fs.statSync(foundPath);
          const fileBuffer = fs.readFileSync(foundPath);

          return new Response(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/zip",
              "Content-Disposition": `attachment; filename="${fileName}"`,
              "Content-Length": stats.size.toString(),
              "Cache-Control": "no-store",
            },
          });
        } catch (error: any) {
          console.error(`[Download] Erro ao ler arquivo: ${error.message}`);
          return new Response(`Erro interno ao processar download: ${error.message}`, { status: 500 });
        }
      },
    },
  },
});
