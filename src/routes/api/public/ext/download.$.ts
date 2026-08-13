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
      GET: async ({ request }) => {
        const url = new URL(request.url);
        // Em TanStack Start, podemos pegar o caminho diretamente da URL se o params falhar
        const pathname = url.pathname;
        const prefix = "/api/public/ext/download/";
        const filePath = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : "";
        
        console.log(`[Download] Extraído via URL: ${filePath}`);
        
        if (!filePath || filePath.includes("..") || filePath.startsWith("/")) {
          return new Response("Caminho inválido ou ausente", { status: 400 });
        }

        const projectRoot = process.cwd();
        
        // Tentar no diretório de extensões primeiro
        let fullPath = path.resolve(projectRoot, "extensions", filePath);
        
        if (!fs.existsSync(fullPath)) {
          // Se não estiver em extensions, tentar em public
          fullPath = path.resolve(projectRoot, "public", filePath);
        }
        
        if (!fs.existsSync(fullPath)) {
          console.error(`[Download] Arquivo não encontrado: ${filePath} (Cwd: ${projectRoot})`);
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
