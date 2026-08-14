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
        let fileName = params._ || "";
        
        if (!fileName) {
          const parts = url.pathname.split("/");
          fileName = parts[parts.length - 1];
        }

        console.log(`[Download] Arquivo solicitado: ${fileName}`);
        
        if (!fileName || fileName.includes("..")) {
          return new Response("Nome de arquivo inválido", { status: 400 });
        }

        const projectRoot = process.cwd();
        const searchDirs = [
          path.resolve(projectRoot, "public"),
          path.resolve(projectRoot, "public/extensions"),
          path.resolve(projectRoot, "public/extensions/ext-08/integrated"),
          path.resolve(projectRoot, "public/extensions/ext-07/integrated"),
        ];

        let foundPath = "";
        for (const dir of searchDirs) {
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
              foundPath = path.resolve(dir, match);
              break;
            }
          }
        }

        if (!foundPath) {
          console.error(`[Download] Não encontrado em nenhum diretório: ${fileName}`);
          return new Response("Arquivo não encontrado", { status: 404 });
        }

        try {
          const stats = fs.statSync(fullPath);
          if (stats.isDirectory()) {
            return new Response("O caminho especificado é um diretório", { status: 400 });
          }

          const fileBuffer = fs.readFileSync(fullPath);
          const fileName = path.basename(fullPath);

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
