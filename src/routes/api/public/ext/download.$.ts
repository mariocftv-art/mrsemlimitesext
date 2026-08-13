import { createFileRoute } from "@tanstack/react-router";
import fs from "fs";
import path from "path";

/**
 * Rota unificada para download de extensões direto do sistema de arquivos do servidor.
 */
export const Route = createFileRoute("/api/public/ext/download/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const filePath = (params as any)["_"];
        // Sanitização básica para evitar path traversal
        if (filePath.includes("..") || filePath.startsWith("/")) {
          return new Response("Caminho inválido", { status: 400 });
        }

        const fullPath = path.join(process.cwd(), "extensions", filePath);
        
        if (!fs.existsSync(fullPath)) {
          console.error(`[Download] Arquivo não encontrado: ${fullPath}`);
          return new Response("Arquivo não encontrado", { status: 404 });
        }

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
      },
    },
  },
});
