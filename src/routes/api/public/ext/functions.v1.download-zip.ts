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
        // Importante: em ambiente Lovable, o baseUrl deve ser resolvido corretamente
        const baseUrl = "https://mrsemlimitesext.lovable.app";
        let file = "ext1_v37.zip";
        
        if (ext === "5") return Response.redirect(`${baseUrl}/ext5_v720.zip`, 302);
        if (ext === "4") return Response.redirect(ext4Asset.url, 302);
        if (ext === "2") return Response.redirect(`${baseUrl}/MR%20Sem%20Limites%20EXT2.zip`, 302);
        if (ext === "3") return Response.redirect(`${baseUrl}/Metodo%20Quatro%20v17.zip`, 302);
        
        return Response.redirect(`${baseUrl}/${file}`, 302);
      },
    },
  },
});
