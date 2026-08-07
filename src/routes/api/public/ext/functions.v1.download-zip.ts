import { createFileRoute } from "@tanstack/react-router";
import ext4Asset from "@/assets/ext4_v412.zip.asset.json";

export const Route = createFileRoute("/api/public/ext/functions/v1/download-zip")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const version = url.searchParams.get("v") || "2.9";
        const ext = url.searchParams.get("ext") || "1";
        
        console.log(`[Download] Request for EXT${ext} v${version}`);

        // Servir os arquivos locais da pasta public ou via asset redirect
        const baseUrl = "https://mrsemlimitesext.lovable.app";
        
        const fileMap: Record<string, string> = {
          "1": "ext1_v37.zip",
          "2": "MR%20Sem%20Limites%20EXT2.zip",
          "3": "Metodo%20Quatro%20v17.zip",
          "5": "ext5_v720.zip"
        };

        if (ext === "4") return Response.redirect(ext4Asset.url, 302);
        
        const fileName = fileMap[ext] || "ext1_v37.zip";
        const finalUrl = `${baseUrl}/${fileName}`;

        // Adicionamos headers para tentar forçar o download no navegador
        return new Response(null, {
          status: 302,
          headers: {
            "Location": finalUrl,
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Content-Type": "application/zip"
          }
        });
      },
    },
  },
});
