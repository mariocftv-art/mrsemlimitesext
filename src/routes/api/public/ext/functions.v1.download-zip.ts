import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/ext/functions/v1/download-zip")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const version = url.searchParams.get("v") || "2.9";
        const ext = url.searchParams.get("ext") || "1";
        
        console.log(`[Download] Request for EXT${ext} v${version}`);

        // Servir os arquivos locais da pasta public
        const baseUrl = new URL(request.url).origin;
        let file = "ext1_v37.zip";
        
        if (ext === "5") file = "ext5_v720.zip";
        else if (ext === "4") file = "ext4_v412.zip";
        else if (ext === "2") file = "MR Sem Limites EXT2.zip";
        else if (ext === "3") file = "Metodo Quatro v17.zip";
        
        return Response.redirect(`${baseUrl}/${file}`, 302);
      },
    },
  },
});
